import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Twitter, Instagram, Twitch } from 'lucide-react';

export function Footer() {
  return (
    <footer id="about" className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Syndicate ESP. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            aria-label="Twitter"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            aria-label="Instagram"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            aria-label="Twitch"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Twitch className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
