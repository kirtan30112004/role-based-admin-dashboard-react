# 🛡️ AdminHub — Role-Based Admin Dashboard

A production-quality, fully responsive **Role-Based Access Control (RBAC) Admin Dashboard** built with React 19, Vite, and Tailwind CSS. The application supports three user roles — **Administrator**, **HR Manager**, and **Employee** — each with its own protected routes, navigation, and feature set. All data is persisted in `localStorage` with no backend required.

> Built as a portfolio project to demonstrate depth in React architecture, state management, component design, custom hooks, and modern frontend engineering practices.

---

## ✨ Features

### 🔐 Authentication & Access Control
- **Role-based login** with three mock user accounts (Admin, HR, Employee)
- **Session persistence** via `localStorage` with an 8-hour expiry timer
- **Automatic session expiry** with a countdown warning banner (fires 15 minutes before logout)
- **Activity-based session renewal** — throttled `pointerdown` / `keydown` listeners silently extend the session within the warning window
- **Tab-wake re-validation** — `visibilitychange` listener checks if the session expired while the browser tab was in the background
- **One-click session extension** from the warning banner in the Header

### 🚦 Routing & Route Guards
- **Protected routes** with `ProtectedRoute` — redirects unauthenticated users to `/login`, preserving the intended destination in router `state` for post-login redirect
- **Role-enforced routes** — each route declares `allowedRoles`; wrong-role access redirects to `/unauthorized`
- **Public route guard** (`PublicRoute`) — prevents already-authenticated users from viewing the login page
- **Hydration-aware guard** — shows a `LoadingScreen` while the session is being read from `localStorage`, preventing a flash of the login page on refresh
- **14 routes** across three role namespaces (`/admin/*`, `/hr/*`, `/employee/*`) plus shared error pages

### 👥 Employee Management (CRUD)
- **Full CRUD** — Create, Read, Update, Delete employee records
- **Table view & Card (grid) view** — toggle between layouts on the same data
- **Multi-field search** with 250ms debounce (name, email, job title, department)
- **Multi-filter** — department, status, and employment type filters applied simultaneously
- **Pagination** — configurable page size, first/prev/next/last controls, auto-resets to page 1 on filter change
- **Employee detail view** — read-only modal with full profile, emergency contact, and salary display
- **Form validation** — per-field validation on blur, full-form validation on submit, duplicate email detection, phone format check, future-date guard on join date
- **CSV export** — client-side download of the current filtered employee list with a datestamped filename
- **Seed data reset** — restore to the 12-record seed dataset from Settings

### 🏢 Department Management (CRUD)
- **Full CRUD** — Create, Read, Update, Delete department records
- **Headcount tracking** — live employee count per department, derived from `EmployeeContext`
- **Budget tracking** — budget field with formatted currency display
- **Color-coded departments** — consistent colour tokens per department used across charts and UI elements
- **Form validation** — required name, duplicate name detection, positive budget validation

### 📊 Dashboard Analytics & Charts
Six interactive **Recharts** charts, each with custom tooltips and responsive containers:

| Chart | Type | Key Information |
|---|---|---|
| Headcount Trend | ComposedChart (Area + Bar + Line) | 12-month headcount with hires, exits, and plan-vs-actual target line |
| Weekly Attendance | BarChart (stacked) | Present vs. absent per weekday with rate labels and dynamic 90% threshold line |
| Attendance Rate Trend | ComposedChart (Area + Line) | 12-month attendance % with 90% target reference line |
| Department Distribution | PieChart (donut) | Live headcount per department from `DepartmentContext`, with percentage labels |
| Leave Requests | ComposedChart (Area + Line) | Monthly approved / pending / rejected trends |
| Salary Distribution | BarChart (horizontal) | Employee count per pay band |

### 🔍 Search & Pagination
- Debounced live search across all list views
- Generic `usePagination` hook reused across Employees, Users, Leaves, and Departments
- Auto-reset to page 1 when the dataset changes due to filtering

### 📋 Leave Management
- **HR** can review and approve/reject pending leave requests
- **Employees** can submit new leave requests with date validation and track existing ones
- Leave balance summary with used days and pending count

