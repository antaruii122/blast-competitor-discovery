import os
import argparse
import sys
from supabase import create_client, Client

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', 'webapp', '.env.local'))
except ImportError:
    pass

# Load Supabase credentials from Environment Variables
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")


def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables are required.", file=sys.stderr)
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_KEY)

import time

def retry_upsert(client: Client, table_name: str, payload: dict, on_conflict: str, retries: int = 3):
    last_err = None
    for attempt in range(retries):
        try:
            res = client.table(table_name).upsert(payload, on_conflict=on_conflict).execute()
            return res
        except Exception as e:
            last_err = e
            # If the schema cache is stale (PGRST205), wait and retry
            if 'PGRST205' in str(e) or 'Could not find the table' in str(e):
                time.sleep(1.5)
            else:
                raise e
    raise last_err

def handle_upload_phase(sku: str, category: str, description: str):
    """
    Phase 1: Upload. Parses details into Table A (my_products).
    """
    client = get_supabase_client()
    
    payload = {
        "sku": sku,
        "category": category,
        "description": description
    }
    
    res = retry_upsert(client, "my_products", payload, "sku")
    print(f"Successfully uploaded {sku} to my_products (Table A).")

def handle_matching_phase(your_sku: str, category: str, comp_brand: str, comp_sku: str, comp_url: str, comp_specs: str):
    """
    Phase 2: Competitor Matching. Upserts into Table B ([category]_comparison).
    Trigger setup_category_tables RPC to ensure the table exists dynamically.
    """
    client = get_supabase_client()
    
    # Ensure tables B and C exist for this category
    client.rpc("setup_category_tables", {"p_category": category}).execute()
    
    table_b_name = f"{category.lower().replace('-', '_').replace(' ', '_')}_comparison"
    payload = {
        "your_sku": your_sku,
        "competitor_brand": comp_brand,
        "competitor_sku": comp_sku,
        "competitor_url": comp_url,
        "competitor_specs": comp_specs
    }
    
    res = retry_upsert(client, table_b_name, payload, "your_sku,competitor_sku")
    print(f"Successfully added match {comp_sku} for {your_sku} in {table_b_name} (Table B).")

def handle_pricing_phase(your_sku: str, category: str, comp_sku: str, country: str, available: bool, price: float, retailer_name: str, product_page_url: str):
    """
    Phase 3: Pricing & Availability. Upserts into Table C ([category]_regional).
    """
    client = get_supabase_client()
    
    client.rpc("setup_category_tables", {"p_category": category}).execute()
    
    table_c_name = f"{category.lower().replace('-', '_').replace(' ', '_')}_regional"
    payload = {
        "your_sku": your_sku,
        "competitor_sku": comp_sku,
        "country": country,
        "available": available,
        "price": price,
        "retailer_name": retailer_name,
        "product_page_url": product_page_url
    }
    
    res = retry_upsert(client, table_c_name, payload, "your_sku,competitor_sku,country,retailer_name")
    print(f"Successfully added price entry for {comp_sku} in {country} via {retailer_name} to {table_c_name} (Table C).")



def main():
    parser = argparse.ArgumentParser(description="Supabase Data Ingestion Pipeline")
    parser.add_argument("--phase", required=True, choices=["upload", "match", "price"], help="Which phase of the decoupled process to execute.")
    parser.add_argument("--sku", help="Your Product SKU")
    parser.add_argument("--category", help="Product Category. Required for dynamic tables.")
    parser.add_argument("--description", help="Condensed product description block for Phase 1")
    
    # Phase 2 Args
    parser.add_argument("--comp-brand", help="Competitor Brand")
    parser.add_argument("--comp-sku", help="Competitor SKU Model")
    parser.add_argument("--comp-url", help="Competitor Product official URL")
    parser.add_argument("--comp-specs", help="Competitor brief specification summary")
    
    # Phase 3 Args
    parser.add_argument("--country", help="Country Name")
    parser.add_argument("--available", type=bool, default=False, help="Availability Boolean")
    parser.add_argument("--price", type=float, default=None, help="Regional Price if available")
    parser.add_argument("--retailer-name", help="Retailer name (e.g. wimpi.cl)")
    parser.add_argument("--product-page-url", help="Specific product page URL on retailer site")
    
    args = parser.parse_args()
    
    if args.phase == "upload":
        if not all([args.sku, args.category, args.description]):
            print("Error: --sku, --category, and --description are required for upload phase.")
            sys.exit(1)
        handle_upload_phase(args.sku, args.category, args.description)
        
    elif args.phase == "match":
        if not all([args.sku, args.category, args.comp_sku]):
            print("Error: --sku, --category, and --comp-sku are required for match phase.")
            sys.exit(1)
        handle_matching_phase(args.sku, args.category, args.comp_brand, args.comp_sku, args.comp_url, args.comp_specs)
        
    elif args.phase == "price":
        if not all([args.sku, args.category, args.comp_sku, args.country, args.retailer_name]):
            print("Error: --sku, --category, --comp-sku, --country, and --retailer-name are required for price phase.")
            sys.exit(1)
        handle_pricing_phase(args.sku, args.category, args.comp_sku, args.country, args.available, args.price, args.retailer_name, args.product_page_url)

if __name__ == "__main__":
    main()
