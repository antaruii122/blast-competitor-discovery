
import os
import json
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

try:
    from supabase import create_client, Client
except ImportError:
    print("Warning: 'supabase' package not installed. Run 'pip install supabase'")
    create_client = None

# Load Supabase credentials from Environment Variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def get_supabase_client() -> Optional[Client]:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables are required.")
        return None
    if not create_client:
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
        return None

def push_results(matches: List[Dict[str, Any]], my_product_id: str):
    """
    Pushes results to the 'competitor_matches' table in Supabase.
    """
    if not matches:
        print("No matches to push.")
        return

    client = get_supabase_client()
    
    # Prepare payload
    payloads = []
    for m in matches:
        # Generate match_id if not present
        match_id = str(uuid.uuid4())
        
        # Extract data
        payload = {
            "id": match_id, # Assuming DB has uuid PK
            "my_product_id": my_product_id,
            "competitor_brand": m.get("brand"),
            "competitor_model": m.get("model"),
             # Price fields are NULL for global matches in decoupled mode
            "competitor_price_latam": None,
            "currency": None,
            "country": None,
            "technical_parity_score": m.get("match_meta", {}).get("score"),
            "tier": m.get("match_meta", {}).get("tier"),
            # Storing spec diffs could be useful
            "spec_diffs": json.dumps(m.get("match_meta", {}).get("notes", [])),
            "timestamp": datetime.utcnow().isoformat()
        }
        payloads.append(payload)
        
    if client:
        try:
            print(f"Pushing {len(payloads)} records to Supabase...")
            data, count = client.table("competitor_matches").insert(payloads).execute()
            print("Successfully pushed to Supabase.")
        except Exception as e:
            print(f"Supabase Output Error: {e}")
            # Fallback to print if DB fails
            print(f"FALLBACK DB INSERT: {json.dumps(payloads, indent=2)}")
    else:
        # If client not available, print as fallback (mock behavior)
        print("Supabase Client unavailable. Printing payload:")
        print(f"DB INSERT: {json.dumps(payloads, indent=2)}")

if __name__ == "__main__":
    # Test
    test_match = [{"brand": "TestBrand", "model": "TestModel", "match_meta": {"score": 0.9, "tier": "Tier 1"}}]
    push_results(test_match, "test-uuid")
