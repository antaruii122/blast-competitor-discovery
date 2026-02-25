import os
import json
import http.client
import re
import subprocess
from supabase import create_client, Client
from dotenv import load_dotenv

# Load credentials
load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

if not SUPABASE_URL or not SERPER_API_KEY:
    print("Missing credentials in .env.local")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_price(price_str):
    if not price_str:
        return None
    # Remove currency symbols and dots/commas
    # For Uruguay, we expect prices in USD or UYU. 
    # Usually shopping results give a string like "US$ 150" or "$ 5.000"
    cleaned = re.sub(r'[^\d]', '', str(price_str))
    try:
        return float(cleaned)
    except ValueError:
        return None

def fetch_data_from_serper(sku, brand, retailer="nnet.com.uy"):
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    # 1. Check Search for availability and link
    search_query = f'site:{retailer} {brand} {sku}'
    search_payload = json.dumps({'q': search_query, 'gl': 'uy', 'hl': 'es'})
    
    available = None
    price = None
    product_url = None
    
    try:
        conn.request('POST', '/search', search_payload, headers)
        res = conn.getresponse()
        search_data = json.loads(res.read().decode('utf-8'))
        
        # sku lowercase words to check
        sku_words = set(word.lower() for word in sku.split())

        for item in search_data.get('organic', []):
            link = item.get('link', '')
            if retailer in link:
                snippet = item.get('snippet', '').lower()
                title = item.get('title', '').lower()
                
                # Validation: it must be a specific product page, not a listing page.
                # A good product page title usually contains the SKU or brand+specs.
                # If the title is just a massive list of brands or generic "Productos", skip it.
                title_words = set(re.findall(r'\b\w+\b', title))
                
                # Require at least some intersection between the SKU words and the title words 
                # (to ensure it's not a generic listing)
                if not sku_words.intersection(title_words) and not brand.lower() in title:
                     continue # Doesn't look like the specific product
                
                product_url = link
                
                # Basic availability check
                if 'agotado' in snippet or 'sin stock' in snippet or 'agotado' in title:
                    available = False
                else:
                    available = True
                break
    except Exception as e:
        print(f"Error in search for {sku}: {e}")

    # 2. Check Shopping for price
    shopping_query = f'{brand} {sku} {retailer}'
    shopping_payload = json.dumps({'q': shopping_query, 'gl': 'uy', 'hl': 'es', 'num': 10})
    
    try:
        conn.request('POST', '/shopping', shopping_payload, headers)
        res = conn.getresponse()
        shopping_data = json.loads(res.read().decode('utf-8'))
        
        retailer_clean = "nnet"
        
        for item in shopping_data.get('shopping', []):
            source = item.get('source', '').lower()
            item_title = item.get('title', '').lower()
            
            if retailer_clean in source:
                # Match SKU parts
                sku_parts = [p.lower() for p in sku.split() if p.lower() not in ['monitor', 'gamer', 'gaming', '2k', '4k', 'fhd', 'v1', 'v2']]
                if not sku_parts or all(part in item_title for part in sku_parts):
                    price = clean_price(item.get('price'))
                    if price:
                        available = True
                        if not product_url:
                            product_url = item.get('link')
                        print(f"    Matched Shopping: {item['title']} - {item['price']}")
                        break
    except Exception as e:
        print(f"Error in shopping for {sku}: {e}")
        
    return available, price, product_url

def main():
    print("Fetching unique competitor matches from monitors_comparison...")
    res = supabase.table('monitors_comparison').select('your_sku, competitor_brand, competitor_sku').execute()
    matches = res.data
    
    print(f"Found {len(matches)} matches to process.")
    
    results_found = 0
    for match in matches:
        your_sku = match['your_sku']
        brand = match['competitor_brand']
        sku = match['competitor_sku']
        retailer = "nnet.com.uy"
        print(f"Processing: {brand} {sku} (for {your_sku}) on {retailer}...")
        available, price, product_url = fetch_data_from_serper(sku, brand, retailer)
        
        if product_url:
            print(f"  Saving results for {sku} (URL found, Available: {available})...")
            # Use supabase_ingest.py to save
            cmd = [
                "python", "tools/supabase_ingest.py",
                "--phase", "price",
                "--sku", your_sku,
                "--category", "monitors",
                "--comp-brand", brand,
                "--comp-sku", sku,
                "--country", "uruguay",
                "--available", str(available).lower() if available is not None else "false",
                "--retailer-name", retailer,
                "--product-page-url", product_url
            ]
            if price:
                cmd.extend(["--price", str(price)])
            
            subprocess.run(cmd)
            results_found += 1
        else:
            print(f"  Skipping {sku} (Not found on site).")

    print(f"\nDiscovery complete. Recorded {results_found} matches for Uruguay.")
    
    # Update discovery_status
    discovery_payload = {
        "category": "monitors",
        "country": "uruguay",
        "retailer": "nnet.com.uy",
        "match_count": results_found
    }
    try:
        supabase.table('discovery_status').upsert(discovery_payload, on_conflict='category,country,retailer').execute()
        print("Updated discovery_status table.")
    except Exception as e:
        print(f"Error updating discovery_status: {e}")

if __name__ == "__main__":
    main()
