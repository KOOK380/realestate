import { PrismaClient } from "@prisma/client";
import { agents as mockAgents } from "../src/lib/data/mock/agents";
import { builders as mockBuilders } from "../src/lib/data/mock/builders";
import { cities as mockCities } from "../src/lib/data/mock/cities";
import {
  properties as mockProperties,
  deriveProjects,
} from "../src/lib/data/mock/properties";
import { reels as mockReels } from "../src/lib/data/mock/reels";
import {
  testimonials as mockTestimonials,
  blogs as mockBlogs,
} from "../src/lib/data/mock/misc";

const prisma = new PrismaClient();

const J = (v: unknown) => JSON.stringify(v);

async function main() {
  console.log("🌱 Seeding Luxe Estates database...");

  await prisma.$transaction([
    prisma.recentlyViewed.deleteMany(),
    prisma.savedProperty.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.message.deleteMany(),
    prisma.reelComment.deleteMany(),
    prisma.reel.deleteMany(),
    prisma.propertyImage.deleteMany(),
    prisma.floorPlan.deleteMany(),
    prisma.property.deleteMany(),
    prisma.project.deleteMany(),
    prisma.builder.deleteMany(),
    prisma.agent.deleteMany(),
    prisma.city.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Cities
  for (const c of mockCities) {
    await prisma.city.create({
      data: {
        id: c.id,
        name: c.name,
        state: c.state,
        country: c.country,
        image: c.image,
        propertyCount: c.propertyCount,
        trending: c.trending ?? false,
      },
    });
  }
  console.log(`  ✓ ${mockCities.length} cities`);

  // Builders
  for (const b of mockBuilders) {
    await prisma.builder.create({
      data: {
        id: b.id,
        name: b.name,
        logo: b.logo,
        coverImage: b.coverImage,
        established: b.established,
        projectsDelivered: b.projectsDelivered,
        rating: b.rating,
        verified: b.verified,
        bio: b.bio,
        cities: J(b.cities),
      },
    });
  }
  console.log(`  ✓ ${mockBuilders.length} builders`);

  // Agents
  for (const a of mockAgents) {
    await prisma.agent.create({
      data: {
        id: a.id,
        name: a.name,
        avatar: a.avatar,
        phone: a.phone,
        whatsapp: a.whatsapp,
        email: a.email,
        rating: a.rating,
        dealsClosed: a.dealsClosed,
        experienceYears: a.experienceYears,
        specialties: J(a.specialties),
        verified: a.verified,
        languages: J(a.languages),
        responseTime: a.responseTime,
      },
    });
  }
  console.log(`  ✓ ${mockAgents.length} agents`);

  // Properties
  for (const p of mockProperties) {
    await prisma.property.create({
      data: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle ?? null,
        description: p.description,
        transactionType: p.transactionType.toUpperCase(),
        type: p.type,
        price: p.price,
        pricePerSqft: p.pricePerSqft ?? null,
        rentMonthly: p.rentMonthly ?? null,
        deposit: p.deposit ?? null,
        bookingAmount: p.bookingAmount ?? null,
        beds: p.beds,
        baths: p.baths,
        area: p.area,
        furnishing: p.furnishing?.toUpperCase().replace(/\s+/g, "_") ?? null,
        possession: p.possession?.toUpperCase().replace(/\s+/g, "_") ?? null,
        possessionDate: p.possessionDate ? new Date(p.possessionDate) : null,
        city: p.city,
        locality: p.locality,
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        videoUrl: p.videoUrl ?? null,
        tour360Url: p.tour360Url ?? null,
        builderId: p.builderId ?? null,
        agentId: p.agentId,
        amenities: J(p.amenities),
        nearbyPlaces: J(p.nearbyPlaces),
        investmentScore: p.investmentScore ?? null,
        expectedRentalYield: p.expectedRentalYield ?? null,
        expectedAppreciation: p.expectedAppreciation ?? null,
        verified: p.verified,
        featured: p.featured,
        trending: p.trending,
        luxury: p.luxury,
        rating: p.rating,
        reviews: p.reviews,
        views: p.views,
        images: {
          create: p.images.map((url, i) => ({ url, position: i })),
        },
        floorPlans: {
          create: p.floorPlans.map((fp) => ({
            label: fp.label,
            area: fp.area,
            price: fp.price,
            beds: fp.beds,
            baths: fp.baths,
            image: fp.image,
          })),
        },
      },
    });
  }
  console.log(`  ✓ ${mockProperties.length} properties`);

  // Projects
  const projects = deriveProjects();
  for (const p of projects as any[]) {
    await prisma.project.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        builderId: p.builderId,
        tagline: p.tagline,
        description: p.description,
        city: p.city,
        locality: p.locality,
        startingPrice: p.startingPrice,
        type: p.type,
        configurations: J(p.configurations),
        status:
          p.status === "Under Construction" ? "UNDER_CONSTRUCTION" : "READY_TO_MOVE",
        reraId: p.reraId,
        rating: p.rating,
        unitsSold: p.unitsSold,
        totalUnits: p.totalUnits,
        possessionDate: p.possessionDate ? new Date(p.possessionDate) : null,
        featured: p.featured,
        trending: p.trending,
        images: J(p.images),
        amenities: J(p.amenities),
      },
    });
  }
  console.log(`  ✓ ${projects.length} projects`);

  // Reels
  for (const r of mockReels) {
    await prisma.reel.create({
      data: {
        id: r.id,
        propertyId: r.propertyId,
        videoUrl: r.videoUrl,
        poster: r.poster,
        caption: r.caption,
        hashtags: J(r.hashtags),
        music: r.music,
        views: r.views,
        likes: r.likes,
        shares: r.shares,
        saves: r.saves,
      },
    });
  }
  console.log(`  ✓ ${mockReels.length} reels`);

  // Testimonials & Blogs
  for (const t of mockTestimonials) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        avatar: t.avatar,
        role: t.role,
        rating: t.rating,
        text: t.text,
        city: t.city,
      },
    });
  }
  for (const b of mockBlogs) {
    await prisma.blogPost.create({
      data: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        cover: b.cover,
        author: b.author,
        authorAvatar: b.authorAvatar,
        category: b.category,
        readMinutes: b.readMinutes,
        publishedAt: new Date(b.publishedAt),
      },
    });
  }
  console.log(`  ✓ testimonials & blogs`);

  // Demo admin
  await prisma.user.upsert({
    where: { email: "admin@luxe-estates.app" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@luxe-estates.app",
      role: "ADMIN",
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
