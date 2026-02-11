# Task Plan

## Phase 1: Blueprint (Vision & Logic)
- [x] **Discovery:** Define North Star, Source of Truth, Payload, Rules.
- [x] **Constitution:** Create `gemini.md` with Schema and Behavior.
- [ ] **Research:**
    - [ ] Survey "RivalSearchMCP" capabilities (simulated/defined).
    - [ ] Confirm Supabase table structure for `Matches_Mercado`.

## Phase 2: Link (Connectivity)
- [ ] **Verification:**
    - [ ] Check Supabase connection.
    - [ ] Verify GitHub Skill Vaults access (if applicable).
- [ ] **Handshake:**
    - [ ] Create `tools/test_supabase_connection.py`.
    - [ ] Create `tools/test_rival_search.py`.

- [/] Phase 3: Architect (The Build) <!-- id: 9 -->
    - [/] **Skill Creation (`matching-hardware`):**
        - [ ] Create `SKILL.md`.
        - [ ] Define **Category Rules** (Sub-skills logic) in `resources/category-rules.json`.
    - [ ] **Tool Implementation:**
        - [ ] `engine_orchestrator.py`: The orchestrated logic.
        - [ ] `perform_global_match.py`: Search for tech equivalents.
        - [ ] `validate_tech_parity.py`: 20% tolerance & gatekeeping.
        - [ ] `find_local_price.py`: LATAM search.
        - [ ] `push_match_results.py`: Supabase insert.

## Phase 4: Stylize (Refinement)
- [ ] **Payload Refinement:** Format "Value Gap" strings (e.g., "Matches MSI Specs but 20% Cheaper").
- [ ] **UI/UX:** (Future) Web App Dashboard.

## Phase 5: Trigger (Deployment) ✅
- [x] **Automation:** Script to process a batch of products from Google Sheets.
- [x] **Completed:** `batch_processor.py` successfully processes CSV catalogs
- [x] **Integration:** Supabase client updated with official Python SDK

---

# Protocol 1: Web Application

## Phase 1: Project Setup
- [ ] Initialize Next.js 14+ with App Router and TypeScript
- [ ] Configure design system (CSS variables, glassmorphism, animations)
- [ ] Set up Supabase client configuration
- [ ] Create project structure (components, lib, app routes)

## Phase 2: Feature - Catalog Upload
- [ ] Build file upload interface (drag-and-drop CSV/Excel)
- [ ] Create API route to invoke `batch_processor.py`
- [ ] Implement real-time processing status updates
- [ ] Add catalog preview and validation

## Phase 3: Feature - Competitor Viewing
- [ ] Create competitor dashboard with filtering/search
- [ ] Build card and table views for matches
- [ ] Implement detailed comparison page
- [ ] Add export functionality (Excel, PDF)

## Phase 4: Feature - Price Checking
- [ ] Build country/retailer selector interface
- [ ] Create API route for on-demand price checks
- [ ] Implement price history visualization
- [ ] Add real-time price update notifications

## Phase 5: Deployment
- [ ] Deploy to Vercel or preferred platform
- [ ] Configure environment variables
- [ ] Test full workflow end-to-end
- [ ] Document user workflows
