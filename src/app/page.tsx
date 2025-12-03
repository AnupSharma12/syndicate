import { EventSchedule } from '@/components/event-schedule';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <EventSchedule />
      </main>
      <Footer />
    </div>
  );
}
