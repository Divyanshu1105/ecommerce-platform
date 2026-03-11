# 🚀 E-Commerce Deployment Journal

> **Status**: ✅ Completed | 🔄 In Progress | ❌ Blocked  
> **Date**: Feb 28, 2026  
> **Server**: Render.com | **Branch**: `main`

---

# 1: Production-Ready Code Changes

## 1.1 Production Django Settings
**WHAT**: Updated Django `settings.py` for live deployment  
**WHY**: Local dev settings (DEBUG=True, SQLite) are insecure for production  

**🔧 FILES CHANGED**:
ecommerce-backend/core/settings.py
+ Added: SECURITY_HEADERS (XSS, SSL redirect)
+ Added: POSTGRES_DB (dj_database_url)
+ Changed: DEBUG=False, ALLOWED_HOSTS=production.com

⚠️**WHAT COULD BREAK**: 
- If ALLOWED_HOSTS is wrong, Django returns "Bad Request (400)"
- If database settings wrong, app won't connect
- Missing environment variables will crash the app

---

## 1.2 Create Production Requirements File
**WHAT**: Creating requirements.txt with all dependencies
**WHY**: Render needs to know which Python packages to install

**COMMAND RUN**:
pip freeze > requirements.txt

⚠️**WHAT COULD BREAK**:
- Missing packages → ImportError on server
- Wrong versions → Compatibility issues

---

## 1.3 Update Frontend for Production
**WHAT**: Preparing React frontend for production
**WHY**: Frontend needs to know production API URL, not localhost

**FILES CHANGED**:
- ecommerce-frontend/.env (add production variable)
- ecommerce-frontend/src/services/api.ts (will auto-use env var)

---

## 1.4 Test Build Locally
**WHAT**: Testing production build locally
**WHY**: Catch errors before deploying

**COMMAND RUN**:
cd ecommerce-frontend
npm run build

⚠️**WHAT COULD BREAK**:
- TypeScript errors
- Missing dependencies
- Environment variable issues

---

# Phase 2: Database Migration.

## 2.1: Install PostgreSQL Locally (for testing)
**WHAT**: Installing PostgreSQL locally to test migration
**WHY**: We need to ensure data migrates correctly before deploying

**COMMANDS**: (choose based on your OS)

**For macOS**:
brew install postgresql@14
brew services start postgresql@14

**For Ubuntu/Debian**:
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

**For Windows**:
Download from: https://www.postgresql.org/download/windows/

⚠️**WHAT COULD BREAK**:
- Installation permission issues
- Port 5432 already in use
- Service fails to start

---

## 2.2: Create Local PostgreSQL Database
**WHAT**: Creating a new PostgreSQL database for testing
**WHY**: We'll migrate SQLite data here first to ensure everything works

**COMMANDS RUN**:
sudo -u postgres psql  (Linux/macOS)
or
psql -U postgres  (Windows)

**Then in psql shell**:
CREATE DATABASE ecommerce_db;
CREATE USER ecommerce_user WITH PASSWORD 'testpassword123';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
\q

⚠️**WHAT COULD BREAK**:
- User already exists
- Password complexity requirements
- Permission denied

---

## 2.3: Test PostgreSQL Connection
**WHAT**: Testing connection to PostgreSQL
**WHY**: Ensure Django can connect before migrating data

**COMMAND RUN**:
python manage.py dbshell

**WHAT COULD BREAK**:
- Connection refused (PostgreSQL not running)
- Authentication failed (wrong password)
- Database doesn't exist

---

## 2.4: Create Migrations for New Database
**WHAT**: Running migrations on PostgreSQL
**WHY**: Creates the database schema

**COMMANDS RUN****:
python manage.py makemigrations
python manage.py migrate

**SUCCESS**: All tables created in PostgreSQL
Tables created: auth_user, products_product, cart_cartitem, orders_order, etc.

---

##  2.5: Export Data from SQLite
**WHAT**: Exporting existing data from SQLite to JSON
**WHY**: Need to transfer users, products, orders to new database

**COMMAND RUN**:
python manage.py dumpdata > datadump.json

**FILES CREATED**:
- datadump.json (contains all database records)

**WHAT COULD BREAK**:
- Large export might timeout (unlikely with small data)
- Unicode/encoding issues

