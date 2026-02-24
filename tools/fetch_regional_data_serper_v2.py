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
    cleaned = re.sub(r'[^\d]', '', str(price_str))
    try:
        return float(cleaned)
    except ValueError:
        return None

def fetch_data_from_serper(sku, brand, retailer="winpy.cl"):
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    # 1. Check Search for availability
    search_query = f'site:{retailer} {brand} {sku}'
    search_payload = json.dumps({'q': search_query, 'gl': 'cl', 'hl': 'es'})
    
    available = None
    price = None
    
    try:
        conn.request('POST', '/search', search_payload, headers)
        res = conn.getresponse()
        search_data = json.loads(res.read().decode('utf-8'))
        
        for item in search_data.get('organic', []):
            snippet = item.get('snippet', '')
            title = item.get('title', '')
            link = item.get('link', '')
            
            if retailer in link:
                if 'Agotado' in snippet or 'Agotado' in title:
                    available = False
                else:
                    available = True
                break
    except Exception as e:
        print(f"Error in search for {sku}: {e}")

    # 2. Check Shopping for price - NO QUOTES, and include Brand
    # We use a broader query to ensure we find THE retailer
    shopping_query = f'{brand} {sku} {retailer}'
    shopping_payload = json.dumps({'q': shopping_query, 'gl': 'cl', 'hl': 'es', 'num': 10})
    
    try:
        conn.request('POST', '/shopping', shopping_payload, headers)
        res = conn.getresponse()
        shopping_data = json.loads(res.read().decode('utf-8'))
        
        retailer_clean = retailer.replace('.cl', '').lower()
        
        for item in shopping_data.get('shopping', []):
            source = item.get('source', '').lower()
            item_title = item.get('title', '').lower()
            
            # Match retailer
            if retailer_clean in source:
                # Extract parts of SKU that are not generic "Monitor" or "Gaming"
                sku_parts = [p.lower() for p in sku.split() if p.lower() not in ['monitor', 'gamer', 'gaming', '2k', '4k', 'fhd']]
                
                # If we have specific parts (like "G27i"), ensure they are in the title
                if sku_parts:
                    if all(part in item_title for part in sku_parts):
                        price = clean_price(item.get('price'))
                        if price:
                            available = True
                            print(f"    Matched Shopping: {item['title']} - {item['price']}")
                            break
                else:
                    # Fallback to broad match if SKU is just "Monitor" (shouldn't happen)
                    price = clean_price(item.get('price'))
                    if price:
                        available = True
                        break
    except Exception as e:
        print(f"Error in shopping for {sku}: {e}")
        
    return available, price

def main():
    # Only re-check those with no price or those recently failed
    res = supabase.table('monitors_regional').select('*').execute()
    records = res.data
    
    print(f"Checking {len(records)} records...")
    
    for record in records:
        sku = record['competitor_sku']
        brand = record['competitor_brand']
        retailer = record['retailer_name'] or "winpy.cl"
        
        # Proactively check if it's the one the user mentioned
        if "G27i" in sku or "G34WQi" in sku or record['price'] is None:
            print(f"Processing {brand} {sku} on {retailer}...")
            available, price = fetch_data_from_serper(sku, brand, retailer)
            
            updates = {}
            if available is not None:
                updates['available'] = available
            if price is not None:
                updates['price'] = price
            
            if updates:
                supabase.table('monitors_regional').update(updates).eq('id', record['id']).execute()
                print(f"  Updated: Available={available}, Price={price}")

if __name__ == "__main__":
    main()
