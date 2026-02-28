WHAT: Updating Django settings for production deployment
WHY: Local development settings (DEBUG=True, SQLite, localhost only) are 
     insecure and won't work on a live server

COMMANDS RUN: None yet (code changes first)

FILES CHANGED:
- ecommerce-backend/core/settings.py
- ecommerce-backend/.env (will add new variables)
- ecommerce-backend/requirements.txt (will add new packages)

WHAT COULD BREAK: 
- If ALLOWED_HOSTS is wrong, Django returns "Bad Request (400)"
- If database settings wrong, app won't connect
- Missing environment variables will crash the app


### Create Production Requirements File
WHAT: Creating requirements.txt with all dependencies
WHY: Render needs to know which Python packages to install

COMMAND RUN:
pip freeze > requirements.txt

WHAT COULD BREAK:
- Missing packages → ImportError on server
- Wrong versions → Compatibility issues


### Update Frontend for Production
WHAT: Preparing React frontend for production
WHY: Frontend needs to know production API URL, not localhost

FILES CHANGED:
- ecommerce-frontend/.env (add production variable)
- ecommerce-frontend/src/services/api.ts (will auto-use env var)


### Test Build Locally
WHAT: Testing production build locally
WHY: Catch errors before deploying

COMMAND RUN:
cd ecommerce-frontend
npm run build

WHAT COULD BREAK:
- TypeScript errors
- Missing dependencies
- Environment variable issues