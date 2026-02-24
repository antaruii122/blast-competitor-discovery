import os
import json
import http.client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def test_mi_desktop_27():
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    query = 'Xiaomi "Mi Desktop Monitor 27" winpy.cl'
    payload = json.dumps({'q': query, 'gl': 'cl', 'hl': 'es'})
    conn.request('POST', '/search', payload, headers)
    print("Search Result:")
    print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=2))
    
    conn.request('POST', '/shopping', payload, headers)
    print("\nShopping Result:")
    print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=2))

if __name__ == "__main__":
    test_mi_desktop_27()
