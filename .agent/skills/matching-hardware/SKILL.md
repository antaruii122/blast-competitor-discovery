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
1.  **Input Parsing:** Receive standard Product Spec JSON.
2.  **Phase A: Global Tech Search**
    - Load `category_rules.json`.
    - **Iterate Tier 1 Brands:** Search for models matching critical specs.
    - **Iterate Tier 2 Brands:** Search for models matching critical specs.
    - **Validate:** Apply `validate_tech_parity` (Gatekeeping + +/- 20% Tolerance).
    - **Goal:** Accumulate ~4 Tier 1 and ~2 Tier 2 Matches.
3.  **Phase B: Local Discovery**
    - For each **Global Match**:
        - Search specifically in Chile, Brazil, Colombia (via `find_local_price`).
        - If found, calculate `Value Gap`.
4.  **Output:** 
    - Insert structured result into Supabase `Matches_Mercado`.

## Instructions
- **Strict Parsing:** Do not guess specs. If a critical spec (e.g., Panel Type) is missing, fail the match or ask for clarification (if interactive).
- **RivalSearchMCP:** Use this tool (simulated or real) to fetch competitor data.
- **Supabase:** Ensure the `matches_mercado` table exists before pushing.

## Resources
- `resources/category_rules.json`: The source of truth for brands and logic.
- `scripts/`: Helper scripts for testing.
