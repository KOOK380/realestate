import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Star,
  BadgeCheck,
  Phone,
  MessageCircle,
  CalendarCheck,
  Eye,
  Share2,
  Building2,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  TrainFront,
  Utensils,
  Trees,
  Award,
  TrendingUp,
  Percent,
  ChevronRight,
  Phone as PhoneIcon,
} from "lucide-react";
import {
  getPropertyBySlug,
  getRelatedProperties,
  getAgentById,
  getBuilderById,
} from "@/lib/data";
import { cn, formatPrice, formatArea, formatRent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PropertyGallery } from "@/components/property/property-gallery";
import { EMICalculator } from "@/components/property/emi-calculator";
import { SaveShareBar, StickyPropertyActions } from "@/components/property/property-actions";
import { BookVisit } from "@/components/property/book-visit";
import { PropertyCard } from "@/components/property/property-card";
import { RecentlyViewedTracker } from "@/components/property/recently-viewed-tracker";
import { SITE } from "@/lib/constants";

const NEARBY_ICONS = {
  school: GraduationCap,
  hospital: HeartPulse,
  mall: ShoppingBag,
  transit: TrainFront,
  restaurant: Utensils,
  park: Trees,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return {
    title: `${property.title} · ${property.locality}`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} · ${property.locality}`,
      description: property.description.slice(0, 160),
      images: [{ url: property.images[0], width: 1200, height: 630 }],
    },
  };
}

export default async function PropertyDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [related, agent, builder] = await Promise.all([
    getRelatedProperties(property, 4),
    getAgentById(property.agentId),
    property.builderId ? getBuilderById(property.builderId) : null,
  ]);

  const isRent = property.transactionType === "Rent";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality,
      addressRegion: property.city,
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
    },
  };

  return (
    <article className="pb-28 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecentlyViewedTracker property={property} />

      {/* Breadcrumbs */}
      <div className="container-luxe flex items-center gap-1.5 pt-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/${property.transactionType.toLowerCase()}`} className="hover:text-foreground">
          {property.transactionType}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{property.title}</span>
      </div>

      {/* Gallery */}
      <div className="container-luxe mt-4">
        <PropertyGallery
          images={property.images}
          videoUrl={property.videoUrl}
          tour360Url={property.tour360Url}
          title={property.title}
        />
      </div>

      {/* Main grid */}
      <div className="container-luxe mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {property.verified && (
                <Badge variant="success"><BadgeCheck className="h-3 w-3" /> Verified</Badge>
              )}
              <Badge variant="accent">{property.type}</Badge>
              {property.luxury && <Badge variant="gold"><Award className="h-3 w-3" /> Luxury</Badge>}
              {property.possession && <Badge variant="outline">{property.possession}</Badge>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {property.address}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                <span className="font-bold">{property.rating}</span>
                <span className="text-muted-foreground">({property.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-4 w-4" /> {property.views.toLocaleString("en-IN")} views
              </div>
            </div>

            {/* Specs */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {property.beds > 0 && (
                <SpecCard icon={<BedDouble className="h-5 w-5" />} value={property.beds} label="Bedrooms" />
              )}
              {property.baths > 0 && (
                <SpecCard icon={<Bath className="h-5 w-5" />} value={property.baths} label="Bathrooms" />
              )}
              <SpecCard
                icon={<Maximize className="h-5 w-5" />}
                value={formatArea(property.area)}
                label="Built-up area"
              />
              <SpecCard
                icon={<Building2 className="h-5 w-5" />}
                value={property.type}
                label="Property type"
              />
            </div>

            <div className="mt-5">
              <SaveShareBar property={property} />
            </div>
          </div>

          {/* Description */}
          <Section title="About this property">
            <p className="leading-relaxed text-muted-foreground">{property.description}</p>
            {property.tags && property.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {property.tags.map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            )}
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  {a}
                </div>
              ))}
            </div>
          </Section>

          {/* Floor plans */}
          {property.floorPlans.length > 0 && (
            <Section title="Floor plans & configurations">
              <div className="grid gap-4 sm:grid-cols-2">
                {property.floorPlans.map((fp) => (
                  <Card key={fp.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image src={fp.image} alt={fp.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      <Badge variant="dark" className="absolute left-3 top-3">{fp.label}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="text-sm">
                        <div className="text-muted-foreground">{formatArea(fp.area)} · {fp.beds}BHK</div>
                        <div className="font-display text-lg font-bold">{formatPrice(fp.price)}</div>
                      </div>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {/* Map & nearby */}
          <Section title="Location & nearby">
            <MapEmbed lat={property.lat} lng={property.lng} label={property.locality} />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.nearbyPlaces.map((place, i) => {
                const Icon = NEARBY_ICONS[place.type];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card/40 px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{place.name}</div>
                      <div className="text-xs text-muted-foreground">{place.distanceKm} km</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Investment analysis */}
          {(property.investmentScore || property.expectedRentalYield) && (
            <Section title="Investment analysis">
              <div className="grid gap-4 sm:grid-cols-3">
                {property.investmentScore && (
                  <ScoreCard
                    label="Investment score"
                    score={property.investmentScore}
                    icon={<TrendingUp className="h-5 w-5" />}
                    tone="primary"
                  />
                )}
                {property.expectedRentalYield && (
                  <ScoreCard
                    label="Rental yield"
                    score={property.expectedRentalYield}
                    suffix="% / yr"
                    icon={<Percent className="h-5 w-5" />}
                    tone="emerald"
                  />
                )}
                {property.expectedAppreciation && (
                  <ScoreCard
                    label="Appreciation"
                    score={property.expectedAppreciation}
                    suffix="% / yr"
                    icon={<TrendingUp className="h-5 w-5" />}
                    tone="gold"
                  />
                )}
              </div>
            </Section>
          )}

          {/* EMI Calculator */}
          {!isRent && <EMICalculator price={property.price} />}
        </div>

        {/* RIGHT — sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
          <Card className="p-6">
            {/* Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-display text-3xl font-extrabold">
                  {isRent ? formatRent(property.rentMonthly ?? property.price) : formatPrice(property.price)}
                </div>
                {!isRent && property.pricePerSqft && (
                  <div className="text-sm text-muted-foreground">
                    ₹{property.pricePerSqft.toLocaleString("en-IN")} / sq.ft
                  </div>
                )}
              </div>
              <Badge variant="accent">{property.transactionType}</Badge>
            </div>

            {isRent && property.deposit && (
              <div className="mt-2 text-sm text-muted-foreground">
                Security deposit: <span className="font-semibold text-foreground">₹{property.deposit.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* Agent */}
            {agent && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback>{agent.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {agent.name}
                    {agent.verified && <BadgeCheck className="h-3.5 w-3.5 text-teal-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ★ {agent.rating} · {agent.dealsClosed} deals · {agent.responseTime}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <BookVisit property={property} triggerVariant="gradient" />
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${SITE.supportPhoneHref}`}>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                </a>
                <a href={`https://wa.me/${SITE.whatsappHref}`} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Builder */}
            {builder && (
              <Link
                href={`/buy?builder=${builder.id}`}
                className="mt-5 flex items-center gap-3 rounded-2xl border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                  <Image src={builder.logo} alt={builder.name} fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{builder.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ★ {builder.rating} · {builder.projectsDelivered} projects
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            )}

            {/* Quick facts */}
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <FactRow label="Furnishing" value={property.furnishing ?? "—"} />
              <FactRow label="Possession" value={property.possession ?? "—"} />
              <FactRow label="Booking amount" value={property.bookingAmount ? formatPrice(property.bookingAmount) : "—"} />
              <FactRow label="Property ID" value={property.id.toUpperCase()} />
            </div>
          </Card>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-luxe mt-16">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">More like this</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      <StickyPropertyActions property={property} />
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SpecCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="mt-2 font-display text-lg font-bold leading-none">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  suffix,
  icon,
  tone,
}: {
  label: string;
  score: number;
  suffix?: string;
  icon: React.ReactNode;
  tone: "primary" | "emerald" | "gold";
}) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600",
    gold: "bg-gold/10 text-gold-600",
  };
  return (
    <Card className="p-4">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors[tone])}>
        {icon}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">
        {score}
        {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// Lightweight map embed using OpenStreetMap (no API key required)
function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const delta = 0.01;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border">
      <iframe
        title={`Map of ${label}`}
        className="h-full w-full"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
      />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        <MapPin className="mr-1 inline h-3 w-3" /> {label}
      </div>
    </div>
  );
}
