import type {
  FloorPlan,
  NearbyPlace,
  Property,
  TransactionType,
} from "../types";
import { AMENITIES } from "@/lib/constants";
import { imagesFor } from "../images";
import { builders, builderById } from "./builders";
import { agents } from "./agents";
import { cities, LOCALITIES } from "./cities";

// Deterministic pseudo-random so the dataset is stable across renders.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260714);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const pickN = <T>(arr: readonly T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};
const between = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

interface Blueprint {
  type: Property["type"];
  beds: number;
  baths: number;
  area: [number, number]; // min, max sqft
  priceL: [number, number]; // in lakhs
  luxury: boolean;
}

const BLUEPRINTS: Blueprint[] = [
  { type: "Apartment", beds: 2, baths: 2, area: [900, 1300], priceL: [80, 180], luxury: false },
  { type: "Apartment", beds: 3, baths: 3, area: [1300, 1900], priceL: [120, 320], luxury: false },
  { type: "Apartment", beds: 4, baths: 4, area: [1900, 2600], priceL: [220, 480], luxury: true },
  { type: "Penthouse", beds: 4, baths: 5, area: [3200, 5200], priceL: [650, 1800], luxury: true },
  { type: "Villa", beds: 4, baths: 5, area: [2600, 4200], priceL: [320, 900], luxury: true },
  { type: "Villa", beds: 5, baths: 6, area: [4200, 6800], priceL: [600, 1500], luxury: true },
  { type: "Independent House", beds: 3, baths: 3, area: [1500, 2400], priceL: [150, 420], luxury: false },
  { type: "Studio", beds: 1, baths: 1, area: [380, 650], priceL: [35, 95], luxury: false },
  { type: "Plot", beds: 0, baths: 0, area: [1200, 5400], priceL: [40, 380], luxury: false },
  { type: "Commercial Office", beds: 0, baths: 2, area: [800, 5000], priceL: [120, 1200], luxury: false },
  { type: "Retail Shop", beds: 0, baths: 1, area: [300, 1500], priceL: [80, 600], luxury: false },
];

const POSSESSION = ["Ready to Move", "Under Construction"] as const;
const FURNISH = ["Fully Furnished", "Semi Furnished", "Unfurnished"] as const;
// Weighted possession sampler (Ready to Move shows up more often).
const POSSESSION_SAMPLES = ["Ready to Move", "Ready to Move", "Under Construction"] as const;

const TITLE_WORDS = {
  prefix: ["Skyline", "Azure", "Crescent", "The", "Grand", "Marina", "Royal", "Elevate", "Solis", "Aura", "Lumiere", "Eden"],
  suffix: ["Residences", "Heights", "Towers", "Estate", "Greens", "Park", "Square", "Manor", "Terrace", "Habitat", "Cove", "Haus"],
};
const PROJECT_TAGS = ["Sea View", "Smart Home", "Garden Facing", "Corner Unit", "Vastu Compliant", "RERA Approved", "Pet Friendly", "Solar Powered"];

function makeNearby(): NearbyPlace[] {
  const types: NearbyPlace["type"][] = ["school", "hospital", "mall", "transit", "restaurant", "park"];
  return pickN(types, between(4, 6)).map((type) => ({
    type,
    name: nearbyName(type),
    distanceKm: +(rand() * 4 + 0.3).toFixed(1),
  }));
}
function nearbyName(type: NearbyPlace["type"]): string {
  const names: Record<NearbyPlace["type"], string[]> = {
    school: ["Greenwood High", "Delhi Public School", "Bombay Scottish", "Oakridge International"],
    hospital: ["Fortis Hospital", "Apollo Clinic", "Manipal Care", "Lilavati Centre"],
    mall: ["Phoenix Marketcity", "DLF Mall", "Inorbit Mall", "UB City"],
    transit: ["Metro Station", "Central Railway", "Bus Terminal", "International Airport"],
    restaurant: ["The Table", "Social Kitchen", "Olive Bistro", "Toast & Tonic"],
    park: ["Central Park", "Riverside Garden", "Lakeside Promenade", "Green Boulevard"],
  };
  return pick(names[type]);
}

function makeFloorPlans(beds: number, basePrice: number): FloorPlan[] {
  if (beds === 0) return [];
  const variants: { beds: number; label: string }[] = [];
  const start = Math.max(2, beds - 1);
  for (let b = start; b <= beds + 1; b++) {
    variants.push({ beds: b, label: b === 1 ? "1 BHK" : `${b} BHK` });
  }
  return variants.slice(0, between(2, 3)).map((v, i) => ({
    id: `fp-${v.label}-${i}`,
    label: v.label,
    area: between(700 + v.beds * 350, 1100 + v.beds * 450),
    price: Math.round(basePrice * (0.7 + v.beds * 0.18)),
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    beds: v.beds,
    baths: Math.max(1, v.beds),
  }));
}

