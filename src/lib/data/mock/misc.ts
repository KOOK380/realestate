import type { BlogPost, InvestmentOpportunity, Testimonial } from "../types";
import { TESTIMONIAL_AVATARS, BLOG_COVERS } from "../images";
import { properties } from "./properties";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aditya Joshi",
    avatar: TESTIMONIAL_AVATARS[0],
    role: "Software Engineer, Bangalore",
    rating: 5,
    text: "Found our forever home through a Reel — yes, a Reel! The whole process from discovery to site visit took 4 days. Genuinely the smoothest real estate experience.",
    city: "Bangalore",
  },
  {
    id: "t2",
    name: "Meera Krishnan",
    avatar: TESTIMONIAL_AVATARS[1],
    role: "Architect, Mumbai",
    rating: 5,
    text: "As someone who notices every detail, I was blown away. The 360 tours, floor plans, investment scores — it's clear real experts built this.",
    city: "Mumbai",
  },
  {
    id: "t3",
    name: "Faisal Rahman",
    avatar: TESTIMONIAL_AVATARS[2],
    role: "NRI Investor, Dubai",
    rating: 5,
    text: "Managing my India investments from Dubai has never been easier. The Invest section's ROI calculator and verified listings gave me real confidence.",
    city: "Dubai",
  },
  {
    id: "t4",
    name: "Sneha & Rahul",
    avatar: TESTIMONIAL_AVATARS[3],
    role: "First-time buyers, Pune",
    rating: 5,
    text: "We were nervous first-time buyers. The agents are responsive, the EMI calculator helped us budget, and we closed in 3 weeks. Thank you!",
    city: "Pune",
  },
  {
    id: "t5",
    name: "Vikrant Desai",
    avatar: TESTIMONIAL_AVATARS[4],
    role: "Founder, Hyderabad",
    rating: 4,
    text: "Beautiful product. Filtered 200+ listings down to 6 in minutes and the WhatsApp connect to agents was instant. Small UX wins everywhere.",
    city: "Hyderabad",
  },
  {
    id: "t6",
    name: "Priyanka Rao",
    avatar: TESTIMONIAL_AVATARS[5],
    role: "Marketing Lead, Goa",
    rating: 5,
    text: "Bought a holiday villa in Goa entirely through the platform. The reels sold me before I even visited. It really does feel like Airbnb × Instagram.",
    city: "Goa",
  },
];

export const blogs: BlogPost[] = [
  {
    id: "blog-1",
    slug: "2026-luxury-real-estate-trends",
    title: "7 Luxury Real Estate Trends Defining 2026",
    excerpt:
      "From branded residences to wellness floors, here's what's shaping how the top 1% are buying homes this year.",
    content:
      "The luxury segment is being rewritten. Buyers in 2026 want more than square footage — they want experiences, smart living, and provenance.",
    cover: BLOG_COVERS[0],
    author: "Aarav Mehta",
    authorAvatar: TESTIMONIAL_AVATARS[0],
    category: "Market Insights",
    readMinutes: 6,
    publishedAt: "2026-07-02T10:00:00.000Z",
  },
  {
    id: "blog-2",
    slug: "first-home-buyers-guide-india",
    title: "The First-Time Home Buyer's Guide (India Edition)",
    excerpt:
      "Everything you need: home loans, RERA, stamp duty, registry and the hidden costs nobody talks about.",
    content: "Buying your first home? Start here. We break down the entire process end to end.",
    cover: BLOG_COVERS[1],
    author: "Priya Nair",
    authorAvatar: TESTIMONIAL_AVATARS[1],
    category: "Guides",
    readMinutes: 9,
    publishedAt: "2026-06-20T10:00:00.000Z",
  },
  {
    id: "blog-3",
    slug: "rental-yield-cities-2026",
    title: "Which Indian City Offers the Best Rental Yield in 2026?",
    excerpt:
      "We analysed 50,000 listings. The results may surprise you — and where NRIs should be parking their money.",
    content: "Rental yield isn't uniform. Here's the data-driven breakdown by city and asset class.",
    cover: BLOG_COVERS[2],
    author: "Rohan Kapoor",
    authorAvatar: TESTIMONIAL_AVATARS[2],
    category: "Investing",
    readMinutes: 7,
    publishedAt: "2026-06-08T10:00:00.000Z",
  },
  {
    id: "blog-4",
    slug: "designing-the-perfect-penthouse",
    title: "Designing the Perfect Penthouse: An Architect's Notes",
    excerpt:
      "Double-height ceilings, private terraces, and the underrated details that make a penthouse feel worth it.",
    content: "What separates a great penthouse from a great apartment? Space, light, and intent.",
    cover: BLOG_COVERS[3],
    author: "Sneha Reddy",
    authorAvatar: TESTIMONIAL_AVATARS[3],
    category: "Design",
    readMinutes: 5,
    publishedAt: "2026-05-29T10:00:00.000Z",
  },
];

// Derive investment opportunities from invest/luxury properties
export const investmentOpportunities: InvestmentOpportunity[] = properties
  .filter((p) => p.transactionType === "Invest" || p.luxury)
  .slice(0, 8)
  .map((p, i) => ({
    id: `inv-${i + 1}`,
    propertyId: p.id,
    title: p.title,
    location: `${p.locality}, ${p.city}`,
    image: p.images[0],
    entryPrice: p.price,
    expectedRentalYield: p.expectedRentalYield ?? 4,
    expectedAppreciation: p.expectedAppreciation ?? 8,
    horizonYears: [5, 7, 10][i % 3],
    rating: (["A+", "A", "A+", "B+"] as const)[i % 4],
    tags: p.tags ?? [],
  }));

export const blogBySlug = (slug: string) => blogs.find((b) => b.slug === slug);