---

## 2.6: Import Data to PostgreSQL
**WHAT**: Importing data into PostgreSQL
**WHY**: Populate new database with existing records

**COMMAND RUN**:
python manage.py loaddata datadump.json

⚠️**WHAT COULD BREAK**:
- Foreign key constraint violations (if tables empty)
- Duplicate primary keys
- Content type issues

🔧**WHAT I FIXED (Learned)**:
- Schema permissions → Always grant public schema access
- Windows encoding → Use -o flag, never >
- Service names → PostgreSQL uses postgresql-x64-18
- User prompts → => = normal user (good), # = superuser

---

## 2.7: Verify Data Migration
**WHAT**: Verifying data was transferred correctly
**WHY**: Ensure no data loss

**COMMANDS RUN**:
python manage.py shell


---


# Phase 3: Deploy Backend to Render

## 3.1: Push Latest Code to GitHub
**WHAT**: Pushing production-ready code to GitHub
**WHY**: Render needs to pull our code from a Git repository

**COMMANDS RUN**:
git status
git add .
git commit -m "feat: prepare backend for production deployment"
git push origin main

**VERIFICATION**:
✅ All files committed
✅ Push successful
✅ GitHub repo updated at: https://github.com/Divyanshu1105/ecommerce-platform

---

## 3.2: Connect GitHub Repository to Render

**WHAT**: Connecting the backend repository to the hosting platform.**
**WHY**: Render automatically deploys code from GitHub and redeploys when new commits are pushed.

**ACTION**:
 1. Go to Render Dashboard
 2. Click New → Web Service
 3. Connect GitHub account
 4. Select repository:
    - ecommerce-platform

Important configuration (because this project uses a monorepo):
Root Directory: ecommerce-backend

This ensures Render runs commands from the backend folder instead of the repository root.

⚠️ **WHAT COULD BREAK**

- Selecting wrong repository
- Forgetting to set Root Directory
- Render attempting to deploy frontend instead of backend

---

## 3.3 Configure Runtime Environment

**WHAT**: Setting the runtime language.
**WHY**: Render defaults to Node.js, but Django requires Python.

**SETTING**:
```python
Language: Python 3
```

⚠️ **WHAT COULD BREAK**
- Leaving runtime as Node
- Build failing due to incorrect environment

---

## 3.4 Configure Build and Start Commands

**WHAT**: Defining commands used to prepare and run the Django application.
**WHY**: Render needs instructions to install dependencies, apply migrations, and start the server.

**OPTION 1** (recommended): Using build.sh
Create a file:
```python
ecommerce-backend/build.sh
```

**CONTENT**:
```bash
#!/usr/bin/env bash

set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

**START COMMAND**:
```python
gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
```

⚠️ **WHAT COULD BREAK**
- Missing requirements.txt
- gunicorn not installed
- Static files not collected

---

## 3.5 Make build.sh Executable

**WHAT**: Ensuring the build script can run in Linux environments.
**WHY**: Render servers run Linux and require executable permissions.

**COMMANDS**:
```bash
git add build.sh
git update-index --chmod=+x build.sh
git commit -m "make build script executable"
git push
```

⚠️ **WHAT COULD BREAK**
- Running command in wrong directory
- Windows CRLF line ending warnings (safe to ignore)

Example warning encountered:
 - LF will be replaced by CRLF the next time Git touches it

This **does not** affect deployment.

---

## 3.6 Configure Environment Variables on Render

**WHAT**: Setting secret configuration values securely.
**WHY**: `.env` files are intentionally excluded from GitHub.

Environment variables must be added manually in Render.

**Variables added**
```python
SECRET_KEY=<django-secret-key>
DEBUG=False
ALLOWED_HOSTS=.onrender.com,localhost
DATABASE_URL=<postgresql-connection-url>
```

⚠️ **WHAT COULD BREAK**
- Missing SECRET_KEY
- Incorrect DATABASE_URL
- DEBUG accidentally set to True

---

## 3.7 Deploy the Backend Service

After configuration, Render automatically builds and deploys the service.

Successful deployment message:
```python
Your service is live 🎉
```

Backend URL generated by Render:
```python
https://ecommerce-backend-api-kur9.onrender.com
```

**Note**: Render automatically appends a unique identifier (`kur9`) to avoid naming conflicts.

---

## 3.8 Verify Deployment

Test Admin Panel
```python
https://ecommerce-backend-api-kur9.onrender.com/admin
```

Expected result:
```python
Django Admin Login Page
```

Test API Endpoint
```python
https://ecommerce-backend-api-kur9.onrender.com/api/products/
```

Expected result:
```python
HTTP 200 OK
[]
```


**Empty response means**:
- API works correctly
- Database currently contains no products

--- 

## 3.9 Render Free Tier Limitation

**WHAT**: Attempted to open Render shell.

RESULT
```python
Shell is not supported for free instance types.
```

**WHY**: Render disables terminal access on the free tier.

⚠️ **IMPACT**

Cannot run commands such as:
```python
python manage.py createsuperuser
```

directly on the server.

---

## 3.10 Workaround: Creating Superuser via Build Command

Since shell access is unavailable, a temporary workaround is used.

**Modify the build command to run**:
``python
python manage.py createsuperuser --noinput
```

