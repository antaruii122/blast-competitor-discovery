# PC Cases Competitive Matching Guide

> **CRITICAL INSTRUCTION:** Before assessing this product, you MUST check `parity_rules.md` to define the strict Dealbreakers (Critical vs Variable specs). The points and rules below are for **qualitative context** only. Do NOT use them to define what is strict vs variable.

## 1. Qualitative Context & "Product Soul"

### Tempered Glass Style (15 points)
**Definition:** The type and extent of tempered glass panels on the case.

**Values:**
- `none` - No tempered glass (solid panels)
- `side_only` - Single TG side panel
- `dual_side_front` - TG on side + front panels
- `panoramic_270` - 270° wraparound TG (front + side)
- `full_aquarium` - Full glass enclosure

**Why Critical:** TG vs no-TG represents fundamentally different customer personas. Someone wanting a "showcase" case (dual TG + RGB) will REJECT a solid panel case, even if all other specs match. This is THE defining aesthetic choice.

**Rejection Rule:** If mismatch in TG style tier = **AUTO-REJECT**
- Example: Target has `dual_side_front`, candidate has `side_only` → **REJECT**
- Example: Target has `panoramic_270`, candidate has `none` → **REJECT**

---

### Chassis Layout & "La Pecera" Sub-Type (15 points)
**Definition:** The internal structure, specifically for "Fish Tank" (Pecera) cases.

**Types:**
- `standard_tower` - PSU at bottom, width < 230mm. (Standard airflow/glass case)
- `dual_chamber_wide` - PSU behind motherboard, width > 270mm. (True "O11-style" Pecera)

**Why Critical:**
- **"La Pecera" (Fish Tank)** aesthetic comes in two distinct builds:
    1.  **Wide Dual Chamber:** Short & FAT (285mm+). Massive GPU support, easy cable management.
    2.  **Compact Tunnel:** Tall & THIN (210mm). Standard tower with glass front. Cramped cables.
- **Gaming Impact:** A "Wide" case fits 4090s/380mm GPUs easily. A "Compact" case struggles (330mm max).
- **Customer Persona:** A builder wanting the "Wide Stance" look will REJECT a skinny tower.

**Rejection Rule:**
- **Wide Dual Chamber** vs **Standard Tower** = **REJECT** (Structural Mismatch)
- *Example:* Target 1001A (285mm Wide) vs Antec CX200M (210mm Wide).
    - Result: **REJECT**. One is a wide bench, one is a skinny tower.

---

### Front Panel Design (15 points)
**Definition:** The primary front panel construction and purpose.

**Values:**
- `solid` - Closed solid panel (basic office cases)
- `mesh_airflow` - Mesh/perforated for maximum airflow
- `tempered_glass` - Glass showcase front
- `hybrid_mesh_glass` - Combination design

**Why Critical:** Mesh (airflow-focused) vs Glass (showcase-focused) = **different use cases**. An airflow enthusiast will NOT buy a glass-front case. A showcase builder will NOT buy a full-mesh case.

**Rejection Rule:** 
- Mesh ≠ Glass → **AUTO-REJECT**
- Solid office ≠ Glass showcase → **AUTO-REJECT**

---

### Showcase Intent / Market Positioning (10 points)
**Definition:** The "soul" or primary purpose of the case.

**Values:**
- `airflow_performance` - Enthusiast cooling builds
- `rgb_showcase` - Visual aesthetic, RGB lighting focus
- `minimalist_professional` - Clean office/workstation
- `budget_aesthetic` - Entry-level gaming showcase

**Why Critical:** This is the "customer persona test" - would someone shopping for an RGB showcase case even LOOK at an airflow-focused case? No.

**Rejection Rule:** If target is `rgb_showcase` and candidate is `airflow_performance` or `minimalist_professional` → **REJECT**

---

### Physical Build Class (Weight & Materials) (15 points)
**Definition:** The "heft" and material quality of the chassis.

**Values:**
- `budget_lightweight` - < 6.0kg (Thin steel ~0.5-0.6mm, acrylic or thin glass)
- `mid_range_standard` - 6.0kg - 9.0kg (Standard steel ~0.7mm)
- `premium_tank` - > 9.0kg (Thick steel 0.8mm+, aluminum, heavy glass)

