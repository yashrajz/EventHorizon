# Authentication Flow Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     EVENTHORIZON AUTH                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │  AuthContext │◄───│    Login     │◄───│     Hero     │ │
│  │  (Provider)  │    │     Page     │    │   (CTAs)     │ │
│  └──────┬───────┘    └──────────────┘    └──────────────┘ │
│         │                                                   │
│         ├───► isAuthenticated                               │
│         ├───► user (role)                                   │
│         ├───► signIn / signOut                              │
│         └───► hasRole / getRedirectPath                     │
└─────────────────────────────────────────────────────────────┘
```

## User Roles & Redirects

```
┌──────────────────────────────────────────────────────┐
│                    After Login:                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Role: admin/superadmin  ──────►  /admin             │
│  Role: attendant         ──────►  /attendant         │
│  Role: user              ──────►  /                  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## CTA Click Flow (from Hero)

```
┌────────────────────────────────────────────────────────────┐
│                  "Create Event" Button                      │
└────────────────────────────────────────────────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │ isAuthenticated? │
                 └────────┬─────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                  │
     YES │                              NO  │
         ▼                                  ▼
  ┌──────────────┐              ┌────────────────────┐
  │ Navigate to  │              │  Navigate to       │
  │ /submit-event│              │  /login            │
  └──────────────┘              │  (save return URL) │
                                └─────────┬──────────┘
                                          │
                                          ▼
                                  ┌───────────────┐
                                  │  User logs in │
                                  └───────┬───────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │ Redirect to      │
                                │ /submit-event    │
                                └──────────────────┘
```

## Route Protection Flow

```
┌───────────────────────────────────────────────────────────┐
│      User tries to access /admin directly                 │
└───────────────────────────────────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────┐
            │  RoleProtectedRoute     │
            │  allowedRoles: [admin]  │
            └─────────────┬───────────┘
                          │
                          ▼
                ┌──────────────────┐
                │ isAuthenticated? │
                └────────┬─────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
    NO  │                              YES │
        ▼                                  ▼
  ┌───────────┐              ┌─────────────────────┐
  │ Redirect  │              │ hasRole([admin])?   │
  │ to /login │              └──────────┬──────────┘
  └───────────┘                         │
                           ┌────────────┴────────────┐
                           │                          │
                       NO  │                      YES │
                           ▼                          ▼
              ┌────────────────────┐      ┌──────────────────┐
              │ Redirect to user's │      │  Render /admin   │
              │ dashboard          │      │  content         │
              │ (by role)          │      └──────────────────┘
              └────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ if attendant → /attendant
         │ if user → /          │
         └──────────────────────┘
```

## Complete Authentication Journey

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER LANDS ON HOMEPAGE (not authenticated)               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Sees three CTAs:                                         │
│    • Create Event                                           │
│    • Manage Conference                                      │
│    • Admin Dashboard                                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Clicks "Admin Dashboard"                                 │
│    → handleAdminDashboard() runs                            │
│    → Checks: isAuthenticated && hasRole(["admin"])          │
│    → Result: NO → navigate("/login", {from: "/admin"})      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Arrives at /login                                        │
│    • Sees login form                                        │
│    • Sees demo credentials                                  │
│    • "from" state saved: /admin                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Enters: admin@eventhorizon.com / admin123                │
│    → signIn() called                                        │
│    → Mock validation passes                                 │
│    → User object created with role: "admin"                 │
│    → Saved to localStorage                                  │
│    → AuthContext updates: user, isAuthenticated = true      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Login success handler:                                   │
│    → Check "from" state: /admin                             │
│    → navigate("/admin", { replace: true })                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. RoleProtectedRoute checks /admin access:                 │
│    → isAuthenticated? YES                                   │
│    → hasRole(["admin", "superadmin"])? YES                  │
│    → Render <AdminLayout />                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. USER SEES ADMIN DASHBOARD ✓                             │
└─────────────────────────────────────────────────────────────┘
```

## Unauthorized Access Example

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Regular user (role: "user") tries /admin                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. RoleProtectedRoute checks:                               │
│    → isAuthenticated? YES (logged in as user)               │
│    → hasRole(["admin", "superadmin"])? NO                   │
│    → Action: Redirect to user's dashboard                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. getRedirectPath() called:                                │
│    → user.role = "user"                                     │
│    → Return: "/"                                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. User redirected to homepage (/)                          │
│    Access denied gracefully, no error shown                 │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                   localStorage                               │
│  Key: "eventhorizon:auth:user"                              │
│  Value: {                                                    │
│    id: "1",                                                  │
│    name: "Admin User",                                       │
│    email: "admin@eventhorizon.com",                          │
│    role: "admin"                                             │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Read on app load
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthContext (React Context)                     │
│  • Hydrates user state from localStorage                    │
│  • Provides auth methods to entire app                      │
│  • Updates on login/logout                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Available via useAuth()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              All Components Can Access:                      │
│  • user                                                      │
│  • isAuthenticated                                           │
│  • signIn()                                                  │
│  • signOut()                                                 │
│  • hasRole()                                                 │
│  • getRedirectPath()                                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
  └─ AuthProvider (wraps entire app)
      │
      ├─ Route: / (Index/Hero)
      │   └─ Hero component
      │       ├─ Uses useAuth()
      │       └─ CTA buttons with auth checks
      │
      ├─ Route: /login
      │   └─ Login component
      │       ├─ Uses useAuth()
      │       └─ Calls signIn()
      │
      ├─ Route: /admin
      │   └─ RoleProtectedRoute (roles: admin, superadmin)
      │       └─ AdminLayout
      │           └─ Admin pages
      │
      ├─ Route: /attendant
      │   └─ RoleProtectedRoute (roles: attendant)
      │       └─ AttendantLayout
      │           └─ Attendant pages
      │
      └─ Route: /submit-event
          └─ RoleProtectedRoute (roles: user, admin, attendant)
              └─ SubmitEvent component
```

---

**Legend:**
- `►` = Navigation/Redirect
- `✓` = Success
- `┌─┐` = Component/Process
- `│` = Flow direction
