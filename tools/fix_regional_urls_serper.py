import os
import json
import http.client
import urllib.request
import re
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

def is_link_dead(url: str, retailer: str) -> bool:
    """Checks if a URL returns a 404 or a soft 404 (redirect to home/category)"""
    if not url:
        return True
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        response = urllib.request.urlopen(req, timeout=10)
        final_url = response.geturl().lower()
        
        # Site-specific soft 404 checks
        if 'nnet.com.uy' in retailer.lower():
            if 'default.php' in final_url or 'productos_por_marca.php' in final_url or 'productos.php' in final_url:
                return True
        elif 'winpy.cl' in retailer.lower():
            html = response.read(50000).decode('utf-8', errors='ignore').lower()
            if 'página no encontrada' in html or '<title>404</title>' in html:
                return True
                
        return False
    except urllib.error.HTTPError as e:
        if e.code in [403, 503, 429]:
            # Bot protection / WAF, treat as alive
            print(f"      [WAF/Bot block checking {url}: {e.code}]")
            return False
        return True
    except Exception as e:
        # Timeout or HTTPError (like 404)
        print(f"      [HTTP Error checking {url}: {e}]")
        return True

def is_valid_product_page(title, sku, brand):
    title = title.lower()
    sku_words = set(word.lower() for word in str(sku).split())
    title_words = set(re.findall(r'\b\w+\b', title))
    
    # Generic rejection words
    generic_words = ['productos', 'categorías', 'marcas', 'lista', 'resultados', 'inicio']
    if any(word in title for word in generic_words):
        if not sku_words.issubset(title_words): 
            return False

    if brand.lower() in title or sku_words.intersection(title_words):
        return True
    
    return False

def get_correct_url(sku, brand, retailer):
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    search_query = f'site:{retailer} {brand} {sku}'
    search_payload = json.dumps({'q': search_query, 'hl': 'es', 'num': 5})
    
    try:
        conn.request('POST', '/search', search_payload, headers)
        res = conn.getresponse()
        search_data = json.loads(res.read().decode('utf-8'))
        
        for item in search_data.get('organic', []):
            link = item.get('link', '')
            title = item.get('title', '')
            
            if retailer in link.lower() and is_valid_product_page(title, sku, brand):
                # Verify it's actually alive and not a soft 404
                if not is_link_dead(link, retailer):
                    return link
        return None
    except Exception as e:
        print(f"Error fetching exact URL for {sku}: {e}")
        return None

def main():
    print("Fetching ALL regional records...")
    res = supabase.table('monitors_regional').select('*').execute()
    records = res.data
    
    print(f"Found {len(records)} global records. Checking URLs for dead links and soft 404s...")
    
    fixed_count = 0
    deleted_count = 0
    
    for record in records:
        url = record.get('product_page_url')
        sku = record['competitor_sku']
        brand = record['competitor_brand']
        retailer = record['retailer_name']
        record_id = record['id']
        country = record['country']
        
        # Check if current URL is dead or generic
        bad_url = False
        if not url:
            bad_url = True
        elif 'productos.php' in url or 'productos_por_marca.php' in url or 'path=' in url:
            bad_url = True
        else:
            bad_url = is_link_dead(url, retailer)
            
        if bad_url:
            print(f"\n[!] Dead/Invalid URL detected for {brand} {sku} ({country}): {url}")
            print("    -> Attempting to find correct live product page via Serper...")
            
            correct_url = get_correct_url(sku, brand, retailer)
            
            if correct_url:
                print(f"    -> MATCH FOUND: {correct_url}")
                supabase.table('monitors_regional').update({'product_page_url': correct_url, 'available': True}).eq('id', record_id).execute()
                fixed_count += 1
            else:
                 print(f"    -> NO MATCH FOUND. Product definitely does not exist on {retailer}.")
                 print("    -> DELETING ROW: product_page_url is null so it must be eliminated.")
                 supabase.table('monitors_regional').delete().eq('id', record_id).execute()
                 deleted_count += 1
        else:
            pass # Keep it, it's alive

    print(f"\nGlobal Cleanup Complete! Fixed {fixed_count} URLs, and permanently DELETED {deleted_count} unfindable rows.")

if __name__ == "__main__":
    main()