**Why Critical:** Weight is the best proxy for build quality. A 5kg case is fundamentally a different product tier than a 13kg case, even if they look similar in photos.
- **Budget Customer:** Wants "looks for less" (doesn't care about steel thickness).
- **Premium Customer:** Wants substantial build quality, noise dampening, and rigidity.

**Rejection Rule:** 
- If Weight Delta > 50% (e.g., 5kg vs 10kg) → **AUTO-REJECT**
- If Target is `budget_lightweight` and Candidate is `premium_tank` → **REJECT** (False Premium Match)

---

## 2. Structural Features

### Form Factor (15 points)
**Acceptable Range:** **STRICT MATCH REQUIRED**

**Values:** `Mini-ITX`, `Micro-ATX`, `ATX`, `E-ATX`, `Full-Tower`

**Logic:** Form factor is binary - an ITX case CANNOT fit an ATX motherboard. This is a hard compatibility requirement.

**Tolerance:** **0% - Must match exactly**

---

### GPU Clearance Tier (8 points)
**Acceptable Range:** Within same tier class

**Tiers:**
- `compact_<300mm` - SFF/budget builds
- `standard_300-360mm` - Mainstream gaming
- `enthusiast_>360mm` - High-end multi-GPU

**Logic:** 320mm vs 340mm = acceptable (same tier). But <300mm vs >360mm = different build class.

**Tolerance:** ±20% within tier, but crossing tier boundaries = concern

---

### Radiator Support (7 points)
**Acceptable Range:** Comparable cooling philosophy

**Tiers:**
- `none` - Air cooling only
- `120-240mm` - Basic AIO support
- `280-360mm` - Enthusiast AIO
- `dual_360mm` - Extreme cooling

**Logic:** No AIO support vs 360mm AIO = different target market. 240mm vs 280mm = acceptable.

**Tolerance:** Within 1 tier level acceptable

---

## 3. Convenience Features

### USB-C Presence (10 points)
**Definition:** Whether the case has USB Type-C front I/O.

**Values:** `none`, `usb3.2_gen1`, `usb3.2_gen2`, `usb3.2_gen2x2`

**Why Not Critical:** USB-C presence = mid-tier signal, but absence is acceptable in ultra-budget. Not a dealbreaker if all CRITICAL features match.

**Logic:** Premium cases usually have it, budget cases often don't. This is a "nice-to-have."

---

### USB Generation (5 points)
**Definition:** The USB version of front panel ports.

**Values:** `usb2.0`, `usb3.0`, `usb3.2_gen1`, `usb3.2_gen2`

**Logic:** USB 1.0/2.0 = budget tier. USB 3.2 Gen2 = mid-tier+. Not a dealbreaker.

---

### RGB Controller Included (5 points)
**Definition:** Whether an RGB controller or LED button is included.

**Logic:** Indicates gaming/aesthetic tier but not critical if target already has RGB fans.

---

## 4. Secondary Features

### Dimensions (5 points)
**Tolerance:** **±35% acceptable IF Critical features match perfectly**

**Logic:** Size difference is forgivable if "product soul" aligns. A customer wanting dual-TG RGB showcase will accept 38% height difference if the aesthetic matches.

**Example from 270-D1:** 
- Target: 317mm height
- Candidate: 438mm height (38% taller)
- **APPROVED** because CRITICAL features (dual TG + RGB showcase) matched perfectly

**Key Insight:** Don't reject based on dimensions FIRST - verify product soul FIRST, then check dimensions.

---

### RGB Lighting Type (3 points)
**Values:** `none`, `fixed_color`, `addressable_argb`

**Logic:** Fixed RGB vs ARGB = nice-to-have difference, not dealbreaker.

---

### Preinstalled Fans (Tier-Dependent Criticality)
**Definition:** The number of included fans vs the target.

**Logic:**
- **For Premium Cases:** Fans are often NOT included (enthusiasts buy their own). ±50% variance is acceptable.
- **For Budget/Value Cases:** Included fans are the **PRIMARY VALUE PROP**. A $50 case with 6 fans cannot be compared to a $50 case with 0 fans.

**Rejection Rule (Value Cases Only):**
- If Target has >3 fans (e.g., "Full Fan Bundle") and Candidate has 0 fans (e.g., "Bare Bones") → **REJECT** (Value mismatch)
- If Candidate Price + Cost of Fans > 150% of Target Price → **REJECT**

---

## 5. Verification Checklist

### Pre-Search (Define Product Soul)
- [ ] Identify TG style (none/side/dual/panoramic)
- [ ] Identify front panel design (solid/mesh/glass)
- [ ] Determine showcase intent (airflow/RGB showcase/minimalist/budget)
- [ ] Define form factor requirement (strict)

### During Search
- [ ] Find official manufacturer product page (NOT retailer search results)
- [ ] **View product images** to visually confirm:
  - TG panel count and location
  - Front panel type (mesh vs glass vs solid)
  - RGB lighting presence
- [ ] **Read full specifications** including:
  - Exact dimensions
  - Form factor support
  - GPU clearance
  - Rad iator support
  - I/O ports
- [ ] **Read marketing language** for clues:
  - "Gaming" vs "Office" vs "Workstation"
  - "Showcase" vs "Airflow" vs "Performance"
  - "RGB" vs "Minimalist" vs "Professional"

### Post-Search Validation
- [ ] Cross-check specs from multiple sources if conflict exists
- [ ] Calculate dimension differences (H × W × D)
- [ ] Verify I/O tier (USB-C presence, USB generation)
- [ ] Confirm material quality matches market segment
- [ ] Apply "Customer Persona Test" (see below)

### Customer Persona Test
**Question:** *"If a customer wants Target Product, would a salesperson realistically suggest Candidate Product as an alternative?"*

**Answer:** Consider:
- Same visual aesthetic? (TG style, RGB)
- Same use case? (showcase vs airflow vs office)
- Same market tier? (budget vs mid vs premium)
- Same buyer persona? (RGB enthusiast vs airflow enthusiast vs professional)

---

## 6. Reasoning Examples

### ✅ GOOD MATCH: 270-D1 vs Antec CX60M ARGB

**Target: 270-D1**
- Dual TG (front + side)
- 5× ARGB fans
- USB-C present
- 317mm × 270mm × 325mm (H×W×D)
- Budget RGB showcase
- $25.90 FOB

**Candidate: Antec CX60M ARGB**
- 270° panoramic TG
- 3× ARGB fans
- USB 3.2 Gen2 Type-C (superior!)
- 354mm × 275mm × 346mm (only 12% taller)
- Budget-mid RGB showcase
- $70-90 USD

**Analysis:**
- **CRITICAL (40pts):** ✅ PERFECT - Both dual TG RGB showcase
- **STRUCTURAL (30pts):** ✅ PERFECT - Same form factor, GPU clearance, radiator support
- **CONVENIENCE (20pts):** ✅ PERFECT - Type-C present (even better Gen2)
- **SECONDARY (10pts):** ✅ 9/10 - Only 12% taller (excellent)

**Match Score:** 99/100

**Why It's a Match:** Perfect product soul alignment. Customer wanting dual-TG RGB showcase would ABSOLUTELY consider this. Type-C USB is actually superior. Only 12% taller is negligible. Tier 1 brand at budget pricing.

---

### ❌ BAD MATCH: NB Series vs DeepCool CH260

**Target: NB Series**
- NO tempered glass (solid panels)
- NO RGB
- Basic black coating
- 284×160×350mm
- Office MicroATX
- Budget simple design

**Candidate: DeepCool CH260**
- Tempered glass panel
- Mesh front
- 438×225×312mm (54% longer!)
- Gaming MicroATX
- RGB aesthetic

**Analysis:**
- **CRITICAL (0pts):** ❌ FAIL - TG gaming vs plain office = **COMPLETELY DIFFERENT SOULS**
- **STRUCTURAL:** ✅ Both MicroATX (but irrelevant given Critical fail)
- **Dimensions:** ❌ 54% longer (far exceeds 35% tolerance)

**Why It's NOT a Match:** Customer seeking basic office case would NEVER consider gaming TG/mesh case. Market segments don't overlap. Dimension variance is also excessive. Visual style fundamentally different.

**Rejection Reason:** Critical feature mismatch (TG vs no-TG, gaming vs office).

---

### 🤔 EDGE CASE: 270-D1 vs Thermaltake View 170 (38% taller)

**Target: 270-D1**
- Dual TG showcase
- 5× ARGB fans
- USB-C present
- 317mm height
- Budget RGB showcase

**Candidate: Thermaltake View 170**
- Dual TG showcase
- 3× ARGB fans
- NO USB-C (only USB 3.0)
- 438mm height (38% taller - exceeds 35% guideline!)
- Budget RGB showcase

**Initial Concern:** Dimensions exceed 35% tolerance

**Additional Analysis Needed:**
1. **Verify Critical features:** Perfect match (dual TG, RGB showcase, budget tier) ✅
2. **Check Structural:** Same form factor, GPU clearance ✅
3. **Customer Persona Test:** Would customer accept 38% taller if aesthetic matches? **YES** - product soul is identical
4. **USB-C absence:** Acceptable at budget tier

**Final Decision:** ✅ **APPROVED** - Weighted score 88%

**Reasoning:** Dimension guideline is just that - a guideline. The 35% rule can be exceeded IF Critical features (40 points) match perfectly. Product soul is identical (dual TG RGB showcase at budget price). USB-C absence hurts Convenience score but expected for budget Tier 1.

**Key Learning:** **Prioritize product soul over numeric tolerances.**

---

## 7. Common Mistakes to Avoid

### ❌ Mistake 1: "Assuming compact + budget = office case"
**Why It's Wrong:** Budget gaming cases exist in compact form factors (like 270-D1). Always verify TG/RGB presence.

**Example Error:** Rejecting dual-TG compact case as competitor for another dual-TG compact case just because "it's small so must be office."

**Fix:** Verify visual design FIRST (TG panels, RGB lighting), then check size.

---

### ❌ Mistake 2: "Trusting search summaries without verifying product page"
**Why It's Wrong:** Search results often omit critical details like "entry-level gaming" or TG panel count.

**Example Error:** Assuming "Cooler Master MB320L" is office case because search says "compact budget case" - but it has TG panel + ARGB fans = gaming.

**Fix:** ALWAYS find official product page with full specs and images.

---

### ❌ Mistake 3: "Accepting similar size without checking visual style"
**Why It's Wrong:** Two identically-sized MicroATX cases can serve completely different markets (gaming showcase vs office vs airflow).

**Example Error:** Matching plain black office case with RGB TG case because "both are 350mm tall."

**Fix:** Check Critical features (TG, front design, market positioning) BEFORE dimensions.

---

### ❌ Mistake 4: "Ignoring marketing language like 'Entry-level Gaming'"
**Why It's Wrong:** Marketing copy reveals target market. "Entry-level Gaming" ≠ "Office/Budget."

**Fix:** Read product descriptions for keywords: Gaming, Showcase, Airflow, Professional, Workstation, RGB.

---

### ❌ Mistake 5:"Rigid adherence to 35% dimension rule"
**Why It's Wrong:** Dimension tolerance is SECONDARY (10 points). If CRITICAL (40 points) + STRUCTURAL (30 points) match perfectly, dimensions can exceed 35%.

**Example:** 270-D1 vs View 170 (38% taller) approved because product soul matched perfectly.

**Fix:** Evaluate dimensions LAST, after verifying product soul.

---

## 8. Technical Tier Indicators

### Entry/Budget Tier
**Technical Signals:**
- 0.5mm steel thickness
- No USB-C (or basic USB 3.0)
- Fixed RGB or basic ARGB
- Single TG panel (side only) OR no TG
- Basic cable management
- Fewer preinstalled fans (0-2)

**Example Products:** 270-D1, GameMax Infinity Mini, Redragon GC-218M

---

### Mid-Range Tier
**Technical Signals:**
- 0.7mm steel thickness
- USB-C present (Gen1 or Gen2)
- ARGB lighting with controller
- Dual TG or panoramic TG
- Cable management cutouts
- 2-4 preinstalled fans

**Example Products:** Antec CX60M, Thermaltake View 170, Cooler Master MB320L

---

### Premium Tier
**Technical Signals:**
- 0.8mm+ steel or aluminum
- USB 3.2 Gen2 Type-C
- Advanced ARGB ecosystem
- Panoramic or full glass
- PSU shroud, dual-chamber design
- Premium finish (powder coat, brushed aluminum)
- 3-5 preinstalled premium fans

**Example Products:** NZXT H510 Elite, Corsair 4000D Airflow, Lian Li O11 Dynamic
