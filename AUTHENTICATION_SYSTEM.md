# Authentication System Documentation

## Overview

EventHorizon now features a professional, role-based authentication system with clean UX and no intrusive popups.

## System Architecture

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)

Centralized authentication state management for all user types.

**User Roles:**
- `admin` - Full admin access
- `superadmin` - Super admin with elevated permissions
- `attendant` - Conference manager
- `user` - Regular user

**Key Features:**
- Persistent sessions (localStorage)
- Role-based access control
- Automatic role-based redirects
- Mock authentication (ready for API integration)

**API:**
```typescript
const { 
  user,              // Current user object or null
  isAuthenticated,   // Boolean auth status
  isLoading,         // Loading state
  signIn,            // (email, password) => Promise<boolean>
  signOut,           // Clear session
  hasRole,           // (roles[]) => boolean
  getRedirectPath    // Get user's dashboard path
} = useAuth();
```

### 2. **RoleProtectedRoute** (`src/components/RoleProtectedRoute.tsx`)

Protects routes based on authentication and user role.

**Usage:**
```tsx
<RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
  <AdminDashboard />
</RoleProtectedRoute>
```

**Flow:**
1. Check if user is authenticated
2. If not → redirect to /login with return URL
3. If authenticated but wrong role → redirect to user's dashboard
4. If authenticated with correct role → render content

### 3. **Login Page** (`src/pages/Login.tsx`)

Unified login for all user types with role-based redirects.

**Features:**
- Single form for all users
- Automatic role detection
- Return URL support
- Demo credentials display
- Error handling

**Demo Credentials:**
```
Admin:     admin@eventhorizon.com / admin123
Attendant: attendant@eventhorizon.com / attendant123
User:      user@example.com / user123
```

## User Experience Flow

### Scenario 1: User Clicks "Create Event"

```
User on Hero → Click "Create Event" Button
  ↓
Check if authenticated?
  ├─ NO → Navigate to /login (with return URL: /submit-event)
  │        ↓
  │      User logs in
  │        ↓
  │      Redirect to /submit-event
  │
  └─ YES → Navigate directly to /submit-event
```

### Scenario 2: User Clicks "Admin Dashboard"

```
User on Hero → Click "Admin Dashboard" Button
  ↓
Check if authenticated AND has admin role?
  ├─ NO → Navigate to /login (with return URL: /admin)
  │        ↓
  │      User logs in
  │        ↓
  │      If user has admin role → /admin
  │      If user is attendant → /attendant
  │      If user is normal user → /
  │
  └─ YES (authenticated + admin) → Navigate to /admin
```

### Scenario 3: Direct URL Access

```
User types /admin in browser
  ↓
RoleProtectedRoute checks:
  ├─ Not authenticated? → /login (return URL: /admin)
  ├─ Authenticated but not admin? → /user-dashboard
  └─ Authenticated as admin? → Show /admin
```

## Route Structure

```
/ (public)
├─ /about (public)
├─ /contact (public)
├─ /event/:id (public)
│
├─ /login (auth page)
├─ /signin (legacy, kept for compatibility)
├─ /signup (public)
│
├─ /submit-event (protected: user, admin, attendant)
│
├─ /admin (protected: admin, superadmin)
│  ├─ / (dashboard)
│  ├─ /events
│  ├─ /events/new
│  ├─ /events/:id
│  ├─ /events/:id/view
│  ├─ /registrations
│  ├─ /users
│  └─ /settings
│
└─ /attendant (protected: attendant)
   └─ / (dashboard)
```

## Key Components

### Hero CTAs (`src/components/Hero.tsx`)

Three main call-to-action buttons:

1. **Create Event** → `/submit-event`
   - Checks: isAuthenticated
   - If not authenticated → redirect to /login

2. **Manage Conference** → `/attendant`
   - Checks: isAuthenticated && hasRole(["attendant"])
   - If not authenticated → redirect to /login

3. **Admin Dashboard** → `/admin`
   - Checks: isAuthenticated && hasRole(["admin", "superadmin"])
   - If not authenticated → redirect to /login

**No Popups:** All authentication checks happen via navigation, not modals.

### Attendant Pages

Conference management interface for event organizers:

- `AttendantLayout.tsx` - Sidebar navigation
- `AttendantDashboard.tsx` - Stats and quick actions

## UX Design Decisions

