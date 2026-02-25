# B.L.A.S.T. Intelligence Core - Competitor Discovery Platform

AI-powered competitor discovery system that identifies global technical rivals for hardware products and finds their local pricing across South American markets.

## Overview

**Two-Phase Architecture:**
1. **Global Spec Matching**: Import catalogs from Google Sheets → Find technically equivalent competitor models
2. **Local Price Discovery**: Select competitors → Search whitelisted LATAM retailers for real-time pricing

## Project Structure

```
├── tools/                    # Backend Python scripts
│   ├── batch_processor.py    # Main catalog processing orchestrator
│   ├── engine_orchestrator.py # Competitor matching logic
│   ├── perform_global_match.py
│   ├── validate_tech_parity.py
│   ├── local_price_fetcher.py
│   ├── push_match_results.py # Supabase integration
│   └── retailer_config.json  # Country/retailer whitelist
├── webapp/                   # Next.js web application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & API clients
│   │   └── theme/           # Material-UI theme
└── .agent/                   # Skills & workflows
    └── skills/
        ├── matching-hardware/
        └── search-specialist/
```

## Tech Stack

**Backend:**
- Python 3.8+
- Supabase (PostgreSQL)
- RivalSearch MCP (via Model Context Protocol)

**Frontend:**
- Next.js 14 (App Router)
- Material-UI (MUI)
- TypeScript
- Google Sheets API

## Deployment

- **Frontend**: Vercel
- **Backend**: Python scripts (serverless or containerized)
- **Database**: Supabase (hosted)

## Environment Variables

See `webapp/.env.local.template` for required configuration.

## Development Status

- [x] **Protocol 0**: Backend Intelligence Core (Complete)
- [ ] **Protocol 1**: Web Application (In Progress)

## AI Execution Prompts

Below are the approved prompt templates for executing the two distinct workflow phases. Use these to instruct the AI agent.

### 1. Phase 1: Catalog Ingestion
*Use this when uploading a new PDF, Excel, image, or text file containing your products.*

> "Execute **Phase 1 (Catalog Ingestion)** on the attached document.
> 1. Use the `data-ingestion` skill to extract the exact SKU, summarize the specifications into a single 'description' string, and determine the correct hardware 'category'.
> 2. Use the `tools/supabase_ingest.py` script with `--phase upload` to insert these products into the `my_products` table.
> 3. Provide a summary of the SKUs you successfully ingested into the database."

### 2. Phase 2: Global Tech Comparison
*Use this to find technical equivalents for the products you just uploaded.*

> "Execute **Phase 2 (Global Tech Comparison)** for the **[CATEGORY]** category.
> 1. Look in the `my_products` table for any items in `[CATEGORY]` where the competitor match hasn't been done yet. Extract my SKUs.
> 2. Use the `matching-hardware` skill to find ~4 Tier 1 and ~2 Tier 2 technical global rivals for my SKU. Prioritize **[BRAND]** if relevant. 
>    *   **CRITICAL RULES**: You MUST check the category's `resources/*.md` file first to enforce strict dealbreakers (e.g., Curved vs Flat, Panel Types).
> 3. Use the `tools/supabase_ingest.py` script with `--phase match` to safely insert the found competitors into the `[category]_comparison` table.
> 4. Mark my product's analysis status as 'complete' in `my_products`.
> 5. Provide a summary of the technical matches found."

### 3. Phase 3: Regional Price Discovery
*Use this to find local prices in LATAM for the competitors we already mapped.*

> "Execute **Phase 3 (Regional Price Discovery)** for **[COUNTRY]** in the **[CATEGORY]** category on the retailer **[RETAILER_DOMAIN]** (e.g. `winpy.cl`).
> 1. Query the `[category]_comparison` table to get the full list of `competitor_sku` items mapped to my products. **Do not search for new tech matches.**
> 2. Consult `tools/retailer_config.json` for the **[COUNTRY]** whitelist.
> 3. Use the Google Serper API logic to scout these *exact* competitor SKUs strictly on **[RETAILER_DOMAIN]**. Exclude marketplaces. Run scripts synchronously.
> 4. Use the `tools/supabase_ingest.py` script with `--phase price` to safely insert the results into the `[category]_regional` table. Ensure all fields (availability, price, retailer name, URL) are captured accurately.
> 5. Provide a summary report of the found prices and availability in **[COUNTRY]**."

### 4. Phase 4: Bottom-Up Regional Discovery (Store Scraping)
*Use this when the Top-Down global search (Phase 2 & 3) didn't find enough local competitors, and you want to scrape exactly what a specific retailer has in stock to find matches.*

> "Execute **Phase 4 (Bottom-Up Regional Discovery)** on the retailer **[RETAILER_URL]** for the **[CATEGORY]** category.
> 1. Scrape the retailer's catalog to extract all available products and their specifications.
> 2. Filter the scraped products to ONLY consider the following competitor brands: **Samsung, Xiaomi, MSI, Perseo, Cooler Master, Fastrock, Acer**.
> 3. Compare these local models against my products in the `my_products` table based on hardware parity.
> 4. For each of my SKUs, select a **maximum of 1 or 2** of the absolute best matches from the scraped data. If you find one excellent match, one is enough. Do not exceed two.
> 5. Add these new relationships to `[category]_comparison` and insert the regional data (URL, price, availability) directly into `[category]_regional`."

## License

Private project - All rights reserved
