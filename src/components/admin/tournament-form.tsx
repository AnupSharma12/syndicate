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
  game: z.enum(['Valorant', 'Free Fire', 'Minecraft', 'Pubg', 'CS:GO', 'Apex Legends']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  status: z.enum(['Open', 'Closed', 'Live', 'Coming Soon']),
  prize: z.coerce.number().min(0, 'Prize must be a positive number'),
  fee: z.coerce.number().min(0, 'Fee must be a positive number'),
  maxTeams: z.coerce.number().positive('Max teams must be positive'),
  registeredTeams: z.coerce.number().min(0, 'Registered teams cannot be negative'),
  gameMode: z.string().optional(),
  map: z.string().optional(),
  releaseDate: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const gameSpecificOptions = {
    'Free Fire': {
        maps: ['Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'NeXTerra'],
        gameModes: ['Squad', 'Solo', 'Duo'],
    },
    'Valorant': {
        maps: ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus', 'Sunset'],
        gameModes: ['Standard', 'Spike Rush', 'Deathmatch'],
    },
    'Pubg': {
        maps: ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Karakin', 'Taego', 'Deston'],
        gameModes: ['Classic', 'Arcade', 'EvoGround'],
    },
    'Minecraft': {
        maps: ['Overworld', 'The Nether', 'The End'],
        gameModes: ['Survival', 'Creative', 'Adventure', 'Hardcore'],
    },
    'CS:GO': {
        maps: ['Dust II', 'Mirage', 'Inferno', 'Nuke', 'Overpass', 'Vertigo', 'Ancient'],
        gameModes: ['Competitive', 'Wingman', 'Casual', 'Deathmatch'],
    },
    'Apex Legends': {
        maps: ["King's Canyon", 'Worlds Edge', 'Olympus', 'Storm Point', 'Broken Moon'],
        gameModes: ['Trios', 'Duos', 'Ranked'],
    }
}

export function TournamentForm({ isOpen, setIsOpen, event }: TournamentFormProps) {
  const firestore = useFirestore();
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
        prize: 0,
        fee: 0,
        status: 'Open',
        game: 'Valorant',
        maxTeams: 0,
        registeredTeams: 0,
    }
  });

  const selectedGame = watch('game');
  const selectedStatus = watch('status');

  useEffect(() => {
    if (event) {
      reset({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0],
        releaseDate: event.releaseDate ? new Date(event.releaseDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        name: '',
        game: 'Valorant',
        date: '',
        time: '',
        status: 'Open',
        prize: 0,
        fee: 0,
        maxTeams: 0,
        registeredTeams: 0,
        gameMode: '',
        map: '',
        releaseDate: '',
      });
    }
  }, [event, reset]);

  const onSubmit = (data: EventFormData) => {
    if (!firestore) return;

    const eventData: Partial<Event> = {
        ...data,
        description: '', // Add a default empty description
        date: new Date(data.date).toISOString(),
    };
    
    if (data.status === 'Coming Soon' && data.releaseDate) {
        eventData.releaseDate = new Date(data.releaseDate).toISOString();
    } else {
        eventData.releaseDate = undefined;
    }


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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Tournament' : 'Add Tournament'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update the details of the tournament.' : 'Fill in the details for the new tournament.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="game">Game</Label>
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
                      <SelectItem value="Free Fire">Free Fire</SelectItem>
                      <SelectItem value="Minecraft">Minecraft</SelectItem>
                      <SelectItem value="Pubg">Pubg</SelectItem>
                      <SelectItem value="CS:GO">CS:GO</SelectItem>
                      <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.game && <p className="text-red-500 text-xs mt-1">{errors.game.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
               {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="text" {...register('time')} placeholder="e.g. 6:00 PM IST" />
               {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
                      <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
            {selectedStatus === 'Coming Soon' && (
                <div className="space-y-2">
                    <Label htmlFor="releaseDate">Auto-Open Date</Label>
                    <Input id="releaseDate" type="date" {...register('releaseDate')} />
                    {errors.releaseDate && <p className="text-red-500 text-xs mt-1">{errors.releaseDate.message}</p>}
                </div>
            )}
             <div className="space-y-2">
              <Label htmlFor="prize">Prize (RS)</Label>
              <Input id="prize" type="number" {...register('prize')} />
              {errors.prize && <p className="text-red-500 text-xs mt-1">{errors.prize.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">Fee (RS)</Label>
              <Input id="fee" type="number" {...register('fee')} />
              {errors.fee && <p className="text-red-500 text-xs mt-1">{errors.fee.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="maxTeams">Max Teams</Label>
              <Input id="maxTeams" type="number" {...register('maxTeams')} />
              {errors.maxTeams && <p className="text-red-500 text-xs mt-1">{errors.maxTeams.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="registeredTeams">Registered Teams</Label>
              <Input id="registeredTeams" type="number" {...register('registeredTeams')} />
              {errors.registeredTeams && <p className="text-red-500 text-xs mt-1">{errors.registeredTeams.message}</p>}
            </div>
          </div>
          
            {selectedGame && gameSpecificOptions[selectedGame] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                     <div className="space-y-2">
                        <Label htmlFor="gameMode">Game Mode</Label>
                         <Controller
                            name="gameMode"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a game mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gameSpecificOptions[selectedGame].gameModes.map(mode => (
                                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="map">Map</Label>
                         <Controller
                            name="map"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a map" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gameSpecificOptions[selectedGame].maps.map(map => (
                                            <SelectItem key={map} value={map}>{map}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            )}
          
          <DialogFooter className="pt-4">
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