function buildProperty(idx: number): Property {
  const bp = pick(BLUEPRINTS);
  const city = pick(cities);
  const locality = pick(LOCALITIES[city.name] ?? [{ name: city.name, lat: city.lat, lng: city.lng }]);
  const isPlot = bp.type === "Plot";
  const isCommercial = bp.type === "Commercial Office" || bp.type === "Retail Shop";

  // Transaction type distribution
  let transactionType: TransactionType;
  if (isCommercial) transactionType = rand() > 0.4 ? "Commercial" : "Rent";
  else if (bp.luxury && rand() > 0.6) transactionType = "Invest";
  else transactionType = rand() > 0.35 ? "Buy" : "Rent";

  const area = between(bp.area[0], bp.area[1]);
  const priceL = between(bp.priceL[0], bp.priceL[1]);
  const price = priceL * 100000;
  const pricePerSqft = Math.round(price / area);

  // Rent: monthly derived from price (~0.3% monthly)
  const rentMonthly = transactionType === "Rent" ? Math.round((price * 0.003) / 1000) * 1000 : undefined;
  const deposit = rentMonthly ? rentMonthly * between(2, 6) : undefined;

  const builder = bp.luxury || isCommercial ? pick(builders) : pick(builders);
  const agent = pick(agents);

  const prefix = pick(TITLE_WORDS.prefix);
  const suffix = pick(TITLE_WORDS.suffix);
  const title = `${prefix} ${suffix}`;
  const projectName = `${prefix} ${suffix}`;

  const imagePool = imagesFor(bp.type);
  const images = pickN(imagePool, between(6, 8));

  const possession = pick(POSSESSION_SAMPLES);
  const furnishing = transactionType === "Rent" ? pick(FURNISH) : isPlot ? undefined : pick(FURNISH);

  const createdDaysAgo = between(1, 120);
  const createdAt = new Date(Date.now() - createdDaysAgo * 86400000).toISOString();
  const possessionDate =
    possession === "Under Construction"
      ? new Date(Date.now() + between(60, 540) * 86400000).toISOString()
      : undefined;

  const investmentScore = between(72, 96);
  const rentalYield = +(rand() * 3 + 2.5).toFixed(1);
  const appreciation = +(rand() * 8 + 6).toFixed(1);

  const verified = rand() > 0.25;
  const featured = bp.luxury && rand() > 0.4;
  const trending = rand() > 0.6;
  const luxury = bp.luxury;

  const slug = `${idx + 1}-${title.toLowerCase().replace(/\s+/g, "-")}-${locality.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return {
    id: `prop-${idx + 1}`,
    slug,
    title: isPlot ? `${locality.name} ${bp.type}` : title,
    subtitle: isPlot ? undefined : `${bp.type} · ${bp.beds} BHK`,
    description: `${title} by ${builder.name} is a thoughtfully designed ${bp.type.toLowerCase()} in ${locality.name}, ${city.name}. ${
      isPlot
        ? "A clear-title, RERA-approved plot perfect for building your dream home or as a long-term land investment."
        : `Spanning ${area.toLocaleString("en-IN")} sq.ft., this ${bp.beds} bedroom home offers ${bp.baths} bathrooms, premium finishes, abundant natural light, and a layout crafted for modern living.`
    } Residents enjoy ${pickN(AMENITIES, 5).join(", ")} and a vibrant neighbourhood minutes from ${locality.name}'s best dining, retail and transit.`,
    transactionType,
    price,
    pricePerSqft,
    rentMonthly,
    deposit,
    bookingAmount: Math.round(price * 0.1),
    type: bp.type,
    beds: bp.beds,
    baths: bp.baths,
    area,
    areaUnit: "sq.ft",
    furnishing: furnishing as Property["furnishing"],
    possession,
    possessionDate,
    city: city.name,
    locality: locality.name,
    address: `${between(1, 99)}, ${locality.name}, ${city.name} ${between(400001, 560100)}`,
    lat: locality.lat + (rand() - 0.5) * 0.04,
    lng: locality.lng + (rand() - 0.5) * 0.04,
    images,
    videoUrl: "https://videos.pexels.com/video-files/4128360/4128360-uhd_2560_1440_24fps.mp4",
    tour360Url: "https://my.matterport.com/show/?m=demo",
    builderId: builder.id,
    agentId: agent.id,
    amenities: pickN(AMENITIES, between(8, 14)),
    nearbyPlaces: makeNearby(),
    floorPlans: makeFloorPlans(bp.beds, price),
    investmentScore,
    expectedRentalYield: rentalYield,
    expectedAppreciation: appreciation,
    verified,
    featured,
    trending,
    luxury,
    rating: +(4.2 + rand() * 0.7).toFixed(1),
    reviews: between(8, 240),
    views: between(120, 18000),
    createdAt,
    tags: pickN(PROJECT_TAGS, between(2, 4)),
  };
}

// Avoid unused local; reuse POSSESSION via a stable array
export const properties: Property[] = Array.from({ length: 48 }, (_, i) => buildProperty(i));

// Derive projects from luxury/commercial properties for the Projects section
export function deriveProjects() {
  return properties
    .filter((p) => p.luxury || p.featured)
    .slice(0, 12)
    .map((p, i) => {
      const builder = p.builderId ? builderById(p.builderId) : undefined;
      return {
        id: `prj-${i + 1}`,
        slug: p.slug,
        name: p.title,
        builderId: p.builderId ?? builders[0].id,
        tagline: p.subtitle ?? `${p.type} in ${p.locality}`,
        description: p.description,
        city: p.city,
        locality: p.locality,
        startingPrice: Math.round(p.price * 0.8),
        type: p.type,
        configurations:
          p.beds === 0 ? ["Plot"] : [`${Math.max(2, p.beds - 1)} BHK`, `${p.beds} BHK`, `${p.beds + 1} BHK`],
        status: p.possession ?? "Ready to Move",
        reraId: `P${p.city.slice(0, 2).toUpperCase()}${(1000 + i * 7).toString()}`,
        images: p.images,
        amenities: p.amenities,
        rating: p.rating,
        unitsSold: between(40, 320),
        totalUnits: between(200, 600),
        possessionDate: p.possessionDate ?? new Date().toISOString(),
        featured: p.featured,
        trending: p.trending,
        builder,
      } as const;
    });
}

export const propertyById = (id: string) => properties.find((p) => p.id === id);
export const propertyBySlug = (slug: string) => properties.find((p) => p.slug === slug);
