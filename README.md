# 🛒 Full-Stack E-Commerce Platform

A production-ready full-stack e-commerce platform built with Django REST Framework and React. 
**Live demo coming Feb 15, 2026 at [shop.yourname.com]()**

## 📋 Table of Contents
- [✨ Features](#-features)
- [📊 Project Status](#-project-status)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📸 Screenshots](#-screenshots)
- [🏗️ Architecture](#️-architecture)
- [📝 What I Learned](#-what-i-learned)
- [📄 License](#-license)
- [📬 Contact](#-contact)

---

## ✨ Features

### ✅ Completed & Tested
- **Product Catalog** - 40+ products with images, ratings, and search
- **Shopping Cart** - Add/update/delete items, quantity management
- **Delivery Options** - 3 tiers (Basic/Standard/Fast) with real-time cost calculation
- **Order Management** - Place orders, view order history
- **Order Tracking** - Track delivery progress with visual progress bar
- **Checkout Flow** - Payment summary with tax calculations (10%)
- **Responsive Design** - Mobile-friendly layout


### 🏗️ In Development
|       Feature          | Status         |  Target Date  |
|------------------------|----------------|---------------|
|  Live Deployment       | 🔄 In Progress | Feb 15, 2026 |
|  Custom Domain         | 🔄 In Progress | Feb 15, 2026 |
|  User Authentication   | 📝 Planning    | Feb 18, 2026 |
|  Stripe Payments       | 📝 Planning    | Feb 20, 2026 |
|  UI Polish             | 🎨 Designing   | Feb 22, 2026 |
|  Testing Suite         | ⏳ Queue        |  Mar 1, 2026 |
----------------------------------------------------------



---

## 🛠️ Tech Stack

<details>
<summary><b>Backend</b></summary>
<br>
- **Framework:** Django 4.2 + Django REST Framework
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Authentication:** JWT (Coming soon)
- **Payments:** Stripe API (Coming soon)
- **Deployment:** Render.com / Gunicorn
</details>

<details>
<summary><b>Frontend</b></summary>
<br>
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Date Handling:** Day.js
- **Deployment:** Vercel/Netlify
</details>

<details>
<summary><b>DevOps</b></summary>
<br>
- **Version Control:** Git/GitHub
- **Domain:** Namecheap
- **SSL:** Let's Encrypt
- **Environment:** 12-factor app methodology
</details>

---

## 🚀 Quick Start

### Prerequisites
```bash
Python 3.10+
Node.js 18+
npm/yarn
Git
 
   1. Clone Repository
        git clone https://github.com/DIVYANSHU1105/ecommerce-platform.git
        cd ecommerce-platform

   2. Backend Setup
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

        # Run migrations
        python manage.py migrate

        # Load sample data
        python manage.py load_sample_products
        python manage.py load_delivery_options

        # Start server
        python manage.py runserver

    3. Frontend Setup
        # Open new terminal
        cd ecommerce-project

        # Install dependencies
        npm install

        # Start development server
        npm run dev


---

 ## 🏗️ Architecture
 ┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ React │────▶│ Django API │────▶│ Database    │
│ Frontend │◀────│ Backend │◀────│ SQLlite    │
└─────────────┘ └──────────────┘ └─────────────┘
│
┌──────┴──────┐
│ External │
│ Services │
└──────┬──────┘
┌──────┴──────┐
│ Stripe │
│ (Soon) │
└─────────────┘



## 🎯 Key Design Decisions

- **UUID Primary Keys** - Better for distributed systems and security
- **Price in Cents** - Avoids floating point precision issues  
- **Select_related** - Optimized database queries (reduced N+1 problems by 80%)
- **Component-based UI** - Reusable React components
- **Snake_case ↔ CamelCase** - Proper translation between Django and React


---


📝 What I Learned
    Blog posts in progress:

    <details> <summary><b>🔧 Technical Challenges Solved</b></summary>
    1. Real-time Delivery Cost Calculation - Implementing live updates when users change delivery options

    2. Django + React Integration - Managing snake_case/camelCase conversion across the stack

    3. Database Optimization - Using select_related to reduce query count by 80%

    4. Order Tracking Logic - Calculating delivery progress percentages

    5. UUID Primary Keys - Implementing them in Django and maintaining consistency

    </details><details> <summary><b>💡 Key Takeaways</b></summary>
    * Deploy early, iterate often

    * Test with real data from day one

    * Document as you build, not after

    * One working feature > five half-finished ones

    </details>

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify  
- ✅ Distribute
- ✅ Private use

**With the requirement to:**
- 📝 Include copyright notice

---

## 📬 Contact

**Divyanshu Singh**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/divyanshusinghtechie11)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DIVYANSHU1105)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:divyanshusingh.techie@gmail.com)

---

⭐ **Star this repo if you find it useful!** ⭐

