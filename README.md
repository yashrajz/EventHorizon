# EventHorizon

## Project Overview
EventHorizon is a full-stack event management platform that allows users to discover, submit, and manage events. It features user authentication, admin approval, event integration from external APIs, and a modern UI built with React and TailwindCSS.

---

## Screenshots

### Homepage Hero Section
![Homepage Hero](./public/Hero%20section.png)

### Upcoming Events
![Upcoming Events](./public/Event%20Section.png)

### User Dashboard
![User Dashboard](./public/Profile%20Section.png)

### Contact Page
![Contact Page](./public/Contact%20Page.png)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Screenshots](#screenshots)
3. [Architecture](#architecture)
4. [Data Flow Diagrams (DFD)](#data-flow-diagrams)
    - [Level 0](#dfd-level-0)
    - [Level 2](#dfd-level-2)
5. [Tech Stack](#tech-stack)
6. [Setup Instructions](#setup-instructions)
7. [API Integration](#api-integration)
8. [Database Schema](#database-schema)
9. [Features](#features)
10. [Folder Structure](#folder-structure)
11. [Contributing](#contributing)
12. [License](#license)
13. [Admin Dashboard](#admin-dashboard)

---

## Architecture
- **Frontend**: React (TypeScript), Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Atlas or local)
- **API Integration**: Eventbrite, Ticketmaster, Mock API

### High-Level Architecture
```
[User] <-> [Frontend (React)] <-> [Backend (Express API)] <-> [MongoDB]
```

---

## Data Flow Diagrams
---

## Authentication Flow Diagrams

### System Overview

```
┌───────────────────────────────────────────────────────────┐
│                     EVENTHORIZON AUTH                     │
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │  AuthContext │◄───│   SignIn     │◄───│     Hero     │ │
│  │  (Provider)  │    │   Page       │    │   (CTAs)     │ │
│  └──────┬───────┘    └──────────────┘    └──────────────┘ │
│         │                                                 │
│         ├───► isAuthenticated                             │
│         ├───► user (role)                                 │
│         ├───► signIn / signOut                            │
│         └───► hasRole / getRedirectPath                   │
└───────────────────────────────────────────────────────────┘
```

### User Roles & Redirects

```
┌──────────────────────────────────────────────────────┐
│                    After Login:                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Role: admin/superadmin  ──────►  /admin             │
│  Role: attendant         ──────►  /attendant         │
│  Role: user              ──────►  /dashboard         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### CTA Click Flow (from Hero)

```
"Create Event" Button
		│
		▼
isAuthenticated?
		│
 ┌──┴─────┐
 │        │
YES      NO
 │        │
 ▼        ▼
Navigate  Navigate to /signin (with return URL)
to /submit-event
					 │
					 ▼
			User logs in
					 │
					 ▼
			Redirect to /submit-event
```

### Route Protection Flow

```
User tries to access /admin directly
		│
		▼
RoleProtectedRoute (allowedRoles: [admin, superadmin])
		│
		▼
isAuthenticated?
	│
 ┌──┴─────┐
 │        │
NO       YES
 │        │
 ▼        ▼
Redirect  hasRole([admin, superadmin])?
to /signin           │
				     ▼
				┌────┴─────┐
				│          │
			NO          YES
				▼          ▼
Redirect to  Render /admin
user's      content
dashboard
```

### Complete Authentication Journey

```
1. User lands on homepage (not authenticated)
2. Sees CTAs: Create Event, Manage Conference, Admin Dashboard
3. Clicks "Admin Dashboard"
	 → Checks: isAuthenticated && hasRole(["admin", "superadmin"])
	 → If not, navigate to /signin (with return URL)
4. Arrives at /signin, logs in
5. On success, redirected to /admin (if admin/superadmin), /attendant (if attendant), /dashboard (if user)
6. RoleProtectedRoute checks access and renders the correct dashboard or redirects
```

### Unauthorized Access Example

```
Regular user (role: "user") tries /admin
		│
		▼
RoleProtectedRoute checks:
		→ isAuthenticated? YES
		→ hasRole([admin, superadmin])? NO
		→ Redirect to user's dashboard (/dashboard)
```

### State Management

```
localStorage
	Key: "eventhorizon:auth:user"
	Value: {
		id, name, email, role
	}
		│
		▼
AuthContext (React Context)
	• Hydrates user state from localStorage
	• Provides auth methods to entire app
	• Updates on login/logout
		│
		▼
All Components Can Access:
	• user
	• isAuthenticated
	• signIn()
	• signOut()
	• hasRole()
	• getRedirectPath()
```

### Component Hierarchy

```
App.tsx
	└─ AuthProvider (wraps entire app)
			├─ Route: / (Index/Hero)
			│   └─ Hero component (uses useAuth, CTA buttons)
			├─ Route: /signin (SignIn page)
			├─ Route: /admin (RoleProtectedRoute: admin, superadmin)
			│   └─ Admin dashboard
			├─ Route: /attendant (RoleProtectedRoute: attendant)
			│   └─ Attendant dashboard
			└─ Route: /submit-event (RoleProtectedRoute: user, attendant)
```

---
### DFD Level 0 (Context Diagram)
```
+-------------------+
|      User         |
+-------------------+
				 |
				 v
+-------------------+
|   EventHorizon    |
+-------------------+
	 /      |      \
	/       |       \
 v        v        v
API   Database   Email
```
- User interacts with EventHorizon (web app)
- EventHorizon communicates with external APIs, database, and email service

### DFD Level 1 (Major Processes)
```
+-------------------+
|      User         |
+-------------------+
				 |
				 v
+-------------------+
|   Frontend (UI)   |
+-------------------+
				 |
				 v
+-------------------+
|  Backend (API)    |
+-------------------+
	 |      |      |
	 v      v      v
Auth  Events  Profile
```
- User actions (login, submit event, view events) go through the frontend to backend
- Backend handles authentication, event CRUD, profile management

### DFD Level 2 (Event Submission Example)
```
[User]
	|
	v
[Submit Event Form]
	|
	v
[Frontend Validation]
	|
	v
[POST /api/events]
	|
	v
[Backend Validation]
	|
	v
[Store in MongoDB]
	|
	v
[Admin Review]
	|
	v
[Event Approved]
	|
	v
[Visible to All Users]
```

---

## Tech Stack
### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Radix UI, Framer Motion, Three.js, React Query, Zod, etc.

### Backend
- Node.js
- Express
- TypeScript
- Mongoose
- JWT, bcryptjs, helmet, cors, nodemailer

### Database
- MongoDB Atlas (recommended)
- Local MongoDB (for development)

---

## Setup Instructions
### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas or local MongoDB
- Git

### Frontend Setup
```sh
git clone <YOUR_GIT_URL>
cd EventHorizon
npm install
npm run dev
```

### Backend Setup
```sh
cd backend
npm install
cp .env.example .env # Add your MongoDB URI and other secrets
npm run dev
```

### MongoDB Setup
See [MONGODB_SETUP_GUIDE.md](MONGODB_SETUP_GUIDE.md) for full instructions.

---

## API Integration
- Eventbrite, Ticketmaster, and Mock API supported
- Configure API keys in `.env` (see [API_INTEGRATION.md](API_INTEGRATION.md))

---

## Database Schema
### Event
- title, description, startDate, endDate, startTime, endTime, timezone
- locationType, venue, city, country, tags, organizer
- eventUrl, registrationUrl, coverImage, category, price, priceAmount
- views, createdBy, status, adminNotes, submittedAt, reviewedAt, reviewedBy

### User
- name, email, password, role (admin, superadmin, attendant, user)
- avatar, bio, location, website, isEmailVerified, tokens

---

## Features
- User authentication (email/password, Google)
- Event submission and approval workflow
- Admin dashboard for event review
- Profile management
- External event API integration
- Responsive, animated UI
- Email notifications

---

## Folder Structure
```
EventHorizon/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
├── src/
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── App.tsx
├── public/
├── package.json
├── README.md
```
---

## Navigation Structure & User Flow

### 📊 Complete Site Navigation Tree
```
EventHorizon Website
│
├── 🏠 HOME (/)
│   ├── Header Navigation
│   │   ├── About (/about)
│   │   ├── Contact (/contact)
│   │   ├── Submit Event (/submit-event)
│   │   └── Sign In (/signin) / Sign Up (/signup)
│   ├── Main Sections
│   │   ├── Hero Section
│   │   ├── Bento Grid Features
│   │   ├── Events Section (Filterable)
│   │   ├── Features Overview
│   │   └── Newsletter Section
│   └── Footer Navigation
│       ├── Product Links → Submit Event, Categories
│       ├── Company Links → About, Blog, Careers, Contact
│       ├── Resources → Help Center, Partners, Community
│       └── Legal → Privacy, Terms, Cookies
│
├── 📖 ABOUT (/about)
├── 📧 CONTACT (/contact)
├── 📝 BLOG (/blog)
├── 👥 CAREERS (/careers)
├── 🤝 PARTNERS (/partners)
├── 💬 COMMUNITY (/community)
├── ❓ HELP CENTER (/help)
├── 🎟️ EVENT PAGES
│   ├── Event Detail (/event/:id)
│   └── Submit Event (/submit-event) [PROTECTED: user, attendant]
├── 🔐 AUTHENTICATION PAGES
│   ├── Sign In (/signin)
│   └── Sign Up (/signup)
├── 👔 CONFERENCE ATTENDANT AREA
│   └── Attendant Dashboard (/attendant) [PROTECTED: attendant]
├── ⚖️ LEGAL PAGES
│   ├── Privacy Policy (/privacy)
│   ├── Terms of Service (/terms)
│   ├── Cookie Policy (/cookies)
│   └── Legal (/legal)
└── 404 NOT FOUND (*)
```

---

### 🗺️ User Journey Flow Diagrams

#### 1️⃣ Anonymous User Flow
```
Land on Homepage
	├─► Browse Events → View Event Details → External Registration
	├─► Read About/Blog → Learn more
	├─► Try Submit Event → Redirected to Sign In
	└─► Sign Up/Sign In → Becomes Authenticated User
```

#### 2️⃣ Authenticated User Flow
```
Login Successful
	├─► Submit Event → Fill Form → Submit for Review
	├─► Browse Events → Register for Events
	├─► View Profile → Manage Settings
	└─► Logout → Return to Anonymous
```

#### 3️⃣ Conference Attendant Flow
```
Attendant Login
	├─► Attendant Dashboard → View Statistics
	├─► Event Management (future)
	└─► Logout → Return to Sign In
```

---

### 🔒 Protected Routes & Access Control

```
PUBLIC ROUTES
	/, /about, /contact, /blog, /event/:id, /careers, /partners, /community, /help, /privacy, /terms, /cookies, /legal

AUTHENTICATION REQUIRED
	/signin, /signup

USER/ATTENDANT PROTECTED
	/submit-event (user, attendant)

ATTENDANT PROTECTED
	/attendant (attendant)

ADMIN PROTECTED
	/admin (admin, superadmin)
	/admin/events (admin, superadmin)

USER DASHBOARD
	/dashboard (user, attendant)

PROFILE
	/profile (user, attendant, admin, superadmin)
```

---

### 🎨 Navigation Components Breakdown

**Header:**
- Logo (links to /)
- Navigation Links: Home, About, Contact, Submit Event
- Search Bar (filters events)
- Auth Buttons: Sign In, Sign Up

**Footer:**
- Brand, Social Links
- Product, Company, Resources, Legal columns

---

### 🔄 Page Interaction Patterns

**Events Section (Homepage):**
- Filter by category, location, date, price
- Event cards link to /event/:id
- Load more button for pagination

**Event Detail Page:**
- Hero, details, organizer, tags, actions (register, share, calendar), related events

**Submit Event:**
- Protected, multi-section form, validation, success message

---

### 📱 Responsive Navigation Behavior

- Desktop: full nav bar, all links visible
- Mobile: hamburger menu, slide-out nav, stacked links

---

### 🛠️ Technical Navigation Implementation

- React Router v6, client-side SPA
- RoleProtectedRoute for protected routes
- SearchContext and AuthContext for state

---

### 📝 Quick Navigation Reference

| Page | Route | Auth Required | Role Required | Description |
|------|-------|---------------|---------------|-------------|
| Home | `/` | ❌ | - | Landing page with events |
| About | `/about` | ❌ | - | Company information |
| Contact | `/contact` | ❌ | - | Contact form |
| Blog | `/blog` | ❌ | - | Blog articles |
| Event Detail | `/event/:id` | ❌ | - | Single event view |
| Submit Event | `/submit-event` | ✅ | user/attendant | Event submission |
| Sign In | `/signin` | ❌ | - | User sign in |
| Sign Up | `/signup` | ❌ | - | User registration |
| Careers | `/careers` | ❌ | - | Job listings |
| Partners | `/partners` | ❌ | - | Partnership info |
| Community | `/community` | ❌ | - | Community hub |
| Help Center | `/help` | ❌ | - | FAQ and support |
| Privacy | `/privacy` | ❌ | - | Privacy policy |
| Terms | `/terms` | ❌ | - | Terms of service |
| Cookies | `/cookies` | ❌ | - | Cookie policy |
| Legal | `/legal` | ❌ | - | Legal information |
| Attendant | `/attendant` | ✅ | attendant | Attendant dashboard |
| Admin | `/admin` | ✅ | admin/superadmin | Admin dashboard |
| Admin Event Review | `/admin/events` | ✅ | admin/superadmin | Event review |
| Dashboard | `/dashboard` | ✅ | user/attendant | User dashboard |
| Profile | `/profile` | ✅ | user/attendant/admin/superadmin | User profile |
| 404 | `*` | ❌ | - | Not found page |

---

## Authentication System - Quick Reference

### 🛡️ Overview
EventHorizon uses a unified, role-based authentication system with clean UX and no intrusive popups.

### 👤 User Roles
- `admin` - Admin access
- `superadmin` - Super admin
- `attendant` - Conference manager
- `user` - Regular user

### 🔑 Key Features (Implemented)
- Persistent sessions (localStorage)
- Role-based access control
- Automatic role-based redirects
- Unified login for all users (SignIn.tsx)
- Route protection with `RoleProtectedRoute`
- Navigation-based auth checks (no popups)

### 🗂️ File Organization (Present)
```
src/
├── contexts/
│   └── AuthContext.tsx          ← Unified auth (all roles)
├── components/
│   └── RoleProtectedRoute.tsx   ← Role-based route protection
│   └── Hero.tsx                 ← Auth-aware CTAs
├── pages/
│   ├── SignIn.tsx               ← Unified login page
│   ├── attendant/
│   │   ├── AttendantLayout.tsx  ← Conference manager layout
│   │   └── AttendantDashboard.tsx ← Conference dashboard
│   └── ...
├── App.tsx                      ← Routing with AuthProvider
```

### 🔐 AuthContext API
```typescript
const { 
	user,              // Current user object or null
	isAuthenticated,   // Boolean auth status
	isLoading,         // Loading state
	signIn,            // (email, password) => Promise<{ success, error? }>
	signOut,           // Clear session
	hasRole,           // (roles[]) => boolean
	getRedirectPath    // Get user's dashboard path
} = useAuth();
```

### 🛣️ Route Structure (Implemented)
```
/ (public)
/about, /contact, /event/:id, ... (public)
/signin (auth page)
/signup (public)
/submit-event (protected: user, attendant)
/admin (protected: admin, superadmin)
/admin/events (protected: admin, superadmin)
/attendant (protected: attendant)
```

### 🚦 User Experience Flow
- Auth checks are performed on navigation, not popups
- RoleProtectedRoute handles redirects for unauthenticated or unauthorized users
- Hero CTAs navigate to protected routes, triggering auth if needed

### 🐛 Troubleshooting
- If you see a redirect to /signin, you are not authenticated for that route
- If you see a redirect to your dashboard, you do not have the required role

---

## Admin Dashboard

The EventHorizon Admin Dashboard is a secure panel for event moderation, accessible only to the SuperUser (role: 'superadmin', email: 'superuser@eventhorizon.com').

### Features Present in the Website
- **Access Control:** Only the SuperUser can access the admin panel. Unauthorized users see an access denied message.
- **Event Statistics:** Dashboard displays counts for pending, approved, rejected, and total events.
- **Event Filtering:** Filter events by status (all, pending, approved, rejected).
- **Event List:** View event details including title, description, date, location, organizer, category, price, submission date, and status.
- **Event Actions:**
	- Approve or Reject pending events
	- View event or registration URL
	- Delete approved or rejected events
- **Export:** Export events to CSV
- **UI/UX:** Responsive design, glassmorphism effects, Framer Motion animations, and shadcn/ui components.

### How It Works
- SuperUser logs in and navigates to the admin panel
- Can review, approve, reject, or delete events
- Can filter events and export event data
- Unauthorized users are redirected or shown an error

**Note:** Only features and logic present in the website code are listed here. For additional admin features, see the codebase or contact the maintainers.

---

## Admin Dashboard - Quick Reference

### 🚀 Quick Start

**Access the Admin Panel:**
1. Go to: `http://localhost:5173/admin`
2. Only the SuperUser (role: 'superadmin', email: 'superuser@eventhorizon.com') can access the admin panel.

### 📋 Feature Checklist (Implemented)
- [x] Admin authentication (login, role-based, protected routes, persistent session)
- [x] Event moderation: approve, reject (with notes), delete, view details
- [x] Event search and filter (by status, title, category, city)
- [x] Tag management (view tags)
- [x] Admin notes for event review
- [x] CSV export for events
- [x] Responsive UI with shadcn/ui, Framer Motion, Lucide React, and theme toggle
- [x] Route protection for admin pages

**Event Fields:**
- Title, Description, Category, Date, Time, Timezone, Location (type, venue, city, country), Organizer, Tags, Status, Banner Image, Admin Notes

### 🗂️ File Organization (Present)
```
src/
├── pages/
│   ├── Admin.tsx              ← Admin dashboard (event moderation)
│   ├── AdminEventReview.tsx   ← Event review (approve/reject)
│   └── ...
├── components/
│   └── ...
├── contexts/
│   └── AuthContext.tsx        ← Auth state (all roles)
├── lib/
│   └── mongodb.ts             ← API client (admin methods)
└── data/
	└── events.ts              ← Event mock data
```

### 🔐 Authentication
**Context:** `AuthContext.tsx`

**Methods:**
```typescript
const { user, signIn, signOut, hasRole } = useAuth();
// Sign in: await signIn(email, password)
// Sign out: signOut()
// Check role: hasRole(["admin", "superadmin"])
```

### 🎨 UI Components Used
- shadcn/ui: Button, Input, Label, Badge, Dialog, etc.
- Framer Motion (animations)
- Lucide React (icons)

### 🛣️ Routes (Implemented)
```
/admin                    ← Dashboard (protected, SuperUser only)
/admin/review             ← Event review (protected)
```

### 🐛 Troubleshooting
- If you see "Access Denied" on /admin, make sure you are logged in as the SuperUser.
- If events do not load, check backend API and MongoDB connection.


---

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License
MIT

---

## Flowchart/DFD Visuals
For full DFD diagrams, see the [DFD Visuals](#data-flow-diagrams) section above. You can use tools like draw.io or Lucidchart to visualize these diagrams for presentations or documentation.

---

## Contact
For questions, open an issue or contact us.

---

