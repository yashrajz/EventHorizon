// Static category-based images - consistent for each event type
export const getCategoryImage = (category: string, eventId?: string): string => {
  const categoryImages: Record<string, string> = {
    'Conference': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80',
    'Networking': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&q=80',
    'Workshop': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&q=80',
    'Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&q=80',
    'Meetup': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80',
    'Webinar': 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop&q=80',
    'Summit': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop&q=80',
    'Expo': 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop&q=80',
    'Tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
    'Startup': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80',
    'AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80',
    'Blockchain': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&q=80',
    'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
    'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80',
  };

  return categoryImages[category] || categoryImages['Conference'];
};

// Utility for generating gradient backgrounds for fast loading
export const generateGradient = (seed: string): string => {
  // Hash function to generate consistent colors from seed
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  const h = hash(seed);
  
  // Generate color palette based on hash
  const hue1 = h % 360;
  const hue2 = (h + 120) % 360;
  const hue3 = (h + 240) % 360;
  
  const gradients = [
    `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 70%, 40%) 100%)`,
    `linear-gradient(to right, hsl(${hue1}, 80%, 45%), hsl(${hue2}, 70%, 50%))`,
    `linear-gradient(135deg, hsl(${hue1}, 75%, 55%) 0%, hsl(${hue2}, 75%, 45%) 50%, hsl(${hue3}, 70%, 50%) 100%)`,
    `radial-gradient(circle at 20% 50%, hsl(${hue1}, 80%, 50%), hsl(${hue2}, 70%, 45%))`,
    `linear-gradient(to bottom right, hsl(${hue1}, 85%, 55%), hsl(${hue2}, 75%, 40%))`,
  ];

  return gradients[h % gradients.length];
};

// Category-based gradient themes
export const getCategoryGradient = (category: string): string => {
  const gradientMap: Record<string, string> = {
    'Conference': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'Networking': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'Workshop': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'Hackathon': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'Meetup': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'Webinar': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'Summit': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'Expo': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  };

  return gradientMap[category] || generateGradient(category);
};

// Pattern overlay for visual interest
export const getPatternOverlay = (): string => {
  return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
};
