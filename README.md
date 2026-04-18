# MPL Steels Smart Ops

An enterprise-grade, full-stack **Smart Operations Platform** for MPL Steels — built to streamline industrial document management, supply chain tracking, and multi-tenant user administration.

---

## Overview

MPL Steels Smart Ops provides a complete end-to-end workflow for managing purchase orders, weighbridge entries, GRN records, supplier invoices, and supporting documents — all within a secure, role-based multi-tenant architecture.

---

## Features

### 🏢 Multi-Tenant Architecture
- Company-level data isolation enforced at all API layers
- Super Admin can manage multiple companies and their users
- Each company has its own admin, operations, and finance roles

### 🔐 Authentication & Authorization
- JWT-based login with configurable token expiry
- Role-Based Access Control (RBAC): `super_admin`, `admin`, `operations`, `finance`
- Secure password hashing with `bcrypt`

### 📦 Transaction Management
- Create and track full supply chain transactions: **PO → Weighbridge → GRN → Invoice**
- Filter transactions by PO number and date range
- Three-way matching support (PO / WB / GRN)

### 📄 Document Management
- Upload and attach documents to transactions
- Support for **8 document types**: Purchase Order, Weighbridge Slip, GRN, Invoice, Quality Certificate, Delivery Challan, Truck Receipt, Lab Certificate
- Integrated in-browser PDF viewer with zoom and fullscreen
- Download and delete documents with role-level permission control

### 📊 Analytics & Monitoring
- Super Admin dashboard with system-wide metrics
- Company-level activity logs and document intelligence
- System health panel

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Lucide React | Icon library |
| Sonner | Toast notifications |
| Axios | HTTP client |
| Vanilla CSS | Custom enterprise design system |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Async REST API framework |
| Motor + PyMongo | Async MongoDB driver |
| MongoDB Atlas | Cloud database |
| python-jose | JWT token handling |
| bcrypt | Password hashing |
| Pydantic v2 | Data validation & settings |
| Uvicorn | ASGI server |

### Deployment
| Service | Role |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database |

---

## Project Structure

```
TASK 1/
├── frontend/                     # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.tsx           # Login page
│   │   │   ├── SuperAdminApp.tsx  # Super admin control panel
│   │   │   ├── UserManagement.tsx # Company user management
│   │   │   ├── DocumentViewer.tsx # PDF viewer + document explorer
│   │   │   └── shared/            # Shared UI components
│   │   ├── services/
│   │   │   └── erpApi.ts          # ERP API service layer
│   │   ├── App.tsx                # Root component & routing
│   │   └── main.tsx               # Entry point
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + API_BASE_URL
│   │   ├── mockData.ts            # Mock transactions & documents
│   │   └── utils.ts               # Utility functions
│   ├── .env                       # Frontend environment variables
│   └── vite.config.ts
│
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── config/
│   │   │   ├── settings.py        # Pydantic settings (env-based)
│   │   │   └── db.py              # MongoDB connection manager
│   │   ├── models/
│   │   │   └── documents.py       # MongoDB document models
│   │   ├── routes/
│   │   │   ├── auth.py            # /auth/login
│   │   │   ├── users.py           # /users & /admin/users
│   │   │   ├── companies.py       # /admin/companies
│   │   │   ├── transactions.py    # /transactions
│   │   │   ├── documents.py       # /documents
│   │   │   ├── analytics.py       # /admin/overview
│   │   │   └── deps.py            # Auth dependency injection
│   │   ├── schemas/
│   │   │   └── schemas.py         # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── transaction_service.py
│   │   │   ├── document_service.py
│   │   │   └── analytics_service.py
│   │   ├── utils/
│   │   │   └── auth.py            # JWT creation, bcrypt hashing
│   │   └── main.py                # FastAPI app entry point
│   ├── requirements.txt
│   └── .env                       # Backend environment variables
│
├── .env.example                  # Template for environment variables
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** v18+
- **Python** 3.11+
- **MongoDB Atlas** account (or local MongoDB)

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

Run the dev server:
```bash
npm run dev
```
App runs at: `http://localhost:5173`

---

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/mpl_steels_db
JWT_SECRET=your-secure-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=False
```

Run the dev server:
```bash
python -m uvicorn app.main:app --reload
```
API runs at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_ALGORITHM` | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |
| `DEBUG` | Enable debug mode (`True`/`False`) |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | User login |
| GET | `/users/me` | Authenticated | Get current user |
| POST | `/admin/users` | Super Admin | Create user in a company |
| GET | `/admin/users` | Super Admin | List users in a company |
| PATCH | `/admin/users/{id}/status` | Super Admin | Activate/deactivate user |
| POST | `/admin/companies` | Super Admin | Create a new company |
| GET | `/admin/companies` | Super Admin | List all companies |
| GET | `/admin/overview` | Super Admin | System-wide analytics |
| POST | `/transactions` | Operations | Create a new transaction |
| GET | `/transactions` | Authenticated | List transactions with filters |
| POST | `/documents/upload` | Operations | Upload a document |
| GET | `/documents` | Authenticated | Get documents for a transaction |
| DELETE | `/documents/{id}` | Admin | Delete a document |

---

## Deployment

### Frontend (Vercel)
Set this environment variable in Vercel Dashboard:
```
VITE_API_URL = https://mpl-steels-smart-ops.onrender.com
```

### Backend (Render)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Set these environment variables in Render Dashboard:
```
MONGO_URI        = <your MongoDB Atlas URI>
JWT_SECRET       = <your secure key>
ALLOWED_ORIGINS  = https://mpl-steels-smart-ops.vercel.app
DEBUG            = False
```

---

## User Roles

| Role | Access |
|---|---|
| `super_admin` | Full system access — manages companies and users |
| `admin` | Company-level user management |
| `operations` | PO, Weighbridge, GRN, Document upload |
| `finance` | Invoice management, financial dashboard |

---

## License

This project is proprietary and developed as part of an internship at **Ultrion Technologies**.
