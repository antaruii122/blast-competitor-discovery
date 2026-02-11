
import json
import os
import sys
from typing import List, Dict, Any, Optional

# Ensure sibling imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from rival_search_client import RivalSearchClient

def load_retailer_config() -> Dict[str, Any]:
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "retailer_config.json")
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: retailer_config.json not found at {config_path}")
        return {}

def is_domain_allowed(url: str, country: str, config: Dict[str, Any]) -> bool:
    """
    Checks if a URL is allowed based on Whitelist/Blacklist for a country.
    Strategy:
    1. If Blacklisted -> REJECT.
    2. If Whitelisted -> ACCEPT.
    3. If neither -> REJECT (Strict Mode) or ACCEPT (Permissive Mode).
    User requested "Excluded MercadoLibre/Solotodo", implied Strict Whitelist for reliability.
    """
    country_config = config.get(country.lower())
    if not country_config:
        # Default policy if country not found? Maybe reject to be safe.
        return False
        
    domain = url.lower().replace("https://", "").replace("http://", "").split("/")[0]
    
    # 1. Check Blacklist
    for bad_site in country_config.get("blacklist", []):
        if bad_site in domain:
            print(f"Blocked Blacklisted Domain: {domain}")
            return False
            
    # 2. Check Whitelist
    for good_site in country_config.get("whitelist", []):
        if good_site in domain:
            return True
            
    # 3. Default Reject (Strict Mode)
    print(f"Blocked Unknown Domain: {domain}")
    return False

def fetch_local_price_on_demand(match_payload: Dict[str, Any], target_country: str) -> Optional[Dict[str, Any]]:
    """
    On-Demand Trigger.
    Input: A single Match record (Brand, Model).
    Output: Price Data found in valid retailer.
    """
    client = RivalSearchClient()
    config = load_retailer_config()
    
    brand = match_payload.get("competitor_brand")
    model = match_payload.get("competitor_model")
    
    print(f"Searching {target_country} for {brand} {model}...")
    
    # In a real scenario, RivalSearchMCP might return multiple results.
    # Here we simulate fetching a candidate URL and validating it.
    
    # MOCK SEARCH RESULT (Simulating RivalSearch)
    # Ideally RivalSearchMCP takes a "domain_filter" arg, but if not, we post-filter.
    
    # Let's say we get a raw result:
    raw_result = client.search_local_price(brand, model, target_country)
    
    if not raw_result:
        return None
        
    url = raw_result.get("url", "")
    
    if is_domain_allowed(url, target_country, config):
        print(f"Price Found: {raw_result['price']} {raw_result['currency']} @ {url}")
        return raw_result
    else:
        print(f"Result Filtered Out: {url} is not in whitelist.")
        return None

if __name__ == "__main__":
    # Test
    fake_match = {"competitor_brand": "MSI", "competitor_model": "Optix G271"}
    
    # 1. Test Valid (PC Factory / Solotodo is mocked in client to return generic, let's pretend)
    # We need to mock the client response in this script or modify the client to return a whitelisted URL for testing.
    # For now, let's rely on the Logic Check function.
    
    conf = load_retailer_config()
    print("Test Blacklist (MercadoLibre):", is_domain_allowed("https://mercadolibre.cl/msi", "chile", conf)) # Should be False
    print("Test Whitelist (PCFactory):", is_domain_allowed("https://www.pcfactory.cl/producto", "chile", conf)) # Should be True
    print("Test Unknown (RandomStore):", is_domain_allowed("https://randomstore.cl", "chile", conf)) # Should be False
