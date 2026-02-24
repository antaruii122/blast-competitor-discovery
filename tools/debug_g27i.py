import os
import json
import http.client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def test_serper_specific():
    conn = http.client.HTTPSConnection('google.serper.dev')
    url = 'https://www.winpy.cl/venta/monitor-gamer-xiaomi-g27i-de-27-ips-full-hd-165mhz-1ms-dp-hdmi-freesync-vesa/'
    payload = json.dumps({'q': url, 'gl': 'cl', 'hl': 'es'})
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    print(f"Testing URL: {url}")
    conn.request('POST', '/search', payload, headers)
    res = conn.getresponse()
    data = res.read()
    print("Search Result:")
    print(json.dumps(json.loads(data.decode('utf-8')), indent=2))
    
    # Also try shopping with the specific name
    query = 'Xiaomi G27i winpy.cl'
    print(f"\nTesting Shopping Query: {query}")
    payload_shop = json.dumps({'q': query, 'gl': 'cl', 'hl': 'es'})
    conn.request('POST', '/shopping', payload_shop, headers)
    res_shop = conn.getresponse()
    data_shop = res_shop.read()
    print("Shopping Result:")
    print(json.dumps(json.loads(data_shop.decode('utf-8')), indent=2))

if __name__ == "__main__":
    test_serper_specific()
