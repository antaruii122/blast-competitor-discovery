import os
import json
import http.client
from dotenv import load_dotenv

load_dotenv('C:/Users/rcgir/Desktop/Antigravity Pojects/Find Competitor Product/webapp/.env.local')

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

def test_g34wqi_url():
    conn = http.client.HTTPSConnection('google.serper.dev')
    url = 'https://www.winpy.cl/venta/monitor-gamer-curvo-xiaomi-g34wqi-de-34-wqhd-180hz-1ms-d-port-hdmi-freesync-vesa/'
    payload = json.dumps({'q': url, 'gl': 'cl', 'hl': 'es'})
    headers = {'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json'}
    
    conn.request('POST', '/search', payload, headers)
    print("Search Result for URL:")
    print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=2))

if __name__ == "__main__":
    test_g34wqi_url()
