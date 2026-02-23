# Power Supplies (PSUs) Competitive Matching Guide

> **CRITICAL INSTRUCTION:** Before assessing this product, you MUST check `parity_rules.md` to define the strict Dealbreakers (Critical vs Variable specs). The points and rules below are for **qualitative context** only. Do NOT use them to define what is strict vs variable.

## 1. Qualitative Context & "Product Soul"

### Wattage Rating (15 points)
**Definition:** Total continuous power output in watts.

**Tiers:**
- `<500W` - Budget builds, office PCs, iGPU systems
- `500-650W` - Entry gaming (RTX 4060, RX 7600)
- `650-850W` - Mid-range gaming (RTX 4070, RX 7800 XT)
- `850-1000W` - High-end gaming (RTX 4080, multi-GPU)
- `>1000W` - Enthusiast/workstation (RTX 4090, dual GPU)

**Why Critical:** Wattage defines system compatibility.
- Insufficient wattage = system crashes, instability
- Massive overspec = wasted money, inefficiency at low load

**Rejection Rule:**
- Must be within same tier or adjacent tier
- <500W vs >1000W = **REJECT** (completely different builds)
- 650W vs 750W = acceptable (both mid-range gaming tier)

**Tolerance:** ±150W within build class acceptable

---

### 80 PLUS Certification (15 points)
**Definition:** Energy efficiency rating at different load levels.

**Tiers:**
- `80_PLUS` - 80% efficiency (basic)
- `80_PLUS_Bronze` - 82-85% efficiency
- `80_PLUS_Silver` - 85-88% efficiency
- `80_PLUS_Gold` - 87-90% efficiency
- `80_PLUS_Platinum` - 90-92% efficiency
- `80_PLUS_Titanium` - 92-94% efficiency

**Why Critical:** Efficiency affects power bill, heat output, and quality tier.
- Bronze vs Titanium = significant electricity cost difference over time
- Higher certification = better quality components typically

**Rejection Rule:**
- Must be within 1-2 certification levels
- No cert (white box) vs Platinum = **REJECT** (budget vs premium)
- Bronze vs Gold = acceptable (adjacent tiers)
- Silver vs Platinum = acceptable

**Tolerance:** ±2 certification levels acceptable

---

### Modular vs Non-Modular (10 points)
**Definition:** Cable management system.

**Values:**
- `non_modular` - All cables permanently attached
- `semi_modular` - Main cables attached, peripherals detachable
- `fully_modular` - All cables detachable

**Why Critical:** Cable management affects case compatibility and aesthetics.
- Non-modular = cable clutter, difficult SFF builds
- Fully modular = clean builds, custom cables possible

**Rejection Rule:**
- Non-modular vs Fully modular = acceptable (preference, not dealbreaker)
- BUT: For SFF cases, modular is often required

**Tolerance:** Semi-modular matches both non-modular and fully modular

---

## 2. Structural Features

### ATX Standard Version (15 points)
**Definition:** ATX power supply specification version.

**Values:**
- `ATX_2.x` - Legacy (24-pin, 8-pin PCIe)
- `ATX_3.0` - Modern (includes 12VHPWR connector for RTX 40-series)
- `ATX_3.1` - Latest (improved 12V-2x6 connector)

**Why Structural (not Secondary):** ATX 3.0+ required for RTX 40-series without adapters.
- RTX 4090 with ATX 2.x PSU = needs adapter cable (messy)
- RTX 4090 with ATX 3.0 PSU = native 12VHPWR (clean)

**Logic:** ATX 2.x vs ATX 3.0 = acceptable if target doesn't use RTX 40-series

**Tolerance:** If GPU requires 12VHPWR, ATX 3.0+ preferred

---

### PCIe Power Connectors (8 points)
**Definition:** Number and type of PCIe/GPU power connectors.

**Common Configs:**
- `2× 8-pin` - Entry gaming (RTX 4060, RX 7600)
- `3× 8-pin` - Mid gaming (RTX 4070, RX 7800 XT)
- `4× 8-pin` - High-end (RTX 4080, multi-GPU)
- `12VHPWR` - RTX 40-series native

**Logic:** Must match GPU power requirements.

**Tolerance:** More connectors = acceptable. Fewer connectors = reject if inadequate.

---

### Form Factor (7 points)
**Definition:** Physical size standard.

**Values:**
- `ATX` - Standard (150mm × 140mm × 86mm)
- `SFX` - Small form factor (125mm × 100mm × 63.5mm)
- `SFX-L` - SFX with longer depth (125mm × 100mm × 125mm)

**Why Structural:** Form factor is case compatibility requirement.

