"use client";

import * as React from "react";
import { Mail, Lock, Phone, User, Chrome, ArrowRight, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSession } from "@/lib/store/user-store";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn } = useSession();
  const [otpSent, setOtpSent] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSocial = async (provider: string) => {
    setLoading(provider);
    // NOTE: Real OAuth handled by NextAuth when keys are present (see /api/auth/*).
    // Mock sign-in so the demo works with zero keys.
    await new Promise((r) => setTimeout(r, 900));
    signIn({
      name: provider === "Google" ? "Demo User" : "Demo User",
      email: "demo@luxe-estates.app",
    });
    setLoading(null);
    onOpenChange(false);
    toast.success("Signed in!", { description: `Welcome to Luxe Estates.` });
  };

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading("email");
    const form = new FormData(e.currentTarget);
    await new Promise((r) => setTimeout(r, 800));
    signIn({
      name: (form.get("name") as string) || "Member",
      email: form.get("email") as string,
    });
    setLoading(null);
    onOpenChange(false);
    toast.success("Signed in!", { description: "Welcome to Luxe Estates." });
  };

  const sendOtp = async () => {
    if (phone.length < 8) {
      toast.error("Enter a valid phone number");
      return;
    }
    setLoading("otp-send");
    await new Promise((r) => setTimeout(r, 700));
    setLoading(null);
    setOtpSent(true);
    toast.success("OTP sent!", { description: "Use 123456 for this demo." });
  };

  const verifyOtp = async () => {
    setLoading("otp-verify");
    await new Promise((r) => setTimeout(r, 700));
    signIn({ name: "Member", email: `${phone}@phone.luxe` });
    setLoading(null);
    onOpenChange(false);
    toast.success("Phone verified! 🎉");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          {/* Left visual panel */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-luxe" />
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Luxury home"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="relative flex h-full flex-col justify-between p-8 text-white">
              <div className="font-display text-2xl font-bold">Luxe Estates</div>
              <div>
                <h3 className="font-display text-3xl font-bold leading-tight">
                  Your dream home is one tap away.
                </h3>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  {[
                    "Save & track properties",
                    "Get instant price alerts",
                    "Book site visits in seconds",
                    "Personalised recommendations",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-300" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome back</DialogTitle>
              <DialogDescription>
                Sign in to save homes, book visits and unlock recommendations.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleSocial("Google")}
                disabled={loading !== null}
              >
                {loading === "Google" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <Chrome className="h-4 w-4" />
                )}
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocial("Apple")}
                disabled={loading !== null}
              >
                <User className="h-4 w-4" /> Apple
              </Button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="otp">Phone OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmail} className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="auth-name" name="name" placeholder="Jane Doe" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="auth-email" name="email" type="email" placeholder="you@email.com" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-pass">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="auth-pass" name="password" type="password" placeholder="••••••••" className="pl-10" required />
                    </div>
                  </div>
                  <Button type="submit" variant="gradient" className="w-full" disabled={loading !== null}>
                    {loading === "email" ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Continue <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-phone">Phone number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="auth-phone"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                  </div>
                  {!otpSent ? (
                    <Button variant="gradient" className="w-full" onClick={sendOtp} disabled={loading !== null}>
                      {loading === "otp-send" ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>Send OTP</>
                      )}
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="auth-otp">Enter OTP</Label>
                        <Input id="auth-otp" placeholder="123456" maxLength={6} className="text-center text-2xl tracking-[0.5em]" />
                      </div>
                      <Button variant="gradient" className="w-full" onClick={verifyOtp} disabled={loading !== null}>
                        {loading === "otp-verify" ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <>Verify & Sign in</>
                        )}
                      </Button>
                      <button
                        className="w-full text-center text-xs text-muted-foreground hover:text-primary"
                        onClick={() => setOtpSent(false)}
                      >
                        ← Change number
                      </button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
