# Project Constitution

## North Star
Construir un motor de paridad técnica global que identifique modelos de hardware de marcas líderes y rastree su precio y disponibilidad en el mercado de Sudamérica.
**Goal:** Identify ~4 Tier 1 Competitors and 1-3 Tier 2 Competitors per product.
**Process:** Global Tech Match (Store) -> On-Demand Local Verification (Web App).
**CRITICAL RULE:** **Technical Parity >>> Price.** Do not use price as a primary filter. Match the *Exact Specifications* and *Feature Set*. If a competitor costs 2x but is the only technical match, IT IS THE MATCH.

## Integrations
- **Supabase (MCP):** Central data hub (`Competitor_Matches`, `Local_Prices`).
- **RivalSearchMCP:** Global scouting.
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

### 2. Matching Logic (Decoupled)
**Step 1: Global Tech Match**
- Trigger: Import Catalog / New Product.
- **Philosophy:** Find the "Product Soulmate". Ignore price.
- Output: Store in `Competitor_Matches`.

**Step 2: Local Discovery (On-Demand)**
- Trigger: Web App User Action.
- **Geography:** All LATAM (Mexico to South).
- **Strict Blacklist:** NO Marketplaces (MercadoLibre, Falabella, Paris, Ripley, Amazon). NO Aggregators (Solotodo, Zoom, Knasta).
- **Whitelist:** Specialized Tech Retailers (PC Factory, Kabum, Cyberpuerta, etc.).

### 3. Tone
- Technical, Engineering-focused.
