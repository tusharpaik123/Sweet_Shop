# Sweet_Shop 🍬

A **Sweet Shop Management System** — a modern web application to manage items, orders, and inventory of a sweet shop.

---



---

## About

Sweet_Shop is a full-stack application built to help sweet shop owners manage products, orders, and inventory from a single dashboard. It provides CRUD operations for items, handles user roles (admin, staff), and ensures real-time updates for stock and orders.

---

## Features

- Add, update, delete, and view sweets/products  
- Inventory/stock management  
- Order placement and tracking  
- Role-based access control (admin)  
- Responsive user interface  
- Search and filter items  
- Dashboard 

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React |
| Backend | Node.js / Express|
| Database | MongoDB |


>

---

## Folder Structure
~~~
Sweet_Shop/
├── client/ # Frontend application
│ ├── src/
│ ├── public/
│ └── ...
├── server/ # Backend server
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── ...
├── README.md
└── package.json / other config files
~~~


---

## Setup & Installation

### Prerequisites

- Node.js (v14+ recommended)  
- NPM / Yarn  
- A database server (MongoDB / MySQL / etc.)  
- (Optional) Git  

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/tusharpaik123/Sweet_Shop.git
   cd Sweet_Shop
Setup backend

bash
Copy code
cd server
npm install
Configure your database connection in .env (e.g. DB_URI, credentials).

Setup frontend

bash
Copy code
cd ../client
npm install
Adjust API base URLs in your client config.

Run development servers
In two separate terminals:

bash
Copy code
# Backend
cd server
npm run dev

# Frontend
cd client
npm start
Access the app
Open your browser and go to http://localhost:3000 (or whatever port you set).

Usage
Login as Admin to add/edit/delete sweets and manage users

Staff users can view items, place orders, and see inventory

The dashboard shows stock levels, recent orders, and alerts for low stock

Use search/filter to quickly find items

Tip: Use seed data or sample users for easy testing.

Contributing
Contributions are welcome! Here’s how you can help:

Fork the repository

Create a new branch: git checkout -b feature/YourFeature

Make your changes and commit: git commit -m "Add something"

Push to your branch: git push origin feature/YourFeature

Open a Pull Request describing your changes

Please ensure your code follows the existing style and includes tests (if applicable).

License
This project is licensed under the MIT License (or whichever license you choose).
See the LICENSE file for details.

Contact
Author: Tushar Paik

GitHub: tusharpaik123
