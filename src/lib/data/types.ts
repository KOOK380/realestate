// ─────────────────────────────────────────────────────────────
// Domain types for Luxe Estates
// These mirror the Prisma schema and are used across the app.
// ─────────────────────────────────────────────────────────────

export type TransactionType = "Buy" | "Rent" | "Invest" | "Commercial";

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  image: string;
  propertyCount: number;
  trending?: boolean;
  lat?: number;
  lng?: number;
}

export interface Builder {
  id: string;
  name: string;
  logo: string;
  established: number;
  projectsDelivered: number;
  rating: number;
  cities: string[];
  verified: boolean;
  bio: string;
  coverImage: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  dealsClosed: number;
  experienceYears: number;
  specialties: string[];
  verified: boolean;
  languages: string[];
  responseTime: string;
}

export interface NearbyPlace {
  type: "school" | "hospital" | "mall" | "transit" | "restaurant" | "park";
  name: string;
  distanceKm: number;
}

export interface FloorPlan {
  id: string;
  label: string; // e.g. "3 BHK"
  area: number;
  price: number;
  image: string;
  beds: number;
  baths: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  transactionType: TransactionType;

  price: number;
  pricePerSqft?: number;
  rentMonthly?: number; // for rent listings
  deposit?: number;
  bookingAmount?: number;

  type: string; // Apartment, Villa, ...
  beds: number;
  baths: number;
  area: number;
  areaUnit?: string;
  furnishing?: "Fully Furnished" | "Semi Furnished" | "Unfurnished";
  possession?: "Ready to Move" | "Under Construction";
  possessionDate?: string;

  // Location
  city: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;

  // Media
  images: string[];
  videoUrl?: string;
  tour360Url?: string;

  // Relations
  builderId?: string;
  agentId: string;
  amenities: string[];
  nearbyPlaces: NearbyPlace[];
  floorPlans: FloorPlan[];

  // Investment signals
  investmentScore?: number; // 0-100
  expectedRentalYield?: number; // %
  expectedAppreciation?: number; // % per year

  // Meta
  verified: boolean;
  featured: boolean;
  trending: boolean;
  luxury: boolean;
  rating: number;
  reviews: number;
  views: number;
  createdAt: string;
  tags?: string[];

  // Reels generated for this property
  reelIds?: string[];
}

export interface Reel {
  id: string;
  propertyId: string;
  videoUrl: string;
  poster: string;
  caption: string;
  hashtags: string[];
  music?: string;
  views: number;
  likes: number;
  comments: ReelComment[];
  shares: number;
  saves: number;
  createdAt: string;
}

export interface ReelComment {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  likes: number;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  builderId: string;
  tagline: string;
  description: string;
  city: string;
  locality: string;
  startingPrice: number;
  type: string;
  configurations: string[]; // ["2 BHK", "3 BHK", "4 BHK"]
  status: "Ready to Move" | "Under Construction" | "New Launch";
  reraId: string;
  images: string[];
  amenities: string[];
  rating: number;
  unitsSold: number;
  totalUnits: number;
  possessionDate: string;
  featured: boolean;
  trending: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  text: string;
  city: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  authorAvatar: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
}

export interface InvestmentOpportunity {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  image: string;
  entryPrice: number;
  expectedRentalYield: number;
  expectedAppreciation: number;
  horizonYears: number;
  rating: "A+" | "A" | "B+" | "B";
  tags: string[];
}

// ── Filter shape shared by listing pages ──────────────────────
export interface PropertyFilters {
  transactionType?: TransactionType;
  type?: string;
  city?: string;
  locality?: string;
  query?: string;
  beds?: number;
  baths?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  furnishing?: string;
  possession?: string;
  builderId?: string;
  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
  luxury?: boolean;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest" | "area-desc" | "rating";
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
