import os
import json
import http.client
import re
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def scrape_nnet_via_serper():
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    # We will search Google to return all indexed pages under the monitor-gamer or productos category for Nnet
    search_queries = [
        'site:nnet.com.uy/productos/ "Monitor" "Gamer"',
        'site:nnet.com.uy/monitor-gamer/',
        'site:nnet.com.uy "Monitor" "Hz" (Samsung OR Xiaomi OR MSI OR Perseo OR Cooler Master OR Fastrock OR Acer)'
    ]
    
    all_products = []
    seen_urls = set()
    
    for query in search_queries:
        print(f"\nQUERYING Google: {query}")
        search_payload = json.dumps({
            'q': query, 
            'hl': 'es', 
            'num': 100 # Max results
        })
        
        try:
            conn.request('POST', '/search', search_payload, headers)
            res = conn.getresponse()
            search_data = json.loads(res.read().decode('utf-8'))
            
            for item in search_data.get('organic', []):
                link = item.get('link', '')
                title = item.get('title', '')
                snippet = item.get('snippet', '')
                
                # Filter strictly for product pages, avoiding categories
                if '/productos/' in link and link not in seen_urls:
                    seen_urls.add(link)
                    all_products.append({
                        'title': title,
                        'link': link,
                        'snippet': snippet
                    })
                    print(f"- {title}")
                    
        except Exception as e:
            print(f"Error fetching from Serper: {e}")
            
    print(f"\nTotal unique monitors discovered via Google Index: {len(all_products)}")

if __name__ == "__main__":
    scrape_nnet_via_serper()
