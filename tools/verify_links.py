import os
import argparse
import sys
import json
import urllib.request
import urllib.parse
from supabase import create_client, Client
import http.client

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', 'webapp', '.env.local'))
except ImportError:
    pass

# Load Supabase credentials from Environment Variables
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables are required.", file=sys.stderr)
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def is_broken_link(url: str) -> bool:
    """
    Checks if a link returns a 4xx/5xx error or contains 'soft 404' indicators.
    """
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        )
        response = urllib.request.urlopen(req, timeout=10)
        
        # If redirect, check the final URL
        final_url = response.geturl()
        
        # Read a portion of the response to check for soft 404s
        html = response.read(100000).decode('utf-8', errors='ignore').lower()

        soft_404_markers = [
            "page not found",
            "could not find requested resource",
            "sorry, the page you're looking for is not available",
            "the page you requested was not found",
            "we can't seem to find the page you're looking for",
            "404 not found",
            "<title>404</title>",
            "<title>page not found</title>"
        ]
        
        for marker in soft_404_markers:
            if marker in html:
                return True
                
        return False
    except Exception as e:
        # Timeout, 404, 403, etc are considered broken
        return True

def find_new_link(brand: str, sku: str) -> str:
    """
    Use Google Serper API to find the official product page.
    """
    if not SERPER_API_KEY:
        print("Warning: SERPER_API_KEY not found. Cannot search for replacement.")
        return None
        
    conn = http.client.HTTPSConnection("google.serper.dev")
    query = f"{brand} {sku} official product page"
    payload = json.dumps({
        "q": query,
        "num": 5
    })
    headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
    }
    
    try:
        conn.request("POST", "/search", payload, headers)
        res = conn.getresponse()
        data = res.read().decode("utf-8")
        json_data = json.loads(data)
        
        if 'organic' in json_data and len(json_data['organic']) > 0:
            brand_lower = brand.lower().replace(" ", "")
            # Try to find an official site first
            for result in json_data['organic']:
                link = result.get('link', '')
                if brand_lower in link.lower() and ('support' not in link.lower() or 'manual' not in link.lower()):
                    return link
            
            # Fallback to first organic
            return json_data['organic'][0]['link']
    except Exception as e:
        print(f"Serper Search Error: {e}")
        
    return None

def verify_and_repair(table_name: str, check_all: bool = False):
    client = get_supabase_client()
    
    res = client.table(table_name).select("*").execute()
    data = [r for r in res.data if r.get('competitor_url')]
    
    print(f"Found {len(data)} records to verify in {table_name}.")
    
    repaired_count = 0
    broken_count = 0
    
    for row in data:
        url = row['competitor_url']
        brand = row['competitor_brand']
        sku = row['competitor_sku']
        rid = row['id']
        
        print(f"Checking [{brand}] {sku} -> {url} ...", end=" ", flush=True)
        
        if is_broken_link(url):
            broken_count += 1
            print("BLOCKED/BROKEN! Searching for alternative...")
            
            new_url = find_new_link(brand, sku)
            if new_url and new_url != url:
                print(f"  -> Found replacement: {new_url}")
                # Update Supabase
                try:
                    update_res = client.table(table_name).update({"competitor_url": new_url}).eq("id", rid).execute()
                    print(f"  -> Updated successfully.")
                    repaired_count += 1
                except Exception as e:
                    print(f"  -> Failed to update: {e}")
            else:
                print("  -> Could not find a suitable replacement.")
        else:
            print("OK.")
            
    print(f"\nVerification Complete!")
    print(f"Total checked: {len(data)}")
    print(f"Broken links found: {broken_count}")
    print(f"Links successfully repaired: {repaired_count}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Link Validator and Repair Tool")
    parser.add_argument("--table", required=True, help="Supabase table name to verify (e.g., monitors_comparison)")
    
    args = parser.parse_args()
    verify_and_repair(args.table)
