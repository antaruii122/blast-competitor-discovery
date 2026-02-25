import requests
import json
from bs4 import BeautifulSoup

def test_nnet_api():
    # Many Prestashop/Magento sites use a predictable AJAX endpoint for category pagination.
    # Nnet URLs usually end with ?page=2 or similar, but the actual data payload might be
    # in an XHR request. Let's try downloading the raw HTML again and looking closer at the
    # AJAX calls embedded in the javascript.

    url = "https://www.nnet.com.uy/monitor-gamer/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print(f"Fetching {url}... looking for specific item wrappers.")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # After further review of Nnet structure from a standard browser dump (historically known), 
    # the products are often wrapped in `<div class="product-item">` or similar structure where
    # the link is inside an `a` tag with the class `name` or `title`.

    # Let's try finding all <a> tags that link to "/productos/"
    links = soup.find_all('a', href=lambda href: href and '/productos/' in href)
    
    print(f"Found {len(links)} general product links.")
    
    products_found = set()
    for link in links:
        url = link['href']
        # The text inside the link might be the product name, or it might be in an image alt tag
        name = link.text.strip()
        if not name:
             img = link.find('img')
             if img and img.get('alt'):
                 name = img['alt'].strip()
                 
        if name and url not in products_found:
             products_found.add(url)
             print(f"- {name}\n  {url}")
             
    if products_found:
        print(f"\nSuccessfully identified {len(products_found)} unique products using link crawling!")
    else:
        print("\nStill unable to extract products. The site is likely heavily client-side rendered (CSR) requiring AJAX interception.")

if __name__ == "__main__":
    test_nnet_api()
