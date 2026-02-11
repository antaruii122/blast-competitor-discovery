from typing import List, Dict, Any
from rival_search_client import RivalSearchClient

def find_local_prices_for_matches(matches: List[Dict[str, Any]], countries: List[str] = ["Chile"]) -> List[Dict[str, Any]]:
    client = RivalSearchClient()
    results = []
    
    for match in matches:
        brand = match.get("brand")
        model = match.get("model")
        
        for country in countries:
            price_data = client.search_local_price(brand, model, country)
            
            if price_data:
                # Merge Match + Price Data
                full_record = match.copy()
                full_record["market_data"] = {
                    "country": country,
                    "price": price_data["price"],
                    "currency": price_data["currency"],
                    "url": price_data["url"]
                }
                results.append(full_record)
                
    return results
