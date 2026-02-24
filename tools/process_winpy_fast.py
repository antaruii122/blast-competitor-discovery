import os
import json
import http.client
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
conn = http.client.HTTPSConnection('google.serper.dev')
headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}

def run_chunk(limit=10):
    manual_skus = ['X16F-PTB156E', 'X19KN', 'X27KF']
    my_monitors_res = supabase.table('my_products').select('sku').ilike('category', '%monitor%').execute()
    monitors = [m['sku'] for m in my_monitors_res.data if m['sku'] not in manual_skus]

    regional_res = supabase.table('monitors_regional').select('your_sku, competitor_sku').execute()
    already_processed = set(f"{r['your_sku']}-{r['competitor_sku']}" for r in regional_res.data)

    if not monitors:
        print("No eligible monitors found.")
        return 0

    match_res = supabase.table('monitors_comparison').select('your_sku, competitor_brand, competitor_sku').in_('your_sku', monitors).execute()
    to_process = [m for m in match_res.data if f"{m['your_sku']}-{m['competitor_sku']}" not in already_processed]
    
    if not to_process:
        print("All monitors processed!")
        return 0

    chunk = to_process[:limit]
    print(f"Processing {len(chunk)} items (out of {len(to_process)} remaining)...")
    
    for match in chunk:
        your_sku = match['your_sku']
        brand = match['competitor_brand']
        sku = match['competitor_sku']
        
        query = f"site:winpy.cl {brand} {sku}"
        payload = json.dumps({'q': query, 'num': 2})
        conn.request('POST', '/search', payload, headers)
        res = json.loads(conn.getresponse().read().decode('utf-8'))
        
        organic = res.get('organic', [])
        inserted = False
        for item in organic:
            link = item.get('link', '')
            snippet = item.get('snippet', '')
            title = item.get('title', '')
            
            if 'venta/' in link and brand.lower() in link.lower():
                available = "Agotado" not in snippet and "Agotado" not in title
                record = {
                    "your_sku": your_sku,
                    "competitor_brand": brand,
                    "competitor_sku": sku,
                    "country": "Chile",
                    "available": available,
                    "price": None,
                    "retailer_name": "winpy.cl",
                    "product_page_url": link.split("?")[0]
                }
                supabase.table('monitors_regional').insert(record).execute()
                print(f"Inserted: {brand} {sku} - Available: {available}")
                inserted = True
                break
                
        if not inserted:
            print(f"Not found on winpy.cl: {brand} {sku}")
            
    return len(to_process) - len(chunk)

if __name__ == "__main__":
    run_chunk(15)
