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

⚠️ **WHAT COULD BREAK*

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