### 🎨 UI / UX
- **Fully responsive** — off-canvas mobile sidebar with backdrop, mobile search drawer, adaptive grid breakpoints (`sm:` `md:` `lg:` `xl:`)
- **Toast notification system** — imperative API (`toast.success/error/info/warning`) with auto-dismiss
- **Skip navigation link** for keyboard and screen-reader accessibility
- **Role-specific navigation** — Sidebar renders only the links relevant to the logged-in role
- **Notification panel** in Header — mark-all-read, per-item dismiss, unread badge
- **Session warning banner** — amber-coloured alert with live countdown and extend button
- **Loading skeletons** — shimmer placeholders in `StatCard` and `ChartCard` during data load
- **Empty states** with contextual call-to-action buttons
- **Breadcrumb navigation** in the Header
- **Dynamic document titles** (`"Page Name | AdminHub"`) on every route

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **Styling** | Tailwind CSS 3 (custom design tokens, animations, `100dvh`) |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Utility** | clsx |
| **Linter** | oxlint |
| **Language** | JavaScript (ESM) |
| **Persistence** | Browser `localStorage` |
| **State** | React Context API + `useReducer` |

---

## 📁 Folder Structure

```
rbac-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── charts/                 # Recharts wrappers (6 charts)
│   │   │   ├── AttendanceChart.jsx
│   │   │   ├── AttendanceTrendChart.jsx
│   │   │   ├── DepartmentChart.jsx
│   │   │   ├── HeadcountChart.jsx
│   │   │   ├── LeaveChart.jsx
│   │   │   └── SalaryBandChart.jsx
│   │   ├── common/                 # Cross-feature reusable components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   └── StatCard.jsx
│   │   ├── departments/            # Department feature components
│   │   │   ├── AddDepartmentModal.jsx
│   │   │   ├── DepartmentCard.jsx
│   │   │   ├── DepartmentForm.jsx
│   │   │   └── EditDepartmentModal.jsx
│   │   ├── employees/              # Employee feature components
│   │   │   ├── AddEmployeeModal.jsx
│   │   │   ├── DeleteEmployeeModal.jsx
│   │   │   ├── EditEmployeeModal.jsx
│   │   │   ├── EmployeeCard.jsx
│   │   │   ├── EmployeeDetailModal.jsx
│   │   │   ├── EmployeeFilters.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeStatsBar.jsx
│   │   │   └── EmployeeTableRow.jsx
│   │   ├── layout/                 # App shell components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/                     # Generic, domain-agnostic primitives
│   │       ├── Breadcrumb.jsx
│   │       ├── Button.jsx
│   │       ├── ConfirmModal.jsx
│   │       ├── DataTable.jsx
│   │       ├── EmptyState.jsx
│   │       ├── Input.jsx
│   │       ├── Loader.jsx
│   │       ├── Modal.jsx
│   │       ├── Pagination.jsx
│   │       ├── SearchBar.jsx
│   │       ├── SectionCard.jsx
│   │       ├── Select.jsx
│   │       └── Toast.jsx
│   ├── constants/
│   │   ├── dashboardData.js        # Chart mock datasets & KPI seed values
│   │   ├── departmentSeed.js       # Department seed records
│   │   ├── employeeSeed.js         # Employee seed records (12 records)
│   │   ├── mockUsers.js            # Auth user list + authenticateUser()
│   │   └── roles.js                # ROLES, ROUTES, ROLE_HOME, DEPARTMENT_COLORS
│   ├── context/
│   │   ├── AuthContext.jsx         # Session, login, logout, expiry timers
│   │   ├── DepartmentContext.jsx   # Department CRUD + localStorage sync
│   │   └── EmployeeContext.jsx     # Employee CRUD + localStorage sync
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useDepartmentForm.js
│   │   ├── useDocumentTitle.js
│   │   ├── useEmployeeForm.js
│   │   ├── useModal.js
│   │   └── usePagination.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminDepartments.jsx
│   │   │   ├── AdminEmployees.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── EmployeeLeaves.jsx
│   │   │   └── EmployeeProfile.jsx
│   │   ├── hr/
│   │   │   ├── HrDashboard.jsx
│   │   │   ├── HrEmployees.jsx
│   │   │   └── HrLeaves.jsx
│   │   └── shared/
│   │       ├── NotFoundPage.jsx
│   │       └── UnauthorizedPage.jsx
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── utils/
│   │   ├── departmentValidation.js
│   │   ├── employeeValidation.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/rbac-dashboard.git

# 2. Navigate into the project directory
cd rbac-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server (opens at http://localhost:5173)
npm run dev

# 5. Build for production
npm run build

# 6. Preview the production build locally
npm run preview
```

