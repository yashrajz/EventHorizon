# EventHorizon API Integration Guide

EventHorizon now supports automatic event fetching from external APIs. This guide explains how to set up and configure different event providers.

## 🎯 Supported APIs

### 1. **Eventbrite API** (Recommended)
- **Best for**: General events, conferences, meetups, workshops
- **Coverage**: Global
- **Sign up**: https://www.eventbrite.com/platform/api
- **Free tier**: Yes (500 requests/day)

### 2. **Ticketmaster Discovery API**
- **Best for**: Concerts, sports, theater, large events
- **Coverage**: North America, Europe, Australia
- **Sign up**: https://developer.ticketmaster.com/
- **Free tier**: Yes (5000 requests/day)

### 3. **Mock API** (Default)
- **Best for**: Development and testing
- **Coverage**: Static mock data
- **Setup**: No configuration needed

## 🚀 Quick Setup

### Step 1: Choose Your API Provider

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### Step 2: Get API Credentials

#### For Eventbrite:
1. Go to https://www.eventbrite.com/platform/api
2. Sign up or log in
3. Create a new app
4. Copy your Private Token

#### For Ticketmaster:
1. Go to https://developer.ticketmaster.com/
2. Sign up or log in
3. Create a new app
4. Copy your API Key (Consumer Key)

### Step 3: Configure Environment Variables

Edit your `.env` file:

```env
# For Eventbrite
VITE_EVENTS_API_PROVIDER=eventbrite
VITE_EVENTBRITE_API_KEY=your_actual_api_key_here

# OR for Ticketmaster
VITE_EVENTS_API_PROVIDER=ticketmaster
VITE_TICKETMASTER_API_KEY=your_actual_api_key_here

# OR for Mock data (default)
VITE_EVENTS_API_PROVIDER=mock
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## 📚 API Usage Examples

### Fetching Events

```typescript
import { getEventsAPI } from '@/services/api';

const api = getEventsAPI();

// Fetch all events
const events = await api.fetchEvents();

// Fetch with filters
const filteredEvents = await api.fetchEvents({
  query: 'startup',
  location: 'San Francisco',
  category: 'Conference',
  limit: 20
});

// Fetch single event
const event = await api.fetchEventById('event-id-123');
```

### Switching API Providers

Simply change the `VITE_EVENTS_API_PROVIDER` in your `.env` file:
- `eventbrite` - Use Eventbrite API
- `ticketmaster` - Use Ticketmaster API
- `mock` - Use mock data (no API key needed)

## 🔧 Advanced Configuration

### Custom API Implementation

Want to use a different API? Create a new service:

```typescript
// src/services/api/your-api.ts
import { BaseEventsAPI, EventSearchParams } from "./base";
import { Event } from "@/data/events";

export class YourAPI extends BaseEventsAPI {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.yourdomain.com');
  }

  async fetchEvents(params?: EventSearchParams): Promise<Event[]> {
    // Implement your API logic
    const data = await this.fetchAPI('/events');
    return data.map(item => this.transformEvent(item));
  }

  async fetchEventById(id: string): Promise<Event | null> {
    // Implement single event fetch
  }

  private transformEvent(apiData: any): Event {
    // Transform API response to Event interface
    return {
      id: apiData.id,
      title: apiData.name,
      // ... map all required fields
    };
  }
}
```

Then register it in `src/services/api/factory.ts`:

```typescript
case 'your-api': {
  const apiKey = import.meta.env.VITE_YOUR_API_KEY;
  this.instance = new YourAPI(apiKey);
  break;
}
```

## 🌍 Data Transformation

All external APIs are automatically transformed to match our Event interface:

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  timezone: string;
  locationType: "IRL" | "Online" | "Hybrid";
  venue?: string;
  city?: string;
  country?: string;
  tags: string[];
  organizer: string;
  eventUrl: string;
  registrationUrl: string;
  coverImage: string;
  views: number;
  price: "Free" | "Paid";
  priceAmount?: string;
  category: string;
}
```

## 🛠️ Troubleshooting

### Events not loading?
1. Check your API key is correct in `.env`
2. Verify the API provider name is spelled correctly
3. Check browser console for error messages
4. Ensure you have internet connection
5. Check API rate limits haven't been exceeded

### API Key errors?
- Make sure the `.env` file is in the project root
- Restart the dev server after changing `.env`
- Don't commit `.env` to version control (it's in `.gitignore`)

### Rate limit exceeded?
- Eventbrite: 500 requests/day on free tier
- Ticketmaster: 5000 requests/day on free tier
- Consider caching or upgrading to paid tier

## 📊 API Response Times

- **Mock API**: ~300ms (simulated delay)
- **Eventbrite**: ~500-1500ms
- **Ticketmaster**: ~400-1200ms

The app includes loading states and error handling for all scenarios.

## 🔒 Security Notes

- Never commit your `.env` file
- API keys are only exposed in the frontend (use server-side proxy for production)
- Consider rate limiting and caching for production apps
- Monitor API usage to avoid unexpected charges

## 📈 Production Recommendations

For production deployment:
1. Set up a backend proxy to hide API keys
2. Implement caching (Redis/Memcached)
3. Add request rate limiting
4. Monitor API usage and costs
5. Consider fallback to mock data if API fails

## 🤝 Contributing

Want to add support for more APIs? We welcome contributions!

1. Create new API service in `src/services/api/`
2. Implement `EventsAPIService` interface
3. Update factory.ts
4. Update this README
5. Submit a pull request

## 📝 License

MIT License - feel free to use in your projects!
