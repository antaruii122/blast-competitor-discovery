import json
import urllib.request
import urllib.parse
from html.parser import HTMLParser

class SimpleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.titles = []
        self.in_title = False
        
    def handle_starttag(self, tag, attrs):
        if tag == 'h2':
            for attr in attrs:
                if attr[0] == 'class' and 'result__title' in attr[1]:
                    self.in_title = True
                    
    def handle_endtag(self, tag):
        if tag == 'h2' and self.in_title:
            self.in_title = False
            
    def handle_data(self, data):
        if self.in_title and data.strip():
            self.titles.append(data.strip())

def search(query):
    print(f'\n--- {query} ---')
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Simple string matching to avoid complex parsing
        idx = 0
        while True:
            idx = html.find('class="result__title"', idx)
            if idx == -1: break
            start_a = html.find('<a ', idx)
            start_text = html.find('>', start_a) + 1
            end_text = html.find('</a>', start_text)
            title = html[start_text:end_text]
            # Strip simple tags
            while '<' in title and '>' in title:
                start_tag = title.find('<')
                end_tag = title.find('>') + 1
                title = title[:start_tag] + title[end_tag:]
            if title.strip():
                print(f"- {title.strip()}")
            idx = end_text
    except Exception as e:
        print(f'Error: {e}')

search('monitor 24 inch VA 1080p 180Hz gaming site:amazon.com OR site:bestbuy.com')
search('monitor 24 inch IPS 1080p 180Hz gaming site:amazon.com OR site:bestbuy.com')
search('monitor 27 inch VA 1080p 180Hz gaming site:amazon.com OR site:bestbuy.com')
search('monitor 27 inch IPS 1080p 180Hz gaming site:amazon.com OR site:bestbuy.com')
search('monitor 27 inch VA 1440p 180Hz gaming site:amazon.com OR site:bestbuy.com')
search('monitor 27 inch IPS 1440p 180Hz gaming site:amazon.com OR site:bestbuy.com')
