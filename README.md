<div align="center">

<img src="https://img.shields.io/badge/StatLab-v0.1-blue?style=for-the-badge" alt="StatLab" />

# StatLab

**Instant data analysis for students and researchers.**
Upload a CSV or Excel file → get EDA, cleaning diagnostics, scope assessment, and plain-English insights in seconds.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Report a Bug](https://github.com/Ajayvarmaramineni/statlab/issues) · [Request a Feature](https://github.com/Ajayvarmaramineni/statlab/issues)

</div>

---

## What is StatLab?

Most students have data but don't know what to do with it. StatLab solves that.

Drop in any CSV or Excel file and StatLab instantly tells you:
- **What's in your data** — row counts, column types, missing values, duplicates, quality score
- **What needs cleaning** — specific issues with actionable fixes
- **What the data looks like** — distributions, correlations, top categories
- **What you can actually do with it** — regression, classification, clustering, time series — with confidence scores and reasoning
- **What it means** — plain-English insights and next steps
- **How to get there** — a visual animated pipeline tailored to your dataset

---

## Screenshots

> Results Dashboard — Overview Tab

![Overview](https://via.placeholder.com/900x500/0f172a/4ade80?text=Overview+Tab)

> Scope Tab — Analysis Feasibility with Confidence Scores

![Scope](https://via.placeholder.com/900x500/0f172a/38bdf8?text=Scope+Tab)

> Pipeline Page — Animated Workflow

![Pipeline](https://via.placeholder.com/900x500/0a0f1e/818cf8?text=Pipeline+View)

---

## Features

| Feature | Description |
|---|---|
| 📁 **Drag & Drop Upload** | CSV and Excel files up to 50 MB |
| 🔍 **Dataset Overview** | Row count, column types, missing %, quality score |
| 🧹 **Cleaning Diagnostics** | Issue detection with severity levels and fix recommendations |
| 📊 **Exploratory Analysis** | Distributions, correlation heatmap, categorical breakdowns |
| 🎯 **Scope Engine** | Tells you what ML analyses are feasible — with confidence scores, warnings, and what's missing |
| 💡 **Insights** | Auto-generated plain-English findings, warnings, and next steps |
| 🔀 **Visual Pipeline** | Animated step-by-step workflow tailored to your dataset |
| 🌑 **Dark Theme** | Fully dark, student-friendly UI |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Recharts, react-dropzone, lucide-react |
| **Backend** | FastAPI, Pandas, NumPy, SciPy, scikit-learn |
| **Storage** | In-memory (MVP) → S3/Cloudflare R2 (production) |
| **Deploy** | Vercel (frontend) + Railway / Render (backend) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+

### 1. Clone the repo

```bash
git clone https://github.com/Ajayvarmaramineni/statlab.git
cd statlab
```

### 2. Start the backend

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000
```

API available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### 3. Start the frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```

App available at `http://localhost:3000`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload CSV/XLSX — returns `file_id` |
| `POST` | `/analyze/{id}` | Dataset summary + column profile |
| `GET` | `/cleaning/{id}` | Cleaning diagnostics with severity + fix suggestions |
| `GET` | `/eda/{id}` | Full EDA — stats, correlations, distributions |
| `GET` | `/scope/{id}` | ML feasibility check with confidence scoring + suggested pipeline |
| `GET` | `/insights/{id}` | Plain-English findings, warnings, and next steps |

---

## Project Structure

```
statlab/
├── backend/
│   ├── app/
│   │   ├── main.py               Entry point + CORS
│   │   ├── routes/               upload, analyze, cleaning, eda, scope, insights
│   │   ├── services/
│   │   │   ├── parser_service.py     Semantic type detection
│   │   │   ├── cleaning_service.py   Issue detection
│   │   │   ├── eda_service.py        Distributions, correlations
│   │   │   ├── scope_service.py      ML feasibility + pipeline generator
│   │   │   └── insight_service.py    Plain-English insight generation
│   │   └── models/               Pydantic schemas
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx              Landing page
    │   ├── upload/               Upload flow
    │   ├── results/[id]/         Results dashboard (5 tabs)
    │   └── pipeline/[id]/        Animated pipeline view
    ├── components/
    │   ├── dashboard/            OverviewTab, CleaningTab, EdaTab, ScopeTab, InsightsTab
    │   ├── charts/               DistributionChart, CorrelationHeatmap, CategoryChart
    │   └── upload/               DropZone
    └── lib/
        ├── api.ts                All backend API calls
        └── helpers.ts            Formatters, type utilities
```

---

## Pricing

| Plan | Price | Uploads | File Size |
|---|---|---|---|
| **Free** | $0 / mo | 5 per month | Up to 10 MB |
| **Pro** | $5.99 / mo | Unlimited | Up to 50 MB |

---

## Roadmap

- [x] Dataset overview + quality scoring
- [x] Cleaning diagnostics
- [x] EDA — distributions, correlations, categorical charts
- [x] Scope engine with confidence scores, warnings, actionable suggestions
- [x] Insight generation
- [x] Animated visual pipeline
- [ ] LLM-powered insights (Claude API integration)
- [ ] One-click cleaning application
- [ ] PDF report export
- [ ] Auth (Clerk)
- [ ] Stripe payments
- [ ] Persistent history (Supabase)
- [ ] Deployment to Vercel + Railway

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)

---

<div align="center">
  Built by <a href="https://github.com/Ajayvarmaramineni">Ajay Ramineni</a>
</div>
