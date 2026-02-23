import json
import urllib.request
import urllib.parse
import re
from html.parser import HTMLParser

class DuckDuckGoParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.results = []
        self.in_result = False
        self.in_title = False
        self.in_url = False
        self.in_snippet = False
        self.current_title = ""
        self.current_url = ""
        self.current_snippet = ""
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        class_name = attrs_dict.get('class', '')
        href = attrs_dict.get('href', '')
        
        if tag == 'div' and 'result' in class_name and 'result--no-result' not in class_name:
            self.in_result = True
            
        if self.in_result:
            if tag == 'h2' and 'result__title' in class_name:
                self.in_title = True
            elif tag == 'a' and 'result__url' in class_name:
                self.in_url = True
                if href:
                    # DDG uses a redirect url, try to extract the real one
                    import urllib.parse
                    parsed = urllib.parse.urlparse(href)
                    query = urllib.parse.parse_qs(parsed.query)
                    if 'uddg' in query:
                        self.current_url = urllib.parse.unquote(query['uddg'][0])
                    else:
                        self.current_url = href
            elif tag == 'a' and 'result__snippet' in class_name:
                self.in_snippet = True

    def handle_endtag(self, tag):
        if tag == 'h2' and self.in_title:
            self.in_title = False
        elif tag == 'a' and self.in_url:
            self.in_url = False
        elif tag == 'a' and self.in_snippet:
            self.in_snippet = False
            if self.current_title and self.current_url:
                self.results.append({
                    'title': self.current_title.strip(),
                    'url': self.current_url,
                    'snippet': self.current_snippet.strip()
                })
                self.current_title = ""
                self.current_url = ""
                self.current_snippet = ""

    def handle_data(self, data):
        if self.in_title:
            self.current_title += data
        elif self.in_snippet:
            self.current_snippet += data

def full_search(query):
    print(f'\n--- Full Search for: {query} ---')
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        parser = DuckDuckGoParser()
        parser.feed(html)
        
        for r in parser.results[:5]:
            print(f"TITLE: {r['title']}")
            print(f"URL: {r['url']}")
            print(f"SNIPPET: {r['snippet']}\n")
            
    except Exception as e:
        print(f'Error: {e}')

full_search('monitor 24 inch "VA" 1080p 180Hz gaming')
full_search('monitor 24 inch "IPS" 1080p 180Hz gaming')
