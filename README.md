# 🏢 Employee Management System

A full-stack Employee Management System built with **React 19** (Vite) on the frontend and **ASP.NET Core 10** on the backend. This application provides comprehensive employee, department, and leave management capabilities with role-based access control and a modern UI.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token management
- Role-based access control (**Admin** / **Employee**)
- Protected routes with automatic redirect to login
- Profile management with avatar upload

### 👥 Employee Management
- **Full CRUD** — Create, read, update, and delete employees
- **Search & pagination** — Search by name, email, or phone with paginated results
- **Department assignment** — Assign employees to departments via dropdown
- **User accounts** — Auto-created when adding an employee

### 🏢 Department Management
- Create, edit, delete departments
- Real-time search filtering
- Employee distribution overview on dashboard

### 📋 Leave Management
- Apply for leaves with multiple types (Sick, Vacation, Personal, etc.)
- Admin approval/rejection workflow with comments
- Status tracking: **Pending** → **Approved** / **Rejected**
- Employee-specific view ("My Leaves") and admin-wide view

### 📊 Dashboard & Analytics
- **Admin Dashboard** — Total salary, employee count, department distribution, on-leave today, recent activity
- **Employee Dashboard** — Tasks completed, pending tasks, leaves available, upcoming reviews
- Department distribution visualization
- Quick actions for leave, reports, and training

### 🎨 UI/UX
- **Responsive design** — Optimized for desktop and tablet
- **Dark/Light mode** with system theme support (remembers preference)
- **shadcn/ui** components + Tailwind CSS v4
- Loading states, skeleton screens, toast notifications
- Animated transitions and hover effects

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI Library |
| **Vite 6** | Build tool with HMR |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **React Hook Form** | Form state management |
| **React Hot Toast** | Toast notifications |
| **date-fns** | Date formatting |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |
| **Zod** | Schema validation |

### Backend

| Technology | Purpose |
|-----------|---------|
| **ASP.NET Core 10** | Web API framework |
| **Entity Framework Core 10** | ORM with migrations |
| **SQLite** | Zero-install file-based database |
| **JWT Bearer** | Token authentication |
| **Scalar** | OpenAPI documentation UI |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (LTS recommended)
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Visual Studio 2022+](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/EmployeeManagementSystem.git
cd EmployeeManagementSystem
```

#### 2. Start the Backend (Terminal 1)

No database setup needed — **SQLite** auto-creates the database file on first run.

```bash
cd server
dotnet restore
dotnet run
```

The API starts at **`http://localhost:5203`**. OpenAPI docs available at `/scalar/v1`.

> The Vite dev server proxies all `/api` requests to this backend automatically.

#### 3. Start the Frontend (Terminal 2)

```bash
cd client
npm install
npm run dev
```

The app opens at **`http://localhost:5173`**.

### 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | 123123 |
| **Employee** | emp1@test.com | 123123 |

---

## 📁 Project Structure

```
EmployeeManagementSystem/
├── client/                              # React + Vite frontend
│   ├── public/                          # Static assets (favicon)
│   ├── src/
│   │   ├── assets/                      # Images, SVGs
│   │   ├── components/
│   │   │   ├── ui/                      # shadcn/ui primitives
│   │   │   ├── layout/                  # AppSidebar, ModeToggle
│   │   │   └── shared/                  # EmployeeTaskList
│   │   ├── config/                      # App constants, API endpoints
│   │   ├── contexts/                    # AuthContext, ThemeContext
│   │   ├── features/                    # Feature-based modules
│   │   │   ├── auth/                    # Login page
│   │   │   ├── dashboard/               # Admin + Employee dashboards
│   │   │   ├── departments/             # Department CRUD
│   │   │   ├── employees/               # Employee CRUD + form
│   │   │   ├── leaves/                  # Leave management
│   │   │   ├── profile/                 # User profile
│   │   │   └── settings/                # App settings
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── layouts/                     # DashboardLayout
│   │   ├── lib/                         # Third-party lib config
│   │   ├── routes/                      # Route definitions
│   │   ├── services/                    # API client (Axios)
│   │   └── styles/                      # Global CSS
│   ├── .env.example                     # Environment template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                   # Proxy: /api → localhost:5203
├── server/                              # ASP.NET Core 10 backend
│   ├── Controllers/                     # Auth, Department, Employee, Leave
│   ├── Data/                            # DbContext, Repositories, Seed
│   ├── DTOs/                            # Request/response models
│   ├── Extensions/                      # Service registration extensions
│   ├── Helpers/                         # Password hashing utilities
│   ├── Middleware/                      # Exception handling
│   ├── Migrations/                      # EF Core SQLite migrations
│   ├── Models/                          # Domain entities
│   ├── Properties/                      # Launch profiles
│   ├── Validators/                      # Input validation
│   ├── Program.cs                       # App entry point
│   ├── appsettings.json                 # Configuration
│   └── server.csproj                    # Project file
├── .gitignore
└── README.md
```

---

## 🧪 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/Auth/login` | No | Login with email + password |
| GET | `/api/Auth/user-profile` | Yes | Get current user profile |
| PUT | `/api/Auth/profile-update` | Yes | Update name, email, phone, avatar |

### Employees (Admin required for write operations)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/Employee?search=&pageIndex=0&pageSize=10` | Admin | List employees with pagination |
| GET | `/api/Employee/{id}` | Yes | Get single employee details |
| POST | `/api/Employee` | Admin | Create employee (auto-creates user) |
| PUT | `/api/Employee/{id}` | Admin | Update employee |
| DELETE | `/api/Employee/{id}` | Admin | Delete employee |

### Departments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/Department` | Yes | List all departments |
| POST | `/api/Department` | Admin | Create department |
| PUT | `/api/Department/{id}` | Admin | Update department |
| DELETE | `/api/Department/{id}` | Admin | Delete department |

### Leaves

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/leave` | Admin | View all leave requests |
| GET | `/api/leave/my` | Employee | View own leave requests |
| GET | `/api/leave/types` | Yes | List available leave types |
| POST | `/api/leave` | Yes | Apply for leave |
| PUT | `/api/leave/{id}/status` | Admin | Approve or reject leave |

---

## 🔒 Security

- **Passwords** — Hashed with SHA256 before storage
- **Authentication** — JWT tokens with 7-day expiry
- **Authorization** — Role-based (`Admin` / `Employee`) on all endpoints
- **API Security** — CORS restricted to frontend origin
- **Input Validation** — Both client-side (React Hook Form) and server-side (data annotations)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Scalar](https://scalar.com/) for the API documentation UI

---

**Built with ❤️ using React + ASP.NET Core**
