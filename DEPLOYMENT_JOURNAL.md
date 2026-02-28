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