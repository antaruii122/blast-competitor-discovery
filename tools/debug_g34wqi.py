import os
import json
import http.client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def test_g34wqi():
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    query = 'Xiaomi G34WQi winpy.cl'
    payload = json.dumps({'q': query, 'gl': 'cl', 'hl': 'es'})
    conn.request('POST', '/shopping', payload, headers)
    print("Shopping Result:")
    print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=2))

if __name__ == "__main__":
    test_g34wqi()
