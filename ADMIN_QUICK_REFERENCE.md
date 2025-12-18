# EventHorizon Admin Dashboard - Quick Reference

## 🚀 Quick Start

### Access the Admin Panel
1. Navigate to: `http://localhost:5173/admin/login`
2. Login with:
   - **Admin**: admin@eventhorizon.dev / admin123
   - **Super Admin**: super@eventhorizon.dev / super123

## 📋 Feature Checklist

### ✅ 1. Admin Authentication
- [x] Login page with email/password
- [x] Role-based access (Admin/Super Admin)
- [x] Protected routes
- [x] Auto-redirect unauthenticated users
- [x] Persistent session (localStorage)

### ✅ 2. Event Management (Core)
- [x] Create events (all fields)
- [x] Edit existing events
- [x] Delete events with confirmation
- [x] View event details
- [x] Search events
- [x] Filter by status (Draft/Published/Cancelled)
- [x] Banner image URL input
- [x] Tag management
- [x] Ticket types configuration

**Event Fields:**
- Title, Description, Category
- Date, Time, Timezone
- Location (Online/Offline/Hybrid)
- Venue, City, Country
- Organizer, Tags
- Status, Banner Image

### ✅ 3. Ticket & Registration Management
- [x] View all registrations
- [x] Ticket types: Free, Paid, VIP
- [x] Ticket limits tracking
- [x] Export registrations as CSV
- [x] Search registrations
- [x] Filter by event
- [x] Filter by status
- [x] Revenue calculation

### ✅ 4. Analytics Dashboard
- [x] Total events count
- [x] Total registrations count
- [x] Active users count
- [x] Revenue tracking
- [x] Trend indicators (% change)
- [x] Registration trends chart (Line)
- [x] Event status chart (Bar)
- [x] Popular events list
- [x] Recent events timeline

**Charts Used:**
- Line Chart: Daily registrations & events
- Bar Chart: Event status distribution

### ✅ 5. User Management
- [x] View all users
- [x] Ban/Unban users
- [x] View user activity
- [x] Events joined per user
- [x] Search users
- [x] Filter by status
- [x] User statistics

### ✅ 6. Settings Panel
- [x] Site title configuration
- [x] Logo URL setting
- [x] Contact email
- [x] Toggle registrations on/off
- [x] Maintenance mode
- [x] Theme switcher (Light/Dark/System)
- [x] Social media links (Twitter, LinkedIn, Facebook)

## 🗂️ File Organization

```
src/
├── pages/admin/
│   ├── AdminLogin.tsx          ← Login page
│   ├── AdminLayout.tsx         ← Sidebar + layout
│   ├── AdminDashboard.tsx      ← Analytics dashboard
│   ├── AdminEvents.tsx         ← Event list
│   ├── AdminEventForm.tsx      ← Create/Edit form
│   ├── AdminEventView.tsx      ← View details
│   ├── AdminRegistrations.tsx  ← Registration list
│   ├── AdminUsers.tsx          ← User management
│   └── AdminSettings.tsx       ← Settings panel
│
├── contexts/
│   └── AdminAuthContext.tsx    ← Auth state
│
├── types/
│   └── admin.ts                ← TypeScript types
│
├── data/
│   └── adminMockData.ts        ← Mock data
│
└── components/
    └── AdminRoute.tsx          ← Route guard
```

## 🔐 Authentication

**Context:** `AdminAuthContext.tsx`

**Methods:**
```typescript
const { user, signIn, signOut, hasRole } = useAdminAuth();

// Sign in
await signIn(email, password); // Returns boolean

// Sign out
signOut();

// Check role
hasRole(["admin", "superadmin"]); // Returns boolean
```

## 🎨 UI Components Used

From shadcn/ui:
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Button, Input, Textarea, Label
- Select, Switch
- Table, TableHeader, TableBody, TableRow, TableCell
- Badge
- Dialog, AlertDialog
- Separator
- Sidebar components

Special:
- Recharts (LineChart, BarChart)
- Framer Motion (animations)
- Lucide React (icons)

