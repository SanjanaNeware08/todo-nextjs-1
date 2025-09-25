# 📝 Todo Application  

The site is live here: https://todo-nextjs-1-xguh.onrender.com
 

A modern full-stack **Task Management Platform** with authentication, task CRUD, and a clean UI. Built with **Next.js (App Router)**, **Node.js/Express**, and **MongoDB**. 🚀  

---

## ✨ Features  

- 🔐 **Auth**: Register, Login, JWT-based authentication  
- ✅ **Tasks**: Create, Delete, Mark complete/in-progress  
- 📅 **Dashboard**: View Today’s Tasks & Upcoming Tasks  
- 👤 **Profile**: Update username, email, password, profile picture  
- ❌ **Delete Account** option  
- ⚡ **API v1**: REST endpoints with validation  
- 🎨 **UI**: Responsive and modern layout with Material UI  

---

## 🧰 Tech Stack  

- 🌐 **Frontend**: Next.js 14 (App Router), React, Material UI  
- 🗄️ **Backend**: Express.js, Node.js, MongoDB (Mongoose)  
- 🔒 **Security**: JWT, bcrypt, Cookies for token storage  
- 🧪 **Linting**: ESLint  

---

## 📦 Monorepo Structure  

Todo Application/
├─ frontend/ # Next.js app (App Router)
│ └─ src/
│ ├─ app/ # Routes, layouts, pages
│ ├─ components/ # UI components + forms
│ ├─ utils/ # API client, helpers
└─ backend/ # Express API
├─ src/
│ ├─ routes/ # Routes (tasks, users, auth)
│ ├─ controllers/ # Controller logic
│ ├─ models/ # Mongoose schemas
│ ├─ middleware/ # Auth, error handling
│ └─ config/ # Mongo connection, env

yaml
Copy code

---

## 🚀 Getting Started  

### 1) Prerequisites  
- Node.js 18+  
- MongoDB (local or Atlas cluster)  

### 2) Clone & Install  

```bash
# Clone
git clone https://github.com/SanjanaNeware08/todo-nextjs-1.git
cd todo-nextjs-1

# Install frontend and backend
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
3) Environment Variables
Create .env files in both frontend and backend folders.

Frontend .env.local

bash
Copy code
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
Backend .env

ini
Copy code
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/todo
JWT_SECRET=super-secret-jwt
PORT=4000
4) Run Dev Servers
bash
Copy code
# Backend
cd backend
npm run dev

# Frontend (in a second terminal)
cd frontend
npm run dev
Frontend: 👉 http://localhost:3000
Backend: 👉 http://localhost:4000

📜 Available Scripts
Frontend
npm run dev – Start Next.js dev server

npm run build – Build for production

npm run start – Start production server

Backend
npm run dev – Start Express server (nodemon)

npm run start – Start production server

🔌 API Overview (v1)
Auth
POST /api/users/register – Register

POST /api/users/login – Login

GET /api/users/:id – Get user details

PATCH /api/users/:id – Update user

DELETE /api/users/:id – Delete account

Tasks
POST /api/tasks – Create task

GET /api/tasks – Get all tasks (by user)

GET /api/tasks/:id – Get single task

PUT /api/tasks/:id – Update task

DELETE /api/tasks/:id – Delete task

All responses follow:

json
Copy code
{
  "success": true,
  "data": {}
}
🧭 UI Highlights
Sidebar navigation

Dashboard showing Today’s + Upcoming tasks

Profile page with inline editing ✍️

Responsive for mobile & desktop

🤝 Contributing
Fork the repo 🍴

Create a feature branch: git checkout -b feat/awesome

Commit changes: git commit -m "feat: add awesome thing"

Push and open a PR 🚀
