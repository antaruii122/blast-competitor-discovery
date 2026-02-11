# B.L.A.S.T. Intelligence Core - Competitor Discovery Platform

AI-powered competitor discovery system that identifies global technical rivals for hardware products and finds their local pricing across South American markets.

## Overview

**Two-Phase Architecture:**
1. **Global Spec Matching**: Import catalogs from Google Sheets → Find technically equivalent competitor models
2. **Local Price Discovery**: Select competitors → Search whitelisted LATAM retailers for real-time pricing

## Project Structure

```
├── tools/                    # Backend Python scripts
│   ├── batch_processor.py    # Main catalog processing orchestrator
│   ├── engine_orchestrator.py # Competitor matching logic
│   ├── perform_global_match.py
│   ├── validate_tech_parity.py
│   ├── local_price_fetcher.py
│   ├── push_match_results.py # Supabase integration
│   └── retailer_config.json  # Country/retailer whitelist
├── webapp/                   # Next.js web application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & API clients
│   │   └── theme/           # Material-UI theme
└── .agent/                   # Skills & workflows
    └── skills/
        ├── matching-hardware/
        └── search-specialist/
```

## Tech Stack

**Backend:**
- Python 3.8+
- Supabase (PostgreSQL)
- RivalSearch MCP (via Model Context Protocol)

**Frontend:**
- Next.js 14 (App Router)
- Material-UI (MUI)
- TypeScript
- Google Sheets API

## Deployment

- **Frontend**: Vercel
- **Backend**: Python scripts (serverless or containerized)
- **Database**: Supabase (hosted)

## Environment Variables

See `webapp/.env.local.template` for required configuration.

## Development Status

- [x] **Protocol 0**: Backend Intelligence Core (Complete)
- [ ] **Protocol 1**: Web Application (In Progress)

## License

Private project - All rights reserved
