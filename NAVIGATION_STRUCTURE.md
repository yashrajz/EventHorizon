# EventHorizon - Navigation Structure & User Flow

## 📊 Complete Site Navigation Tree

```
EventHorizon Website
│
├── 🏠 HOME (/)
│   ├── Header Navigation
│   │   ├── About
│   │   ├── Contact
│   │   ├── Submit Event
│   │   └── Login/SignIn/SignUp
│   │
│   ├── Main Sections
│   │   ├── Hero Section
│   │   ├── Bento Grid Features
│   │   ├── Events Section (Filterable)
│   │   ├── Features Overview
│   │   └── Newsletter Section
│   │
│   └── Footer Navigation
│       ├── Product Links → Submit Event, Categories, Pricing
│       ├── Company Links → About, Blog, Careers, Contact
│       ├── Resources → Help Center, Partners, Community
│       └── Legal → Privacy, Terms, Cookies
│
├── 📖 ABOUT (/about)
│   └── Company information and mission
│
├── 📧 CONTACT (/contact)
│   └── Contact form and social links
│
├── 📝 BLOG (/blog)
│   └── Blog posts and articles
│
├── 👥 CAREERS (/careers)
│   ├── Job listings
│   └── Job application form (with file upload)
│
├── 🤝 PARTNERS (/partners)
│   └── Partnership tiers and benefits
│
├── 💬 COMMUNITY (/community)
│   ├── Community stats
│   ├── Member testimonials
│   └── Discord join link
│
├── ❓ HELP CENTER (/help)
│   ├── FAQ sections
│   └── Search functionality
│
│
├── 🎟️ EVENT PAGES
│   │
│   ├── Event Detail (/event/:id)
│   │   ├── Event information
│   │   ├── Registration button
│   │   ├── Share functionality
│   │   └── Related events
│   │
│   └── Submit Event (/submit-event) [PROTECTED]
│       ├── Requires Authentication
│       ├── Allowed Roles: user, attendant
│       └── Event submission form
│
│
├── 🔐 AUTHENTICATION PAGES
│   │
│   ├── Login (/login)
│   │   ├── Email/Password login
│   │   ├── Google OAuth
│   │   ├── Remember me option
│   │   └── Links to SignIn/SignUp
│   │
│   ├── Sign In (/signin)
│   │   ├── Email/Password login
│   │   ├── Google OAuth
│   │   └── Link to SignUp
│   │
│   └── Sign Up (/signup)
│       ├── Email/Password registration
│       ├── Google OAuth
│       ├── Terms agreement
│       └── Link to SignIn
│
│
├── 👔 CONFERENCE ATTENDANT AREA
│   │
│   └── Attendant Dashboard (/attendant) [PROTECTED]
│       ├── Requires Role: attendant
│       ├── Dashboard overview
│       ├── Event management
│       └── Check-in system
│
│
├── ⚖️ LEGAL PAGES
│   │
│   ├── Privacy Policy (/privacy)
│   │   └── Data protection and privacy practices
│   │
│   ├── Terms of Service (/terms)
│   │   └── Terms and conditions of use
│   │
│   ├── Cookie Policy (/cookies)
│   │   └── Cookie usage and management
│   │
│   └── Legal (/legal)
│       └── General legal information
│
│
└── 404 NOT FOUND (*)
    └── Custom 404 page with navigation back to home
```

---

## 🗺️ User Journey Flow Diagrams

### 1️⃣ Anonymous User Flow
```
┌─────────────┐
│  Land on    │
│  Homepage   │
└──────┬──────┘
       │
       ├──► Browse Events ──► View Event Details ──► External Registration
       │
       ├──► Read About/Blog ──► Learn more
       │
       ├──► Try Submit Event ──► Redirected to Login
       │
       └──► Sign Up/Login ──► Becomes Authenticated User
```

### 2️⃣ Authenticated User Flow
```
┌─────────────┐
│   Login     │
│ Successful  │
└──────┬──────┘
       │
       ├──► Submit Event ──► Fill Form ──► Submit for Review
       │
       ├──► Browse Events ──► Register for Events
       │
       ├──► View Profile ──► Manage Settings
       │
       └──► Logout ──► Return to Anonymous
```

