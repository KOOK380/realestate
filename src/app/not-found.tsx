import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-8xl font-extrabold text-gradient">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        This page took a wrong turn.
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or may have moved. Let's get
        you back on track.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="gradient" size="lg">
          <Link href="/">
            <Home className="h-5 w-5" /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/buy">
            <Search className="h-5 w-5" /> Browse properties
          </Link>
        </Button>
      </div>
    </div>
  );
}
