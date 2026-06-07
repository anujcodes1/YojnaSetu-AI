# YojnaSetu AI 🇮🇳
**AI-Powered Government Scheme Recommendation Platform**

> Connects Indian citizens to the right government schemes using profile-based scoring + Gemini AI explanations.

---

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (bcryptjs) |
| AI | Google Gemini 1.5 Flash |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/yojnasetu-ai.git
cd yojnasetu-ai

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

---

### 2. Environment Variables

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yojnasetu
JWT_SECRET=replace_with_64_char_random_string
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`client/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

### 3. MongoDB Atlas Setup
1. Create free account → [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster** → Free M0 tier → any region
3. **Database Access** → Add Database User → username + password (save these)
4. **Network Access** → Add IP → `0.0.0.0/0` (allow all)
5. **Connect** → Drivers → copy the URI
6. Replace `<user>` and `<password>` in `MONGO_URI`

---

### 4. Gemini API Key
1. Go to → [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. **Get API Key** → Create API key in new project
4. Copy into `GEMINI_API_KEY`

> Free tier gives 15 req/min — more than enough for development and demos.

---

### 5. Seed Database
```bash
cd server
npm run seed
```
Seeds **25+ real government schemes** and creates:
- **Admin account:** `admin@yojnasetu.com` / `Admin@12345`

---

### 6. Run Locally

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → http://localhost:5173
```

---

## Test the App

| Action | Steps |
|---|---|
| Register | `/register` → create account |
| Complete profile | `/profile` → fill age, state, income, occupation, category |
| AI Recommendations | `/recommendations` → Gemini matches your profile to schemes |
| Eligibility Check | `/eligibility` → select any scheme → get AI analysis |
| AI Chat | `/chat` → ask anything about schemes |
| Admin Panel | Login as `admin@yojnasetu.com` → visit `/admin` |

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. [render.com](https://render.com) → **New Web Service** → connect repo
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 20
4. **Environment Variables** → add all vars from `server/.env`
5. Deploy → copy your URL e.g. `https://yojnasetu-api.onrender.com`

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import repo
2. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
3. **Environment Variables:**
   ```
   VITE_API_BASE_URL = https://yojnasetu-api.onrender.com/api/v1
   ```
4. Deploy → copy your URL e.g. `https://yojnasetu.vercel.app`

### Post-Deploy: Update CORS
In Render dashboard → update `CLIENT_URL` to your Vercel URL:
```
CLIENT_URL=https://yojnasetu.vercel.app
```
Redeploy backend.

### Re-seed on Production
```bash
# Set MONGO_URI to your Atlas URI temporarily, then:
cd server
MONGO_URI="your_atlas_uri" npm run seed
```

---

## API Reference

```
POST  /api/v1/auth/register
POST  /api/v1/auth/login
GET   /api/v1/auth/me

GET   /api/v1/user/profile
PUT   /api/v1/user/profile
GET   /api/v1/user/saved-schemes
POST  /api/v1/user/save-scheme/:id
DEL   /api/v1/user/save-scheme/:id

GET   /api/v1/schemes              ?search=&category=&page=&limit=
GET   /api/v1/schemes/:id
GET   /api/v1/schemes/categories

GET   /api/v1/recommendations
GET   /api/v1/recommendations/quick

POST  /api/v1/chat/message
GET   /api/v1/chat/history
DEL   /api/v1/chat/history

POST  /api/v1/eligibility/check/:schemeId
GET   /api/v1/eligibility/history

GET   /api/v1/admin/stats
GET   /api/v1/admin/schemes
POST  /api/v1/admin/schemes
PUT   /api/v1/admin/schemes/:id
DEL   /api/v1/admin/schemes/:id
GET   /api/v1/admin/users
```

---

## How Recommendations Work

```
User Profile → Scoring Engine (0-100 pts)
  ├── Age in range        +20
  ├── State matches       +15
  ├── Category (SC/ST/OBC)+20
  ├── Occupation          +15
  ├── Income under limit  +15
  ├── Gender              +10
  └── Disability flag     + 5

Top 20 scores → Gemini 1.5 Flash
  └── Returns 1-2 sentence explanation per scheme
      (why it's relevant to THIS user's profile)

Results cached 1 hour per user (node-cache)
```

---

## Common Issues

| Problem | Fix |
|---|---|
| `CORS error` | Check `CLIENT_URL` in server `.env` matches frontend URL exactly |
| `Gemini not responding` | Verify `GEMINI_API_KEY` is set; check quota at aistudio.google.com |
| `MongoDB connection failed` | Whitelist `0.0.0.0/0` in Atlas Network Access |
| `Seed fails` | Ensure `MONGO_URI` in `.env` is correct before running seed |
| `Render cold start slow` | Free tier sleeps after 15 min; first request takes ~30s |
| `Recommendations empty` | Complete all 6 profile fields (age, gender, state, income, occupation, category) |

---

## Folder Structure
```
yojnasetu/
├── client/src/
│   ├── api/            axiosInstance.js · services.js
│   ├── components/     Layout · SchemeCard · UI components
│   ├── context/        AuthContext.jsx
│   └── pages/          auth/ · dashboard/ · schemes/ · admin/
│
└── server/
    ├── config/         db.js · gemini.js
    ├── controllers/    auth · user · scheme · recommendation · chat · eligibility · admin
    ├── middleware/     authMiddleware · errorHandler
    ├── models/         User · Scheme · Supporting
    ├── routes/         6 route files
    ├── services/       recommendationEngine · geminiService
    └── data/           seeder.js
```

---

## Environment Variables — Full Reference

| Variable | Where | Required | Description |
|---|---|---|---|
| `MONGO_URI` | server | ✅ | Atlas connection string |
| `JWT_SECRET` | server | ✅ | Min 32 chars, random |
| `JWT_EXPIRES_IN` | server | ✅ | `7d` recommended |
| `GEMINI_API_KEY` | server | ✅ | From Google AI Studio |
| `CLIENT_URL` | server | ✅ | Frontend URL (no trailing slash) |
| `PORT` | server | ❌ | Defaults to 5000 |
| `NODE_ENV` | server | ❌ | `development` / `production` |
| `VITE_API_BASE_URL` | client | ✅ | Backend URL + `/api/v1` |

---

*Built as a Final Year Project · Resume-worthy Full Stack + AI App*
