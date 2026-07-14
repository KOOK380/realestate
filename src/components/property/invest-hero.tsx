"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calculator, Percent, ArrowUpRight, PiggyBank } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { InvestmentOpportunity } from "@/lib/data/types";

export function InvestHero({
  opportunities,
}: {
  opportunities: InvestmentOpportunity[];
}) {
  // ROI calculator state
  const [principal, setPrincipal] = React.useState(1_00_00_000);
  const [yieldPct, setYieldPct] = React.useState(4);
  const [appreciation, setAppreciation] = React.useState(9);
  const [years, setYears] = React.useState(7);

  const calc = React.useMemo(() => {
    const totalYield = principal * (yieldPct / 100) * years;
    const appreciated = principal * Math.pow(1 + appreciation / 100, years) - principal;
    const totalGain = totalYield + appreciated;
    const totalValue = principal + totalGain;
    const roi = (totalGain / principal) * 100;
    return { totalYield, appreciated, totalGain, totalValue, roi };
  }, [principal, yieldPct, appreciation, years]);

  return (
    <section className="relative overflow-hidden bg-gradient-luxe py-16 text-white">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="container-luxe relative">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="glass" className="mb-4 bg-white/10">
            <TrendingUp className="h-3 w-3" /> Investment Hub
          </Badge>
          <h1 className="font-display text-3xl font-bold sm:text-5xl">
            Grow your wealth with real estate.
          </h1>
          <p className="mt-4 text-white/70">
            Curated investment picks with proven rental yields and capital
            appreciation. Use our calculator to model your returns.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-white/10 bg-white/5 p-6 text-foreground backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-teal-500" />
                <h3 className="font-display text-lg font-bold">ROI Calculator</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <Label className="flex justify-between">
                    <span>Investment</span>
                    <span className="font-bold text-primary">
                      {formatPrice(principal)}
                    </span>
                  </Label>
                  <Slider
                    value={[principal]}
                    onValueChange={([v]) => setPrincipal(v)}
                    min={10_000_00}
                    max={5_00_00_000}
                    step={5_000_00}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="flex justify-between">
                    <span>Rental yield / year</span>
                    <span className="font-bold text-emerald-600">{yieldPct}%</span>
                  </Label>
                  <Slider
                    value={[yieldPct]}
                    onValueChange={([v]) => setYieldPct(v)}
                    min={1}
                    max={10}
                    step={0.5}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="flex justify-between">
                    <span>Appreciation / year</span>
                    <span className="font-bold text-gold-600">{appreciation}%</span>
                  </Label>
                  <Slider
                    value={[appreciation]}
                    onValueChange={([v]) => setAppreciation(v)}
                    min={3}
                    max={18}
                    step={0.5}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="flex justify-between">
                    <span>Time horizon</span>
                    <span className="font-bold">{years} years</span>
                  </Label>
                  <Slider
                    value={[years]}
                    onValueChange={([v]) => setYears(v)}
                    min={1}
                    max={20}
                    className="mt-3"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl text-white">
              <div className="flex items-center gap-2 text-white/70">
                <PiggyBank className="h-4 w-4" /> Total value after {years} yrs
              </div>
              <div className="mt-2 font-display text-4xl font-extrabold">
                {formatPrice(calc.totalValue)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-bold text-emerald-300">
                <ArrowUpRight className="h-4 w-4" /> +{calc.roi.toFixed(0)}% return
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <MiniStat
                label="Rental income"
                value={formatPrice(calc.totalYield)}
                icon={<Percent className="h-4 w-4" />}
                tone="emerald"
              />
              <MiniStat
                label="Appreciation"
                value={formatPrice(calc.appreciated)}
                icon={<TrendingUp className="h-4 w-4" />}
                tone="gold"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "emerald" | "gold";
}) {
  return (
    <Card
      className={cn(
        "p-4 text-white backdrop-blur-xl",
        tone === "emerald" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-gold/10 border-gold/20"
      )}
    >
      <div className="flex items-center gap-1.5 text-xs text-white/70">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
    </Card>
  );
}
