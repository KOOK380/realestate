"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "!rounded-2xl !border !border-black/5 !bg-background/95 !backdrop-blur-xl !text-foreground !shadow-float",
            title: "!font-semibold",
          },
        }}
      />
    </NextThemesProvider>
  );
}
