# PC Cooling (CPU Coolers) Competitive Matching Guide

> **CRITICAL INSTRUCTION:** Before assessing this product, you MUST check `parity_rules.md` to define the strict Dealbreakers (Critical vs Variable specs). The points and rules below are for **qualitative context** only. Do NOT use them to define what is strict vs variable.

## 1. Qualitative Context & "Product Soul"

### Cooling Type (25 points)
**Definition:** Air cooler vs Liquid AIO vs Custom Loop.

**Values:**
- `tower_air` - Tower air cooler (budget-midrange)
- `low_profile_air` - Low-profile air cooler (SFF builds)
- `AIO_120` - 120mm AIO liquid cooler
- `AIO_240` - 240mm AIO liquid cooler
- `AIO_280` - 280mm AIO liquid cooler
- `AIO_360` - 360mm AIO liquid cooler
- `custom_loop` - Custom water cooling (enthusiast)

**Why Critical:** Air vs Liquid = fundamentally different installation, performance, and aesthetics.

**Rejection Rule:**
- Air ≠ Liquid → **AUTO-REJECT**.
- **User Intent:** A user looking for a PA120 (Air) is likely avoiding AIO reliability risks. A user looking for an AIO wants the aesthetic/clearance.
- **Strict Parity:** AIO 240mm ≠ AIO 360mm. Performance class must match.
- **Exceptions:** None. If they ask for Air, give them Air.

**Key Insight:** Match cooling type & price tier FIRST. Do not match a stock cooler alternative against a liquid cooler.

---

### TDP Rating / Socket Compatibility (15 points)
**Definition:** Maximum CPU heat (watts) the cooler can handle.

**Tiers:**
- `65W` - Budget CPUs (Ryzen 5, Core i5 non-K)
- `125W` - Mainstream (Ryzen 5X, Core i5-K)
- `150W` - High-end (Ryzen 7, Core i7-K)
- `200W+` - Enthusiast (Ryzen 9, Core i9-K)

**Why Critical:** 65W cooler cannot cool 200W CPU. Thermal throttling will occur.

**Rejection Rule:**
- Must cover target TDP tier
- Overspec is acceptable (200W cooler for 125W CPU = fine)
- Underspec is **REJECT** (65W cooler for 150W CPU = thermal failure)

---

## 2. Structural Features

### Radiator Size (for AIOs) (20 points)
**Acceptable Range:** Within same class

**Classes:**
- `120-140mm` - Budget AIO
- `240-280mm` - Mainstream AIO
- `360-420mm` - Enthusiast AIO

**Logic:** 240mm vs 280mm = similar performance. But 120mm vs 360mm = very different.

**Tolerance:** ±1 fan size acceptable (240mm ↔ 280mm, 360mm ↔ 420mm).

---

### Height Clearance (for Air) (10 points)
**Tolerance:** ±20mm acceptable for same performance tier

**Logic:** Case compatibility matters. 165mm cooler vs 160mm = fine. But 165mm vs 120mm = different tiers.

---

## 3. Convenience Features

### RGB Lighting (10 points)
**Definition:** Addressable RGB fans or pump head.

**Logic:** Aesthetic preference. Doesn't affect cooling performance.

---

### Fan Configuration (10 points)
**Definition:** PWM vs DC, ARGB compatibility.

**Logic:** PWM is preferred (better control), but not dealbreaker.

---

## 4. Secondary Features

### Noise Level (5 points)
**Tolerance:** ±5 dBA acceptable

**Standard:** 20-35 dBA for most coolers

**Logic:** Noise is subjective. Some users prioritize silence, others don't care.

---

### Warranty (5 points)
**Logic:** 5 years vs 6 years = minimal difference.

---

## 5. Verification Checklist

### Pre-Search
- [ ] Identify cooling type (tower air vs AIO) **CRITICAL**
- [ ] Determine TDP requirement (65W, 125W, 150W, 200W+) **CRITICAL**
- [ ] If AIO: Note radiator size (120/240/280/360mm)
- [ ] If Air: Note height clearance (case compatibility)

### During Search
- [ ] **Verify cooling type** - Air tower vs low-profile vs AIO
- [ ] **Check TDP rating** - Can it cool target CPU?
- [ ] **Confirm socket compatibility** - AM4, AM5, LGA1700, etc.
- [ ] If AIO: Verify radiator size
- [ ] Read specifications (fan RPM, noise level)

### Customer Persona Test
**Question:** *"Customer wants 240mm AIO. Would they accept tower air cooler?"*

**Answer:** Usually **NO** - unless they specifically mention performance equivalence (e.g., NH-D15 vs 240mm AIO).

---

## 6. Reasoning Examples

### ✅ GOOD MATCH: Arctic Liquid Freezer II 240 vs Corsair H100i RGB

**Target: Arctic Liquid Freezer II 240**
- Type: AIO liquid cooler
- Radiator: 240mm (2× 120mm fans)
- TDP: 200W+
- RGB: No RGB

**Candidate: Corsair iCUE H100i RGB**
- Type: AIO liquid cooler
- Radiator: 240mm (2× 120mm fans)
- TDP: 180W
- RGB: RGB pump head + fans

**Analysis:**
- **CRITICAL - Type:** ✅ Both 240mm AIOs
- **CRITICAL - TDP:** ✅ Both handle high-end CPUs
- **CONVENIENCE - RGB:** ⚠️ No RGB vs RGB (aesthetic difference)

**Match Score:** 90/100

**Why It's a Match:** Both 240mm AIOs for high-end CPUs. RGB is preference.

---

### ❌ BAD MATCH: 120mm AIO vs 360mm AIO

**Target: Cooler Master MasterLiquid 120 (120mm AIO)**
- Type: 120mm AIO
- TDP: 65-95W

**Candidate: EK-AIO Elite 360 (360mm AIO)**
- Type: 360mm AIO
- TDP: 300W+

**Analysis:**
- **CRITICAL:** ❌ 120mm vs 360mm = completely different tiers
- **TDP:** ❌ 65W vs 300W = budget vs extreme enthusiast
- **PRICE:** ❌ $60 vs $180 = 3x price difference


---

## 7. Common Mistakes

### ❌ Mistake 1: "Matching air cooler to AIO without justification"
**Fix:** Air vs AIO = different aesthetics and installation. Only match if performance-equivalent and similar price.

---

### ❌ Mistake 2: "Ignoring TDP rating"
**Fix:** Verify cooler can handle target CPU TDP. Underpowered cooler = thermal throttling.

---

## 8. Market Tier Indicators

### Budget (<$40)
- Stock coolers or basic tower air
- 65-95W TDP
- No RGB
- Brands: Arctic, Cooler Master Hyper series

### Mid-Range ($40-100)
- Tower air coolers (Noctua, be quiet! Dark Rock)
- 240mm AIOs
- 125-150W TDP
- RGB optional
- Brands: Arctic, Corsair, NZXT

### Premium (>$100)
- High-end tower air (NH-D15, Dark Rock Pro 4)
- 280-360mm AIOs
- 200W+ TDP
- RGB standard
- Brands: Noctua, Corsair, EKWB, NZXT
