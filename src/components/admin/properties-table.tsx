"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Upload,
  Download,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Property } from "@/lib/data/types";

export function PropertiesTable({ items }: { items: Property[] }) {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<string>("All");

  const filtered = items.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.locality.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === "All" || p.type === type;
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} total · {items.filter((p) => p.featured).length} featured
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Bulk import coming soon")}>
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Exporting…")}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="gradient" size="sm" onClick={() => toast.info("Property editor coming in backend phase")}>
            <Plus className="h-4 w-4" /> Add property
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {["All", "Apartment", "Villa", "Plot", "Penthouse"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  type === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Property</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Rating</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 20).map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.images[0]} alt={p.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{p.title}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.locality}, {p.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{p.type}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.verified && <Badge variant="success">Verified</Badge>}
                      {p.featured && <Badge variant="gold">Featured</Badge>}
                      {p.trending && <Badge variant="default">Trending</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                      {p.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/property/${p.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Editor coming soon")}>
                            <Edit3 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => toast.info("Delete coming soon")}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No properties match your filters.
          </div>
        )}
      </Card>
    </div>
  );
}