Environment variables used:
```python
DJANGO_SUPERUSER_USERNAME
DJANGO_SUPERUSER_EMAIL
DJANGO_SUPERUSER_PASSWORD
```

This allows automatic superuser creation during deployment.

⚠️ **IMPORTANT**
Remove these variables after the superuser is created to prevent duplication.

--- 

## Deployment Result

Backend successfully deployed with:
- Django REST API
- PostgreSQL database
- Static files via WhiteNoise
- Gunicorn production server
- Environment variable security

API is now accessible at:
```python
https://ecommerce-backend-api-kur9.onrender.com
```
---

# Phase 4: Deploy Frontend to Vercel

## 4.1: Prepare Frontend for Production
**WHAT**: Ensuring frontend is production-ready
**WHY**: Need to fix any hardcoded values and optimize build

**FILES TO CHECK**:
- ecommerce-project/.env (API URL should point to Render)
- ecommerce-project/vite.config.ts (build settings)
- ecommerce-project/src/services/api.ts (base URL configuration)

---

## 4.2: Test Production Build Locally
**WHAT**: Testing production build locally before deployment
**WHY**: Catch any build errors early

**COMMAND RUN**:
```python
npm run build
```

**EXPECTED OUTPUT**:
dist/ directory created with optimized files
✓ Built in 5.32s

⚠️**WHAT COULD BREAK**:
- TypeScript errors
- Missing dependencies
- Environment variable issues
- Large bundle size warnings


---

## Table of Contents

