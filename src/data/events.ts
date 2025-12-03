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
  coverImage: string;
  views: number;
  price: "Free" | "Paid";
  category: string;
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Y Combinator Demo Day 2024",
    description: "Watch the latest batch of YC startups pitch to investors. An exclusive look at the future of tech.",
    date: "2024-03-15",
    startTime: "10:00",
    endTime: "18:00",
    timezone: "PST",
    locationType: "Hybrid",
    venue: "YC Campus",
    city: "San Francisco",
    country: "USA",
    tags: ["Demo Day", "VC", "Pitching"],
    organizer: "Y Combinator",
    eventUrl: "#",
    coverImage: "",
    views: 12500,
    price: "Free",
    category: "Demo Day",
  },
  {
    id: "2",
    title: "Techstars Startup Weekend",
    description: "54 hours to build a startup. Network with founders, developers, and designers.",
    date: "2024-03-22",
    startTime: "18:00",
    endTime: "21:00",
    timezone: "EST",
    locationType: "IRL",
    venue: "Innovation Hub",
    city: "New York",
    country: "USA",
    tags: ["Hackathon", "Networking", "Workshop"],
    organizer: "Techstars",
    eventUrl: "#",
    coverImage: "",
    views: 8900,
    price: "Paid",
    category: "Hackathon",
  },
  {
    id: "3",
    title: "European Startup Summit",
    description: "Europe's largest gathering of founders, investors, and tech leaders.",
    date: "2024-04-05",
    startTime: "09:00",
    endTime: "19:00",
    timezone: "CET",
    locationType: "IRL",
    venue: "Messe Berlin",
    city: "Berlin",
    country: "Germany",
    tags: ["Conference", "Networking", "VC"],
    organizer: "Startup Europe",
    eventUrl: "#",
    coverImage: "",
    views: 15200,
    price: "Paid",
    category: "Conference",
  },
  {
    id: "4",
    title: "AI Founders Meetup",
    description: "Monthly gathering of AI/ML startup founders. Share insights and challenges.",
    date: "2024-03-28",
    startTime: "19:00",
    endTime: "22:00",
    timezone: "GMT",
    locationType: "IRL",
    venue: "The Shard",
    city: "London",
    country: "UK",
    tags: ["AI", "Meetup", "Networking"],
    organizer: "AI Founders Club",
    eventUrl: "#",
    coverImage: "",
    views: 3400,
    price: "Free",
    category: "Meetup",
  },
  {
    id: "5",
    title: "Pitch Perfect Workshop",
    description: "Learn how to craft a compelling investor pitch from seasoned founders.",
    date: "2024-03-20",
    startTime: "14:00",
    endTime: "17:00",
    timezone: "PST",
    locationType: "Online",
    tags: ["Workshop", "Pitching", "Fundraising"],
    organizer: "Founder Institute",
    eventUrl: "#",
    coverImage: "",
    views: 5600,
    price: "Free",
    category: "Workshop",
  },
  {
    id: "6",
    title: "Web3 Builders Hackathon",
    description: "Build the future of decentralized applications in 48 hours.",
    date: "2024-04-12",
    startTime: "09:00",
    endTime: "21:00",
    timezone: "SGT",
    locationType: "Hybrid",
    venue: "Marina Bay Sands",
    city: "Singapore",
    country: "Singapore",
    tags: ["Web3", "Hackathon", "Blockchain"],
    organizer: "ETH Singapore",
    eventUrl: "#",
    coverImage: "",
    views: 7800,
    price: "Free",
    category: "Hackathon",
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
  "San Francisco",
  "New York",
  "London",
  "Berlin",
  "Singapore",
  "Online",
];
