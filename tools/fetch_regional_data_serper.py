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

if not SUPABASE_URL or not SERPER_API_KEY:
    print("Missing credentials in .env.local")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_price(price_str):
    if not price_str:
        return None
    # Remove currency symbols and dots/commas
    # Chilean prices often look like $108.832 or 108.832
    cleaned = re.sub(r'[^\d]', '', str(price_str))
    try:
        return float(cleaned)
    except ValueError:
        return None

def fetch_data_from_serper(sku, brand, retailer="winpy.cl"):
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    # Query for Search (to check availability/snippets)
    search_query = f'site:{retailer} "{sku}"'
    search_payload = json.dumps({'q': search_query, 'gl': 'cl', 'hl': 'es'})
    
    # Query for Shopping (to find price)
    shopping_query = f'"{sku}" {retailer}'
    shopping_payload = json.dumps({'q': shopping_query, 'gl': 'cl', 'hl': 'es'})
    
    available = None
    price = None
    
    # 1. Check Search for availability
    try:
        conn.request('POST', '/search', search_payload, headers)
        res = conn.getresponse()
        search_data = json.loads(res.read().decode('utf-8'))
        
        for item in search_data.get('organic', []):
            snippet = item.get('snippet', '')
            title = item.get('title', '')
            if 'Agotado' in snippet or 'Agotado' in title:
                available = False
                break
            if retailer in item.get('link', ''):
                # If we find a Winpy link and it doesn't say Agotado, we assume available for now
                if available is None:
                    available = True
    except Exception as e:
        print(f"Error in search for {sku}: {e}")

    # 2. Check Shopping for price
    try:
        conn.request('POST', '/shopping', shopping_payload, headers)
        res = conn.getresponse()
        shopping_data = json.loads(res.read().decode('utf-8'))
        
        for item in shopping_data.get('shopping', []):
            source = item.get('source', '').lower()
            item_title = item.get('title', '').lower()
            
            # Check if source is the retailer and title contains SKU
            if retailer.replace('.cl', '') in source or retailer in source:
                if sku.lower() in item_title or any(part.lower() in item_title for part in sku.split()):
                    price = clean_price(item.get('price'))
                    if price:
                        available = True # If it has a shopping price, it's likely available
                        break
    except Exception as e:
        print(f"Error in shopping for {sku}: {e}")
        
    return available, price

def main():
    # Get regional records needing price/availability check
    # We check all record to be sure
    res = supabase.table('monitors_regional').select('*').execute()
    records = res.data
    
    print(f"Checking {len(records)} records...")
    
    for record in records:
        sku = record['competitor_sku']
        brand = record['competitor_brand']
        retailer = record['retailer_name'] or "winpy.cl"
        
        print(f"Processing {brand} {sku} on {retailer}...")
        
        available, price = fetch_data_from_serper(sku, brand, retailer)
        
        # Update record
        updates = {}
        if available is not None:
            updates['available'] = available
        if price is not None:
            updates['price'] = price
        
        if updates:
            supabase.table('monitors_regional').update(updates).eq('id', record['id']).execute()
            print(f"  Updated: Available={available}, Price={price}")
        else:
            print(f"  No updates found for {sku}")

if __name__ == "__main__":
    main()
