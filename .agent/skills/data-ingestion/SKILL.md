---
description: Automatically processes uploaded product files (Excel, images, text) to extract and condense specifications, then updates Supabase using the ingestion script.
---

# Product Data Ingestion Skill

This skill is invoked **automatically** whenever the user uploads a new file, photo, or Excel sheet containing product specifications to be added to our system.

## Objective
Extract the SKU, condense all product specifications into a single cohesive description string, identify the hardware category, and ingest it into **Table A (My Products)** using the backend ingestion script. 

## Core Rules — NEVER VIOLATE
1. **Extract precisely 3 fields for Table A**:
   - `sku`: The exact manufacturer part number / model identifier. This is the **most important** identifier.
   - `description`: You MUST condense all technical specifications and descriptions into a **single string field**. NEVER split specs into multiple columns. 
   - `category`: Identify the product category (e.g., `monitors`, `cases`, `cooling`, `motherboards`, `gpus`). Be consistent and use the plural form in lowercase.
2. **Never create duplicates**: The ingestion script will enforce uniqueness, but always ensure the SKU is perfectly extracted.
3. **No direct DB writes**: ALWAYS use `python tools/supabase_ingest.py` to handle database interactions. The Python script will handle `ON CONFLICT` updates and trigger any necessary dynamic table creations safely via RPC.

## How to Execute This Skill
1. **Analyze the Upload:**
   - Review the uploaded file/image/text.
   - Extract the SKU.
   - Summarize the specs into one comprehensive string.
   - Determine the correct category.
2. **Execute Ingestion:**
   Run the following command:
   ```bash
   python tools/supabase_ingest.py --phase upload \
     --sku "<extracted_sku>" \
     --category "<category>" \
     --description "<condensed_description>"
   ```
3. **Report:**
   Inform the user of the successful extraction and ingestion, displaying the `sku`, `category`, and a brief preview of the `description`.

## Notes on the Decoupled System (For Agent Context)
You do not need to handle Phase 2 or Phase 3 directly during upload, but know they exist:
- **Phase 1 (Upload):** Handled by this skill. Stores products in `my_products` (Table A).
- **Phase 2 (Matching):** Find competitors for a SKU, writes to `[category]_comparison` (Table B). Table B has 1 row per competitor model.
  - **CRITICAL RULE FOR ALL SKILLS**: `competitor_sku` MUST be the true Model Name (e.g. "ASUS VA27EHF"), NEVER a generic search string. `competitor_url` MUST be the direct product page link.
- **Phase 3 (Pricing):** Finds regional pricing for SKUs, writes to `[category]_regional` (Table C). Table C has 1 row per region per competitor.

These tables are dynamically created via PostgreSQL functions triggered by the Python script to ensure relational database integrity.
