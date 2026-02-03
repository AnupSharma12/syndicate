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
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background relative overflow-hidden">
          {/* Animated background orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse opacity-50" style={{ animationDelay: '1s' }} />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                About <span className="text-gradient-animate inline-block">Syndicate ESP</span>
              </h1>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                The ultimate destination for competitive gaming. We bring together passionate gamers 
                to compete, connect, and champion their skills in the most exciting esports tournaments.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background relative">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                <span className="text-gradient-animate">Our Mission</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                To create a thriving esports community where players of all skill levels can 
                participate in fair, exciting, and professionally organized tournaments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Trophy, title: 'Competitive Excellence', desc: 'We host professionally organized tournaments with fair rules, transparent scoring, and exciting prize pools.' },
                { icon: Users, title: 'Community First', desc: 'Our platform is built for the gaming community, fostering connections between players, teams, and fans.' },
                { icon: Target, title: 'Growth & Development', desc: 'We support players in their journey from casual gaming to competitive esports through structured tournaments.' }
              ].map((item, idx) => (
                <div key={idx} className="pop-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <Card className="bg-card border-border/60 group hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full">
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-12 w-12 text-primary" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.desc}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                <span className="text-gradient-animate">Why Choose Syndicate ESP?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Gamepad2, title: 'Multiple Game Titles', desc: 'From Valorant to Free Fire, PUBG to Minecraft, we host tournaments across the most popular gaming titles.' },
                { icon: Shield, title: 'Fair Play Guaranteed', desc: 'Our strict anti-cheat policies and professional moderation ensure a level playing field for all participants.' },
                { icon: Trophy, title: 'Exciting Prizes', desc: 'Compete for cash prizes, gaming gear, and exclusive rewards in our tournaments.' },
                { icon: Zap, title: 'Easy Registration', desc: 'Simple team registration process with clear instructions and instant confirmation.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pop-in group" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="about" className="py-16 bg-background relative">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              <span className="text-gradient-animate">Get In Touch</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Have questions about our tournaments or want to partner with us? 
              We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pop-in">
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">Email:</span>{' '}
                contact@syndicateesp.com
              </div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="py-16 bg-muted/30 relative overflow-hidden">
          {/* Animated background orbs */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-6">
              Made by <span className="text-gradient-animate">Anup</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover more about the creator and explore additional projects
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {[
                { href: 'https://anupsharma12.com.np', label: 'Portfolio' },
                { href: 'https://github.com/AnupSharma12', label: 'GitHub' }
              ].map((link, idx) => (
                <a 
                  key={idx}
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 pop-in relative overflow-hidden group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
