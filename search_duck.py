import urllib.request
import urllib.parse
import sys

def search(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'w3m/0.5.3+git20180125'}
    )
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        results = []
        pos = 0
        while pos != -1 and len(results) < 5:
            # Look for result__url string directly instead of tag parsing
            url_start = html.find('class="result__url"', pos)
            if url_start == -1: break
            
            href_start = html.find('href="', url_start) + 6
            href_end = html.find('"', href_start)
            u = html[href_start:href_end]
            
            # The exact unescaped link is after uddg= if present
            if 'uddg=' in u:
                u = urllib.parse.unquote(u.split('uddg=')[1].split('&')[0])
                
            # Now find the title right before this url
            title_block_start = html.rfind('<h2', 0, url_start)
            title_start = html.find('>', html.find('<a', title_block_start)) + 1
            title_end = html.find('</a>', title_start)
            title = html[title_start:title_end]
            
            # Strip tags safely
            clean_title = ""
            in_tag = False
            for char in title:
                if char == '<': in_tag = True
                elif char == '>': in_tag = False
                elif not in_tag: clean_title += char
                
            results.append((clean_title.strip(), u))
            pos = href_end
            
        return results
    except Exception as e:
        print(f"Error: {e}")
        return []

print("\n=== 24 inch VA 1080p 180Hz ===")
for r in search('monitor "24 inch" "VA" "180Hz" "1080p" gaming site:amazon.com'):
    print(f"- {r[0]}\n  {r[1]}")

print("\n=== 24 inch VA 1080p 180Hz Alternate ===")    
for r in search('monitor "24 inch" "VA" "180Hz" "FHD" gaming site:newegg.com'):
    print(f"- {r[0]}\n  {r[1]}")

print("\n=== 24 inch IPS 1080p 180Hz ===")
for r in search('monitor "24 inch" "IPS" "180Hz" "1080p" gaming site:amazon.com'):
    print(f"- {r[0]}\n  {r[1]}")

print("\n=== 27 inch VA 1080p 180Hz ===")
for r in search('monitor "27 inch" "VA" "180Hz" "1080p" gaming site:amazon.com'):
    print(f"- {r[0]}\n  {r[1]}")

print("\n=== 27 inch IPS 1080p 180Hz ===")
for r in search('monitor "27 inch" "IPS" "180Hz" "1080p" gaming site:amazon.com'):
    print(f"- {r[0]}\n  {r[1]}")
    
print("\n=== 27 inch VA 1440p 180Hz ===")
for r in search('monitor "27 inch" "VA" "180Hz" "1440p" OR "QHD" gaming site:amazon.com'):
    print(f"- {r[0]}\n  {r[1]}")

print("\n=== 27 inch IPS 1440p 180Hz ===")
for r in search('monitor "27 inch" "IPS" "180Hz" "1440p" OR "QHD" gaming site:amazon.com'):
    print(f"- {r[0]}\n  {r[1]}")

