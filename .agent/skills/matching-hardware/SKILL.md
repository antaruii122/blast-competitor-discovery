---
name: matching-hardware
description: Identifies global technical rivals for hardware products and finds their local (South American) pricing. Uses strict 20% numeric tolerance and feature gatekeeping.
---

# Hardware Matching Skill

## When to use this skill
- When the user wants to find competitors for a specific product (e.g., "Find rivals for this MSI Monitor").
- When a new product is added to the Google Sheet and needs validation.
- Triggered by `engine_orchestrator.py`.

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

### Main Workflow
1.  **Input Parsing:** Receive standard Product Spec JSON.
2.  **Phase A: Global Tech Search**
    - Load `category_rules.json`.
    - **Iterate Tier 1 Brands:** Search for models matching critical specs.
    - **Iterate Tier 2 Brands:** Search for models matching critical specs.
    - **Validate:** Apply AI analysis framework + `validate_tech_parity` for numeric tolerance.
    - **Goal:** Accumulate ~4 Tier 1 and ~2 Tier 2 Matches.
    - **🚨 STOP HERE: Run PRE-WORK VERIFICATION checklist above**
3.  **Phase B: Local Discovery** (ONLY after verification complete)
    - For each **VERIFIED Global Match**:
        - Search specifically in Chile, Brazil, Colombia (via `find_local_price`).
        - If found, calculate `Value Gap`.
4.  **Output:** 
    - Insert structured result into Supabase `Matches_Mercado`.

## Competitor Analysis Framework

### Step 1: Gather Complete Context
Before declaring a match, collect:
- Full product specifications from manufacturer/retailer pages
- Market positioning (office, gaming, enthusiast, professional)
- Visual aesthetics and build features (tempered glass, RGB, mesh vs solid panels)
- Price segment (budget, mid-range, premium)
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
> "If a customer wants Product A, would they realistically consider Product B  
> as a valid competitor/alternative in the same market?"

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
- **RivalSearchMCP:** Use this tool (simulated or real) to fetch competitor data.
- **Supabase:** Ensure the `matches_mercado` table exists before pushing.

## Resources
- `resources/category_rules.json`: The source of truth for brands and tolerance guidelines.
- `scripts/`: Helper scripts for testing.
