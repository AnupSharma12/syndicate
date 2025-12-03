
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Team } from '@/lib/data';
import { Loader2, Trophy, User } from 'lucide-react';
import Image from 'next/image';

export default function TeamsPage() {
  const firestore = useFirestore();

  const teamsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'teams') : null),
    [firestore]
  );
  const { data: teams, isLoading } = useCollection<Team>(teamsRef);
  
  const getRankVariant = (rank: Team['rank']) => {
    switch (rank) {
      case 'Champion':
        return 'default';
      case 'Elite':
        return 'destructive';
      case 'Pro':
        return 'secondary';
      default:
        return 'outline';
    }
  };


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-7xl px-4">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
              Selected Teams
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Elite squads competing in Syndicate tournaments
            </p>
          </div>
          
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && teams && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {teams.map((team) => (
                <Card key={team.id} className="flex flex-col bg-card border-border/60">
                   <div className="relative h-24 bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
                        <Image src={team.logoUrl} alt={`${team.name} logo`} width={80} height={80} className="h-20 w-20 object-contain rounded-md" />
                   </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-2xl">{team.name}</CardTitle>
                         <div className="flex items-center gap-2 text-amber-400 font-bold">
                            <Trophy className="h-5 w-5" />
                            <span>{team.wins}</span>
                        </div>
                    </div>
                    <Badge variant={getRankVariant(team.rank)} className="w-fit">{team.rank}</Badge>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                     <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <User className="h-4 w-4" />
                            <span>Captain</span>
                        </div>
                        <p className="font-semibold text-primary">{team.captainName}</p>
                     </div>
                     <div>
                        <h4 className="text-sm text-muted-foreground mb-1">Squad Members</h4>
                        <ul className="list-disc list-inside text-foreground/90 space-y-1">
                            {team.squadMembers.map(member => (
                                <li key={member.gameId}>{member.name}</li>
                            ))}
                        </ul>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
