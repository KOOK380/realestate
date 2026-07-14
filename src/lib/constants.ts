export const SITE = {
  name: "Luxe Estates",
  tagline: "Discover properties worth coming home to.",
  description:
    "Luxe Estates is a premium real estate platform where you discover homes through beautiful video, immersive tours, and curated collections — across Buy, Rent and Invest.",
  url: "https://luxe-estates.app",
  locale: "en_IN",
  currency: "INR",
  supportPhone: "+91 98765 43210",
  supportPhoneHref: "+919876543210",
  whatsappHref: "919876543210",
  email: "hello@luxe-estates.app",
} as const;

export const WHATSAPP_DEFAULT = `https://wa.me/${SITE.whatsappHref}?text=${encodeURIComponent(
  "Hi, I'm interested in a property I saw on Luxe Estates."
)}`;

export interface NavLink {
  label: string;
  href: string;
  featured?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Invest", href: "/invest" },
  { label: "Reels", href: "/reels", featured: true },
];

export const MOBILE_NAV = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Buy", href: "/buy", icon: "Building2" },
  { label: "Rent", href: "/rent", icon: "KeyRound" },
  { label: "Invest", href: "/invest", icon: "TrendingUp" },
  { label: "Reels", href: "/reels", icon: "Video", featured: true },
  { label: "Saved", href: "/account/saved", icon: "Heart" },
  { label: "Account", href: "/account", icon: "User" },
] as const;

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Independent House",
  "Penthouse",
  "Studio",
  "Plot",
  "Commercial Office",
  "Retail Shop",
  "Warehouse",
] as const;

export const TRANSACTION_TYPES = ["Buy", "Rent", "Invest", "Commercial"] as const;

export const BHK_OPTIONS = ["1", "2", "3", "4", "5+"] as const;

export const FURNISH_OPTIONS = [
  "Fully Furnished",
  "Semi Furnished",
  "Unfurnished",
] as const;

export const CITY_OPTIONS = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Goa",
  "Dubai",
];

export const POPULAR_SEARCHES = [
  "3BHK in Bandra",
  "Villa in Goa",
  "Penthouse Mumbai",
  "Apartment Whitefield Bangalore",
  "Plot in Pune",
  "Luxury Dubai Marina",
  "Studio Hyderabad",
  "Sea view apartment",
];

export const AMENITIES = [
  "Swimming Pool",
  "Gymnasium",
  "24/7 Security",
  "Power Backup",
  "Covered Parking",
  "Clubhouse",
  "Garden",
  "Kids Play Area",
  "Lift",
  "CCTV",
  "Fire Safety",
  "Rain Water Harvesting",
  "EV Charging",
  "Smart Home",
  "Concierge",
  "Spa",
  "Tennis Court",
  "Private Terrace",
  "Sea View",
  "Modular Kitchen",
];

export const BUDGET_STEPS = [
  0, 5_000_000, 1_00_00_000, 2_00_00_000, 5_00_00_000, 10_00_00_000,
] as const;

export const NEARBY_PLACE_TYPES = [
  { type: "school", label: "Schools", icon: "GraduationCap" },
  { type: "hospital", label: "Hospitals", icon: "HeartPulse" },
  { type: "mall", label: "Shopping", icon: "ShoppingBag" },
  { type: "transit", label: "Transit", icon: "TrainFront" },
  { type: "restaurant", label: "Dining", icon: "Utensils" },
  { type: "park", label: "Parks", icon: "Trees" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: "Instagram" },
  { label: "Twitter / X", href: "#", icon: "Twitter" },
  { label: "Facebook", href: "#", icon: "Facebook" },
  { label: "YouTube", href: "#", icon: "Youtube" },
  { label: "LinkedIn", href: "#", icon: "Linkedin" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Buy", href: "/buy" },
      { label: "Rent", href: "/rent" },
      { label: "Invest", href: "/invest" },
      { label: "Reels", href: "/reels" },
      { label: "Commercial", href: "/buy?type=Commercial" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "EMI Calculator", href: "#" },
      { label: "Investment Guide", href: "#" },
      { label: "Home Loan", href: "#" },
      { label: "Property Valuation", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
      { label: "RERA", href: "#" },
    ],
  },
] as const;
