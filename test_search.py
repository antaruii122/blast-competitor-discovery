import urllib.request
import urllib.parse
import re

def simple_search(query):
    print(f'\n--- Searching for: {query} ---')
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        results = []
        idx = 0
        while True:
            idx = html.find('class="result__title"', idx)
            if idx == -1 or len(results) >= 5: break
            
            start_a = html.find('<a class="result__url"', idx)
            if start_a == -1: break
            
            start_text = html.find('>', start_a) + 1
            end_text = html.find('</a>', start_text)
            title_html = html[start_text:end_text]
            
            clean_title = ''
            in_tag = False
            for char in title_html:
                if char == '<': in_tag = True
                elif char == '>': in_tag = False
                elif not in_tag: clean_title += char
                
            results.append(clean_title.strip())
            idx = end_text
            
        for r in results:
            print(f'- {r}')
            
    except Exception as e:
        print(f'Error: {e}')

simple_search('monitor 24 inch VA 1080p 180Hz gaming site:amazon.com OR site:bestbuy.com')
simple_search('monitor 24 inch IPS 1080p 180Hz gaming site:amazon.com OR site:bestbuy.com')
