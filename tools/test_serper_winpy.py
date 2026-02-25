import os
import json
import http.client
import re
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

sku = "Gaming Monitor G27i"
brand = "Xiaomi"
retailer = "winpy.cl"

def is_valid_product_page(title, sku, brand):
    title = title.lower()
    sku_words = set(word.lower() for word in str(sku).split())
    title_words = set(re.findall(r'\b\w+\b', title))
    
    print(f"DEBUG Title words: {title_words}")
    print(f"DEBUG SKU words: {sku_words}")
    
    generic_words = ['productos', 'categorías', 'marcas', 'lista', 'resultados', 'inicio']
    if any(word in title for word in generic_words):
        if not sku_words.issubset(title_words): 
            print(f"DEBUG: Rejected due to generic words")
            return False

    intersection = sku_words.intersection(title_words)
    print(f"DEBUG Intersection: {intersection}")
    
    if brand.lower() in title or intersection:
        print(f"DEBUG: Accepted")
        return True
    
    print(f"DEBUG: Rejected due to missing brand and sku intersection")
    return False

conn = http.client.HTTPSConnection('google.serper.dev')
headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}

search_query = f'site:{retailer} {brand} {sku}'
search_payload = json.dumps({'q': search_query, 'hl': 'es', 'num': 5})

conn.request('POST', '/search', search_payload, headers)
res = conn.getresponse()
search_data = json.loads(res.read().decode('utf-8'))

print(json.dumps(search_data, indent=2))

for item in search_data.get('organic', []):
    link = item.get('link', '')
    title = item.get('title', '')
    
    print(f"\nEvaluating: {title} | {link}")
    if retailer in link.lower() and is_valid_product_page(title, sku, brand):
        print(f"VALID URL: {link}")
