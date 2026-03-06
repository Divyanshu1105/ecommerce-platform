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

