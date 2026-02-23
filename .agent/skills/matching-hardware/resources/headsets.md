# Gaming Headsets Competitive Matching Guide

> **CRITICAL INSTRUCTION:** Before assessing this product, you MUST check `parity_rules.md` to define the strict Dealbreakers (Critical vs Variable specs). The points and rules below are for **qualitative context** only. Do NOT use them to define what is strict vs variable.

## 1. Qualitative Context & "Product Soul"

### Brand Category Alignment (20 points)
**Definition:** The primary market identity of the brand and product line.

**Values:**
- `gaming_brand` - Dedicated gaming focus (Razer, Redragon, HyperX, Logitech G).
- `lifestyle_brand` - General consumer audio (JBL, Sony, Bose, Anker).
- `studio_brand` - Professional audio (Audio-Technica, Beyerdynamic, Sennheiser Pro).

**Why Critical:** **GAMERS BUY GAMING BRANDS.**
- A customer looking for a Redragon headset (budget gaming) is NOT cross-shopping with a JBL Tune (lifestyle music).
- They want: Aggressive styling, boom mic, gaming prestige, RGB.
- They do NOT want: Portable folding design, ANC, "office look".

**Rejection Rule:**
- **STRICT BAN:** If Target is `gaming_brand`, Candidate MUST be `gaming_brand` (or specific gaming sub-brand like JBL Quantum).
- **AUTO-REJECT** any general consumer headphones (JBL Tune/Live, Sony WH/CH series) for gaming requests.
- **Example Error:** Matching a Redragon Zeus to a JBL Tune 510BT is a **CRITICAL FAILURE**.

---

### Earcup Design (15 points)
**Definition:** The acoustic isolation design of the earcups.

**Values:**
- `closed_back` - Sealed earcups (noise isolation, bass-heavy)
- `open_back` - Perforated/mesh earcups (soundstage, natural audio)
- `semi_open` - Hybrid design (partial isolation)

**Why Critical:** This is a FUNDAMENTAL AUDIO ARCHITECTURE CHOICE.
- Closed-back = Gaming, office calls, noisy environments (isolation required)
- Open-back = Music listening, streaming, quiet environments (soundstage priority)

**Rejection Rule:**
- Closed ≠ Open → **AUTO-REJECT**
- Gaming headsets are 95% closed-back (need isolation for focus)
- Open-back headsets leak sound (unusable in shared spaces)

**Technical Impact:**
- Closed: Better bass response, no sound leakage, artificial soundstage
- Open: Natural soundstage, less bass, sound leaks out/in

---

### Surround Sound Technology (15 points)
**Definition:** The audio spatial technology present in the headset.

**Values:**
- `stereo` - Standard 2.0 stereo (no virtualization)
- `virtual_7.1_software` - Software-based surround (requires USB + driver)
- `virtual_7.1_hardware` - Hardware DSP-based surround
- `true_7.1_hardware` - Physical multi-driver 7.1 (rare, premium only)

**Why Critical:** This is a BINARY DEALBREAKER. A customer buying a headset WITH 7.1 surround specifically wants that feature. Comparing stereo headsets to 7.1 headsets = **WRONG MARKET**.

**Rejection Rule:**
- Target has `virtual_7.1_software` → Candidate must have virtual OR true 7.1
- Target has `stereo` → Candidate must be `stereo` (7.1 headset is different tier/price)
- **NEVER match stereo vs 7.1** → **AUTO-REJECT**

**Example Error (THE MISTAKE YOU MADE):**
- ❌ Matching headset without 7.1 to HyperX Cloud III (has DTS Headphone:X spatial audio)
- ✅ Match stereo to stereo, 7.1 to 7.1 only

---

### Battery System (15 points)
**Definition:** How the headset handles power (Wireless only).

**Values:**
- `internal_rechargeable` - Standard built-in battery (USB-C charge)
- `hot_swap_system` - Removable batteries with continuous play (SteelSeries Infinity Power, Turtle Beach Stealth Pro)
- ` replaceable_battery` - User replaceable AA/AAA (rare now)