- [Project Structure](#project-structure)
- [Issue 1 — Products Not Loading (API Timeout)](#issue-1--products-not-loading-api-timeout)
- [Issue 2 — CORS Policy Blocking Requests](#issue-2--cors-policy-blocking-requests)
- [Issue 3 — Empty Database on Render](#issue-3--empty-database-on-render)
- [Issue 4 — Duplicate /api/api/ in Cart URLs](#issue-4--duplicate-apiapi-in-cart-urls)
- [Issue 5 — Vercel Build Failing (vite not found)](#issue-5--vercel-build-failing-vite-not-found)
- [Issue 6 — Local Server HTTPS Error](#issue-6--local-server-https-error)
- [Final Configuration Reference](#final-configuration-reference)
- [Key Lessons Learned](#key-lessons-learned)

---

## Project Structure

```
ecommerce-platform/
├── ecommerce-backend/       ← Django REST API (Render)
│   ├── manage.py
│   ├── core/settings.py
│   ├── datadump.json
│   └── requirements.txt
└── ecommerce-project/       ← React Frontend (Vercel)
    ├── src/
    │   ├── api/axiosConfig.ts
    │   ├── services/
    │   └── pages/
    ├── .env.development
    ├── .env.production
    └── package.json
```

---

## Issue 1 — Products Not Loading (API Timeout)

### What Happened

After deploying both ends, products were not loading on the live site. The browser console showed:

```
[API Response Error]
Object { status: undefined, statusText: undefined, data: undefined,
url: '/products/', baseURL: 'https://ecommerce-backend-api-kur9.onrender.com/api' }

Error fetching products:
AxiosError { message: 'Network error', code: 'ECONNABORTED' }
```

### Root Cause

Render's **free tier spins down inactive services after 15 minutes**. The first request after a cold start takes 30–60 seconds to wake up. Axios was timing out before the server finished waking, producing `ECONNABORTED` with `status: undefined`.

### Fix Applied

**1. Increased Axios timeout** in `src/api/axiosConfig.ts`:

```typescript
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60 seconds to survive Render cold start
});
```

**2. Set up UptimeRobot** to ping the backend every 5 minutes, preventing spin-down:

- Service: [uptimerobot.com](https://uptimerobot.com) (free)
- Monitor Type: HTTP(s)
- URL: `https://ecommerce-backend-api-kur9.onrender.com/api/products/`
- Interval: Every 5 minutes

**3. Added user-friendly error handling** for cold start timeouts:

```typescript
catch (error) {
    if (error.code === 'ECONNABORTED') {
        setError('Server is waking up, please wait 30 seconds and refresh...');
    }
}
```

---

## Issue 2 — CORS Policy Blocking Requests

### What Happened

After fixing the timeout, a new error appeared:

```
Access to XMLHttpRequest at 'https://ecommerce-backend-api-kur9.onrender.com/api/products/'
from origin 'https://ecommerce-project-virid-beta.vercel.app'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

### Root Cause

Three sub-problems caused this:

1. `core/settings.py` had an **old Vercel preview URL** hardcoded in `CORS_ALLOWED_ORIGINS`. Preview URLs change with every deployment.
2. The **production domain** (`ecommerce-project-virid-beta.vercel.app`) was never added to CORS allowed origins on Render.
3. Vercel generates two types of URLs — **deployment URLs** (temporary, change every deploy) and **production domain** (stable, always the same). Only the production domain should be used in CORS config.

### Vercel URL Types Explained

| Type | Example | Use in CORS? |
|------|---------|--------------|
| Deployment URL | `ecommerce-project-bwhsoip44-xxx.vercel.app` | ❌ Changes every deploy |
| Production Domain | `ecommerce-project-virid-beta.vercel.app` | ✅ Always stable |

### Fix Applied

**Updated `CORS_ALLOWED_ORIGINS` in `core/settings.py`:**

```python
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,https://ecommerce-project-virid-beta.vercel.app"
).split(",")
```

**Updated Render environment variable:**

| Key | Value |
|-----|-------|
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000,https://ecommerce-project-virid-beta.vercel.app` |
| `ALLOWED_HOSTS` | `.onrender.com,localhost` |
| `DEBUG` | `False` |

> ⚠️ **Important:** Always use the production domain in CORS config, never deployment preview URLs.

---

## Issue 3 — Empty Database on Render

### What Happened

After fixing CORS, the API was reachable but returning an empty array:

```
GET https://ecommerce-backend-api-kur9.onrender.com/api/products/
Response: []
```

### Root Cause

Render's PostgreSQL was a **fresh empty database**. Django migrations had created the tables but no data had been loaded into them. The `datadump.json` fixture file existed locally but had never been pushed to the remote database.

### Fix Applied

Connected local Django directly to Render's PostgreSQL using the **External Database URL** from Render's Connect tab, and ran commands locally:

**Step 1 — Run migrations:**
```bash
DATABASE_URL=postgresql://user:pass@dpg-xxx.render.com/dbname python manage.py migrate
```

**Output:**
```
Operations to perform:
  Apply all migrations: admin, auth, cart, contenttypes, delivery, orders, products, sessions
Running migrations:
  No migrations to apply.
```

**Step 2 — Load fixture data:**
```bash
DATABASE_URL=postgresql://user:pass@dpg-xxx.render.com/dbname python manage.py loaddata datadump.json
```

**Output:**
```
Installed 131 object(s) from 1 fixture(s)
```

**Step 3 — Verify data loaded:**
```bash
DATABASE_URL=postgresql://user:pass@dpg-xxx.render.com/dbname python manage.py shell -c \
"from products.models import Product; print('Products:', Product.objects.count())"
```

**Output:**
```
Products: 48
```

> 💡 **Note:** This method works without Render Shell access (which is not available on the free tier). By passing `DATABASE_URL` as a prefix to any Django management command, you can point your local Django instance directly at the remote database.

---

## Issue 4 — Duplicate /api/api/ in Cart URLs

### What Happened

After products loaded successfully, adding items to cart failed:

```
POST https://ecommerce-backend-api-kur9.onrender.com/api/api/cart-items/ 404 (Not Found)

Failed to add to cart:
AxiosError { message: 'Request failed with status code 404', code: 'ERR_BAD_REQUEST' }
```

### Root Cause

The `VITE_API_BASE_URL` environment variable was **not set on Vercel**. Since Vercel never reads local `.env` files during build, the variable was `undefined` in production, causing the axios instance to fall back to `http://localhost:8000/api`.

The Vite dev server has a **proxy configuration** in `vite.config.ts` that forwards `/api/*` requests to Django locally:

```typescript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
        },
    }
}
```

This proxy **only works locally** — it doesn't exist on Vercel. Without the correct `VITE_API_BASE_URL`, requests in production were constructing wrong URLs.

### Fix Applied

Added `VITE_API_BASE_URL` to **Vercel environment variables**:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_BASE_URL` | `https://ecommerce-backend-api-kur9.onrender.com/api` | Production |

> ⚠️ **Important:** Vite environment variables (`VITE_*`) must be explicitly added to Vercel's dashboard. Local `.env.production` files are **not read** by Vercel during build.

---

## Issue 5 — Vercel Build Failing (vite not found)

### What Happened

After adding the environment variable, Vercel builds kept failing:

```
sh: line 1: vite: command not found
Error: Command "vite build" exited with 127
```

### Root Cause

Two problems combined:

1. `vite`, `typescript`, and `@vitejs/plugin-react` were all in `devDependencies` in `package.json`. Vercel skips installing `devDependencies` in production builds, so the build tools were unavailable.

2. Vercel's **Root Directory** was set to `./` (repo root) instead of `ecommerce-project/` (where `package.json` actually lives), causing `npm error: Could not read package.json`.

### Fix 1 — Moved build tools to `dependencies` in `package.json`

```json
"dependencies": {
    "@vitejs/plugin-react": "^4.4.1",
    "typescript": "~5.8.3",
    "vite": "^6.3.5",
    ...
}
```

### Fix 2 — Set Root Directory on Vercel

**Vercel Dashboard → Project → Settings → Build and Deployment → Root Directory:**

```
ecommerce-project
```

### Fix 3 — Set Install Command on Vercel

**Vercel Dashboard → Project → Settings → Build and Deployment → Install Command:**

```
npm install
```

### Fix 4 — Cleared Vercel Build Cache

**Vercel Dashboard → Deployments → latest → `...` → Redeploy → uncheck "Use existing build cache" → Redeploy**

> 💡 **Why moving to `dependencies` is safe:** Locally, `npm install` always installs both `dependencies` and `devDependencies`, so nothing changes locally. The only difference is that Vercel's production build can now find these tools.

---

## Issue 6 — Local Server HTTPS Error

### What Happened

While testing locally, the terminal and console showed:

```
You're accessing the development server over HTTPS, but it only supports HTTP.

GET https://localhost:8000/api/products/ net::ERR_SSL_PROTOCOL_ERROR
```

### Root Cause

The browser had cached an **HSTS (HTTP Strict Transport Security)** rule for localhost, forcing all requests to HTTPS even though Django dev server only supports HTTP.

### Fix Applied

**Cleared HSTS cache in Chrome:**

1. Go to `chrome://net-internals/#hsts`
2. Under "Delete domain security policies" → type `localhost` → click **Delete**
3. Go to `chrome://net-internals/#sockets` → click **Flush socket pools**
4. Restart Chrome

---

## Final Configuration Reference

### Render Environment Variables

| Key | Value |
|-----|-------|
| `DATABASE_URL` | PostgreSQL External Database URL from Render |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000,https://ecommerce-project-virid-beta.vercel.app` |
| `ALLOWED_HOSTS` | `.onrender.com,localhost` |
| `DEBUG` | `False` |
| `SECRET_KEY` | Your Django secret key |

### Vercel Environment Variables

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_BASE_URL` | `https://ecommerce-backend-api-kur9.onrender.com/api` | Production |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Production |
| `NPM_CONFIG_PRODUCTION` | `false` | Production |

### Vercel Build Settings

| Setting | Value |
|---------|-------|
| Root Directory | `ecommerce-project` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Frontend Environment Files

**`.env.development`:**
```
VITE_API_BASE_URL=http://localhost:8000/api
```

**`.env.production`:**
```
VITE_API_BASE_URL=https://ecommerce-backend-api-kur9.onrender.com/api
```

---

## Key Lessons Learned

### 1. Render Free Tier Spins Down
Render free tier services sleep after 15 minutes of inactivity. Always use UptimeRobot or a similar service to keep the backend alive, and set Axios timeout to at least 60 seconds.

### 2. Always Use Production Domain in CORS
Vercel deployment URLs change with every deploy. Always use the stable **production domain** in `CORS_ALLOWED_ORIGINS`, never the preview/deployment URL.

### 3. Vite Proxy Only Works Locally
`vite.config.ts` proxy settings forward requests locally but **do not exist on Vercel**. All API calls must use the configured Axios instance with `VITE_API_BASE_URL`, never raw relative paths.

### 4. Vercel Never Reads Local `.env` Files
Always add `VITE_*` environment variables explicitly in the **Vercel Dashboard**. Local `.env.production` files are not read during Vercel's build process.

### 5. Load Data Remotely Without Shell Access
On Render free tier (no shell access), you can load data into the remote PostgreSQL database by prefixing Django management commands with `DATABASE_URL=<external_url>` from your local machine.

### 6. Build Tools Must Be in `dependencies` for Vercel
`vite`, `typescript`, and framework plugins must be in `dependencies` (not `devDependencies`) for Vercel to install them during production builds.

### 7. Set Root Directory for Monorepos on Vercel
In a monorepo, always set the **Root Directory** in Vercel's build settings to point to the frontend subfolder where `package.json` lives.

---

# Phase 5: Connect, Test & Optimize Live Application
| **What**                     | **Why It's Critical**                                                                 |
|--------------------------|-----------------------------------------------------------------------------------|
| End-to-End Testing       | Walk through the full user journey and catch real bugs                            |
| Performance Optimization | Improve load times, Core Web Vitals, Google ranking                               |
| Error Monitoring         | Set up alerting so you know when things break in production                       |
| Analytics                | Understand how users interact with the site                                       |
| Resume Integration       | Document and present the project effectively                                      |
|--------------------------|-----------------------------|

## 5.1: Complete End-to-End Testing
**WHAT**: Testing entire user journey on live site
**WHY**: Ensure real users have smooth experience

**TEST URL**: https://ecommerce-project-virid-beta.vercel.app
**BACKEND**: https://ecommerce-backend-api-kur9.onrender.com
**TEST CREDENTIALS**:
Test User: (create fresh account)
Stripe Test Card: 4242 4242 4242 4242**

## Test Checklist
**Run through EVERY feature and check** ✅:
```
🔐 AUTHENTICATION FLOW
✅ Can register new account
✅ Can login with credentials
✅ JWT persists after page refresh
✅ Logout works correctly
✅ Protected routes redirect to login

🏠 HOME PAGE
✅ Products load from API
✅ Search functionality works
✅ Product images display
✅ Loading states show properly
✅ Error states handled gracefully

🛒 CART FUNCTIONALITY
✅ Add product to cart
✅ Update quantity
✅ Remove item from cart
✅ Cart total updates correctly
✅ Delivery options affect total
✅ Cart persists after login

💳 CHECKOUT & PAYMENT
✅ Payment summary calculates correctly
✅ Stripe Elements loads
✅ Test payment succeeds (4242)
✅ Order created after payment
✅ Cart clears after order
✅ Redirect to orders page

📦 ORDERS PAGE
✅ Orders list displays
✅ Order details correct
✅ Empty state shows properly
✅ Track order link works

📍 TRACKING PAGE
✅ Order tracking loads
✅ Progress bar updates
✅ Estimated delivery shows
✅ Back to orders link works

👤 PROFILE PAGE
✅ User info displays
✅ Tabs navigate correctly
✅ Logout from profile works

📱 RESPONSIVE DESIGN
✅ Mobile view (375px) - all features accessible
✅ Tablet view (768px) - layout adjusts
✅ Desktop view (1440px) - optimal spacing

🌐 CROSS-BROWSER
✅ Chrome works
🔄 Firefox works
🔄 Edge works
```