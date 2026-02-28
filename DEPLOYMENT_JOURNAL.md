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