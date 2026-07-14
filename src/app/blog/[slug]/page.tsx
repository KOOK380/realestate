import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getBlogBySlug, getBlogs } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = (await getBlogs()).filter((b) => b.id !== post.id).slice(0, 3);

  return (
    <article className="container-luxe max-w-3xl py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="mt-6">
        <Badge variant="accent">{post.category}</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Image
              src={post.authorAvatar}
              alt={post.author}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readMinutes} min read
          </span>
        </div>
      </div>

      <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl">
        <Image src={post.cover} alt={post.title} fill className="object-cover" priority />
      </div>

      <div className="mt-8 space-y-4 text-lg leading-relaxed text-foreground/90">
        <p className="text-xl font-medium text-foreground">{post.excerpt}</p>
        <p>{post.content}</p>
        <p>
          At Luxe Estates, we believe finding a home should be as joyful as living
          in one. That's why every listing is verified, every tour is immersive,
          and every interaction is designed to feel effortless. Whether you're
          buying your first apartment, renting a studio, or investing in a
          luxury villa, our platform brings together the best of Instagram-style
          discovery and Airbnb-grade trust.
        </p>
        <p>
          Stay tuned for more deep-dives, market data, and buying guides. And if
          there's a topic you'd like us to cover, drop us a line — we read every
          message.
        </p>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-2xl font-bold">More from the blog</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {related.map((b) => (
            <Link key={b.id} href={`/blog/${b.slug}`}>
              <Card className="group h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={b.cover}
                    alt={b.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold leading-tight group-hover:text-primary">
                    {b.title}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
