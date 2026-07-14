import type { City } from "../types";
import { CITY_IMAGES } from "../images";

interface CitySeed {
  name: string;
  state: string;
  country: string;
  propertyCount: number;
  trending?: boolean;
  lat: number;
  lng: number;
}

const citySeeds: CitySeed[] = [
  { name: "Mumbai", state: "Maharashtra", country: "India", propertyCount: 18420, trending: true, lat: 19.076, lng: 72.8777 },
  { name: "Delhi NCR", state: "Delhi", country: "India", propertyCount: 15230, trending: true, lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", state: "Karnataka", country: "India", propertyCount: 22890, trending: true, lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", state: "Telangana", country: "India", propertyCount: 13760, lat: 17.385, lng: 78.4867 },
  { name: "Pune", state: "Maharashtra", country: "India", propertyCount: 16450, lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", state: "Tamil Nadu", country: "India", propertyCount: 11320, lat: 13.0827, lng: 80.2707 },
  { name: "Goa", state: "Goa", country: "India", propertyCount: 4210, trending: true, lat: 15.2993, lng: 74.124 },
  { name: "Dubai", state: "Dubai", country: "UAE", propertyCount: 8980, trending: true, lat: 25.2048, lng: 55.2708 },
];

export const cities: City[] = citySeeds.map((c, i) => ({
  id: `city-${i + 1}`,
  name: c.name,
  state: c.state,
  country: c.country,
  propertyCount: c.propertyCount,
  trending: c.trending,
  lat: c.lat,
  lng: c.lng,
  image: CITY_IMAGES[c.name as keyof typeof CITY_IMAGES],
}));

// Localities per city for richer mock data
export const LOCALITIES: Record<string, { name: string; lat: number; lng: number }[]> = {
  Mumbai: [
    { name: "Bandra West", lat: 19.0596, lng: 72.8295 },
    { name: "Worli", lat: 19.0176, lng: 72.8177 },
    { name: "Lower Parel", lat: 19.0084, lng: 72.83 },
    { name: "Juhu", lat: 19.0972, lng: 72.8264 },
    { name: "Powai", lat: 19.1176, lng: 72.906 },
  ],
  "Delhi NCR": [
    { name: "Vasant Kunj", lat: 28.5184, lng: 77.1591 },
    { name: "Gurgaon Golf Course Road", lat: 28.4595, lng: 77.0266 },
    { name: "Dwarka", lat: 28.5921, lng: 77.046 },
    { name: "Noida Sector 150", lat: 28.4707, lng: 77.4608 },
    { name: "Lutyens' Delhi", lat: 28.6139, lng: 77.209 },
  ],
  Bangalore: [
    { name: "Indiranagar", lat: 12.9719, lng: 77.6412 },
    { name: "Whitefield", lat: 12.9698, lng: 77.75 },
    { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
    { name: "HSR Layout", lat: 12.9116, lng: 77.6473 },
    { name: "Hebbal", lat: 13.0358, lng: 77.597 },
  ],
  Hyderabad: [
    { name: "Banjara Hills", lat: 17.4156, lng: 78.4347 },
    { name: "Jubilee Hills", lat: 17.4239, lng: 78.4083 },
    { name: "Gachibowli", lat: 17.4401, lng: 78.3489 },
    { name: "Kokapet", lat: 17.4035, lng: 78.3622 },
    { name: "Hitech City", lat: 17.4435, lng: 78.3772 },
  ],
  Pune: [
    { name: "Koregaon Park", lat: 18.5362, lng: 73.8939 },
    { name: "Baner", lat: 18.559, lng: 73.7761 },
    { name: "Hinjewadi", lat: 18.5912, lng: 73.7389 },
    { name: "Viman Nagar", lat: 18.5679, lng: 73.9143 },
    { name: "Kharadi", lat: 18.556, lng: 73.9408 },
  ],
  Chennai: [
    { name: "Adyar", lat: 13.0012, lng: 80.2565 },
    { name: "OMR", lat: 12.8244, lng: 80.2228 },
    { name: "Anna Nagar", lat: 13.085, lng: 80.2101 },
    { name: "Velachery", lat: 12.9792, lng: 80.2207 },
  ],
  Goa: [
    { name: "Panaji", lat: 15.4909, lng: 73.8278 },
    { name: "Calangute", lat: 15.544, lng: 73.7553 },
    { name: "Assagao", lat: 15.6175, lng: 73.7586 },
    { name: "Dona Paula", lat: 15.4516, lng: 73.7981 },
  ],
  Dubai: [
    { name: "Downtown Dubai", lat: 25.1972, lng: 55.2744 },
    { name: "Dubai Marina", lat: 25.0805, lng: 55.1403 },
    { name: "Palm Jumeirah", lat: 25.1124, lng: 55.139 },
    { name: "JVC", lat: 25.0618, lng: 55.2614 },
    { name: "Business Bay", lat: 25.1865, lng: 55.265 },
  ],
};

export const cityById = (id: string) => cities.find((c) => c.id === id);
export const cityByName = (name: string) => cities.find((c) => c.name === name);