---

## 🔑 Demo Credentials

Use these credentials on the login page, or click the quick-fill role pills to auto-populate the form.

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@company.com` | `Admin@123` | All pages — Employee CRUD, Department CRUD, User Accounts, Settings |
| **HR Manager** | `hr@company.com` | `Hr@12345` | HR Dashboard, Employee Directory, Leave Requests |
| **Employee** | `employee@company.com` | `Emp@1234` | Personal Dashboard, Profile, My Leaves |

> **Note:** Credentials are stored in plain text in `constants/mockUsers.js` for demonstration purposes only. In a production system, authentication would be handled server-side with hashed passwords and JWT tokens.

---

## 🏗️ Architecture

### Context API — Global State Management

Three independent contexts, each owning a distinct domain:

```
<AuthProvider>          → Session lifecycle, login/logout, role
  <EmployeeProvider>    → Employee CRUD + localStorage sync
    <DepartmentProvider>→ Department CRUD + localStorage sync
      <AppRouter />
      <ToastContainer />
    </DepartmentProvider>
  </EmployeeProvider>
</AuthProvider>
```

Each context uses `useReducer` for predictable, atomic state transitions and `useMemo` + `useCallback` to stabilize the context value reference and prevent unnecessary consumer re-renders.

### Routing

React Router v7 with a nested layout pattern:

- `AppRouter.jsx` — single file containing all 14 route definitions
- `ProtectedRoute` — wraps the entire `DashboardLayout` (authentication check) and individually wraps each page (role check)
- `PublicRoute` — prevents authenticated users from accessing `/login`
- The `<DashboardLayout>` parent route uses `<Outlet />` to render page content, so Sidebar/Header/Footer persist without remounting across navigations

### Component-Driven Architecture

Three tiers of components, with a strict one-way dependency direction:

```
ui/           ← Domain-agnostic primitives (Button, Modal, Input, Select …)
    ↑
common/       ← App-aware but cross-feature (Avatar, StatCard, ChartCard …)
    ↑
feature/      ← Domain-specific (EmployeeCard, DepartmentForm, AddEmployeeModal …)
    ↑