### 3️⃣ Conference Attendant Flow
```
┌─────────────────┐
│ Attendant Login │
└────────┬────────┘
         │
         ├──► Attendant Dashboard ──► View Statistics
         │
         ├──► Event Management ──► Check-in Attendees
         │
         ├──► Scan QR Codes ──► Verify Tickets
         │
         └──► Logout ──► Return to Login
```

---

## 🔒 Protected Routes & Access Control

### Route Protection Levels

```
PUBLIC ROUTES (No Authentication Required)
├── / (Home)
├── /about
├── /contact
├── /blog
├── /event/:id
├── /careers
├── /partners
├── /community
├── /help
├── /privacy
├── /terms
├── /cookies
└── /legal

AUTHENTICATION REQUIRED
├── /login
├── /signin
└── /signup

USER PROTECTED ROUTES (Roles: user, attendant)
└── /submit-event
    └── Authentication Required
    └── Redirects to /login if not authenticated

ATTENDANT PROTECTED ROUTES (Role: attendant)
└── /attendant
    ├── Requires attendant role
    └── Redirects to /login if unauthorized
```

---

## 🎨 Navigation Components Breakdown

### Header Navigation
```
Header Component
├── Logo (links to /)
├── Navigation Links
│   ├── Home (/)
│   ├── About (/about)
│   ├── Contact (/contact)
│   └── Submit Event (/submit-event)
│
├── Search Bar (Global Search)
│   └── Filters events by query
│
└── Auth Buttons
    ├── Login (/login)
    ├── Sign In (/signin)
    └── Sign Up (/signup)
```

### Footer Navigation
```
Footer Component
├── Brand Section
│   ├── Logo & Tagline
│   └── Social Links
│       ├── Twitter
│       ├── LinkedIn
│       └── GitHub
│
├── Product Column
│   ├── Events → /
│   ├── Categories → /
│   ├── Submit Event → /submit-event
│   └── Pricing → /
│
├── Company Column
│   ├── About → /about
│   ├── Blog → /blog
│   ├── Careers → /careers
│   └── Contact → /contact
│
├── Resources Column
│   ├── Help Center → /help
│   ├── API → /
│   ├── Partners → /partners
│   └── Community → /community
│
└── Legal Column
    ├── Privacy → /privacy
    ├── Terms → /terms
    └── Cookies → /cookies
```

---

## 🔄 Page Interaction Patterns

### Events Section (Homepage)
```
Events Section
├── Filter by Category
│   ├── All Events
│   ├── Conference
│   ├── Meetup
│   ├── Workshop
│   ├── Hackathon
│   └── Networking
│
├── Advanced Filters (Toggle)
│   ├── Location (City/Online/IRL/Hybrid)
│   ├── Date Range (Start & End)
│   ├── Price (Free/Paid)
│   └── Format (In-Person/Online/Hybrid)
│
├── Event Cards
│   └── Click → /event/:id
│
└── Load More Button
    └── Shows next 6 events
```

### Event Detail Page
```
Event Detail Page (/event/:id)
├── Hero Section
│   ├── Cover Image
│   ├── Title & Category
│   ├── Date, Time, Location
│   └── Price & Availability
│
├── Details Section
│   ├── Description
│   ├── Organizer Info
│   ├── Tags
│   └── Schedule
│
├── Actions
│   ├── Register Button → External URL
│   ├── Share Button → Copy Link
│   └── Add to Calendar
│
└── Related Events
    └── Links to similar events
```

### Submit Event Form Flow
```
Submit Event Page (/submit-event)
├── Authentication Check
│   └── If not logged in → Redirect to /login
│
├── Form Sections
│   ├── Basic Info (Title, Description, Category)
│   ├── Date & Time (Date, Start, End, Timezone)
│   ├── Location (Type, Venue, City, Country)
│   ├── Pricing (Free/Paid, Amount)
│   ├── Registration (URL, Image URL)
│   └── Additional (Organizer, Attendees)
│
└── Submit Action
    ├── Validation
    ├── Success Message
    └── Redirect to Homepage
```

---

## 📱 Responsive Navigation Behavior

### Desktop (>768px)
- Full horizontal navigation bar
- All links visible
- Hover effects on buttons
- Dropdown menus (if applicable)

### Mobile (<768px)
- Hamburger menu icon
- Slide-out mobile menu
- Stacked navigation links
- Simplified footer layout

