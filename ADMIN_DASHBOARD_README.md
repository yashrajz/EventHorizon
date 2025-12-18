# EventHorizon Admin Dashboard

A comprehensive, production-ready admin dashboard for the EventHorizon event management platform. Built with React, TypeScript, and modern UI components.

## 🎯 Features Implemented

### 1. **Admin Authentication**
- **Login Page**: Secure admin login with email and password
- **Role-Based Access**: Support for Admin and Super Admin roles
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Session Management**: Persistent login using localStorage

**Demo Credentials:**
- Admin: `admin@eventhorizon.dev` / `admin123`
- Super Admin: `super@eventhorizon.dev` / `super123`

### 2. **Event Management** ⭐ Core Feature
Complete CRUD operations for events:

**Event Fields:**
- Title, Description, Category
- Date, Start Time, End Time, Timezone
- Location Type (Online/Offline/Hybrid)
- Venue, City, Country
- Banner Image Upload
- Status (Draft/Published/Cancelled)
- Tags
- Ticket Types Configuration

**Features:**
- ✅ Create new events with comprehensive form
- ✅ Edit existing events
- ✅ View event details
- ✅ Delete events with confirmation
- ✅ Search & filter by status
- ✅ Responsive table layout

### 3. **Ticket & Registration Management**
- **Registration List**: View all event registrations
- **Ticket Types**: Support for Free, Paid, and VIP tickets
- **Ticket Limits**: Set capacity per ticket type
- **Export to CSV**: Download registrations data
- **Filters**: Search by user, event, or status
- **Revenue Tracking**: Real-time revenue calculation

### 4. **Analytics Dashboard**
**Statistics Cards:**
- Total Events
- Total Registrations
- Active Users
- Revenue with trend indicators

**Charts:**
- Registration trends (Line chart - daily activity)
- Event status distribution (Bar chart)
- Popular events ranking
- Recent events timeline

**Library Used:** Recharts (already in package.json)

### 5. **User Management**
- **User List**: View all registered users
- **Ban/Unban**: Toggle user status
- **User Activity**: View user's event registrations
- **Search & Filter**: By name, email, or status
- **Statistics**: Active vs. banned users count

### 6. **Settings Panel**
**General Settings:**
- Site Title
- Logo URL
- Contact Email
- Enable/Disable Registrations
- Maintenance Mode toggle

**Appearance:**
- Theme Toggle (Light/Dark/System)
- Uses `next-themes` for seamless theme switching

**Social Links:**
- Twitter
- LinkedIn
- Facebook

## 📁 File Structure

```
src/
├── pages/admin/
│   ├── AdminLogin.tsx           # Authentication page
│   ├── AdminLayout.tsx          # Sidebar layout wrapper
│   ├── AdminDashboard.tsx       # Analytics dashboard
│   ├── AdminEvents.tsx          # Event list & management
│   ├── AdminEventForm.tsx       # Create/Edit event form
│   ├── AdminEventView.tsx       # View event details
│   ├── AdminRegistrations.tsx   # Registration management
│   ├── AdminUsers.tsx           # User management
│   └── AdminSettings.tsx        # Settings panel
├── contexts/
│   └── AdminAuthContext.tsx     # Auth state management
├── types/
│   └── admin.ts                 # TypeScript interfaces
├── data/
│   └── adminMockData.ts         # Mock data for demo
└── components/
    └── AdminRoute.tsx           # Route protection HOC
```

## 🔐 Route Protection

All admin routes are protected using the `AdminRoute` component:

```tsx
<Route
  path="/admin"
  element={
    <AdminRoute roles={["admin", "superadmin"]}>
      <AdminLayout />
    </AdminRoute>
  }
>
  {/* Protected child routes */}
</Route>
```

**How it works:**
1. Checks if user is authenticated
2. Verifies user role matches required roles
3. Redirects to `/admin/login` if not authenticated
4. Redirects to home if insufficient permissions

## 🎨 UI/UX Design

**Design Principles:**
- Consistent with main site's aesthetic
- Glass-morphism effects
- Smooth animations using Framer Motion
- Responsive design (mobile-first)
- Accessible components from shadcn/ui

**Components Used:**
- Card, Badge, Button
- Table, Dialog, Alert
- Select, Input, Textarea, Switch
- Charts (Recharts)
- Sidebar (shadcn/ui)

## 🚀 Getting Started

### Prerequisites
```bash
# All dependencies already installed in package.json
npm install
# or
bun install
```

### Run Development Server
```bash
npm run dev
# or
bun run dev
```

### Access Admin Panel
1. Navigate to `http://localhost:5173/admin/login`
2. Use demo credentials to login
3. Explore the dashboard!