**Why Critical:**
- A user wanting "Infinite Battery" (Hot-Swap) will **NOT** accept a standard headset. This is a lifestyle choice.
- **Rejection Rule:**
- If Target has `hot_swap_system`, Candidate MUST have it.
- **Example:** SteelSeries Arctis Nova Pro Wireless vs Logitech G Pro X 2.
    - Logitech has 50hr battery (Good).
    - SteelSeries has Infinite battery (Better).
    - **VERDICT:** NOT A MATCH for the "Infinite" user.

---

### Active Noise Cancellation (ANC) (10 points)
**Definition:** Hardware-based noise cancellation.

**Rejection Rule:**
- If Target has ANC, Candidate SHOULD have ANC.
- Passive isolation ≠ Active Cancellation.

---

### Connection Type (10 points)
**Definition:** How the headset connects to devices.

**Values:**
- `wired_3.5mm_only` - Analog audio jack only
- `wired_usb_only` - USB digital audio only
- `dual_usb_3.5mm` - Both USB + 3.5mm (versatility)
- `wireless_2.4GHz` - Wireless dongle
- `wireless_bluetooth` - Bluetooth wireless
- `wired_wireless_hybrid` - Can be used wired OR wireless

**Why Critical:** Connection type defines platform compatibility and use case.
- `wired_3.5mm_only` = Console + PC + mobile (universal)
- `wired_usb_only` = PC/PS5 only (can't use on Xbox, mobile, Switch)
- `wireless_2.4GHz` = Gaming-focused (low latency)
- `wireless_bluetooth` = Mobile/office (higher latency)

**Rejection Rule:**
- Wired-only vs Wireless = **different buyer needs** - can be flexible if same tier, but note the difference
- USB-only vs 3.5mm-only = **platform incompatibility** - acceptable if target market aligns
- Dual connection is superior to single connection → acceptable upgrade

---

### Microphone Presence & Type (5 points)
**Definition:** Whether a microphone is included and how it attaches.

**Values:**
- `none` - No microphone (music/media headphones)
- `fixed_boom` - Non-removable boom mic
- `detachable_boom` - Removable boom mic
- `inline_mic` - Cable inline mic (basic)
- `dual_mic` - Boom + inline options

**Why Critical:** Headset vs Headphones = different product category.
- Gaming headset = must have mic
- Music headphones = no mic needed

**Rejection Rule:**
- Target has mic → Candidate must have mic
- Target has NO mic → Candidate with mic is acceptable (upgrade)
- Fixed vs detachable = convenience, not dealbreaker

---

## 2. Structural Features

### Driver Size (15 points)
**Acceptable Range:** ±10mm or within same class

**Classes:**
- `30mm-40mm` - Compact/portable headsets
- `40mm-50mm` - Standard gaming (most common)
- `53mm+` - Large drivers (premium bass)

**Logic:** 40mm vs 50mm = acceptable (both standard gaming). But 30mm vs 53mm = very different audio signature.

**Tolerance:** ±20% acceptable, but must be in same class

**Example:**
- ✅ 40mm vs 50mm (acceptable - both standard gaming)
- ✅ 50mm vs 53mm (acceptable - adjacent)
- ❌ 30mm vs 53mm (different classes)

---

### Freq uency Range (10 points)
**Acceptable Range:** Standard gaming range expected

**Standard:** 20Hz - 20,000Hz (human hearing range)
**Extended Bass:** 15Hz - 20,000Hz
**Extended Treble:** 20Hz - 25,000Hz

**Logic:** Most gaming headsets claim 20-20kHz. Deviations are usually marketing. Don't weight this heavily UNLESS significant deviation.

**Tolerance:** Must overlap standard range (20-20kHz). Extended bass/treble = nice-to-have.

---

### Impedance Tier (5 points)
**Acceptable Range:** Within same amplification requirements

**Tiers:**
- `16-32Ω` - Low impedance (mobile, console, no amp needed)
- `40-80Ω` - Medium (desktop, some may need amp)
- `100Ω+` - High impedance (dedicated amp required)

**Logic:** 32Ω vs 40Ω = similar (both work on most devices). But 32Ω vs 250Ω = completely different target user (casual vs audiophile).

**Tolerance:** Within same tier only

---

## 3. Convenience Features

### RGB / LED Lighting (10 points)
**Definition:** Presence of LED or RGB aesthetic lighting.

**Values:**
- `none` - No lighting
- `single_led` - Fixed color LED
- `rgb_static` - RGB but single color mode
- `rgb_dynamic` - RGB with multiple effects/breathing

**Why Not Critical:** Lighting is aesthetic preference, not functional requirement. Budget gaming headsets often have basic LED. Premium may skip it entirely (focus on audio).

**Logic:** This is a "gaming aesthetic" signal but not a dealbreaker. A customer wanting RGB might accept non-RGB if audio quality/price is better.

**Example:**
- Target has RGB LED → Candidate without RGB is acceptable if same tier/price
- Target has NO RGB → Candidate with RGB is acceptable (upgrade)

---

###Platform Compatibility (5 points)
**Definition:** Which gaming platforms are officially supported.

**Values:**
- `pc_only` - Windows/Mac only
- `multi_platform` - PC + PS + Xbox + Switch
- `pc_console` - PC + some consoles

**Logic:** 3.5mm headsets = universal. USB headsets = platform-specific.

**Tolerance:** More compatibility is better, but PC-only vs multi-platform acceptable if connection type justifies it.

---

### Comfort Features (5 points)
**Definition:** Ear pad material and headband padding.

**Values:**
- `basic_foam` - Standard foam pads
- `memory_foam` - Memory foam cushions
- `hybrid_fabric_pleather` - Breathable fabric + pleather
- `premium_velour` - High-end velour pads

**Logic:** Comfort is subjective and difficult to verify pre-purchase. Don't weight this heavily.

---

## 4. Secondary Features

### Cable Length (5 points)
**Tolerance:** ±0.5m acceptable

**Standard:** 1.5m - 2.5m for gaming headsets

**Logic:** 1.8m vs 2.2m = negligible difference. But 1.0m vs 3.0m might indicate different use case (portable vs desktop).

---

### Weight (3 points)
**Tolerance:** ±50g acceptable

**Typical:** 250g - 350g for wired gaming headsets

**Logic:** Weight affects comfort but is very subjective. Don't reject based on weight alone.

---

### Inline Controls (2 points)
**Definition:** Volume wheel or mute button on cable.

**Logic:** Convenience feature. Nice to have, not dealbreaker.

---

## 5. Verification Checklist

### Pre-Search (Define Product Soul)
- [ ] Identify surround sound type (stereo vs virtual 7.1 vs hardware 7.1) **CRITICAL**
- [ ] Determine connection type (wired USB vs 3.5mm vs wireless vs dual)
- [ ] Confirm microphone requirement (gaming headset vs music headphones)
- [ ] Note driver size class (30-40mm vs 40-50mm vs 53mm+)
- [ ] Define price tier (budget/<$40, mid/$40-80, premium/>$80)

### During Search
- [ ] Find official manufacturer product page
- [ ] **Verify surround sound explicitly:**
  - Does product page mention "7.1" or "surround sound"?
  - Is it virtual (software/driver) or hardware DSP?
  - Or is it stereo/2.0 only?
- [ ] **Check connectivity carefully:**
  - USB only, 3.5mm only, or dual connection?
  - Wireless type (2.4GHz dongle vs Bluetooth)?
- [ ] **Confirm platform compatibility:**
  - PC only or multi-platform?
  - Does USB version work on Xbox/PS5?
- [ ] **Read full specifications:**
  - Driver size (mm)
  - Frequency range
  - Impedance
  - Microphone type
- [ ] **Check product images:**
  - RGB/LED lighting visible?
  - Detachable vs fixed mic?
  - Ear pad type

### Post-Search Validation
- [ ] Cross-check 7.1 surround claim from multiple sources (manufacturer + retailer)
- [ ] Verify if "7.1" requires software/driver installation (virtual) or built-in DSP
- [ ] Confirm connection type works on target platforms
- [ ] Apply "Customer Persona Test"

### Customer Persona Test
**Question:** *"If a customer wants Target Headset, would a salesperson suggest Candidate Headset?"*

**Consider:**
- Same earcup design? (closed vs open = different use case)
- Same surround sound type? (stereo vs 7.1 = different market)
- Same connection convenience? (dual connection vs single)
- Same platform compatibility? (PC-only vs universal)
- Same technical tier? (entry vs premium)
- Same use case? (competitive gaming vs casual gaming vs office calls)

---

## 6. Real Product Matching Examples

### ✅ GOOD MATCH #1: HyperX Cloud II ↔ Corsair HS60 Pro

**Product A: HyperX Cloud II**
- Earcup: Closed-back
- Driver: 53mm neodymium
- Audio: Virtual 7.1 surround (via USB sound card)
- Connection: USB dongle + 3.5mm jack (dual mode)
- Frequency: 15Hz-25kHz
- Impedance: 60Ω (passive), USB powered
- Mic: Detachable boom, noise-canceling
- Platform: PC, PS5, PS4, Xbox (via 3.5mm)

**Product B: Corsair HS60 Pro**
- Earcup: Closed-back
- Driver: 50mm neodymium
- Audio: Virtual 7.1 surround (via USB adapter)
- Connection: USB adapter + 3.5mm jack (dual mode)
- Frequency: 20Hz-20kHz
- Impedance: Not specified (USB powered)
- Mic: Detachable boom, noise-canceling
- Platform: PC, PS5, PS4, Xbox, Switch (via 3.5mm)

**Analysis (A→B and B→A):**
- **CRITICAL - Earcup Design:** ✅ Both closed-back
- **CRITICAL - Surround Sound:** ✅ Both virtual 7.1 via USB processing
- **CRITICAL - Connection:** ✅ Both dual-mode (USB for 7.1 + 3.5mm for console)
- **CRITICAL - Microphone:** ✅ Both detachable boom, noise-canceling
- **STRUCTURAL - Driver Size:** ✅ 53mm vs 50mm (within tolerance, both premium gaming tier)
- **STRUCTURAL - Impedance:** ✅ Both USB-powered (no amp needed)
- **CONVENIENCE - Platform:** ✅ Both multi-platform compatible

**Match Score:** 96/100 (bidirectional)

**Why It's a Match:** These headsets are DIRECT COMPETITORS in the mid-range 7.1 gaming headset market. Both use external USB processing for surround sound, both have detachable mics, both support console via 3.5mm fallback. Customer wanting HyperX Cloud II would absolutely consider HS60 Pro and vice versa.

**Key Insight:** When both products use virtual 7.1 via USB adapter, driver size variance (50mm vs 53mm) is negligible - both are premium gaming tier.

---

### ✅ GOOD MATCH #2: Logitech G432 ↔ SteelSeries Arctis 5

**Product A: Logitech G432**
- Earcup: Closed-back
- Driver: 50mm
- Audio: DTS Headphone:X 2.0 (7.1 surround)
- Connection: USB Type-A + 3.5mm jack
- Frequency: 20Hz-20kHz
- Impedance: 39Ω
- Mic: 6mm flip-to-mute boom
- RGB: No RGB
- Platform: PC, Mac, PS5/PS4, Switch

**Product B: SteelSeries Arctis 5**
- Earcup: Closed-back
- Driver: 40mm neodymium (S1 drivers)
- Audio: DTS Headphone:X v2.0 (7.1 surround)
- Connection: USB Type-A + 3.5mm adapter
- Frequency: 20Hz-22kHz
- Impedance: Not specified
- Mic: Retractable ClearCast boom, Discord-certified
- RGB: Dual-zone RGB earcups
- Platform: PC, Mac, PS5/PS4 (via USB + adapter)

**Analysis (A→B and B→A):**
- **CRITICAL - Earcup Design:** ✅ Both closed-back
- **CRITICAL - Surround Sound:** ✅ Both DTS Headphone:X 2.0 (exact same tech)
- **CRITICAL - Connection:** ✅ Both USB + 3.5mm
- **CRITICAL - Microphone:** ✅ Both boom mic (flip vs retractable)
- **STRUCTURAL - Driver Size:** ✅ 50mm vs 40mm (different but both mid-range tier)
- **CONVENIENCE - RGB:** ⚠️ No RGB vs Dual-zone RGB (aesthetic difference)

**Match Score:** 89/100 (bidirectional)

**Why It's a Match:** Both use the EXACT SAME DTS Headphone:X 2.0 surround technology. Driver size difference (50mm vs 40mm) is offset by SteelSeries' custom S1 driver tuning. RGB presence is aesthetic preference (some users want it, others don't). Customer wanting G432 would consider Arctis 5 and vice versa.

**Key Insight:** When surround technology is identical (DTS Headphone:X 2.0), driver size becomes secondary. RGB is convenience tier, not dealbreaker.

---

### ✅ GOOD MATCH #3: HyperX Cloud II ↔ Logitech G432

**Product A: HyperX Cloud II**
- Earcup: Closed-back
- Driver: 53mm
- Audio: Virtual 7.1 surround (USB sound card)
- Connection: USB + 3.5mm
- Impedance: 60Ω
- Mic: Detachable

**Product B: Logitech G432**
- Earcup: Closed-back
- Driver: 50mm
- Audio: DTS Headphone:X 2.0 (7.1 surround)
- Connection: USB + 3.5mm
- Impedance: 39Ω
- Mic: Flip-to-mute boom

**Analysis (A→B and B→A):**
- **CRITICAL:** ✅ All critical features match (closed-back, 7.1 surround, USB+3.5mm, mic present)
- **STRUCTURAL:** ✅ Driver sizes within range (50-53mm both premium gaming)
- **STRUCTURAL:** ✅ Impedances both mid-range (no amp needed)

**Match Score:** 91/100 (bidirectional)

**Why It's a Match:** Both are mid-range 7.1 gaming headsets with USB surround processing and dual connectivity. Technical tier and use case identical.

---

### ❌ BAD MATCH #1: HyperX Cloud II ↔ Audio-Technica ATH-M50x

**Product A: HyperX Cloud II (Gaming Headset)**
- Earcup: Closed-back
- Driver: 53mm
- Audio: **Virtual 7.1 surround** (gaming feature)
- Connection: USB + 3.5mm
- Mic: **Detachable boom microphone** (PRESENT)
- Use Case: Gaming (isolation + surround + communication)

**Product B: Audio-Technica ATH-M50x (Studio Headphones)**
- Earcup: Closed-back
- Driver: 45mm
- Audio: **Stereo ONLY** (no surround, reference monitoring)
- Connection: 3.5mm ONLY (no USB, no surround processing)
- Mic: **NONE** (studio monitoring, no communication)
- Use Case: Music production (reference listening, critical audio work)

**Analysis (A→B FAILS, B→A FAILS):**
- **CRITICAL - Earcup Design:** ✅ Both closed-back (ONLY thing that matches)
- **CRITICAL - Surround Sound:** ❌ **FAIL** - 7.1 gaming vs stereo reference = different use cases
- **CRITICAL - Connection:** ❌ **FAIL** - USB gaming vs 3.5mm studio = incompatible
- **CRITICAL - Microphone:** ❌ **FAIL** - Gaming headset vs NO MIC headphones = **different product category**

**Match Score:** 25/100 (REJECTED - both directions)

**Why It's NOT a Match:**
1. **Product category mismatch:** Headset (with mic) ≠ Headphones (no mic)
2. **Use case mismatch:** Gaming (surround, isolation, chat) ≠ Studio (reference, mixing, critical listening)
3. **Technical incompatibility:** USB 7.1 processing ≠ passive stereo
4. **Customer intent mismatch:** Gamer wants communication + surround. Producer wants accuracy + no processing.

**Customer Persona Test FAILS:**
- Gamer wanting HyperX Cloud II would NEVER want ATH-M50x (no mic = can't chat)
- Producer wanting ATH-M50x would NEVER want HyperX (colored audio, gaming gimmicks)

**Rejection Reason:** Different product categories (headset vs headphones), different use cases (gaming vs studio), missing critical feature (microphone).

---

### ❌ BAD MATCH #2: Corsair HS60 Pro ↔ Beyerdynamic DT 770 Pro

**Product A: Corsair HS60 Pro (Gaming)**
- Earcup: Closed-back
- Driver: 50mm neodymium
- Audio: Virtual 7.1 surround (USB)
- Mic: **Detachable boom** (gaming communication)
- Use Case: Gaming headset

**Product B: Beyerdynamic DT 770 Pro (Professional Audio)**
- Earcup: Closed-back
- Driver: 45mm
- Audio: Stereo ONLY (professional monitoring)
- Mic: **NONE** (studio headphones)
- Impedance: 80Ω or 250Ω (requires amplifier)
- Use Case: Professional audio monitoring

**Analysis (A→B FAILS, B→A FAILS):**
- **CRITICAL - Surround:** ❌ 7.1 gaming vs stereo professional
- **CRITICAL - Microphone:** ❌ Gaming headset vs NO MIC
- **STRUCTURAL - Impedance:** ❌ USB-powered vs 80Ω/250Ω (needs amp)

**Match Score:** 20/100 (REJECTED)

**Why It's NOT a Match:** Product category mismatch (headset vs headphones), use case mismatch, impedance incompatibility.

---

### ❌ BAD MATCH #3: SteelSeries Arctis 5 ↔ Sennheiser HD 560S (Open-Back)

**Product A: SteelSeries Arctis 5**
- Earcup: **Closed-back** (isolation for gaming)
- Audio: DTS 7.1 surround
- Mic: Retractable boom
- Use Case: Gaming

**Product B: Sennheiser HD 560S**
- Earcup: **Open-back** (soundstage for music)
- Audio: Stereo ONLY
- Mic: **NONE**
- Use Case: Audiophile music listening

**Analysis (A→B FAILS, B→A FAILS):**
- **CRITICAL - Earcup Design:** ❌ **DEALBREAKER** - Closed vs Open = fundamentally different
  - Closed = isolation (gaming, office)
  - Open = soundstage, sound leakage (quiet environments only)
- **CRITICAL - Surround:** ❌ 7.1 vs stereo
- **CRITICAL - Microphone:** ❌ Headset vs headphones

**Match Score:** 15/100 (REJECTED)

**Why It's NOT a Match:** The closed-back vs open-back difference ALONE is a dealbreaker. Open-back headphones leak sound and provide NO isolation - unusable for gaming in shared spaces. Gamer wanting Arctis 5 needs isolation. Audiophile wanting HD 560S needs soundstage and quiet environment.

**Rejection Reason:** CRITICAL earcup design mismatch + no microphone + different use case.

---

## 7. Common Mistakes to Avoid

### ❌ Mistake 1: "Matching stereo headset to 7.1 headset without verification"
**Why It's Wrong:** 7.1 surround (especially hardware or premium software like DTS) is a FEATURE customers specifically seek. Stereo buyers DON'T want unnecessary software/drivers.

**Example Error:** Matching $20 stereo headset to HyperX Cloud III (DTS Headphone:X) just because "both have 50mm drivers."

**Fix:** Verify surround sound type FIRST. Match stereo to stereo, virtual 7.1 to virtual 7.1, hardware 7.1 to hardware 7.1.

---

### ❌ Mistake 2: "Assuming USB + 3.5mm means same connection type"
**Why It's Wrong:** Some headsets use USB ONLY for LED power (audio via 3.5mm). Others use USB for audio + 7.1 processing.

**Example Error:** Matching headset with "USB audio + 7.1" to headset with "USB LED power only, audio via 3.5mm."

**Fix:**Read product specs to clarify USB function: "USB for LED" vs "USB digital audio" vs "USB + 3.5mm dual mode."

---

### ❌ Mistake 3: "Ignoring platform compatibility differences"
**Why It's Wrong:** USB headsets may be PC-only. 3.5mm headsets are universal (PC + all consoles + mobile).

**Example Error:** Matching universal 3.5mm headset to PC-only USB headset for console gamer.

**Fix:** Verify platform compatibility. If target is 3.5mm (universal), USB-only candidate must explicitly support target platforms.

---

### ❌ Mistake 4: "Matching gaming headset (with mic) to music headphones (no mic)"
**Why It's Wrong:** Headset vs Headphones = different product categories. Gamers NEED microphone.

**Fix:** Verify microphone presence. Gaming headset must have mic (boom or inline).

---

### ❌ Mistake 5: "Treating RGB lighting as critical feature"
**Why It's Wrong:** RGB is aesthetic preference, not functional requirement. Some premium headsets skip RGB entirely (focus on audio quality).

**Example Error:** Rejecting HyperX Cloud III as competitor because it has no RGB.

**Fix:** RGB is CONVENIENCE (10 points), not CRITICAL. Accept headsets without RGB if other criteria match, especially if premium tier.

**HOWEVER:** If target is marketed as "RGB Gaming Headset," candidate should ideally have some lighting.

---

## 8. Technical Tier Indicators

### Entry/Budget Tier
**Technical Signals:**
- Stereo audio (NO 7.1) OR basic virtual 7.1 via software
- USB + 3.5mm dual connection (versatility)
- Basic LED or RGB lighting
- 50mm drivers (standard)
- 32Ω impedance (no amp needed)
- Basic foam ear pads
- Fixed or detachable boom mic
- 1.5-2.5m cable

**Common Features:**
- Multi-platform compatibility (3.5mm)
- Lightweight design
- Basic marketing claims ("immersive audio")

---

### Mid-Range Tier
**Technical Signals:**
- Virtual 7.1 surround (software or DSP)
- USB digital audio preferred (driver-based features)
- RGB with multiple effects
- 50mm - 53mm drivers
- 32-40Ω impedance
- Memory foam ear pads
- Detachable boom mic with flip-to-mute
- Braided cable
- Software support (EQ presets)

**Common Features:**
- "7.1 surround sound" prominently marketed
- Software customization (EQ, RGB, mic monitoring)
- Better build quality (metal headband adjusters)
- Noise-canceling microphone

---

### Premium Tier
**Technical Signals:**
- DTS Headphone:X, Dolby Atmos, or hardware DSP
- Multi-connection (3.5mm + USB-A + USB-C)
- 40mm - 53mm drivers (quality over size)
- Varied impedance (some go higher for better audio)
- Premium materials (aluminum, steel frame)
- Velour or hybrid ear pads
- Detachable boom mic OR broadcast-quality
- Modular cables (3.5mm, USB, USB-C options)
- Advanced software (parametric EQ, spatial audio profiles)

**Common Features:**
- "Studio-quality" or "Esports-grade" marketing
- Replaceable parts (ear pads, cables, mic)
- Console & PC optimized
- May skip RGB entirely (professional aesthetic)
- Advanced spatial audio licensing (DTS, Dolby)
