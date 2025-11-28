import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Youtube } from 'lucide-react';

// Custom SVG for Discord
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879a.75.75 0 0 0 .904-.549c.045-.245.13-1.05.13-1.05s-.375.188-1.021.125a9.53 9.53 0 0 1-4.99-2.02c.23-.12.44-.25.63-.39.86-.59 1.58-1.28 2.12-2.05.54-.77.88-1.64.98-2.58a.75.75 0 0 0-.6-.74c-.4-.1-1.22-.27-2.06-.37-.84-.1-1.68-.1-2.52-.01-.84.09-1.68.27-2.52.54a.75.75 0 0 0-.44.92c.1.4.28.8.5 1.18.22.38.5.75.83 1.1.33.35.7.68 1.1 1 .4.32.84.6 1.32.82a.75.75 0 0 0 .94-.31c.2-.3.34-.64.44-1a.75.75 0 0 0-1.44-.31c-.1.35-.25.67-.44.95-.19.28-.43.53-.7.75a10.43 10.43 0 0 0-8.25-5.91 10.5 10.5 0 0 0 21 0c0 5.79-4.71 10.5-10.5 10.5h-.75Z" />
    <path d="M9.09 13.34c.73-.26 1.44-.6 2.12-1.02.68-.42 1.33-.9 1.94-1.44.61-.54 1.18-1.14 1.68-1.8.5-.66.92-1.38 1.25-2.16" />
    <path d="M14.91 13.34c-.73-.26-1.44-.6-2.12-1.02-.68-.42-1.33-.9-1.94-1.44-.61-.54-1.18-1.14-1.68-1.8-.5-.66-.92-1.38-1.25-2.16" />
  </svg>
);

// Custom SVG for Facebook
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

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
            aria-label="Discord"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <DiscordIcon className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.youtube.com/@syndicateesp1"
            aria-label="YouTube"
            target="_blank"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Youtube className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            aria-label="Facebook"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FacebookIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
