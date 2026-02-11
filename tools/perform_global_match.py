
import sys
import json
import os
from typing import Dict, Any, List

# Ensure we can import sibling modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from rival_search_client import RivalSearchClient
from validate_tech_parity import validate_parity

def perform_global_match(category: str, target_specs: Dict[str, Any], rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Orchestrates the Global Match Phase.
    """
    client = RivalSearchClient()
    matched_candidates = []
    
    # 1. Load Brands
    tier1_brands = rules.get("brands_tier1", [])
    tier2_brands = rules.get("brands_tier2", [])
    
    all_brands = [("Tier 1", b) for b in tier1_brands] + [("Tier 2", b) for b in tier2_brands]
    
    print(f"Starting Global Search for {len(all_brands)} targets...")
    
    for tier, brand in all_brands:
        # Stop condition: If we have enough matches, maybe we can stop? (User said find ~4 + 1-3)
        # For now, we search all to get best options, or limit per brand
        
        candidates = client.search_global_model(brand, category, target_specs)
        
        for cand in candidates:
            is_match, score, log = validate_parity(target_specs, cand["specs"], rules)
            
            if is_match:
                cand["match_meta"] = {
                    "score": score,
                    "tier": tier,
                    "log": log
                }
                matched_candidates.append(cand)
                print(f"MATCH FOUND: {brand} {cand.get('model')} (Score: {score:.2f})")
            else:
                 print(f"Discarded {brand} {cand.get('model')}: {log[-1]}")
                 
    return matched_candidates

if __name__ == "__main__":
    # Test Run
    pass
