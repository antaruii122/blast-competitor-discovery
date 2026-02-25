import requests
from bs4 import BeautifulSoup

def test_scrape_nnet():
    url = "https://www.nnet.com.uy/monitor-gamer/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Let's find links that look like products to work backward to the container
    product_links = soup.find_all('a', href=lambda href: href and 'https://www.nnet.com.uy/productos/' in href)
    
    if product_links:
        print(f"Found {len(product_links)} product links.")
        for pl in product_links[:5]:
            print(f"Link: {pl['href']} Title: {pl.text.strip()}")
            
            # Print the parent elements to figure out the structure
            parent = pl.parent
            for i in range(3):
                if parent:
                    print(f"  Parent {i+1} class: {parent.get('class')}")
                    parent = parent.parent
            print("---")

if __name__ == "__main__":
    test_scrape_nnet()
