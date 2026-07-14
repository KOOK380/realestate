"use client";

import * as React from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { calculateEMI, formatPrice } from "@/lib/utils";

export function EMICalculator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = React.useState(Math.round(price * 0.2));
  const [rate, setRate] = React.useState(8.5);
  const [tenure, setTenure] = React.useState(20);

  const loan = price - downPayment;
  const { emi, totalInterest, totalPayable } = calculateEMI(loan, rate, tenure);

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-bold">EMI Calculator</h3>
          <p className="text-xs text-muted-foreground">Estimate your monthly payment</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="flex justify-between">
            <span>Down payment</span>
            <span className="font-bold">{formatPrice(downPayment)}</span>
          </Label>
          <Slider
            value={[downPayment]}
            onValueChange={([v]) => setDownPayment(v)}
            min={Math.round(price * 0.1)}
            max={Math.round(price * 0.9)}
            step={1_000_00}
            className="mt-3"
          />
        </div>

        <div>
          <Label className="flex justify-between">
            <span>Interest rate</span>
            <span className="font-bold text-primary">{rate}%</span>
          </Label>
          <Slider
            value={[rate]}
            onValueChange={([v]) => setRate(v)}
            min={6}
            max={14}
            step={0.1}
            className="mt-3"
          />
        </div>

        <div>
          <Label className="flex justify-between">
            <span>Loan tenure</span>
            <span className="font-bold">{tenure} years</span>
          </Label>
          <Slider
            value={[tenure]}
            onValueChange={([v]) => setTenure(v)}
            min={5}
            max={30}
            className="mt-3"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-gradient-luxe p-4 text-white">
        <div>
          <div className="text-xs text-white/70">Monthly EMI</div>
          <div className="font-display text-2xl font-bold">{formatPrice(emi)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <div className="text-xs text-white/60">Principal</div>
            <div className="font-semibold">{formatPrice(loan)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Total interest</div>
            <div className="font-semibold">{formatPrice(totalInterest)}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-white/60">Total payable</div>
            <div className="font-semibold">{formatPrice(totalPayable)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
