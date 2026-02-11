
import sys
import os
import json
import argparse
from typing import Dict, Any

# Ensure sibling imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from perform_global_match import perform_global_match
from push_match_results import push_results

def load_category_rules(category: str) -> Dict[str, Any]:
    """
    Loads rules from .agent/skills/matching-hardware/resources/category_rules.json
    """
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # path is tools/../.agent/... 
    # Actually tools is at root/tools. .agent is at root/.agent.
    # So we go up one level from tools to root.
    root_path = os.path.dirname(base_path) 
    
    rules_path = os.path.join(root_path, ".agent", "skills", "matching-hardware", "resources", "category_rules.json")
    
    # Fallback for dev environment pathing
    if not os.path.exists(rules_path):
        # Try relative to current script if running from root
        rules_path = os.path.abspath(os.path.join(".agent", "skills", "matching-hardware", "resources", "category_rules.json"))
        
    if not os.path.exists(rules_path):
        raise FileNotFoundError(f"Could not find category_rules.json at {rules_path}")
        
    with open(rules_path, 'r') as f:
        all_rules = json.load(f)
        
    return all_rules.get(category.lower())

def process_product(product_spec: Dict[str, Any]):
    """
    Main Orchestration Flow:
    1. Load Rules
    2. Global Match
    3. Local Price Search
    4. Push to DB
    """
    category = product_spec.get("category")
    product_id = product_spec.get("id", "unknown-id")
    
    print(f"--- Processing {product_spec.get('product_name')} ({category}) ---")
    
    # 1. Load Rules
    rules = load_category_rules(category)
    if not rules:
        print(f"Error: No rules found for category '{category}'")
        return
        
    # 2. Global Match
    print(f"Phase 1: Global Matching (Tolerance: {rules.get('tolerance'):.0%})")
    global_matches = perform_global_match(category, product_spec.get("specs"), rules)
    
    if not global_matches:
        print("No global matches found. Stopping.")
        return
        
    print(f"Found {len(global_matches)} Global Candidates. Storing in Database.")
    
    # 3. Push Global Matches to DB (Without Price)
    push_results(global_matches, product_id)
    print("--- Global Match Process Complete ---")

if __name__ == "__main__":
    # Example Usage: python tools/engine_orchestrator.py --spec '{"..."}'
    # parser = argparse.ArgumentParser()
    # ...
    
    # HARDCODED TEST for verification
    test_spec = {
        "id": "test-uuid-123",
        "product_name": "My MSI Clone Monitor",
        "category": "monitor",
        "specs": {
            "refresh_rate_hz": 165,
            "response_time_ms": 1,
            "size_inch": 27,
            "panel_type": "IPS",
            "screen_curvature": "Flat",
            "resolution_width": 1920
        }
    }
    
    process_product(test_spec)
