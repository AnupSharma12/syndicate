import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <section className="relative h-[75vh] w-screen max-w-full min-h-[400px] sm:h-[80vh] md:h-[90vh] overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse opacity-50" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl">
            <span className="text-gradient-animate inline-block">Enter The Arena</span>
          </h1>
        </div>
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
          <p className="max-w-3xl text-lg text-foreground/80 md:text-xl drop-shadow-lg">
            The ultimate destination for competitive gaming. Join tournaments, watch
            live events, and become a part of the action.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pop-in" style={{ animationDelay: '0.4s' }}>
          <Button asChild size="lg" className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
            <Link href="#tournaments">
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              Explore Tournaments
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold text-base hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-105">
            <Link href="#schedule">View Schedule</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
