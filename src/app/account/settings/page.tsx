"use client";

import * as React from "react";
import { Moon, Sun, Globe, Bell, Shield, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/store/user-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useSession();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Settings</h2>

      <Card className="divide-y divide-border">
        <SettingRow
          icon={mounted && theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          title="Dark mode"
          description="Switch between light and dark themes"
        >
          <Switch
            checked={mounted ? theme === "dark" : false}
            onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
          />
        </SettingRow>

        <SettingRow
          icon={<Bell className="h-5 w-5" />}
          title="Push notifications"
          description="Get alerts for price drops and new matches"
        >
          <Switch defaultChecked onCheckedChange={() => toast.success("Preference saved")} />
        </SettingRow>

        <SettingRow
          icon={<Globe className="h-5 w-5" />}
          title="Email digests"
          description="Weekly summary of new listings"
        >
          <Switch defaultChecked onCheckedChange={() => toast.success("Preference saved")} />
        </SettingRow>

        <SettingRow
          icon={<Shield className="h-5 w-5" />}
          title="Two-factor authentication"
          description="Add an extra layer of security"
        >
          <Switch onCheckedChange={() => toast.success("2FA enabled")} />
        </SettingRow>
      </Card>

      {user && (
        <Button variant="outline" className="w-full text-destructive" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      )}
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <Label className="font-semibold">{title}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
