
import csv
import json
import sys
import os

# Ensure sibling imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from engine_orchestrator import process_product

def load_csv_input(filepath: str):
    """
    Reads a CSV file where each row is a product.
    Format Expectation: id, product_name, category, price_latam, specs_json
    """
    products = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                # Parse the specs_json string into a dict
                specs = json.loads(row['specs_json'])
                
                product = {
                    "id": row['id'],
                    "product_name": row['product_name'],
                    "category": row['category'],
                    "price_latam": float(row['price_latam']),
                    "specs": specs
                }
                products.append(product)
            except Exception as e:
                print(f"Skipping row {row.get('product_name')}: Error parsing - {e}")
                
    return products

def run_batch(filepath: str):
    print(f"Starting Batch Processing for {filepath}")
    products = load_csv_input(filepath)
    print(f"Loaded {len(products)} products.")
    
    for p in products:
        try:
            process_product(p)
        except Exception as e:
            print(f"CRITICAL ERROR processing {p['product_name']}: {e}")
            
    print("Batch Processing Complete.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tools/batch_processor.py <path_to_csv>")
    else:
        run_batch(sys.argv[1])
