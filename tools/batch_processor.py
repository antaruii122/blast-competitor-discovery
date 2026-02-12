"""
Batch Processor for Find Competitor Product
Takes a CSV with model + specifications and searches for competitor products.
"""

import csv
import json
import sys
import os
import uuid
from datetime import datetime

# Ensure sibling imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Try to import Supabase client, but don't fail if not available
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    print("[Warning] Supabase not installed. Results will only be printed to console.")


def get_supabase_client() -> 'Client':
    """Get Supabase client from environment variables."""
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment")

    return create_client(url, key)


def load_csv_input(filepath: str):
    """
    Reads a CSV file where each row is a product.
    New Format: model, specifications
    """
    products = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                product = {
                    "id": str(uuid.uuid4()),
                    "model": row.get('model', '').strip(),
                    "specifications": row.get('specifications', '').strip(),
                }

                # Skip empty rows
                if not product['model']:
                    continue

                products.append(product)
            except Exception as e:
                print(f"[Error] Skipping row: {e}")

    return products


def save_products_to_db(products: list, supabase: 'Client') -> dict:
    """
    Save products to the 'products' table in Supabase.
    Returns a mapping of model -> product_id.
    """
    product_ids = {}

    for product in products:
        try:
            # Prepare product data
            data = {
                "id": product['id'],
                "model_name": product['model'],
                "specifications_text": product['specifications'],
                "created_at": datetime.utcnow().isoformat(),
                "status": "pending"
            }

            # Insert into database
            result = supabase.table('products').upsert(data, on_conflict='model_name').execute()

            if result.data:
                product_ids[product['model']] = result.data[0]['id']
                print(f"[DB] Saved product: {product['model']}")

        except Exception as e:
            print(f"[Error] Failed to save {product['model']}: {e}")
            product_ids[product['model']] = product['id']

    return product_ids


def run_batch(filepath: str):
    """
    Process a batch of products from CSV.
    For now, this just validates and stores the products.
    The actual competitor matching will be done by the MCP tools or API.
    """
    print(f"\n{'='*60}")
    print(f"Starting Batch Processing")
    print(f"Input file: {filepath}")
    print(f"{'='*60}\n")

    # Load products from CSV
    products = load_csv_input(filepath)
    print(f"[Info] Loaded {len(products)} products from CSV")

    if not products:
        print("[Warning] No valid products found in CSV")
        return

    # Print sample of loaded products
    print("\n[Preview] First 3 products:")
    for i, p in enumerate(products[:3]):
        print(f"  {i+1}. Model: {p['model']}")
        print(f"     Specs: {p['specifications'][:100]}...")

    # Try to save to Supabase if available
    if SUPABASE_AVAILABLE:
        try:
            supabase = get_supabase_client()
            print("\n[DB] Connected to Supabase")

            product_ids = save_products_to_db(products, supabase)
            print(f"[DB] Saved {len(product_ids)} products to database")

        except Exception as e:
            print(f"[Error] Database connection failed: {e}")
            print("[Info] Products loaded but not saved to database")
    else:
        print("\n[Info] Supabase not configured - products loaded but not persisted")

    print(f"\n{'='*60}")
    print(f"Batch Processing Complete")
    print(f"Total products: {len(products)}")
    print(f"{'='*60}\n")

    # Output JSON summary for the API to parse
    result = {
        "success": True,
        "products_loaded": len(products),
        "products": [{"model": p['model'], "id": p['id']} for p in products]
    }

    print("\n--- JSON_RESULT_START ---")
    print(json.dumps(result))
    print("--- JSON_RESULT_END ---")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python batch_processor.py <path_to_csv>")
        sys.exit(1)
    else:
        run_batch(sys.argv[1])
