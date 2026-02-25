import os
import re
import json
import http.client
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
                return link
        return None
    except Exception as e:
        print(f"Error fetching: {e}")
        return None

def full_restore_pipeline():
    print("STEP 1: Fetching all global competitors from monitors_comparison...")
    comp_res = supabase.table('monitors_comparison').select('*').execute()
    comp_data = comp_res.data
    
    print("STEP 2: Fetching existing regional data...")
    reg_res = supabase.table('monitors_regional').select('*').execute()
    reg_data = reg_res.data
    
    existing_records = set([
        (r['country'].lower(), r['competitor_sku'], r['your_sku'])
        for r in reg_data
    ])
    
    countries_retailers = [
        ('chile', 'winpy.cl'),
        ('uruguay', 'nnet.com.uy')
    ]

    print("\nSTEP 3: Identifying missing competitors and searching Google Serper for them...")
    restored = 0
    not_found = 0
    
    for country, retailer in countries_retailers:
        for prod in comp_data:
            key = (country, prod['competitor_sku'], prod['your_sku'])
            if key not in existing_records:
                # The row is completely missing from the DB. Let's see if it exists online!
                sku = prod['competitor_sku']
                brand = prod['competitor_brand']
                
                url = get_correct_url(sku, brand, retailer)
                
                # THE CORE RULE: Only insert if URL is found!
                if url:
                    insert_data = {
                        'your_sku': prod['your_sku'],
                        'competitor_brand': brand,
                        'competitor_sku': sku,
                        'country': country,
                        'retailer_name': retailer,
                        'available': True,
                        'product_page_url': url
                    }
                    supabase.table('monitors_regional').insert(insert_data).execute()
                    print(f"[{country.upper()}] SUCCESS: Found and inserted {brand} {sku} -> {url}")
                    restored += 1
                else:
                    print(f"[{country.upper()}] SKIPPING INSERT: URL is null for {brand} {sku}. We do not create rows for unfindable products.")
                    not_found += 1

    print("\nSTEP 4: Confirming cleanup – Deleting any remaining null URLs from the database...")
    clean_res = supabase.table('monitors_regional').delete().is_('product_page_url', 'null').execute()
    
    print(f"\n=======================")
    print(f"PIPELINE COMPLETE!")
    print(f"Restored Valid URLs: {restored}")
    print(f"Missing URLs Ignored (NO ROW CREATED): {not_found}")
    print(f"Deleted lingering null rows: {len(clean_res.data)}")
    print(f"=======================")

if __name__ == '__main__':
    full_restore_pipeline()
