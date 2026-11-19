# SENTINEL — AI Financial Threat Intelligence & Protection Platform

> Detect the threat. Understand the network. Protect the money.

Sentinel is a real-time, deterministic financial threat intelligence and verification platform designed for enterprise treasury, procurement, and SecOps teams to detect and neutralize supplier impersonation, invoice fraud, and payment diversion attacks.

---

## 🏛 Monorepo Architecture

```
Sentinel/
├── frontend/               # Next.js 16 (App Router), Tailwind CSS v4, Lucide Icons, React Flow
│   ├── src/
│   │   ├── app/            # Landing page, /login, /signup, /confirm-email, /onboarding, /dashboard
│   │   ├── components/     # Three-pane Linear-style workspace, Command Palette, Modals
│   │   ├── context/        # AuthContext (Firebase Auth + Cloud Firestore sync)
│   │   └── lib/            # Firestore service, deterministic verification rules
│   └── public/             # Monochromatic branding assets, icons, SVG marks
│
├── backend/                # Google Cloud Run microservice (Python / FastAPI)
│   ├── main.py             # FinGuard deterministic verification & Gemini ScamShield endpoint
│   ├── requirements.txt    # FastAPI, Uvicorn, google-genai, pydantic
│   └── .env.example
│
├── .agents/                # Design intelligence skills & verification standards
├── AGENTS.md               # Platform mission & development rules
└── DESIGN_SYSTEM.md        # Monochromatic Linear design system specifications
```

---

## 🛡 Core Modules

1. **FinGuard**: Deterministic supplier bank account and IFSC/IBAN verification (zero LLM hallucination).
2. **TrustGraph**: Historical entity correlation and forensic relationship graph with provenance (React Flow).
3. **ScamShield**: AI-powered multimodal evidence analysis using Google Gemini.
4. **Unified Intelligence**: Real-time investigation dossiers connecting telemetry across all three modules.

---

## ☁️ Deployment Stack

- **Frontend**: [Vercel](https://vercel.com) (Next.js 16 App Router on Edge/Node runtime)
- **Backend / API**: [Render](https://render.com) (FastAPI Web Service with `render.yaml` Blueprint)
- **Authentication & Database**: Firebase Authentication & Cloud Firestore (Free Spark tier, zero billing required)

---

## 🚀 Deployment Instructions

### 1. Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com/new) and import `Rijurajx/Sentinel`.
2. In **Root Directory**, click **Edit** and select **`frontend`**.
3. Add Environment Variables from `frontend/.env.example`.
4. Click **Deploy**.

### 2. Deploy Backend to Render
1. Go to [Render](https://dashboard.render.com/) > **New** > **Blueprint** (or **Web Service**).
2. Connect `Rijurajx/Sentinel` (Render auto-detects `render.yaml`).
3. Set `GEMINI_API_KEY` in Environment Variables.
4. Click **Apply** to deploy the FastAPI service.

---

## 🚀 Getting Started

### 1. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Firebase and API credentials
npm run dev
```

### 2. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

