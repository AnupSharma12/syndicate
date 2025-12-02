'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Registration, Event } from '@/lib/data';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface ApplicationDetailDialogProps {
  registration: Registration | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <p className="text-sm font-medium text-muted-foreground col-span-1">{label}</p>
      <p className="text-base col-span-2">{value}</p>
    </div>
  );
}

function ImagePreview({ label, src }: { label:string, src: string | undefined | null }) {
  const placeholder = "https://placehold.co/600x400/22272F/9499A4?text=No+Image+Provided";
  const imageUrl = src || placeholder;
  const hint = src ? 'proof image' : 'placeholder image';

  return (
    <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-video w-full rounded-md overflow-hidden border">
             <Image
                src={imageUrl}
                alt={label}
                fill
                className="object-contain"
                data-ai-hint={hint}
             />
        </a>
    </div>
  )
}

export function ApplicationDetailDialog({
  registration,
  isOpen,
  setIsOpen,
}: ApplicationDetailDialogProps) {
  const firestore = useFirestore();

  const eventRef = useMemoFirebase(
    () => (firestore && registration ? doc(firestore, 'events', registration.eventId) : null),
    [firestore, registration]
  );
  const { data: event } = useDoc<Event>(eventRef);

  if (!registration) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
         <ScrollArea className="max-h-[90vh]">
            <div className='p-6'>
                <DialogHeader>
                <DialogTitle>Application for: <span className='text-primary'>{event?.name}</span></DialogTitle>
                <DialogDescription>
                    Viewing registration for team: <span className="font-semibold text-foreground">{registration.teamName}</span>.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                    {/* Team Details */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Team Details</h4>
                        <div className="space-y-2">
                            <DetailItem label="Team Name" value={registration.teamName} />
                            <DetailItem label="Registration Date" value={new Date(registration.registrationDate).toLocaleString()} />
                            <ImagePreview label="Team Logo" src={registration.teamLogoUrl} />
                        </div>
                    </div>

                    <Separator />
                    
                    {/* Team Leader Details */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Team Leader</h4>
                        <div className="space-y-2">
                            <DetailItem label="Full Name" value={registration.teamLeaderFullName} />
                            <DetailItem label="Email" value={registration.teamLeaderEmail} />
                            <DetailItem label={`${event?.game ?? 'Game'} ID`} value={registration.teamLeaderGameId} />
                            <DetailItem label="Phone Number" value={registration.whatsAppNumber} />
                        </div>
                    </div>
                    
                    <Separator />

                    {/* Squad Members */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Squad Members</h4>
                        <div className="space-y-4">
                            {registration.squadMembers.map((member, index) => (
                                <div key={index} className="p-3 border rounded-md">
                                    <p className="font-medium text-foreground">Player {index + 1}: {member.name}</p>
                                    <p className="text-sm text-muted-foreground">{`${event?.game ?? 'Game'} ID: ${member.gameId}`}</p>
                                </div>
                            ))}
                            {registration.squadMembers.length === 0 && <p className="text-sm text-muted-foreground">No additional squad members listed.</p>}
                        </div>
                    </div>

                    <Separator />

                    {/* Submitted Proofs */}
                     <div>
                        <h4 className="text-lg font-semibold mb-4">Submitted Proofs</h4>
                        <div className="grid gap-4">
                            {event && event.fee > 0 && (
                                <ImagePreview label="Payment Proof" src={registration.paymentProofUrl} />
                            )}
                            {registration.youtubeProofUrl && (
                                <ImagePreview label="YouTube Proof" src={registration.youtubeProofUrl} />
                            )}
                             {!registration.paymentProofUrl && !registration.youtubeProofUrl && <p className="text-sm text-muted-foreground">No additional proofs submitted.</p>}
                        </div>
                    </div>
                </div>
            </div>
         </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