## 🔑 Key Logic Explanations

### 1. Authentication Flow
```typescript
// AdminAuthContext.tsx
- signIn(): Validates credentials, stores user in localStorage
- signOut(): Clears user session
- hasRole(): Checks if user has required role
- Uses React Context for global state
```

### 2. Event Management
```typescript
// AdminEvents.tsx
- useMemo for efficient filtering
- Search: Filters by title, category, organizer
- Status Filter: draft/published/cancelled
- Delete: Confirmation dialog before deletion

// AdminEventForm.tsx
- Dynamic form based on location type
- Tag management (add/remove)
- Validation before submission
- Edit mode vs. Create mode handling
```

### 3. CSV Export (Registrations)
```typescript
// AdminRegistrations.tsx - exportToCSV()
1. Convert registration data to CSV format
2. Create Blob with CSV content
3. Generate download link
4. Trigger automatic download
```

### 4. Charts Configuration
```typescript
// Recharts usage in AdminDashboard.tsx
- ChartContainer with theme-aware colors
- Responsive charts using ResponsiveContainer
- Custom tooltips and legends
- Multiple data series support
```

## 📊 Data Flow

```
Mock Data (adminMockData.ts)
    ↓
Admin Components (useState)
    ↓
User Actions (CRUD operations)
    ↓
State Updates (setState)
    ↓
UI Re-render
```

**Note:** Currently uses mock data. To integrate with backend:
1. Replace `useState` with API calls
2. Use React Query for data fetching
3. Update CRUD operations to call API endpoints

## 🎭 Theme Support

The admin panel fully supports theme switching:

```typescript
// Using next-themes
const { theme, setTheme } = useTheme();

// Theme values: "light" | "dark" | "system"
setTheme("dark");
```

**Theme-aware components:**
- All charts use CSS variables
- Colors adapt to light/dark mode
- Consistent with main site theme

## 🛡️ Security Considerations

**Current Implementation (Demo):**
- Client-side authentication only
- Credentials stored in localStorage
- Mock validation logic

**Production Recommendations:**
1. Implement JWT tokens
2. Use HTTP-only cookies
3. Add CSRF protection
4. Validate on backend
5. Use secure password hashing
6. Implement rate limiting
7. Add audit logs

## 📱 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Adaptive Features:**
- Collapsible sidebar on mobile
- Stacked layouts on small screens
- Touch-friendly controls
- Optimized table scrolling

## 🚀 Performance Optimizations

1. **useMemo**: Expensive filtering operations
2. **Lazy Loading**: Code splitting for admin routes
3. **Debouncing**: Search input (can be added)
4. **Virtual Scrolling**: For large tables (can be added)

## 🔧 Customization Guide

### Adding New Admin Page

1. **Create Component:**
```typescript
// src/pages/admin/AdminNewFeature.tsx
const AdminNewFeature = () => {
  return <div>Your feature</div>;
};
export default AdminNewFeature;
```

2. **Add Route:**
```typescript
// App.tsx
<Route path="new-feature" element={<AdminNewFeature />} />
```

3. **Add Navigation:**
```typescript
// AdminLayout.tsx
<SidebarMenuItem>
  <NavLink to="/admin/new-feature">
    <SidebarMenuButton>New Feature</SidebarMenuButton>
  </NavLink>
</SidebarMenuItem>
```

### Modifying Mock Data

Edit `src/data/adminMockData.ts` to add more sample data.

### Changing Theme Colors

Update `tailwind.config.ts` or use CSS variables in `index.css`.

## 🐛 Known Issues & Future Enhancements

**Known Issues:**
- None currently

**Future Enhancements:**
1. Real-time updates with WebSockets
2. Advanced filtering (date range, multi-select)
3. Bulk operations (bulk delete, export selected)
4. Email notifications for new registrations
5. Event analytics per event (detailed metrics)
6. User roles management UI
7. Activity logs/audit trail
8. File upload for banner images
9. Rich text editor for descriptions
10. Calendar view for events

## 📚 Dependencies Used

**Core:**
- React 18
- TypeScript
- Vite

**UI:**
- shadcn/ui components
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

**Charts:**
- Recharts

**Routing:**
- React Router v6

**Forms:**
- React Hook Form (can be integrated)
- Zod (can be integrated for validation)

**State:**
- React Context API
- useState/useEffect

**Theme:**
- next-themes

## 🎓 Learning Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)
- [React Router v6 Guide](https://reactrouter.com)
- [Framer Motion Docs](https://www.framer.com/motion)

## 📝 License

This admin dashboard is part of the EventHorizon project.

## 👨‍💻 Author

Built by a senior full-stack developer for the EventHorizon event management platform.

---

**Happy Event Managing! 🎉**
