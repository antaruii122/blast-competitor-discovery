# Project Constitution

## North Star
Construir un motor de paridad técnica global que identifique modelos de hardware de marcas líderes y rastree su precio y disponibilidad en el mercado de Sudamérica.
**Goal:** Identify ~4 Tier 1 Competitors and 1-3 Tier 2 Competitors per product.
**Process:** Global Tech Match (Store) -> On-Demand Local Verification (Web App).

## Integrations
- **Supabase (MCP):** Central data hub (`Competitor_Matches`, `Local_Prices`).
- **RivalSearchMCP:** Global scouting.
- **Google Sheets:** Input source.

## Data Schemas
(Unchanged from previous)

## Behavioral Rules

### 1. Brand & Category Matrix
(Same as before - Tier 1 vs Challenger)

### 2. Matching Logic (Decoupled)
**Step 1: Global Tech Match**
- Trigger: Import Catalog / New Product.
- Output: Store in `Competitor_Matches`.

**Step 2: Local Discovery (On-Demand)**
- Trigger: Web App User Action.
- **Geography:** All LATAM (Mexico to South).
- **Strict Blacklist:** NO Marketplaces (MercadoLibre, Falabella, Paris, Ripley, Amazon). NO Aggregators (Solotodo, Zoom, Knasta).
- **Whitelist:** Specialized Tech Retailers (PC Factory, Kabum, Cyberpuerta, etc.).

### 3. Tone
- Technical, Engineering-focused.
