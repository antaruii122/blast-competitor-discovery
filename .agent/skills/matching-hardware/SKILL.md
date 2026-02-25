---
name: matching-hardware
description: Identifies global technical rivals for hardware products. Uses strict technical parity and feature gatekeeping. IGNORES PRICE for matching.
---

# Hardware Matching Skill

## When to use this skill
- When the user wants to find competitors for a specific product (e.g., "Find rivals for this MSI Monitor").
- When a new product is added to the Google Sheet and needs validation.
- Triggered by `engine_orchestrator.py`.

## 🚨 UNIVERSAL EXCLUSION RULES (READ THIS FIRST)
**Applies to ALL categories:**

1.  **Gaming Identity is ABSOLUTE:**
    - If the input product is a **Gaming Product** (e.g., "Redragon", "Razer", "RGB", "Gaming Headset"), you are **FORBIDDEN** from comparing it effectively with "Lifestyle" or "General Consumer" brands.
    - **Brand Hierarchy & Allowed List:**
    
        **1. Monitors**
        *   **Tier 1 (Global Leaders):** Xiaomi (PRIORITY #1), Samsung, LG, ASUS (ROG/TUF), Dell (Alienware), AOC, Acer (Predator/Nitro), BenQ (Zowie).
        *   **Tier 2 (Value/Challengers):** MSI, Gigabyte, ViewSonic, Sceptre, Viotek, Pixio, Innocn, TGT, Mancer, Arzopa, Pichau.
        *   **BANNED:** KTC (Not in region).

        **2. Peripherals (Keyboards, Mice, Headsets)**
        *   **Tier 1:** Logitech G, Razer, Corsair, HyperX, SteelSeries, ASUS ROG.
        *   **Tier 2 (Budget/Regional):** Redragon, T-Dagger, VSG, Gamdias, Sharkoon, Trust, Havit, Glorious, Akko, Keychron, Royal Kludge (RK), Aula, Ajazz, Motospeed.

        **3. Components (GPUs, Motherboards)**
        *   **Tier 1 (The "Big 3+1"):** ASUS, MSI, Gigabyte, ASRock.
        *   **Tier 2 (Specialists/Value):** Zotac, PNY, Palit, Galax (KFA2), Colorful, Sapphire (AMD), PowerColor (AMD), XFX (AMD), Biostar, EVGA (Legacy/Used).

        **4. Cooling & Cases**
        *   **Tier 1:** Corsair, NZXT, Lian Li, Cooler Master, Thermaltake, Fractal Design, Phanteks, Be Quiet!, Noctua (Cooling).
        *   **Tier 2:** DeepCool, Antec, Aerocool, Cougar, Gamdias, Redragon, Montech, Zalman, ID-Cooling, Valkyrie, Pichau, T-Dagger.

        **5. Power Supplies (PSU)**
        *   **Tier 1 (Elite/Reliable):** Corsair (RMe/RMx/HXi), Seasonic, EVGA (SuperNOVA), Be Quiet!, ASUS ROG/TUF, MSI (MPG/MEG), Thermaltake (Toughpower), XPG (Core Reactor).
        *   **Tier 2 (Budget/Acceptable):** DeepCool (PK/PM), Cooler Master (MWE), Gigabyte (UD), Redragon (Gold models only), Gamdias (Kratos/Helios - Low Tier verify), Aerocool (Cylon/Kcas - Low Tier verify).
        *   **Warning:** Strict quality control on Tier 2 PSUs; verified 80+ Bronze/Gold minimum.

        **6. Gaming Chairs**
        *   **Tier 1 (Premium):** Secretlab, Herman Miller x Logitech, Razer (Iskur/Enki), DXRacer, Noblechairs, Corsair.
        *   **Tier 2 (Regional/Value):** Cougar, ThunderX3, Redragon, Gamdias, Aerocool, Drift, Sharkoon, DT3 Sports (Brazil), Pichau (Brazil).

    - **Exception:** Only specific models explicitly marketed as "Gaming Series" from general brands (e.g., Sony INZONE, JBL Quantum) are allowed. Generic models (JBL Tune, Sony WH-1000XM) are **AUTO-REJECTED**.

2.  **Product Soul Alignment:**
    - Do not match a product optimized for *competitive performance* (latency, mic clarity, positioning) with a product optimized for *media consumption* (anc, portability, battery life).

---

## Workflow

### 🚨 CRITICAL PRE-WORK VERIFICATION (DO THIS FIRST)
**NEVER search for prices until ALL verification steps are complete.**

For EACH candidate product, you MUST verify:

1. **Dimensions & Size Class MUST Match**
   - **CRITICAL:** Verify actual dimensions from official specs
   - Calculate height/depth differences: >30% = DIFFERENT SIZE CLASS
   - Compact (300-350mm) ≠ Mid-Tower (400-500mm) ≠ Full Tower (>500mm)
   - ✗ If candidate is 40%+ taller/deeper = **REJECT IMMEDIATELY**
   - **Check FIRST before other criteria**

2. **I/O Ports Match Market Tier**
   - Compare USB versions (3.0 vs 3.2), Type-C presence, port counts
   - ✗ If candidate has USB Type-C but target doesn't = **DIFFERENT TIER, REJECT**
   - ✗ If candidate has 2×USB 3.2 Gen2 but target has USB 1.0 = **REJECT**

3. **RGB Status MUST Match**
   - ✗ Candidate has RGB fans/lighting but target doesn't = **REJECT**
   - ✗ Candidate marketed as "gaming RGB" vs target "basic" = **REJECT**

4. **Material Quality Tier**
   - 0.5mm steel = budget tier
   - 0.7-0.8mm steel = standard tier
   - ✗ Different material tiers = likely wrong market segment

5. **Market Positioning Verification**
   - Read official product page marketing language
   - "Budget" vs "Premium" vs "Enthusiast" must match
   - Price tier expectations must align

**ONLY after verifying all candidates above, proceed to Phase B (pricing).**

---

## 🚨 MANDATORY FIRST STEP: Category Detection & MD Routing

**BEFORE starting Phase A (Global Tech Search), you MUST identify the product category and consult its verification guide.**

### Step 1: Detect Product Category

From the product specs or name, identify the category:
- **cases** - PC cases, enclosures, chassis
- **headsets** - Gaming headsets, headphones with mic
- **keyboards** - Mechanical/membrane keyboards
- **mice** - Gaming mice, pointing devices
- **monitors** - Display panels, screens
- **gpus** - Graphics cards (Nvidia, AMD)
- **motherboards** - Mainboards (AM4, AM5, LGA1700, etc.)
- **cooling** - CPU coolers (air tower, AIO liquid coolers)
- **gaming_tables** - Gaming desks, standing desks

### Step 2: Load Category Verification Guide

**IMMEDIATELY read the category-specific MD file:**
- Reference path: `resources/{category}.md`
- Examples:
  - Headset → Read `resources/headsets.md`
  - Keyboard → Read `resources/keyboards.md`
  - Monitor → Read `resources/monitors.md`

### Step 3: Apply Category Rules

Use the verification guide to identify:
1. **CRITICAL Features (40%)** - Dealbreakers that must match
2. **STRUCTURAL Features (30%)** - Important with tolerance ranges
3. **CONVENIENCE Features (20%)** - Nice-to-have
4. **SECONDARY Features (10%)** - Flexible

**The category MD defines what makes products compete in the same market.**

### Example:
```
Product Input: "Razer Kraken V3 Gaming Headset"

1. Detect Category: headset
2. Read: resources/headsets.md
3. Extract Critical Features from MD:
   - Surround sound type (stereo vs 7.1) - DEALBREAKER
   - Connection type (wired USB vs 3.5mm)
   - Microphone presence
4. Use these to filter competitors BEFORE checking prices
```

**❌ DO NOT SKIP THIS STEP. Skipping category verification is how errors like "matching non-7.1 headset to 7.1 headset" happen.**

---

### Main Workflow
1.  **Input Parsing:** Receive standard Product Spec JSON.
2.  **Phase A: Global Tech Search**
    - Load `category_rules.json`.
    - **Iterate Tier 1 Brands:** Search for models matching critical specs.
    - **Iterate Tier 2 Brands:** Search for models matching critical specs.
    - **Validate:** Apply AI analysis framework + `validate_tech_parity` for numeric tolerance.
    - **Goal:** Accumulate ~4 Tier 1 and ~2 Tier 2 Matches.
    - **🚨 STRICT BRAND & SKU RULES (MANDATORY):** 
        1. **MAX ONE MATCH PER BRAND:** You may only select ONE competitor model per brand per search. (e.g., if you find 1 Xiaomi, do not add another Xiaomi. You must find Samsung, MSI, AOC, etc. to fill the quota).
        2. **STRICT SKU VALIDATION:** You must use the exact, real product SKU (e.g., Xiaomi "G24i" or "G27Qi"). Verify the SKU actually exists in reality and is not hallucinated or incorrectly shortened.
        3. **BRAND DIVERSITY REQUIRED:** While the Priority #1 brand (e.g., Xiaomi) is the most important, you MUST include matches from other Tier 1 and Tier 2 brands to provide a correct, diverse list of real products.
    - **CRITICAL:** DO NOT FILTER BY PRICE. If the only technical match is 2x the price, KEEP IT.
    - **🚨 STOP HERE: Run PRE-WORK VERIFICATION checklist above**
3.  **Phase B: Local Discovery** (ONLY after verification complete)
    - For each **VERIFIED Global Match**:
        - Search specifically in Chile, Brazil, Colombia (via `find_local_price`).
        - If found, calculate `Value Gap`.
4.  **Output:** 
    - Insert structured result into Supabase `monitors_comparison`.
    - Update the original product's `competitor_analysis_status` to 'complete' in the `my_products` table to track progress.
    - **🚨 DATABASE POPULATION RULES (CRITICAL):**
        - `competitor_sku`: MUST be the exact Brand and literal Model Name/Number (e.g., "ASUS VA27EHF", "Xiaomi Mi Monitor 1C", "Gigabyte G27F"). **NEVER** use long generic search descriptions or SEO titles. The name of the monitor IS the competitor SKU.
        - `competitor_url`: MUST be the actual, direct product URL (e.g., `https://www.asus.com/.../va27ehf/`), **NOT** a search engine URL, and **NOT** just the brand's homepage.
        - `competitor_specs`: Condense the critical specs used for matching (e.g., "27 inch IPS FHD 100Hz Tier 1"). You may add extra relevant specs if it helps describe the match better.

## Competitor Analysis Framework

### Step 1: Gather Complete Context
Before declaring a match, collect:
- Full product specifications from manufacturer/retailer pages
- Market positioning (office, gaming, enthusiast, professional)
- Visual aesthetics and build features (tempered glass, RGB, mesh vs solid panels)
- **IGNORE** Price segment. Focus on "Performance Tier" instead.
- Customer reviews mentioning use case

### Step 2: Identify Critical Differentiators
Ask yourself: **"What would make a customer reject this alternative?"**

**For PC Cases:**
- Does it have the same visual style? (TG vs solid, RGB vs plain, mesh vs closed)
- Is it in the same market segment? (office/budget vs gaming vs enthusiast)
- Does it support the same motherboard form factor? (strict)
- Can it physically accommodate similar builds? (GPU clearance, cooler height)

**For Monitors:**
- Same panel technology? (IPS vs VA vs TN - usually critical)
- Same curvature? (Flat vs Curved - **CRITICAL DEALBREAKER**)
- Same use case? (gaming vs productivity vs creative work)
- Similar refresh rate tier? (60Hz vs 144Hz+ vs 240Hz+)

**Tolerance Guidelines (NOT rigid rules):**
- **Dimensions:** 20-25% variance acceptable if form factor/use case matches
- **Has vs doesn't have:** Binary features (TG, RGB, mesh, curved screen) - usually deal-breakers
- **Quantity of same feature:** 2 vs 3 of something (TG panels, RGB zones) - usually acceptable
- **Compatibility specs:** GPU clearance, cooler height, VESA mounting - need to be adequate (30% tolerance)
- **Drive bays, fan mounts, ports:** Flexible, as long as meets basic needs

### Step 2.5: MANDATORY VERIFICATION (Critical)

> **⚠️ NEVER trust search summaries or generic descriptions alone.**

Before declaring ANY product as a match, you MUST verify:

**Required Actions:**
1. **Find official product page** (manufacturer website or major retailer)
2. **Read FULL specifications** - not just search result snippets
3. **Check product images** to visually confirm:
   - Tempered glass vs solid panels
   - RGB lighting presence
   - Front panel design (mesh vs solid)
4. **Read marketing language** explicitly:
   - "Gaming" = gaming market (usually has TG/RGB)
   - "Office" / "Business" / "Workstation" = professional market
   - "Entry-level gaming" ≠ "Budget office"
5. **Verify material specs:**
   - Steel thickness (0.5mm = cheap, 0.7-0.8mm = standard)
   - Panel type explicitly stated
6. **Cross-check multiple sources** if specs conflict

**Common Failure Patterns to Avoid:**
- ❌ Assuming "compact + budget" = office case
- ❌ Trusting "no RGB" in search summary without verifying TG panels
- ❌ Accepting "similar size" without checking visual style
- ❌ Not reading "Primary Use: Entry-level Gaming" in actual specs

**If you cannot verify these details, REJECT the match rather than guess.**

### Step 3: Make an Engineering Judgment
Synthesize all information and ask:
> "If a customer wants Product A, is Product B the **TECHNICAL TWIN**?
> "Forget price. Does it DO the same things?"

**Provide reasoned analysis:**
- **Match confidence:** High / Medium / Low
- **Key similarities:** What makes them comparable
- **Key differences:** What might matter to some customers
- **Recommendation:** Valid competitor or not

**Example: Why DeepCool CH260 is NOT a match for NB Series**
```
Target: NB Series - Office MicroATX, no TG, no RGB, basic black coating, 284×160×350mm
Candidate: DeepCool CH260 - Gaming MicroATX, TG panel, mesh front, 438×225×312mm

Analysis:
✓ Form factor: Both MicroATX
✗ Visual style: Plain office vs gaming TG/mesh - fundamentally different
✗ Market segment: Budget office vs enthusiast gaming - different customers
✗ Dimensions: 54% longer (far exceeds 25% guideline)

Judgment: NOT A VALID MATCH
Reasoning: Customer seeking basic office case would not consider gaming 
case with tempered glass. Market segments don't overlap. Dimension variance 
also excessive beyond tolerance guidelines.
```

## Instructions
- **Strict Parsing:** Do not guess specs. If a critical spec (e.g., Panel Type) is missing, fail the match or ask for clarification (if interactive).
- **AI Analysis First:** Use the analysis framework above to evaluate similarity BEFORE running numeric validation.
- **Context Over Rules:** Guidelines in `category_rules.json` are just that - guidelines. Use engineering judgment.
- **🚨 SEARCH TOOL DIRECTIVE (CRITICAL):**
  1. You are **STRICTLY FORBIDDEN** from using the terminal to run background Python or Bash scripts (like `search_duck.py` or custom scrapers) for web searching.
  2. If using Python to hit the Google Serper API (with `SERPER_API_KEY`), you MUST set `WaitMsBeforeAsync` to a high value (e.g. 300000) to ensure the script runs synchronously and finishes before returning. **NEVER** let a script become a "Background command".
  3. The native `search_web` tool MUST ONLY be used as a SECOND option or fallback. If API scripts using Serper are unfeasible, fallback to `search_web` for reinforcing information.
  4. **SUPABASE MCP ALLOWED:** You CAN and SHOULD use the Supabase MCP (`execute_sql`) to query and retrieve information from the database whenever needed.
- **Supabase:** Ensure the `matches_mercado` table exists before pushing.

## Resources
- `resources/category_rules.json`: The source of truth for brands and tolerance guidelines.
- `scripts/`: Helper scripts for testing.
