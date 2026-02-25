import os
import json
import http.client
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

def is_valid_product_page(title, sku, brand):
    title = title.lower()
    sku_words = set(word.lower() for word in str(sku).split())
    title_words = set(re.findall(r'\b\w+\b', title))
    
    # Generic rejection words
    generic_words = ['productos', 'categorías', 'marcas', 'lista', 'resultados']
    if any(word in title for word in generic_words):
        # Allow it if the SKU is definitively in the title anyway
        if not sku_words.issubset(title_words): 
            return False

    # Check if title has either the brand or part of the SKU
    if brand.lower() in title or sku_words.intersection(title_words):
        return True
    
    return False

def get_correct_url(sku, brand, retailer):
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    search_query = f'site:{retailer} {brand} {sku}'
    search_payload = json.dumps({'q': search_query, 'hl': 'es'}) # Do not lock 'gl' completely incase of edge routing
    
    try:
        conn.request('POST', '/search', search_payload, headers)
        res = conn.getresponse()
        search_data = json.loads(res.read().decode('utf-8'))
        
        for item in search_data.get('organic', []):
            link = item.get('link', '')
            title = item.get('title', '')
            
            if retailer in link:
                if is_valid_product_page(title, sku, brand):
                    return link
        return None
    except Exception as e:
        print(f"Error fetching exact URL for {sku}: {e}")
        return None

def main():
    print("Fetching existing Uruguay records...")
    res = supabase.table('monitors_regional').select('*').eq('country', 'uruguay').execute()
    records = res.data
    
    print(f"Found {len(records)} records for Uruguay. Checking URLs...")
    
    fixed_count = 0
    removed_count = 0
    
    for record in records:
        url = record.get('product_page_url', '')
        sku = record['competitor_sku']
        brand = record['competitor_brand']
        retailer = record['retailer_name']
        record_id = record['id']
        
        # If it's explicitly a generic products listing page
        if 'productos.php' in url or 'productos_por_marca.php' in url or 'path=' in url:
            print(f"\n[!] Invalid URL detected for {brand} {sku}: {url}")
            print("    -> Attempting to find correct product page via Serper...")
            
            correct_url = get_correct_url(sku, brand, retailer)
            
            if correct_url:
                if correct_url != url:
                    print(f"    -> MATCH FOUND: {correct_url}")
                    supabase.table('monitors_regional').update({'product_page_url': correct_url}).eq('id', record_id).execute()
                    fixed_count += 1
                else:
                    print("    -> Best match is the same URL. Leaving as is.")
            else:
                 print(f"    -> NO MATCH FOUND. Product likely does not exist on {retailer}.")
                 # User note: "if you cannot find it, maybe it means it doesn't exist" -> we should remove the misleading link
                 print("    -> Removing the generic URL from the DB record to avoid misleading listing pages.")
                 supabase.table('monitors_regional').update({'product_page_url': None, 'available': False}).eq('id', record_id).execute()
                 removed_count += 1

    print(f"\nCleanup Complete! Fixed {fixed_count} URLs, and removed {removed_count} unfindable URLs.")

if __name__ == "__main__":
    main()
