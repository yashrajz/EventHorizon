import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

const SEO = ({
  title = "EventHorizon - Discover Startup Events Worldwide",
  description = "The curated directory for startup events. Find conferences, meetups, and networking opportunities for founders, investors, and builders across the globe.",
  keywords = "startup events, tech conferences, founder meetups, networking events, entrepreneurship, innovation, startup community",
  image = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop",
  url = "https://eventhorizon.com",
  type = "website"
}: SEOProps) => {
  const siteTitle = title.includes("EventHorizon") ? title : `${title} | EventHorizon`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="EventHorizon Team" />
    </Helmet>
  );
};

export default SEO;
