"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Video,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Upload,
  Download,
  CalendarCheck,
  Heart,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const trafficData = [
  { name: "Mon", views: 4200, leads: 42 },
  { name: "Tue", views: 5100, leads: 51 },
  { name: "Wed", views: 4800, leads: 48 },
  { name: "Thu", views: 6200, leads: 62 },
  { name: "Fri", views: 7400, leads: 74 },
  { name: "Sat", views: 8900, leads: 89 },
  { name: "Sun", views: 7600, leads: 76 },
];

const typeData = [
  { name: "Apartments", value: 42, color: "#2563EB" },
  { name: "Villas", value: 22, color: "#14B8A6" },
  { name: "Plots", value: 14, color: "#F59E0B" },
  { name: "Commercial", value: 12, color: "#8B5CF6" },
  { name: "Other", value: 10, color: "#94A3B8" },
];

const recentLeads = [
  { name: "Riya Sharma", interest: "3BHK · Bandra", status: "New", time: "5m ago", avatar: "1" },
  { name: "Karan Malhotra", interest: "Villa · Goa", status: "Contacted", time: "22m ago", avatar: "5" },
  { name: "Divya Patel", interest: "Plot · Pune", status: "Site visit", time: "1h ago", avatar: "9" },
  { name: "Arjun Verma", interest: "Penthouse · Worli", status: "New", time: "2h ago", avatar: "20" },
  { name: "Nisha Gupta", interest: "Studio · Bangalore", status: "Qualified", time: "3h ago", avatar: "25" },
];

const statusColors: Record<string, string> = {
  New: "bg-blue-500/15 text-blue-600",
  Contacted: "bg-amber-500/15 text-amber-600",
  "Site visit": "bg-violet-500/15 text-violet-600",
  Qualified: "bg-emerald-500/15 text-emerald-600",
};

export default function AdminDashboard() {
  const stats = [
    { label: "Total properties", value: "48", change: "+12%", up: true, icon: Building2 },
    { label: "Active leads", value: "12", change: "+34%", up: true, icon: Users },
    { label: "Reels views", value: "182K", change: "+8%", up: true, icon: Video },
    { label: "Site visits", value: "47", change: "-3%", up: false, icon: CalendarCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back — here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/admin/properties">
              <Plus className="h-4 w-4" /> Add property
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-bold",
                    s.up ? "text-emerald-600" : "text-destructive"
                  )}
                >
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.change}
                </span>
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold">Traffic & leads</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="accent">Live</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="l" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2} fill="url(#v)" />
              <Area type="monotone" dataKey="leads" stroke="#14B8A6" strokeWidth={2} fill="url(#l)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold">Properties by type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {typeData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {typeData.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
                  {t.name}
                </span>
                <span className="font-semibold">{t.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions + recent leads */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold">Quick actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "New property", icon: Building2, href: "/admin/properties" },
              { label: "Upload reel", icon: Video, href: "/admin/reels" },
              { label: "Add blog", icon: Users, href: "/admin/blogs" },
              { label: "View leads", icon: Users, href: "/admin/leads" },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex flex-col items-start gap-2 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent/5"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold">{a.label}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-bold">Recent leads</h3>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentLeads.map((lead) => (
              <div
                key={lead.name}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://i.pravatar.cc/80?img=${lead.avatar}`} alt={lead.name} />
                  <AvatarFallback>{lead.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{lead.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{lead.interest}</div>
                </div>
                <span
                  className={cn(
                    "hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-block",
                    statusColors[lead.status]
                  )}
                >
                  {lead.status}
                </span>
                <span className="text-xs text-muted-foreground">{lead.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
