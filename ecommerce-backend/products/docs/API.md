🛍️ E-commerce Products API Documentation 🚀
Project Overview
Project Name: E-commerce Backend API
Description: RESTful API for managing e-commerce products with ratings, pricing, and keywords.
Backend: Django 4.x + Django REST Framework
Frontend: React application
Status: Development 



Development: http://localhost:8000/api/
Production: https://your-domain.com/api/ (Update when deployed)

📤 Sample Product Structure:
    {
    "id": "10ed8504-57db-433c-b0a3-fc71a35c88a1",
    "image": "images/products/athletic-skateboard-shoes-gray.jpg",
    "name": "Athletic Skateboard Shoes - Gray",
    "rating": {
        "stars": 4,
        "count": 89
    },
    "priceCents": 3390,
    "keywords": ["shoes", "running shoes", "footwear"]
    }


🚀 Quick Start Guide

1. First, Start Your Server
    Open terminal and run:
        cd ecommerce-backend
        python manage.py runserver
    ✅ You should see: Starting development server at http://127.0.0.1:8000/

2. Test Your API - Quick Commands
    Check if API is working:
        curl http://localhost:8000/api/products/

    Add a sample product:
        curl -X POST http://localhost:8000/api/products/ \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Wireless Headphones",
            "image": "images/products/headphones.jpg",
            "price_cents": 7999,
            "rating_stars": 4.5,
            "rating_count": 120,
            "keywords": ["electronics", "audio", "wireless"]
        }'
    
    Get all products (format nicely):
        curl -s http://localhost:8000/api/products/ | python -m json.tool

3. Frontend Test - JavaScript Code
    Add to your React component:
        // Test API connection
        useEffect(() => {
        fetch('http://localhost:8000/api/products/')
            .then(response => response.json())
            .then(data => console.log('Products:', data))
            .catch(error => console.error('Error:', error));
        }, []);

4. Common Fixes - If Something Breaks
    If CORS error appears:
        # settings.py - Add these lines
    INSTALLED_APPS = [
        'corsheaders',  # Add this
        # ... other apps
    ]

    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware',  # Add this FIRST
        # ... other middleware
    ]

    CORS_ALLOW_ALL_ORIGINS = True  # Add at bottom


    If no data shows:
    # Add sample data
    python manage.py shell

    # In shell, paste:
    from products.models import Product
    Product.objects.create(
        name="Wireless Mouse",
        image="/images/mouse.jpg",
        price_cents=1999,
        keywords=["electronics", "computer"]
    )

5. API Endpoints Quick Reference
    
    What to do	        URL	                                           Method
    See all products	http://localhost:8000/api/                     products/GET
    Add new product	    http://localhost:8000/api/products/	           POST
    Update product	    http://localhost:8000/api/products/ID-HERE/	   PUT
    Delete product	    http://localhost:8000/api/products/ID-HERE/	   DELETE


6. Test in Browser
    Just open: http://localhost:8000/api/products/

    You should see JSON data!



Troubleshooting:
        Need help? Run these checks:
        # Check server
        curl -I http://localhost:8000/api/products/

        # Check database
        python manage.py shell -c "from products.models import Product; print(Product.objects.count())"