pages/        ← Compose everything; call context hooks; own page-level state
```

### Custom Hooks — Logic Extraction

All non-trivial logic that is either reused or would clutter a component is extracted into a custom hook. See the [Custom Hooks](#-custom-hooks) section below.

### localStorage Synchronisation

`utils/storage.js` wraps all `localStorage` calls with:
- Automatic `JSON.parse` / `JSON.stringify`
- `try / catch` on every operation (handles Safari private-mode `SecurityError` gracefully)
- A `rbac_` key prefix to avoid collisions with other scripts on the same origin

Three storage keys are used:

| Key | Owner | Contents |
|---|---|---|
| `rbac_session` | `AuthContext` | `{ user, expiresAt }` |
| `rbac_employees` | `EmployeeContext` | Full employee array |
| `rbac_departments` | `DepartmentContext` | Full department array |

---

## 🧩 Reusable Components

### `components/ui/` — Generic Primitives (13 components)

| Component | Purpose |
|---|---|
| `Button` | Multi-variant button (`primary`, `outline`, `ghost`, `danger`) with loading spinner and icon slots |
| `Input` | Labelled text input with error, hint, and required-indicator support |
| `Select` | Styled `<select>` with the same visual API as `Input`; accepts `options` as string array or `{ value, label }` objects |
| `Modal` | Accessible overlay (focus trap, Escape to close, outside-click to close) with header/body/footer slots and four size variants |
| `ConfirmModal` | Destructive-action confirmation modal built on `Modal`; accepts `onConfirm` callback |
| `DataTable` | Generic table with column headers, row renderer, empty state, and optional pagination footer |
| `Pagination` | First / Prev / page pills / Next / Last controls with rows-per-page selector |
| `SearchBar` | Debounce-ready search input with a clear button |
| `Loader` | Spinner in multiple sizes; can render as a full-screen overlay or centred inline |
| `EmptyState` | Zero-result placeholder with configurable icon, title, message, and CTA |
| `Toast` | Imperative toast system (`toast.success/error/info/warning`) with auto-dismiss and slide-in animation |
| `SectionCard` | Titled card shell with optional subtitle and top-right action slot |
| `Breadcrumb` | Chevron-separated breadcrumb trail |

### `components/common/` — App-Aware Cross-Feature (6 components)

| Component | Purpose |
|---|---|
| `Avatar` | Initials-based avatar with role-specific colour coding; falls back to image if provided |
| `Badge` / `RoleBadge` | Colour-coded role badge (Admin → purple, HR → blue, Employee → emerald) |
| `StatCard` | KPI card with icon bubble, value, unit, delta indicator (↑↓), and loading skeleton |
| `ChartCard` | Titled chart shell with subtitle, action slot, and animated bar-chart loading skeleton |
| `PageHeader` | Consistent page-level heading with subtitle and right-aligned actions slot |
| `LoadingScreen` | Full-screen spinner used during session hydration |

---

## 🪝 Custom Hooks

| Hook | File | Purpose |
|---|---|---|
| `useModal` | `hooks/useModal.js` | Encapsulates `isOpen`, `open()`, `close()`, `toggle()` for any Modal instance. Returns a stable object; used at every Add/Edit/Delete/Detail call site. |
| `useDebounce` | `hooks/useDebounce.js` | Returns a lagged copy of a value that only updates after a configurable delay (default 300 ms). Used to rate-limit search filtering without delaying the input itself. |
| `usePagination` | `hooks/usePagination.js` | Generic pagination — computes `paginatedItems`, `totalPages`, navigation functions, boundary flags, and resets to page 1 when the source array length changes. |
| `useEmployeeForm` | `hooks/useEmployeeForm.js` | Manages employee form state, per-field blur validation (via `validateField`), touched tracking, and full-form submit validation (via `validateEmployee`). Handles add and edit modes via `editingId`. |
| `useDepartmentForm` | `hooks/useDepartmentForm.js` | Same pattern as `useEmployeeForm` for department forms using `validateDepartment` / `validateDeptField`. |
| `useDocumentTitle` | `hooks/useDocumentTitle.js` | Sets `document.title` to `"Page | AdminHub"` on mount and resets to `"AdminHub"` on unmount. Used on all 14 pages. |

---

## 🔮 Future Improvements

| Improvement | Description |
|---|---|
| **REST API / Backend** | Replace `localStorage` CRUD with real API calls (`fetch`/`axios`). The `useReducer` action shapes are already API-ready — only the context's data-fetching layer needs to change. |
| **JWT Authentication** | Replace the mock `authenticateUser()` function with a POST to a real auth endpoint. Store the access token instead of the raw user object; send it as a `Bearer` header on every request. |
| **Unit & Integration Tests** | The pure validation functions (`validateEmployee`, `validateDepartment`) and context reducers are ideal first candidates for Jest unit tests. React Testing Library for component interaction tests. |
| **React Query / SWR** | Once a real API exists, replace manual loading/error state in contexts with a data-fetching library for caching, background refetch, and optimistic updates. |
| **Dark Mode** | Tailwind's `dark:` variant is not yet activated. Adding a `ThemeContext` and toggling `class="dark"` on `<html>` would enable a full dark theme with minimal CSS changes. |
| **TypeScript** | The project is structured for easy migration — contexts, hooks, and validation utilities all have clear type shapes that would map directly to TypeScript interfaces. |
| **Code Splitting** | The current bundle is ~825 KB minified (largely Recharts). Adding `React.lazy` + `Suspense` around route-level components and chart components would split the bundle and reduce initial load time. |
| **Real Notifications** | Replace the mock notification array in `Header.jsx` with a WebSocket or Server-Sent Events feed from the backend. |

---

## 👤 Author

**Kirtan Chauhan**

- 🔗 LinkedIn: [https://www.linkedin.com/in/kirtan-chauhan-4a1314292]
- 🐙 GitHub: [https://github.com/kirtan30112004]

---

## 📄 License

This project is built for **educational and portfolio purposes**.

Feel free to use it as a reference or starting point for your own projects. Attribution is appreciated but not required.

---

<div align="center">
  <sub>Built with ❤️ using React 19 · Vite · Tailwind CSS · Recharts</sub>
</div>
