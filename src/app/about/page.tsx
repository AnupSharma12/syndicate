'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Target, Gamepad2, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              About <span className="text-primary">Syndicate ESP</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The ultimate destination for competitive gaming. We bring together passionate gamers 
              to compete, connect, and champion their skills in the most exciting esports tournaments.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                To create a thriving esports community where players of all skill levels can 
                participate in fair, exciting, and professionally organized tournaments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border/60">
                <CardHeader className="text-center">
                  <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Competitive Excellence</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  We host professionally organized tournaments with fair rules, 
                  transparent scoring, and exciting prize pools.
                </CardContent>
              </Card>

              <Card className="bg-card border-border/60">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Community First</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Our platform is built for the gaming community, fostering connections 
                  between players, teams, and fans.
                </CardContent>
              </Card>

              <Card className="bg-card border-border/60">
                <CardHeader className="text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Growth & Development</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  We support players in their journey from casual gaming to 
                  competitive esports through structured tournaments.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                Why Choose Syndicate ESP?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Multiple Game Titles</h3>
                  <p className="text-muted-foreground">
                    From Valorant to Free Fire, PUBG to Minecraft, we host tournaments 
                    across the most popular gaming titles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fair Play Guaranteed</h3>
                  <p className="text-muted-foreground">
                    Our strict anti-cheat policies and professional moderation ensure 
                    a level playing field for all participants.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Exciting Prizes</h3>
                  <p className="text-muted-foreground">
                    Compete for cash prizes, gaming gear, and exclusive rewards 
                    in our tournaments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy Registration</h3>
                  <p className="text-muted-foreground">
                    Simple team registration process with clear instructions 
                    and instant confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="about" className="py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Get In Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Have questions about our tournaments or want to partner with us? 
              We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">Email:</span>{' '}
                contact@syndicateesp.com
              </div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="py-16 bg-muted/30">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-6">
              Made by <span className="text-primary">Anup</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover more about the creator and explore additional projects
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="https://anupsharma12.com.np" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Portfolio
              </a>
              <a 
                href="https://github.com/AnupSharma12" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
