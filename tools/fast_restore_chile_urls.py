import os
import json
import http.client
import re
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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
                return link # Without doing the urllib GET check that triggered the 403!
        return None
    except Exception as e:
        print(f"Error fetching exact URL for {sku}: {e}")
        return None

def main():
    print("Fetching missing Chile records...")
    res = supabase.table('monitors_regional').select('*').eq('country', 'chile').is_('product_page_url', 'null').execute()
    records = res.data
    print(f"Found {len(records)} missing Chile URLs to rebuild.")

    restored = 0
    for record in records:
        sku = record['competitor_sku']
        brand = record['competitor_brand']
        retailer = record['retailer_name']
        record_id = record['id']
        
        url = get_correct_url(sku, brand, retailer)
        if url:
            print(f"Restored URL for {brand} {sku}: {url}")
            supabase.table('monitors_regional').update({'product_page_url': url, 'available': True}).eq('id', record_id).execute()
            restored += 1
        else:
            print(f"Not actively found via Google (likely not carried anymore): {brand} {sku}")
            
    # Do Uruguay as well just in case
    print("\nFetching missing Uruguay records...")
    res_uy = supabase.table('monitors_regional').select('*').eq('country', 'uruguay').is_('product_page_url', 'null').execute()
    records_uy = res_uy.data
    ur_restored = 0
    for record in records_uy:
        sku = record['competitor_sku']
        brand = record['competitor_brand']
        retailer = record['retailer_name']
        record_id = record['id']
        
        url = get_correct_url(sku, brand, retailer)
        if url:
            print(f"Restored URL for {brand} {sku}: {url}")
            supabase.table('monitors_regional').update({'product_page_url': url, 'available': True}).eq('id', record_id).execute()
            ur_restored += 1
            
    print(f"\nCompleted! Recreated {restored} Winpy.cl links and {ur_restored} Nnet.com.uy links perfectly from Google.")

if __name__ == "__main__":
    main()