**Rejection Rule:**
- ATX ≠ SFX → **REJECT** (case incompatibility)
- ATX cases cannot fit SFX PSUs (mounting holes don't align)

**Tolerance:** **0% - Must match exactly**

---

## 3. Convenience Features

### Fan Size & Noise (10 points)
**Definition:** Cooling fan diameter and acoustics.

**Values:**
- `120mm` - Standard (quiet)
- `135mm` - Large (quieter at same RPM)
- `140mm` - Extra large (premium quiet)
- `fanless` - Passive cooling (ultra-quiet, <400W only)

**Logic:** Larger fan = quieter operation at same cooling capacity.

**Tolerance:** Preference. Not dealbreaker.

---

### Zero RPM Mode / Hybrid Fan (5 points)
**Definition:** Fan stops spinning at low loads (<30-40% load).

**Logic:** Reduces noise during idle/light tasks. Premium feature.

---

### Cables Included (5 points)
**Definition:** Cable length and quantity.

**Logic:** Fully modular PSUs may have different cable kits. Not critical.

---

## 4. Secondary Features

### Single Rail vs Multi-Rail (5 points)
**Definition:** 12V power delivery architecture.

**Values:**
- `single_rail` - All 12V on one rail (simpler, higher OCP limit)
- `multi_rail` - Multiple 12V rails (OCP per rail, safer)

**Logic:** Single rail is modern standard for gaming. Multi-rail is legacy/safety-focused.

**Tolerance:** Preference. Most modern PSUs are single-rail.

---

### Warranty Length (3 points)
**Definition:** Manufacturer warranty period.

**Standard:**
- Budget: 3-5 years
- Mid-range: 5-7 years
- Premium: 10-12 years

**Logic:** Longer warranty = manufacturer confidence in quality.

---

### Japanese Capacitors (2 points)
**Definition:** Primary capacitors made in Japan (Nippon Chemi-Con, Rubycon).

**Logic:** Marketing spec. Japanese caps are standard in mid-range+ PSUs.

---

## 5. Verification Checklist

### Pre-Search
- [ ] Calculate system wattage requirement (CPU + GPU + 20% headroom)
- [ ] Identify wattage tier needed (<500W, 650W, 850W, 1000W+) **CRITICAL**
- [ ] Determine minimum 80 PLUS certification desired **CRITICAL**
- [ ] Check if modular cables required (for SFF or clean builds)
- [ ] Verify form factor (ATX vs SFX) **CRITICAL**
- [ ] Check if RTX 40-series GPU (requires ATX 3.0 or adapter)

### During Search
- [ ] **Confirm wattage** - Continuous rated power (not peak)
- [ ] **Verify 80 PLUS cert** - Look for official certification logo
- [ ] **Check modular type** - Non/semi/fully modular
- [ ] **Confirm form factor** - ATX, SFX, SFX-L
- [ ] **Check ATX version** - 2.x, 3.0, 3.1
- [ ] **Count PCIe connectors** - How many 8-pin or 12VHPWR?
- [ ] **Read reviews** - PSU quality varies by OEM (Seasonic, CWT, etc.)

### Customer Persona Test
**Question:** *"Customer needs 650W 80 PLUS Gold for RTX 4070 build. Would they accept 850W 80 PLUS Bronze?"*

**Answer:** **CONDITIONAL** - Wattage upgrade acceptable (650→850W), but Bronze downgrade from Gold may concern efficiency-conscious buyers. Check if customer prioritizes efficiency or headroom.

---

## 6. Real Product Matching Examples

### ✅ GOOD MATCH #1: Corsair RM750e ↔ Seasonic Focus GX-750

**Product A: Corsair RM750e (2023)**
- Wattage: 750W
- Certification: 80 PLUS Gold
- Modular: Fully modular
- ATX Version: ATX 3.0
- Form Factor: ATX
- PCIe Connectors: 3× 8-pin + 1× 12VHPWR (native)
- Fan: 135mm, Zero RPM mode
- Rails: Single rail

**Product B: Seasonic Focus GX-750 (ATX 3.0)**
- Wattage: 750W
- Certification: 80 PLUS Gold
- Modular: Fully modular
- ATX Version: ATX 3.0
- Form Factor: ATX
- PCIe Connectors: 4× 8-pin + 1× 12VHPWR (native)
- Fan: 135mm, Hybrid silent fan control
- Rails: Single rail

**Analysis (A→B and B→A):**
- **CRITICAL - Wattage:** ✅ Both 750W
- **CRITICAL - Certification:** ✅ Both 80 PLUS Gold
- **CRITICAL - Modular:** ✅ Both fully modular
- **STRUCTURAL - ATX Version:** ✅ Both ATX 3.0 (RTX 40-series ready)
- **STRUCTURAL - Form Factor:** ✅ Both ATX standard
- **STRUCTURAL - PCIe:** ✅ 3×8pin vs 4×8pin (both adequate for RTX 4070 Ti)
- **CONVENIENCE - Fan:** ✅ Both 135mm with zero RPM modes

**Match Score:** 98/100 (bidirectional)

**Why It's a Match:** Both are premium 750W 80 PLUS Gold ATX 3.0 fully modular PSUs from Tier 1 OEMs. Seasonic has one extra 8-pin connector (minor advantage). Corsair vs Seasonic are direct competitors in this segment. Customer wanting either would consider the other.

---

### ✅ GOOD MATCH #2: EVGA 650 G6 ↔ MSI MAG A650BN

**Product A: EVGA SuperNOVA 650 G6**
- Wattage: 650W
- Certification: 80 PLUS Gold
- Modular: Fully modular
- ATX Version: ATX 3.0
- PCIe: 2× 8-pin + 1× 12VHPWR
- Form Factor: ATX

**Product B: MSI MAG A650BN**
- Wattage: 650W
- Certification: 80 PLUS Bronze
- Modular: Non-modular
- ATX Version: ATX 2.52
- PCIe: 2× 8-pin (no 12VHPWR)
- Form Factor: ATX

**Analysis (A→B and B→A):**
- **CRITICAL - Wattage:** ✅ Both 650W
- **CRITICAL - Certification:** ⚠️ Gold vs Bronze (efficiency difference)
- **CRITICAL - Modular:** ⚠️ Fully modular vs Non-modular
- **STRUCTURAL - ATX:** ⚠️ ATX 3.0 vs ATX 2.52 (no native 12VHPWR)
- **STRUCTURAL - Form Factor:** ✅ Both ATX

**Match Score:** 72/100 (CONDITIONAL)

**Why It's Conditional:**
- **Same tier:** Both 650W for mid-range gaming
- **Efficiency gap:** Gold vs Bronze = 5-8% efficiency difference (customer may care)
- **Cable management:** Fully modular vs non-modular = significant for clean builds
- **RTX 40-series:** EVGA native 12VHPWR, MSI requires adapter

**Use Case Determines Match:**
- Budget-conscious, non-RTX 40 build → MSI acceptable
- Clean build, RTX 4060 Ti → EVGA preferred

**Recommendation:** Conditional match. Both work for 650W builds, but EVGA is superior in every way except possible cost.

---

### ❌ BAD MATCH #1: 850W 80 PLUS Platinum ATX ↔ 450W 80 PLUS White SFX

**Product A: Corsair HX850 Platinum (ATX)**
- Wattage: **850W**
- Certification: **80 PLUS Platinum**
- Modular: Fully modular
- Form Factor: **ATX** (150×140×86mm)
- Use Case: High-end gaming (RTX 4080, Ryzen 9)

**Product B: Silverstone SX450-G (SFX)**
- Wattage: **450W**
- Certification: **80 PLUS White (basic)**
- Modular: Fully modular
- Form Factor: **SFX** (125×100×63.5mm)
- Use Case: SFF ITX build (APU or low-power GPU)

**Analysis (A→B FAILS, B→A FAILS):**
- **CRITICAL - Wattage:** ❌ **FAIL** - 850W vs 450W = completely different build classes
  - 850W = RTX 4080 + high-end CPU
  - 450W = RTX 4060 or APU only
- **CRITICAL - Certification:** ❌ **FAIL** - Platinum vs White = premium vs budget
- **STRUCTURAL - Form Factor:** ❌ **DEALBREAKER** - ATX vs SFX = incompatible cases
  - ATX PSU cannot fit SFX case
  - SFX PSU can fit ATX case (with bracket) but wattage mismatch makes it pointless

**Match Score:** 10/100 (REJECTED)

**Why It's NOT a Match:**
1. **Power mismatch:** 850W build cannot run on 450W PSU (crashes, instability)
2. **Form factor incompatibility:** Different case types
3. **Tier mismatch:** Platinum premium vs basic white box
4. **Use case mismatch:** High-end gaming vs budget SFF

**Rejection Reason:** CRITICAL wattage mismatch + form factor incompatibility + tier mismatch.

---

### ❌ BAD MATCH #2: Modern 750W 80 PLUS Gold ATX 3.0 ↔ Legacy 750W 80 PLUS Bronze ATX 2.x

**Product A: Corsair RM750e (2023) - Modern**
- Wattage: 750W
- Certification: 80 PLUS Gold
- ATX Version: **ATX 3.0** (native 12VHPWR)
- PCIe: 3× 8-pin + **1× 12VHPWR**
- Modular: Fully modular
- Target: RTX 4070 Ti build

**Product B: Generic 750W 80 PLUS Bronze (2018) - Legacy**
- Wattage: 750W
- Certification: 80 PLUS Bronze
- ATX Version: **ATX 2.4** (no 12VHPWR)
- PCIe: 4× 8-pin (no 12VHPWR)
- Modular: Non-modular
- Target: GTX 1080 Ti / RTX 3070 legacy build

**Analysis (A→B FAILS, B→A FAILS):**
- **CRITICAL - Wattage:** ✅ Both 750W (only thing that matches)
- **CRITICAL - Certification:** ❌ Gold vs Bronze (efficiency gap)
- **CRITICAL - Modular:** ❌ Fully modular vs non-modular
- **STRUCTURAL - ATX:** ❌ **FAIL** - ATX 3.0 vs ATX 2.4 = RTX 40-series compatibility issue
  - Modern build with RTX 4070 Ti NEEDS 12VHPWR or adapter
  - Legacy PSU requires messy adapter cable

**Match Score:** 45/100 (REJECTED)

**Why It's NOT a Match:**
1. **RTX 40-series incompatibility:** Legacy PSU requires adapter (cable mess)
2. **Efficiency gap:** Gold vs Bronze = 5% efficiency difference
3. **Quality tier:** 2023 modern PSU vs 2018 budget PSU = different component quality
4. **Cable management:** Clean modular vs cable clutter

**Customer Persona Test:**
- Customer building RTX 4070 Ti system wants modern ATX 3.0 PSU → Would REJECT legacy ATX 2.4
- Customer wanting Corsair RM750e expects premium quality → Would REJECT generic Bronze

**Rejection Reason:** ATX version mismatch for modern GPUs + efficiency tier gap + quality difference.

---

## 7. Common Mistakes to Avoid

### ❌ Mistake 1: "Matching different form factors"
**Why Wrong:** ATX PSU cannot fit SFX case. Form factor is physical compatibility requirement.

**Fix:** Match form factor exactly (ATX to ATX, SFX to SFX).

---

### ❌ Mistake 2: "Ignoring 80 PLUS certification gap"
**Why Wrong:** White box vs Platinum = budget vs premium. Different quality tiers.

**Fix:** Match within ±2 certification levels (Bronze ↔ Silver ↔ Gold ↔ Platinum).

---

### ❌ Mistake 3: "Matching wattages without checking use case"
**Why Wrong:** 450W vs 850W = completely different GPU/CPU tiers.

**Fix:** Verify wattage is appropriate for target GPU/CPU. Match within ±150W for same build class.

---

### ❌ Mistake 4: "Not checking ATX 3.0 for RTX 40-series"
**Why Wrong:** ATX 2.x PSU with RTX 4090 = messy adapter cable. Suboptimal.

**Fix:** If target uses RTX 40-series GPU, prefer ATX 3.0+ PSU with native 12VHPWR.

---

## 8. Technical Tier Indicators

### Entry/Budget Tier
**Technical Signals:**
- 400-550W
- 80 PLUS White or 80 PLUS Bronze
- Non-modular or semi-modular
- ATX 2.x (legacy)
- 2× 8-pin PCIe
- 120mm fan
- 3-5 year warranty
- Budget OEMs (generic, Channel Well, HEC)

**Common Use:** Office PCs, budget gaming (GTX 1660, RX 6600), entry builds

---

### Mid-Range Tier
**Technical Signals:**
- 550-750W
- 80 PLUS Bronze or 80 PLUS Gold
- Semi-modular or fully modular
- ATX 2.x or ATX 3.0
- 2-3× 8-pin PCIe ± 12VHPWR
- 120-135mm fan with zero RPM mode
- 5-7 year warranty
- Mid-tier OEMs (CWT, FSP, Great Wall)
- Brands: Corsair RM/CX, EVGA B/G series, Cooler Master MWE

**Common Use:** Mid-range gaming (RTX 4060 Ti, RTX 4070, RX 7700 XT)

---

### Premium Tier
**Technical Signals:**
- 750-1200W
- 80 PLUS Gold, Platinum, or Titanium
- Fully modular
- ATX 3.0 or ATX 3.1 (native 12VHPWR)
- 3-5× 8-pin PCIe + 1-2× 12VHPWR
- 135-140mm fan with zero RPM mode
- 10-12 year warranty
- Premium OEMs (Seasonic, Super Flower, Flextronics)
- Japanese capacitors (Nippon Chemi-Con, Rubycon)
- Brands: Seasonic Prime, Corsair HX/AX, EVGA Supernova T2/P6, be quiet! Dark Power Pro

**Common Use:** High-end gaming (RTX 4080, RTX 4090), workstations, overclocking, multi-GPU
