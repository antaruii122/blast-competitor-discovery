import os
import json
import http.client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def test_serper_quotes():
    conn = http.client.HTTPSConnection('google.serper.dev')
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    # EXACT MATCH with "Gaming Monitor"
    query1 = '"Gaming Monitor G27i" winpy.cl'
    print(f"Testing Query 1 (Quotes): {query1}")
    payload1 = json.dumps({'q': query1, 'gl': 'cl', 'hl': 'es'})
    conn.request('POST', '/shopping', payload1, headers)
    print("Response 1:", json.loads(conn.getresponse().read().decode('utf-8')).get('shopping', [])[:1])
    
    # NO QUOTES
    query2 = 'Gaming Monitor G27i winpy.cl'
    print(f"\nTesting Query 2 (No Quotes): {query2}")
    payload2 = json.dumps({'q': query2, 'gl': 'cl', 'hl': 'es'})
    conn.request('POST', '/shopping', payload2, headers)
    print("Response 2:", json.loads(conn.getresponse().read().decode('utf-8')).get('shopping', [])[:1])

if __name__ == "__main__":
    test_serper_quotes()
