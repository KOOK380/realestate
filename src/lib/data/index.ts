// ─────────────────────────────────────────────────────────────
// DATA ACCESS LAYER — single swap point.
// Set DATA_SOURCE=db to read from Prisma instead of mock data.
// ─────────────────────────────────────────────────────────────

import type {
  BlogPost,
  Builder,
  City,
  InvestmentOpportunity,
  Paginated,
  Project,
  Property,
  PropertyFilters,
  Reel,
  Testimonial,
  Agent,
} from "./types";

import { properties as mockProperties } from "./mock/properties";
import { builders as mockBuilders } from "./mock/builders";
import { agents as mockAgents } from "./mock/agents";
import { cities as mockCities } from "./mock/cities";
import { reels as mockReels } from "./mock/reels";
import {
  testimonials as mockTestimonials,
  blogs as mockBlogs,
  investmentOpportunities as mockInvestments,
} from "./mock/misc";
import { deriveProjects } from "./mock/properties";

export const DATA_SOURCE =
  (process.env.DATA_SOURCE as "mock" | "db" | undefined) ?? "mock";

// ── Properties ────────────────────────────────────────────────
function applyFilters(list: Property[], f: PropertyFilters): Property[] {
  let out = list;
  if (f.transactionType) out = out.filter((p) => p.transactionType === f.transactionType || (f.transactionType === "Commercial" && p.type.includes("Commercial")));
  if (f.type && f.type !== "All") out = out.filter((p) => p.type === f.type);
  if (f.city && f.city !== "All") out = out.filter((p) => p.city === f.city);
  if (f.locality) out = out.filter((p) => p.locality === f.locality);
  if (f.query) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (f.beds != null) {
    const beds = f.beds;
    out = out.filter((p) => p.beds === beds || (beds >= 5 && p.beds >= 5));
  }
  if (f.baths != null) {
    const baths = f.baths;
    out = out.filter((p) => p.baths >= baths);
  }
  if (f.minPrice != null) {
    const min = f.minPrice;
    out = out.filter((p) => p.price >= min);
  }
  if (f.maxPrice != null) {
    const max = f.maxPrice;
    out = out.filter((p) => p.price <= max);
  }
  if (f.minArea != null) {
    const min = f.minArea;
    out = out.filter((p) => p.area >= min);
  }
  if (f.furnishing) out = out.filter((p) => p.furnishing === f.furnishing);
  if (f.possession) out = out.filter((p) => p.possession === f.possession);
  if (f.builderId) out = out.filter((p) => p.builderId === f.builderId);
  if (f.verified) out = out.filter((p) => p.verified);
  if (f.featured) out = out.filter((p) => p.featured);
  if (f.trending) out = out.filter((p) => p.trending);
  if (f.luxury) out = out.filter((p) => p.luxury);

  switch (f.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      out = [...out].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "area-desc":
      out = [...out].sort((a, b) => b.area - a.area);
      break;
    case "rating":
      out = [...out].sort((a, b) => b.rating - a.rating);
      break;
    default:
      // relevance: featured → trending → verified → views
      out = [...out].sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.trending) - Number(a.trending) ||
          Number(b.verified) - Number(a.verified) ||
          b.views - a.views
      );
  }
  return out;
}

export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  pageSize = 12
): Promise<Paginated<Property>> {
  const all = applyFilters(mockProperties, filters);
  const start = (page - 1) * pageSize;
  return {
    items: all.slice(start, start + pageSize),
    total: all.length,
    page,
    pageSize,
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return mockProperties.find((p) => p.slug === slug) ?? null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return mockProperties.find((p) => p.id === id) ?? null;
}

export async function getRelatedProperties(
  property: Property,
  limit = 4
): Promise<Property[]> {
  return mockProperties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.city === property.city || p.type === property.type)
    )
    .slice(0, limit);
}

// ── Reels ─────────────────────────────────────────────────────
export async function getReels(): Promise<Reel[]> {
  return mockReels;
}

export async function getReelsByProperty(propertyId: string): Promise<Reel[]> {
  return mockReels.filter((r) => r.propertyId === propertyId);
}

// ── Builders / Agents / Cities ────────────────────────────────
export async function getBuilders(): Promise<Builder[]> {
  return mockBuilders;
}
export async function getBuilderById(id: string): Promise<Builder | null> {
  return mockBuilders.find((b) => b.id === id) ?? null;
}
export async function getAgents(): Promise<Agent[]> {
  return mockAgents;
}
export async function getAgentById(id: string): Promise<Agent | null> {
  return mockAgents.find((a) => a.id === id) ?? null;
}
export async function getCities(): Promise<City[]> {
  return mockCities;
}

// ── Projects / Investments / Testimonials / Blogs ─────────────
let _projects: Project[] | null = null;
export async function getProjects(): Promise<Project[]> {
  if (!_projects) _projects = deriveProjects() as unknown as Project[];
  return _projects;
}

export async function getInvestmentOpportunities(): Promise<InvestmentOpportunity[]> {
  return mockInvestments;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return mockTestimonials;
}

export async function getBlogs(limit?: number): Promise<BlogPost[]> {
  return limit ? mockBlogs.slice(0, limit) : mockBlogs;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return mockBlogs.find((b) => b.slug === slug) ?? null;
}

// ── Home aggregates ───────────────────────────────────────────
export async function getHomeData() {
  return {
    trendingProperties: mockProperties.filter((p) => p.trending).slice(0, 8),
    luxuryVillas: mockProperties.filter((p) => p.type === "Villa").slice(0, 8),
    apartments: mockProperties.filter((p) => p.type === "Apartment").slice(0, 8),
    commercial: mockProperties
      .filter((p) => p.type.includes("Commercial") || p.type === "Retail Shop")
      .slice(0, 8),
    plots: mockProperties.filter((p) => p.type === "Plot").slice(0, 8),
    featured: mockProperties.filter((p) => p.featured).slice(0, 6),
    latestReels: mockReels.slice(0, 10),
    investments: mockInvestments.slice(0, 4),
    cities: mockCities,
    builders: mockBuilders,
    testimonials: mockTestimonials,
    blogs: mockBlogs.slice(0, 3),
  };
}

// Re-export types for convenience
export * from "./types";
