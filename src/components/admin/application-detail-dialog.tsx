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
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ApplicationDetailDialogProps {
  registration: Registration | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}

function ImagePreview({ label, src }: { label:string, src: string | undefined }) {
  const placeholder = PlaceHolderImages.find(p => p.id === 'image-placeholder')?.imageUrl || "https://placehold.co/600x400/22272F/9499A4?text=No+Image";
  return (
    <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="relative aspect-video w-full rounded-md overflow-hidden border">
             <Image
                src={src || placeholder}
                alt={label}
                fill
                className="object-contain"
                data-ai-hint="proof image"
             />
        </div>
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            Viewing registration for{' '}
            <span className="font-semibold text-foreground">{registration.teamName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <DetailItem label="Event" value={event?.name ?? 'Loading...'} />
          <DetailItem label="Team Name" value={registration.teamName} />
          <DetailItem label="WhatsApp Number" value={registration.whatsAppNumber} />
          <DetailItem
            label="Registration Date"
            value={new Date(registration.registrationDate).toLocaleString()}
          />
          
          <Separator />

          <h4 className="text-md font-semibold pt-2">Submitted Proofs</h4>
          <div className="space-y-4">
              <ImagePreview label="Team Logo" src={registration.teamLogoUrl} />
              {event && event.fee > 0 && (
                <ImagePreview label="Payment Proof" src={registration.paymentProofUrl} />
              )}
              {/* Note: This assumes up to 4 URLs, adjust if needed */}
              <div className="grid grid-cols-2 gap-4">
                {registration.youtubeProofUrls.map((url, index) => (
                    <ImagePreview key={index} label={`YouTube Proof ${index + 1}`} src={url} />
                ))}
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
