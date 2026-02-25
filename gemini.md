# Project Constitution

## North Star
Construir un motor de paridad técnica global que identifique modelos de hardware de marcas líderes y rastree su precio y disponibilidad en el mercado de Sudamérica.
**Goal:** Identify ~4 Tier 1 Competitors and 1-3 Tier 2 Competitors per product.
**Process:** Global Tech Match (Store) -> On-Demand Local Verification (Web App).
**CRITICAL RULE:** **Technical Parity >>> Price.** Do not use price as a primary filter. Match the *Exact Specifications* and *Feature Set*. If a competitor costs 2x but is the only technical match, IT IS THE MATCH.

## 🚨 STRICT AGENT EXECUTION RULES (MANDATORY) 🚨
1. **NO BACKGROUND TERMINAL PROCESSES:** The agent is STRICTLY FORBIDDEN from triggering background terminal commands. If a Python script or command must be executed via `run_command`, the agent MUST set `WaitMsBeforeAsync` to a high value (like 300000ms) to ensure it runs synchronously and finishes before returning. You must NEVER generate a "Background command ID".
2. **NATIVE SQL ALLOWED FOR QUERIES:** The agent IS ALLOWED to use `mcp_supabase-mcp-server_execute_sql` (native SQL) via the Supabase MCP to query and retrieve information from the database.
3. **SERPER API HANDLING:** The Google Serper API key is in `webapp/.env.local`. When searching, use this key via synchronous Python scripts (or native tools) only. Never run web scraping tasks in the background.

## Integrations
- **Supabase (MCP):** Central data hub (`monitors_comparison`, `monitors_regional`). Use MCP to query.
- **🚨 DATABASE INTEGRITY POLICY:**
  - **THE ONLY FUCKING RULE FOR REGIONAL DATA:** If the `product_page_url` is `null` (meaning we cannot find the actual product page on the regional store), **DO NOT CREATE THE ROW.** If a row already exists and the URL is found to be dead, soft-404, or unfindable, you MUST **DELETE THE ROW ENTRY ENTIRELY.** Never leave a row with a `null` product page URL.
  - **NO WEB BROWSERS:** You are strictly forbidden from using web browser subagents, Playwright, Puppeteer, Selenium, or any other browser automation. All data gathering must be done via raw HTTP requests, API calls (like Google Serper), or native Python scraping (BeautifulSoup/Requests). NEVER use a browser.
  - **REUSE BEFORE CREATE:** Strictly forbidden to create new tables for an existing category domain.
  - **EXISTING TABLES ONLY:** Always verify if `[category]_comparison` and `[category]_regional` already exist.
  - **CANONICAL NAMING:** Use plural, lowercase names for all categories used in database naming (e.g., `monitors` NOT `monitor`).
  - **PHASE 3 RESTRICTION:** Phase 3 (Pricing) must NEVER trigger schema changes or table creation unless explicitly instructed with a `--setup` flag.
- **Google Serper / search_web tool:** Global scouting and pricing discovery. **Rule: Google Serper API is the FIRST option. `search_web` MUST ONLY be used as a second option or fallback for reinforcing information.**
- **Google Sheets:** Input source.

## Data Schemas
(Unchanged from previous)

## Behavioral Rules

### 1. Brand & Category Matrix
**Core Rule:** "Gaming Brand Only" for gaming requests.
- **Monitors:**
  - **Tier 1:** Samsung, LG, ASUS, Dell, AOC, Acer, BenQ.
  - **Tier 2:** Xiaomi, MSI, Gigabyte, ViewSonic, Sceptre, Viotek, Pixio, Innocn, TGT, Mancer, Arzopa, Pichau.
  - **BANNED:** KTC.
- **Peripherals:**
  - **Tier 1:** Logitech G, Razer, Corsair, HyperX, SteelSeries, ASUS ROG.
  - **Tier 2:** Redragon, T-Dagger, VSG, Gamdias, Sharkoon, Trust, Havit, Glorious, Akko, Keychron, RK, Aula.
- **Components:**
  - **Tier 1:** ASUS, MSI, Gigabyte, ASRock.
  - **Tier 2:** Zotac, PNY, Palit, Galax, Colorful, Sapphire, PowerColor, XFX, Biostar.
- **Cooling/Cases:**
  - **Tier 1:** Corsair, NZXT, Lian Li, Cooler Master, Thermaltake, Fractal, Phanteks, Be Quiet!, Noctua.
  - **Tier 2:** DeepCool, Antec, Aerocool, Cougar, Gamdias, Redragon, Montech, Zalman, ID-Cooling, Valkyrie.
- **Power Supplies:**
  - **Tier 1:** Corsair (RMe/x), Seasonic, EVGA (SuperNOVA), Be Quiet!, ASUS, MSI, Thermaltake.
  - **Tier 2:** DeepCool, Cooler Master, Gigabyte, Redragon, Gamdias, Aerocool.
- **Gaming Chairs:**
  - **Tier 1:** Secretlab, Herman Miller, Razer, DXRacer, Noblechairs, Corsair.
  - **Tier 2:** Cougar, ThunderX3, Redragon, Gamdias, Aerocool, Drift, Sharkoon, DT3, Pichau.

### 2. Workflow Logic (Three Distinct Phases)
This project separates data ingestion, finding tech competitors, and finding local prices into strictly distinct phases. They should NOT be combined in one prompt.

**Phase 1: Catalog Ingestion**
- **Trigger:** User uploads new product specs (PDF/Excel/Image).
- **Execution:** Extract `sku`, `category`, and condense all specs into a `description`.
- **Output:** Insert the data into `my_products` (Table A).

**Phase 2: Global Tech Comparison**
- **Trigger:** Identifying competitors for newly ingested categories.
- **Philosophy:** Find the "Product Soulmate" (technical parity). Ignore price.
- **Execution:** Find Tier 1 & Tier 2 global competitors matching strict category rules from `resources/[category].md`.
- **Output:** Insert the found rivals into `[category]_comparison` (Table B).
- **Completion:** Mark the original product as `complete` in `my_products`.

**Phase 3: Regional Price Discovery**
- **Trigger:** User wants to find LATAM pricing for competitors we *already* mapped.
- **Condition:** We ALREADY have the comparison equivalents. Do NOT search for technical equivalents again.
- **Input:** Query `[category]_comparison` to get the list of `competitor_sku`.
- **Execution:** Check local availability via Google Serper restricted strictly to a specified retailer domain (e.g. `winpy.cl`) from `retailer_config.json`.
- **Output:** Insert regional data into `[category]_regional` (Table C). Must include `my_sku`, `competitor_sku`, `competitor_brand`, `country`, `retailer_name`, `available`, `price`, `product_page_url`.
- **STRICT RULE:** Do not create a new table if one already exists for this category (e.g., use `monitors_regional` if it exists).

### 3. Tone
- Technical, Engineering-focused.
