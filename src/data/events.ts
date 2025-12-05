export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
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

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "TechSparks Bangalore 2025",
    description: "India's largest startup-tech summit by YourStory. Join 3,000+ founders, investors, and tech leaders. Featuring keynotes from unicorn founders, pitch competitions, and exclusive networking sessions.",
    date: "2025-12-05",
    startTime: "09:00",
    endTime: "18:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "Bengaluru International Exhibition Centre",
    city: "Bangalore",
    country: "India",
    tags: ["Conference", "Startups", "VC", "Networking"],
    organizer: "YourStory",
    eventUrl: "https://yourstory.com/techsparks",
    registrationUrl: "https://yourstory.com/techsparks/register",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    views: 18500,
    price: "Paid",
    priceAmount: "₹12,500",
    category: "Conference",
  },
  {
    id: "2",
    title: "Mumbai Startup Pitch Fest",
    description: "Early-stage startups pitch to angel investors and VCs. ₹50L investment on the spot. Limited to 20 startups. Get mentorship from successful founders and feedback from top investors.",
    date: "2025-12-04",
    startTime: "15:00",
    endTime: "20:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "WeWork BKC",
    city: "Mumbai",
    country: "India",
    tags: ["Pitching", "Investment", "Angel", "Funding"],
    organizer: "Mumbai Angels Network",
    eventUrl: "https://www.mumbaiangels.com/events",
    registrationUrl: "https://www.mumbaiangels.com/events/pitch-fest/register",
    coverImage: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80",
    views: 6800,
    price: "Free",
    category: "Pitch Competition",
  },
  {
    id: "3",
    title: "Smart India Hackathon 2025",
    description: "36-hour hackathon organized by Government of India. Solve real-world problems across healthcare, education, agriculture. ₹1 Crore in prizes and guaranteed internships.",
    date: "2025-12-12",
    startTime: "08:00",
    endTime: "20:00",
    timezone: "IST",
    locationType: "Hybrid",
    venue: "IIT Delhi",
    city: "Delhi",
    country: "India",
    tags: ["Hackathon", "Government", "Innovation", "Students"],
    organizer: "Ministry of Education",
    eventUrl: "https://www.sih.gov.in",
    registrationUrl: "https://www.sih.gov.in/register",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    views: 24000,
    price: "Free",
    category: "Hackathon",
  },
  {
    id: "4",
    title: "Hyderabad SaaS Founders Meetup",
    description: "Monthly meetup for B2B SaaS founders in Hyderabad. Discuss ARR growth, customer acquisition, and scaling strategies. Network with 100+ SaaS founders and leaders.",
    date: "2025-12-06",
    startTime: "18:30",
    endTime: "21:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "T-Hub Phase 2",
    city: "Hyderabad",
    country: "India",
    tags: ["SaaS", "Meetup", "B2B", "Networking"],
    organizer: "SaaSBoomi",
    eventUrl: "https://saasboomi.com/events",
    registrationUrl: "https://saasboomi.com/events/meetup/register",
    coverImage: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&q=80",
    views: 4200,
    price: "Free",
    category: "Meetup",
  },
  {
    id: "5",
    title: "Pune Web3 Summit",
    description: "Explore blockchain, DeFi, NFTs, and Web3 gaming. Workshops on smart contracts, tokenomics, and building dApps. Network with crypto founders and investors.",
    date: "2025-12-14",
    startTime: "10:00",
    endTime: "18:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "Pune Tech Park",
    city: "Pune",
    country: "India",
    tags: ["Web3", "Blockchain", "Crypto", "NFT"],
    organizer: "Blockchain India",
    eventUrl: "https://www.blockchainindia.org",
    registrationUrl: "https://www.blockchainindia.org/summit/register",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    views: 5600,
    price: "Paid",
    priceAmount: "₹3,500",
    category: "Conference",
  },
  {
    id: "6",
    title: "Y Combinator Demo Day Winter 2025",
    description: "Watch the latest batch of YC startups pitch to investors. An exclusive look at the future of tech innovation. See 50+ companies present their groundbreaking ideas across AI, fintech, healthcare, and more.",
    date: "2025-12-08",
    startTime: "10:00",
    endTime: "18:00",
    timezone: "PST",
    locationType: "Hybrid",
    venue: "YC Campus",
    city: "San Francisco",
    country: "USA",
    tags: ["Demo Day", "VC", "Pitching", "Investment"],
    organizer: "Y Combinator",
    eventUrl: "https://www.ycombinator.com/demoday",
    registrationUrl: "https://www.ycombinator.com/demoday/register",
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    views: 12500,
    price: "Free",
    category: "Demo Day",
  },
  {
    id: "7",
    title: "Bangalore AI & ML Meetup",
    description: "Monthly gathering of AI/ML engineers and founders in Bangalore. Discuss latest trends in LLMs, computer vision, and MLOps. Network with 200+ AI professionals.",
    date: "2025-12-07",
    startTime: "18:00",
    endTime: "21:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "Microsoft Reactor Bangalore",
    city: "Bangalore",
    country: "India",
    tags: ["AI", "Machine Learning", "Meetup", "Technology"],
    organizer: "AI Bangalore",
    eventUrl: "https://www.meetup.com/bangalore-ai",
    registrationUrl: "https://www.meetup.com/bangalore-ai/events/register",
    coverImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    views: 5200,
    price: "Free",
    category: "Meetup",
  },
  {
    id: "8",
    title: "Delhi Startup Investors Summit",
    description: "Connect early-stage startups with angel investors and micro VCs. Panel discussions on investment trends, term sheets, and fundraising strategies. 50+ investors attending.",
    date: "2025-12-09",
    startTime: "10:00",
    endTime: "17:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "India Habitat Centre",
    city: "Delhi",
    country: "India",
    tags: ["Investment", "VC", "Angel", "Funding"],
    organizer: "Delhi Angel Network",
    eventUrl: "https://www.indianangelnetwork.com",
    registrationUrl: "https://www.indianangelnetwork.com/summit/register",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    views: 7800,
    price: "Paid",
    priceAmount: "₹5,000",
    category: "Conference",
  },
  {
    id: "9",
    title: "Mumbai FinTech Forum",
    description: "Exploring digital payments, lending tech, insurtech, and regulatory compliance. Network with fintech founders, banks, and regulators. Special focus on UPI and digital banking.",
    date: "2025-12-11",
    startTime: "09:00",
    endTime: "18:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "Bombay Stock Exchange",
    city: "Mumbai",
    country: "India",
    tags: ["FinTech", "Banking", "Payments", "Conference"],
    organizer: "FinTech India",
    eventUrl: "https://www.fintechindia.org",
    registrationUrl: "https://www.fintechindia.org/forum/register",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    views: 9400,
    price: "Paid",
    priceAmount: "₹8,500",
    category: "Conference",
  },
  {
    id: "10",
    title: "TechCrunch Disrupt 2025",
    description: "The world's leading tech conference returns. 10,000+ attendees, 200+ startups in Startup Alley, celebrity speakers, and the legendary Startup Battlefield.",
    date: "2025-12-18",
    startTime: "09:00",
    endTime: "18:00",
    timezone: "PST",
    locationType: "IRL",
    venue: "Moscone Center",
    city: "San Francisco",
    country: "USA",
    tags: ["Conference", "Demo Day", "VC", "Press"],
    organizer: "TechCrunch",
    eventUrl: "https://techcrunch.com/events/disrupt",
    registrationUrl: "https://techcrunch.com/events/disrupt/register",
    coverImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
    views: 45000,
    price: "Paid",
    priceAmount: "₹1,25,000",
    category: "Conference",
  },
  {
    id: "11",
    title: "Product Hunt Makers Festival",
    description: "Virtual festival celebrating indie makers and product builders. Demos, workshops, and networking sessions with top Product Hunt makers.",
    date: "2025-12-12",
    startTime: "10:00",
    endTime: "16:00",
    timezone: "PST",
    locationType: "Online",
    tags: ["Product", "Indie", "Workshop", "Launch"],
    organizer: "Product Hunt",
    eventUrl: "https://www.producthunt.com/events",
    registrationUrl: "https://www.producthunt.com/events/makers-festival/register",
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
    views: 8900,
    price: "Free",
    category: "Workshop",
  },
  {
    id: "12",
    title: "Climate Tech Pitch Night",
    description: "Climate tech startups pitch to impact investors. Focus on renewable energy, carbon capture, sustainable agriculture, and green technology solutions.",
    date: "2025-12-14",
    startTime: "18:00",
    endTime: "21:00",
    timezone: "EST",
    locationType: "IRL",
    venue: "Brooklyn Navy Yard",
    city: "New York",
    country: "USA",
    tags: ["Climate Tech", "Pitching", "Impact", "Sustainability"],
    organizer: "Climate Founders",
    eventUrl: "https://climatefounders.com/events",
    registrationUrl: "https://climatefounders.com/events/pitch-night/register",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    views: 4200,
    price: "Free",
    category: "Pitch Competition",
  },
  {
    id: "13",
    title: "Angel Investors Bootcamp",
    description: "Learn the fundamentals of angel investing. Understand term sheets, valuations, due diligence, and portfolio construction from experienced angels.",
    date: "2025-12-07",
    startTime: "13:00",
    endTime: "17:00",
    timezone: "GMT",
    locationType: "Hybrid",
    venue: "Level39",
    city: "London",
    country: "UK",
    tags: ["Investment", "Workshop", "Angel", "Education"],
    organizer: "Angel Academy",
    eventUrl: "https://www.angelacademylondon.com",
    registrationUrl: "https://www.angelacademylondon.com/bootcamp/register",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    views: 3800,
    price: "Paid",
    priceAmount: "₹45,000",
    category: "Workshop",
  },
  {
    id: "14",
    title: "Hyderabad EdTech Innovation Summit",
    description: "Future of education technology in India. K-12, higher education, upskilling platforms. Network with EdTech founders and education policymakers.",
    date: "2025-12-13",
    startTime: "09:00",
    endTime: "17:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "HICC Hyderabad",
    city: "Hyderabad",
    country: "India",
    tags: ["EdTech", "Education", "Innovation", "Conference"],
    organizer: "EdTech India",
    eventUrl: "https://www.edtechindia.in",
    registrationUrl: "https://www.edtechindia.in/summit/register",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    views: 6200,
    price: "Paid",
    priceAmount: "₹6,500",
    category: "Conference",
  },
  {
    id: "15",
    title: "Women in Tech Leadership Summit",
    description: "Empowering women leaders in technology. Keynotes from female CEOs, workshops on leadership and negotiation, and networking with 500+ women in tech.",
    date: "2025-12-11",
    startTime: "09:00",
    endTime: "18:00",
    timezone: "CET",
    locationType: "IRL",
    venue: "Humboldt Forum",
    city: "Berlin",
    country: "Germany",
    tags: ["Women in Tech", "Leadership", "Conference", "Diversity"],
    organizer: "Women Who Code",
    eventUrl: "https://www.womenwhocode.com/events",
    registrationUrl: "https://www.womenwhocode.com/events/summit/register",
    coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    views: 6700,
    price: "Free",
    category: "Conference",
  },
  {
    id: "16",
    title: "Pune Startup Pitch Competition",
    description: "Early-stage startups compete for ₹25L funding. Pitch to top VCs and angel investors. Mentorship from successful entrepreneurs and feedback sessions.",
    date: "2025-12-16",
    startTime: "14:00",
    endTime: "19:00",
    timezone: "IST",
    locationType: "IRL",
    venue: "Pune Startup Hub",
    city: "Pune",
    country: "India",
    tags: ["Pitching", "Startups", "Funding", "Competition"],
    organizer: "Pune Startup Community",
    eventUrl: "https://www.punestartups.com",
    registrationUrl: "https://www.punestartups.com/pitch-competition/register",
    coverImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
    views: 4800,
    price: "Free",
    category: "Pitch Competition",
  },
  {
    id: "17",
    title: "Mobile Dev Hackathon",
    description: "Build the next big mobile app in 36 hours. iOS and Android developers compete for prizes. Mentorship from senior engineers at major tech companies.",
    date: "2025-12-13",
    startTime: "18:00",
    endTime: "12:00",
    timezone: "SGT",
    locationType: "IRL",
    venue: "NUS Enterprise",
    city: "Singapore",
    country: "Singapore",
    tags: ["Hackathon", "Mobile", "iOS", "Android"],
    organizer: "Dev Community SG",
    eventUrl: "https://www.devcommunity.sg/hackathon",
    registrationUrl: "https://www.devcommunity.sg/hackathon/register",
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    views: 5400,
    price: "Free",
    category: "Hackathon",
  },
  {
    id: "18",
    title: "Startup Grind Global Conference",
    description: "The largest independent startup conference. 3 days of inspiration, education, and connections with founders, investors, and innovators from 125 countries.",
    date: "2025-12-22",
    startTime: "08:00",
    endTime: "19:00",
    timezone: "PST",
    locationType: "Hybrid",
    venue: "Silicon Valley Convention Center",
    city: "San Francisco",
    country: "USA",
    tags: ["Conference", "Global", "Networking", "Growth"],
    organizer: "Startup Grind",
    eventUrl: "https://www.startupgrind.com/conference",
    registrationUrl: "https://www.startupgrind.com/conference/register",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    views: 28000,
    price: "Paid",
    priceAmount: "₹85,000",
    category: "Conference",
  },
];

export const categories = [
  "All",
  "Demo Day",
  "Hackathon",
  "Conference",
  "Meetup",
  "Workshop",
  "Pitch Competition",
];

export const locations = [
  "All Locations",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "San Francisco",
  "New York",
  "London",
  "Berlin",
  "Singapore",
  "Online",
];

// Filter Helper Functions
export const matchesQuery = (event: Event, query: string): boolean => {
  const searchTerm = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.organizer.toLowerCase().includes(searchTerm) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const isInDateRange = (eventDate: string, range: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  switch(range) {
    case "Today":
      return isSameDay(today, event);
    case "This Week":
      return isWithinDays(event, 7);
    case "This Month":
      return isSameMonth(today, event);
    case "This Year":
      return isSameYear(today, event);
    case "Any Date":
      return true;
    default:
      return true;
  }
};

// Date utility functions
const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.toDateString() === d2.toDateString();
};

const isWithinDays = (eventDate: Date, days: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  return eventDate >= today && eventDate <= futureDate;
};

const isSameMonth = (d1: Date, d2: Date): boolean => {
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

const isSameYear = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear();
};
