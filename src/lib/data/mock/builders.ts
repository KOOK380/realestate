import type { Builder } from "../types";

export const builders: Builder[] = [
  {
    id: "bld-1",
    name: "Oberoi Realty",
    logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=200&q=80",
    established: 1990,
    projectsDelivered: 48,
    rating: 4.8,
    cities: ["Mumbai"],
    verified: true,
    bio: "Three decades of crafting Mumbai's most sought-after luxury addresses with a relentless focus on design and quality.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "bld-2",
    name: "Lodha Group",
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=200&q=80",
    established: 1980,
    projectsDelivered: 132,
    rating: 4.6,
    cities: ["Mumbai", "Pune", "Delhi NCR"],
    verified: true,
    bio: "One of India's largest real estate developers, building landmark residential and commercial developments.",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "bld-3",
    name: "Prestige Group",
    logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=200&q=80",
    established: 1986,
    projectsDelivered: 285,
    rating: 4.7,
    cities: ["Bangalore", "Chennai", "Hyderabad", "Mumbai"],
    verified: true,
    bio: "Bangalore's most trusted developer, renowned for large-scale integrated townships and luxury enclaves.",
    coverImage:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "bld-4",
    name: "DLF Limited",
    logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=200&q=80",
    established: 1946,
    projectsDelivered: 158,
    rating: 4.7,
    cities: ["Delhi NCR", "Chennai", "Bangalore"],
    verified: true,
    bio: "Pioneers of the Indian real estate industry, defining premium living and world-class commercial spaces.",
    coverImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "bld-5",
    name: "My Home Group",
    logo: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=200&q=80",
    established: 1987,
    projectsDelivered: 73,
    rating: 4.6,
    cities: ["Hyderabad"],
    verified: true,
    bio: "Hyderabad's flagship developer building self-sustained smart communities across the city.",
    coverImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "bld-6",
    name: "Emaar Properties",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80",
    established: 1997,
    projectsDelivered: 64,
    rating: 4.9,
    cities: ["Dubai", "Delhi NCR"],
    verified: true,
    bio: "Creators of the world's most iconic skyline, including Downtown Dubai and Burj Khalifa.",
    coverImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
  },
];

export const builderById = (id: string) => builders.find((b) => b.id === id)!;