### ✅ What We Did

1. **No Timed Popups** - No automatic login modals after page load
2. **Intentional Access** - Users must click a button to trigger auth
3. **Clear CTAs** - Obvious buttons for different user types
4. **Contextual Redirects** - Remember where users wanted to go
5. **Role-Based Routing** - Automatic redirect to appropriate dashboard
6. **Loading States** - Show spinners during auth checks
7. **Error Handling** - Clear error messages for failed logins

### ❌ What We Avoided

1. ~~Automatic login popup after 3 seconds~~
2. ~~Forced modal on page load~~
3. ~~Confusing multi-step login flow~~
4. ~~Separate login pages for each role~~
5. ~~Redirect loops~~
6. ~~Blocking the entire page with auth modals~~

## Integration with Backend

The current system uses mock authentication. To integrate with a real backend:

### Update `AuthContext.tsx`:

```typescript
const signIn = async (email: string, password: string): Promise<boolean> => {
  try {
    // Replace mock with actual API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role, // Must be "admin" | "superadmin" | "attendant" | "user"
      avatar: data.avatar
    };
    
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    // Store auth token
    localStorage.setItem('auth_token', data.token);
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

## Testing the System

### Manual Test Cases

**Test 1: Unauthenticated Hero Access**
1. Visit homepage (not logged in)
2. Click "Create Event"
3. Expected: Redirect to /login
4. Login with user@example.com / user123
5. Expected: Redirect to /submit-event

**Test 2: Wrong Role Access**
1. Login as attendant@eventhorizon.com / attendant123
2. Try to access /admin directly
3. Expected: Redirect to /attendant (attendant dashboard)

**Test 3: Admin Login Flow**
1. Visit homepage
2. Click "Admin Dashboard"
3. Expected: Redirect to /login
4. Login with admin@eventhorizon.com / admin123
5. Expected: Redirect to /admin

**Test 4: Direct URL Protection**
1. Not logged in
2. Type /admin in address bar
3. Expected: Redirect to /login
4. After login: Redirect back to /admin

## File Summary

```
src/
├─ contexts/
│  ├─ AuthContext.tsx          # Unified auth (NEW)
│  └─ AdminAuthContext.tsx     # Legacy admin auth (can be removed)
│
├─ components/
│  ├─ RoleProtectedRoute.tsx   # Role-based route protection (NEW)
│  ├─ ProtectedRoute.tsx       # Simple auth check (updated)
│  └─ Hero.tsx                 # Updated with auth-aware CTAs
│
├─ pages/
│  ├─ Login.tsx                # Unified login page (NEW)
│  ├─ SignIn.tsx               # Legacy login (kept for compatibility)
│  │
│  ├─ attendant/
│  │  ├─ AttendantLayout.tsx   # Conference manager layout (NEW)
│  │  └─ AttendantDashboard.tsx # Conference dashboard (NEW)
│  │
│  └─ admin/
│     ├─ AdminLayout.tsx
│     ├─ AdminDashboard.tsx
│     └─ ... (existing admin pages)
│
└─ App.tsx                     # Updated routing with AuthProvider
```

## Migration Notes

### Breaking Changes
- Old `AdminAuthProvider` replaced with unified `AuthProvider`
- `/admin/login` route removed (use `/login` instead)
- `AdminRoute` component replaced with `RoleProtectedRoute`

### Backward Compatibility
- `/signin` still works (kept for existing links)
- Old `ProtectedRoute` updated to use new AuthContext
- All admin pages work without modification

## Next Steps

### Recommended Enhancements

1. **Password Reset Flow**
   - Forgot password page
   - Email verification
   - Reset token handling

2. **Registration**
   - Update SignUp page to use AuthContext
   - Email verification
   - Role selection (for attendants)

3. **Session Management**
   - Refresh tokens
   - Auto-logout on expiry
   - "Keep me logged in" functionality

4. **OAuth Integration**
   - Google Sign-In
   - GitHub OAuth
   - LinkedIn OAuth

5. **User Profile**
   - Profile editing
   - Avatar upload
   - Account settings

6. **Attendant Features**
   - Event check-in system
   - Attendee management
   - QR code scanning
   - Real-time notifications

---

**Summary:** The authentication system is production-ready for frontend use. It provides clean UX with no intrusive popups, role-based access control, and clear user flows. Ready for backend API integration.