---

## 🎯 Key User Actions & Entry Points

### Primary Actions
```
1. Browse Events
   Entry: Homepage → Events Section → Event Card → Event Detail
   
2. Submit Event
   Entry: Header "Submit Event" → Login (if needed) → Form → Submit
   
3. Search Events
   Entry: Header Search Bar → Filtered Results → Event Card
   
4. Register for Event
   Entry: Event Detail → Register Button → External Site
   
5. Join Community
   Entry: Footer → Community → Join Discord
   
6. Apply for Job
   Entry: Footer → Careers → Job Listing → Apply Form
   
7. Get Help
   Entry: Footer → Help Center → FAQ → Contact Support
```

### Secondary Actions
```
1. Newsletter Signup
   Entry: Homepage Newsletter Section → Email Form
   
2. Partner Inquiry
   Entry: Footer → Partners → Contact Form
   
3. Read Blog
   Entry: Footer → Blog → Article
   
4. Social Media
   Entry: Footer → Social Icons → External Platform
```

---

## 🚀 Navigation Performance Features

### Page Transitions
- Smooth scroll to top on route change
- Framer Motion page transitions
- Loading states for async operations

### Navigation Helpers
- **ScrollToTopButton**: Available on all pages
- **ScrollToBottomButton**: Available on all pages
- **Breadcrumbs**: Context-aware navigation trail
- **Back Buttons**: Previous page navigation

### Search & Filters
- Real-time search filtering
- Category-based filtering
- Location-based filtering
- Date range selection
- Price filtering

---

## 📊 Site Statistics & Analytics

### Tracked Events
```
Page Views
├── Homepage views
├── Event detail views
├── Form submissions
└── User registrations

User Interactions
├── Search queries
├── Filter applications
├── Button clicks
└── Form completions
```

---

## 🛠️ Technical Navigation Implementation

### Routing Library
- **React Router v6.30.1**
- Client-side routing (SPA)
- Nested routes support
- Protected route components

### Navigation State
- **SearchContext**: Global search state
- **AuthContext**: User authentication state
- URL parameters for event IDs
- Query parameters for filters

### Navigation Guards
```typescript
RoleProtectedRoute Component
├── Checks user authentication
├── Validates user role
├── Redirects unauthorized users
└── Renders protected component
```

---

## 📝 Quick Navigation Reference

| Page | Route | Auth Required | Role Required | Description |
|------|-------|---------------|---------------|-------------|
| Home | `/` | ❌ | - | Landing page with events |
| About | `/about` | ❌ | - | Company information |
| Contact | `/contact` | ❌ | - | Contact form |
| Blog | `/blog` | ❌ | - | Blog articles |
| Event Detail | `/event/:id` | ❌ | - | Single event view |
| Submit Event | `/submit-event` | ✅ | user/attendant | Event submission |
| Login | `/login` | ❌ | - | User authentication |
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
| 404 | `*` | ❌ | - | Not found page |

---

## 🎨 Visual Navigation Hierarchy

```
Level 1: Primary Navigation (Header)
    ├── Core pages always accessible
    └── Highest visibility

Level 2: Section Navigation (Homepage Sections)
    ├── Feature discovery
    └── Content organization

Level 3: Footer Navigation
    ├── Secondary pages
    ├── Legal pages
    └── External links

Level 4: Contextual Navigation
    ├── Breadcrumbs
    ├── Related content
    └── In-page links
```

---

## 🔗 External Links & Integrations

### Social Media Links
- Twitter: `https://twitter.com/eventhorizon`
- LinkedIn: `https://linkedin.com/company/eventhorizon`
- GitHub: `https://github.com/yashrajz/EventHorizon`

### External Registrations
- Event registration URLs (event-specific)
- Discord community link
- Google OAuth integration

---

## 📈 Future Navigation Enhancements

### Planned Features
1. User Dashboard (`/dashboard`)
2. Saved Events (`/saved`)
3. Event History (`/history`)
4. Profile Settings (`/profile`)
5. Notifications Center (`/notifications`)
6. Advanced Search Page (`/search`)
7. Event Calendar View (`/calendar`)
8. API Documentation (`/docs`)

---

**Last Updated**: December 17, 2025
**Version**: 1.0.0
**Maintained By**: EventHorizon Team
