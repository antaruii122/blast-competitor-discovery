import os
import json
import http.client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def test_serper():
    conn = http.client.HTTPSConnection('google.serper.dev')
    query = 'Monitor Xiaomi A27i winpy.cl'
    payload = json.dumps({'q': query, 'num': 5, 'gl': 'cl', 'hl': 'es'})
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    # Try /shopping first
    print("Testing /shopping...")
    conn.request('POST', '/shopping', payload, headers)
    res = conn.getresponse()
    data = res.read()
    print(json.dumps(json.loads(data.decode('utf-8')), indent=2))
    
    # Try /search then
    print("\nTesting /search...")
    conn.request('POST', '/search', payload, headers)
    res = conn.getresponse()
    data = res.read()
    print(json.dumps(json.loads(data.decode('utf-8')), indent=2))

if __name__ == "__main__":
    test_serper()