## 📊 Data Models

### AdminEvent
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  locationType: "online" | "offline" | "hybrid";
  venue?: string;
  city?: string;
  country?: string;
  bannerImage: string;
  status: "draft" | "published" | "cancelled";
  organizer: string;
  tags: string[];
  registrations: number;
  ticketTypes: TicketTypeConfig[];
}
```

### Registration
```typescript
{
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketType: "free" | "paid" | "vip";
  ticketPrice: number;
  registeredAt: string;
  status: "confirmed" | "pending" | "cancelled";
}
```

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "active" | "banned";
  eventsJoined: number;
  lastActive: string;
  registrations: Registration[];
}
```

## 🛣️ Routes

```
/admin/login              ← Login page (public)
/admin                    ← Dashboard (protected)
/admin/events             ← Event list (protected)
/admin/events/new         ← Create event (protected)
/admin/events/:id         ← Edit event (protected)
/admin/events/:id/view    ← View event (protected)
/admin/registrations      ← Registrations (protected)
/admin/users              ← User management (protected)
/admin/settings           ← Settings (protected)
```

## 🎯 Key Functions

### CSV Export
```typescript
// In AdminRegistrations.tsx
exportToCSV() {
  // 1. Prepare data array
  // 2. Convert to CSV string
  // 3. Create Blob
  // 4. Trigger download
}
```

### Search & Filter
```typescript
// Using useMemo for performance
const filtered = useMemo(() => {
  return items.filter(item => {
    const matchesSearch = /* logic */;
    const matchesFilter = /* logic */;
    return matchesSearch && matchesFilter;
  });
}, [items, searchQuery, filter]);
```

### Theme Toggle
```typescript
const { theme, setTheme } = useTheme();
setTheme("dark"); // "light" | "dark" | "system"
```

## 🎨 Styling Patterns

**Consistent Classes:**
```typescript
// Cards
className="border-border/50 backdrop-blur-sm bg-card/50"

// Badges (Status)
"bg-green-500/10 text-green-500 border-green-500/20" // Published
"bg-yellow-500/10 text-yellow-500 border-yellow-500/20" // Draft
"bg-red-500/10 text-red-500 border-red-500/20" // Cancelled

// Animations
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: 0.1 }}
```

## 🔧 Common Customizations

### Add New Statistic to Dashboard
1. Update `mockDashboardStats` in `adminMockData.ts`
2. Add new `StatCard` in `AdminDashboard.tsx`
3. Choose appropriate icon from Lucide React

### Add New Filter
1. Add state: `const [newFilter, setNewFilter] = useState("");`
2. Add to UI: `<Select>` or `<Input>`
3. Update `useMemo` filtering logic

### Modify Table Columns
1. Update `<TableHead>` section
2. Update corresponding `<TableCell>` in map

## 🐛 Troubleshooting

**Issue:** "Cannot find module"
- **Solution:** Run `npm install` or `bun install`

**Issue:** Theme not switching
- **Solution:** Ensure `next-themes` provider is in `App.tsx`

**Issue:** Charts not showing
- **Solution:** Check `recharts` is installed, verify data structure

**Issue:** Routes not working
- **Solution:** Verify `BrowserRouter` wraps all routes in `App.tsx`

## 📈 Performance Tips

1. Use `useMemo` for expensive filters
2. Use `useCallback` for event handlers
3. Implement pagination for large lists
4. Add debounce to search inputs
5. Lazy load routes with React.lazy()

## 🚀 Next Steps

1. **Backend Integration:**
   - Replace mock data with API calls
   - Implement JWT authentication
   - Add real-time updates

2. **Enhanced Features:**
   - File upload for images
   - Rich text editor
   - Advanced analytics
   - Email notifications

3. **Testing:**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Component tests with Testing Library

## 📞 Support

For questions or issues:
- Check `ADMIN_DASHBOARD_README.md` for detailed docs
- Review component comments in code
- Check shadcn/ui docs: https://ui.shadcn.com

---

**Built with ❤️ for EventHorizon**
