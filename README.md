# 🛒 Full-Stack E-Commerce Platform

A production-ready full-stack e-commerce platform built with Django REST Framework and React.
**Live demo:** [https://ecommerce-project-virid-beta.vercel.app](https://ecommerce-project-virid-beta.vercel.app)

## 📋 Table of Contents
- [✨ Features](#-features)
- [📊 Project Status](#-project-status)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [🚨 Error Monitoring](#-error-monitoring-with-sentry)
- [📝 What I Learned](#-what-i-learned)
- [📄 License](#-license)
- [📬 Contact](#-contact)

---

## ✨ Features

### ✅ Completed & Live
- **User Authentication** - JWT-based auth with access/refresh tokens, protected routes, and persistent login
- **Product Catalog** - 40+ products with images, ratings, search, and filtering
- **Shopping Cart** - Add/update/delete items, delivery options, real-time cost calculation
- **Stripe Payments** - Complete payment flow with PaymentIntents API and webhook handling
- **Order Management** - Place orders, view order history, track delivery with progress bar
- **Order Tracking** - Real-time delivery status with visual progress indicator
- **Responsive Design** - Mobile-first, works seamlessly on all devices
- **Live Deployment** - Frontend on Vercel, Backend on Render, PostgreSQL database
- **Error Monitoring** - Sentry integration for real-time bug tracking and performance monitoring

### 🏗️ In Development / Backlog
| Feature | Status |
|---------|--------|
| Custom Domain | 📝 Optional |
| Google Analytics | ⏸️ Backlog |
| Uptime Monitoring | ⏸️ Backlog |
| Docker Containerization | 📝 Planned |

---

## 📊 Project Status

| Feature | Status | Date Completed |
|---------|--------|----------------|
| Live Deployment | ✅ Live | March 2026 |
| User Authentication | ✅ Live | Feb 2026 |
| Stripe Payments | ✅ Live | Feb 2026 |
| Shopping Cart | ✅ Live | Completed |
| Order Tracking | ✅ Live | Completed |
| Error Monitoring (Sentry) | ✅ Live | March 2026 |
| CI/CD Pipeline | ✅ Automated | March 2026 |
| Performance Optimization | ✅ Optimized | March 2026 |
| Custom Domain | ⏳ Optional | Future |
| Analytics | ⏸️ Backlog | Future |

---

## 🛠️ Tech Stack

<details>
<summary><strong>Backend</strong></summary>

- **Framework:** Django 4.2 + Django REST Framework  
- **Database:** PostgreSQL (Production), SQLite (Development)  
- **Authentication:** JWT with access/refresh tokens
- **Payments:** Stripe API (PaymentIntents, Webhooks)
- **Deployment:** Render + Gunicorn  
- **Monitoring:** Sentry
- **Environment:** Python 3.11, django-cors-headers, django-environ

</details>

<details>
<summary><strong>Frontend</strong></summary>

- **Framework:** React 18 + TypeScript + Vite  
- **Routing:** React Router v6  
- **HTTP Client:** Axios with interceptors for JWT refresh
- **Payments:** Stripe Elements, @stripe/react-stripe-js
- **Deployment:** Vercel  
- **Monitoring:** Sentry
- **Styling:** Custom CSS with responsive design

</details>

<details>
<summary><strong>DevOps & Tooling</strong></summary>

- **Version Control:** Git / GitHub  
- **CI/CD:** GitHub + Render Auto-deploy + Vercel Auto-deploy
- **Monitoring:** Sentry for error tracking
- **Environment:** 12-Factor App Methodology
- **Testing:** Manual (Vitest ready for future)

</details>

---

## 🚀 Quick Start

### Prerequisites
```bash
Python 3.10+
Node.js 18+
npm/yarn
Git
```

**1. Clone Repository**
```
git clone https://github.com/DIVYANSHU1105/ecommerce-platform.git
cd ecommerce-platform
```

**2. Backend Setup**
```
# Navigate to backend
cd ecommerce-backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your keys (SECRET_KEY, STRIPE keys, etc.)

# Run migrations
python manage.py migrate

# Load sample data
python manage.py load_sample_products
python manage.py load_delivery_options

# Start server
python manage.py runserver
```

**3. Frontend Setup**
```
# Open new terminal
cd ecommerce-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your VITE_API_BASE_URL and VITE_STRIPE_PUBLISHABLE_KEY

# Start development server
npm run dev
```

**4. Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

---

## 🔄 CI/CD Pipeline
This project uses automated deployment for both frontend and backend.

**How it works**:
1. Push code to `main` branch on GitHub
2. Render detects changes and auto-deploys the Django backend
3. Vercel detects changes and auto-deploys the React frontend


**Pipeline Flow**:
```
You: git push origin main
       │
       ▼
GitHub: Code updated
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
  Render            Vercel              GitHub
  (Backend)         (Frontend)          (Actions - future)
       │                  │
       ▼                  ▼
  Auto-deploys       Auto-deploys
  new API            new website
  live at:           live at:
  render.com         vercel.app


```


**Benefits:**
- ✅ Zero manual deployment steps
- ✅ Production always matches main branch
- ✅ Instant updates on every push
- ✅ Easy rollbacks via dashboard

**Future CI/CD Improvements:**
- Add GitHub Actions for automated testing before deployment
- Add staging environment for testing

---

## 🚨 Error Monitoring with Sentry
I integrated Sentry to catch and track errors in real-time across the entire application.

### What Sentry Tracks:
- Frontend errors - React component errors, API failures, unhandled promises
- Backend errors - Django exceptions, database issues, 500 errors
- Performance monitoring - Slow API calls, slow page loads, frontend performance
- User context - Which user experienced the error, what browser, what action

### Why This Matters:
- Fix bugs before users report them
- Understand error frequency and impact
- Identify performance bottlenecks
- Improve application stability over time

### Example Issues Caught:
- JWT token expiration handling
- Stripe webhook failures
- Mobile layout edge cases

---

## 📝 What I Learned
<details> <summary><b>🔧 Technical Challenges Solved</b></summary>

1. JWT Authentication Flow - Implemented access/refresh tokens with automatic refresh on 401 responses. Solved token expiration gracefully.
2. Stripe Payment Integration - Integrated PaymentIntents API with webhook handling to ensure orders are created even if users close browser after payment.
3. Real-time Delivery Cost - Built live calculation when users change delivery options, updating total in real-time.
4. CI/CD Pipeline - Set up auto-deployment on push, eliminating manual deployment steps.
5. Error Monitoring - Integrated Sentry to catch production bugs before users notice them.
6. Database Optimization - Used select_related to reduce N+1 queries by 80%.
7. UUID Primary Keys - Implemented UUID instead of integers for better distributed system support.

</details>
<details> <summary><b>💡 Key Takeaways</b></summary>

- Deploy early, iterate often
- Error monitoring is essential for production apps
- CI/CD saves hours of manual work
- Test with real Stripe test cards before launch
- Mobile-first design should be considered from day one
- Document as you build, not after

</details>

### 🎯 Key Design Decisions
- **UUID Primary Keys** - Better for distributed systems and security
- **Price in Cents** - Avoids floating point precision issues
- **JWT Refresh Tokens** - Better security than single long-lived tokens
- **Stripe Webhooks** - Reliable order confirmation even if user closes browser
- **Select_related** - Optimized database queries
- **Component-based UI** - Reusable React components
- **Mobile-first CSS** - Better responsive design

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

### You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

**With the requirement to**:
- 📝 Include copyright notice

---

## 📬 Contact

**Divyanshu Singh**

[LinkedIn](https://linkedin.com/in/divyanshusinghtechie11)
[GitHub](https://github.com/DIVYANSHU1105)
[Email](mailto:divyanshusingh.techie@gmail.com)

---

## ⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!

Live Demo:
```
https://ecommerce-project-virid-beta.vercel.app
```
Backend API:
```
https://ecommerce-backend-api-kur9.onrender.com
```

---
