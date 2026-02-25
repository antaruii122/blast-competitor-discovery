import requests
import re
import json

def test_scrape_nnet_json():
    url = "https://www.nnet.com.uy/monitor-gamer/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Failed. Status code: {response.status_code}")
        return
        
    # Since the products aren't in standard HTML divs, they are likely loaded 
    # via a JavaScript array or JSON object inside a <script> tag.
    # Let's search the raw text for common JSON structures related to products.
    
    # 1. Attempt to find a variable assignment containing products
    scripts = re.findall(r'<script.*?>(.*?)</script>', response.text, re.DOTALL | re.IGNORECASE)
    
    found_products = []
    
    for script in scripts:
        if 'dataLayer' in script or 'products' in script.lower() or 'items' in script.lower():
            # Try to extract anything that looks like a JSON array of objects with id, name, price
            try:
                # Very basic greedy regex to find array-like structures
                arrays = re.findall(r'\[\s*\{.*?\}\s*\]', script, re.DOTALL)
                for arr_str in arrays:
                    try:
                        data = json.loads(arr_str)
                        if isinstance(data, list) and len(data) > 0 and 'name' in data[0].keys():
                             found_products.extend(data)
                    except json.JSONDecodeError:
                        pass
            except Exception:
                pass

    if found_products:
         print(f"Successfully extracted {len(found_products)} products directly from JS payload!")
         for p in found_products[:5]:
             print(f"- {p.get('name', 'Unknown')}: {p.get('price', 'No Price')}")
    else:
         print("Could not find structured JSON product data in scripts. Exploring raw text for 'var products = ' or similar.")
         
         # Fallback: look for specific Nnet / PrestaShop / Magento patterns
         matches = re.findall(r'"name":"([^"]+)","id":"([^"]+)"', response.text)
         if matches:
             print(f"Found {len(matches)} products using raw regex.")
             for name, pid in matches[:5]:
                 print(f"- {name} (ID: {pid})")
         else:
             print("Raw regex failed to find standard e-commerce schema.")

if __name__ == "__main__":
    test_scrape_nnet_json()
