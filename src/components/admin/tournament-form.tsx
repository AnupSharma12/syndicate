'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Event } from '@/lib/data';
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useEffect } from 'react';

interface TournamentFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  event: Event | null;
}

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  game: z.enum(['Valorant', 'Apex Legends', 'League of Legends']),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['Open', 'Closed', 'Live']),
  prize: z.coerce.number().min(0, 'Prize must be a positive number'),
  fee: z.coerce.number().min(0, 'Fee must be a positive number'),
});

type EventFormData = z.infer<typeof eventSchema>;

export function TournamentForm({ isOpen, setIsOpen, event }: TournamentFormProps) {
  const firestore = useFirestore();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
        prize: 0,
        fee: 0,
        status: 'Open',
        game: 'Valorant',
    }
  });

  useEffect(() => {
    if (event) {
      reset({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0], // Format for input type="date"
      });
    } else {
      reset({
        name: '',
        game: 'Valorant',
        date: '',
        status: 'Open',
        prize: 0,
        fee: 0,
      });
    }
  }, [event, reset]);

  const onSubmit = (data: EventFormData) => {
    if (!firestore) return;

    const eventData = {
        ...data,
        date: new Date(data.date).toISOString(),
    };

    if (event) {
      // Update existing event
      const eventDocRef = doc(firestore, 'events', event.id);
      setDocumentNonBlocking(eventDocRef, eventData, { merge: true });
    } else {
      // Add new event
      const eventsColRef = collection(firestore, 'events');
      addDocumentNonBlocking(eventsColRef, eventData);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Tournament' : 'Add Tournament'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update the details of the tournament.' : 'Fill in the details for the new tournament.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input id="name" {...register('name')} className="w-full" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="game" className="text-right">
              Game
            </Label>
            <div className="col-span-3">
              <Controller
                name="game"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Valorant">Valorant</SelectItem>
                      <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                      <SelectItem value="League of Legends">League of Legends</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.game && <p className="text-red-500 text-xs mt-1">{errors.game.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
             <div className="col-span-3">
              <Input id="date" type="date" {...register('date')} className="w-full" />
               {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prize" className="text-right">
              Prize
            </Label>
             <div className="col-span-3">
              <Input id="prize" type="number" {...register('prize')} className="w-full" />
              {errors.prize && <p className="text-red-500 text-xs mt-1">{errors.prize.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fee" className="text-right">
              Fee
            </Label>
             <div className="col-span-3">
              <Input id="fee" type="number" {...register('fee')} className="w-full" />
              {errors.fee && <p className="text-red-500 text-xs mt-1">{errors.fee.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
