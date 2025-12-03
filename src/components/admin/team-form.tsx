
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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Team, SquadMember } from '@/lib/data';
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IMGBB_API_KEY = '828e7300541739226abfc621193150d3';


interface TeamFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  team: Team | null;
}

const squadMemberSchema = z.object({
  name: z.string().min(1, 'Player name is required'),
  gameId: z.string().min(1, 'Player Game ID is required'),
});

const teamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().min(1, 'Logo URL is required'),
  captainName: z.string().min(1, 'Captain name is required'),
  rank: z.enum(['Pro', 'Elite', 'Champion', 'Unranked']),
  wins: z.coerce.number().min(0, 'Wins must be a positive number'),
  tournamentsWon: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  squadMembers: z.array(squadMemberSchema).min(1, 'At least one squad member is required'),
});

type TeamFormData = z.infer<typeof teamSchema>;

export function TeamForm({ isOpen, setIsOpen, team }: TeamFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      captainName: '',
      rank: 'Unranked',
      wins: 0,
      tournamentsWon: [],
      squadMembers: [{ name: '', gameId: '' }],
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "squadMembers"
  });

  useEffect(() => {
    if (team) {
      reset({
        ...team,
        tournamentsWon: team.tournamentsWon.join(', '),
      });
    } else {
      reset({
        name: '',
        logoUrl: '',
        captainName: '',
        rank: 'Unranked',
        wins: 0,
        tournamentsWon: [],
        squadMembers: [{ name: '', gameId: '' }],
      });
    }
    setLogoFile(null);
  }, [team, reset]);

  const uploadImage = async (imageFile: File): Promise<string> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast({ title: "Image Uploaded", description: "Logo has been successfully uploaded." });
        return result.data.url;
      } else {
        throw new Error(result.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Image Upload Failed',
        description: (error as Error).message,
      });
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: TeamFormData) => {
    if (!firestore) return;
    
    let finalLogoUrl = data.logoUrl;
    if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile);
        if (uploadedUrl) {
            finalLogoUrl = uploadedUrl;
        } else {
            // Upload failed, stop submission
            return;
        }
    }
    
    if (!finalLogoUrl) {
        toast({ variant: 'destructive', title: 'Missing Logo', description: 'Please provide a logo URL or upload a file.' });
        return;
    }

    const teamData: Omit<Team, 'id'> = {
      ...data,
      logoUrl: finalLogoUrl,
    };

    if (team) {
      // Update existing team
      const teamDocRef = doc(firestore, 'teams', team.id);
      setDocumentNonBlocking(teamDocRef, teamData, { merge: true });
      toast({ title: "Team Updated", description: `${team.name} has been updated.` });
    } else {
      // Add new team
      const teamsColRef = collection(firestore, 'teams');
      addDocumentNonBlocking(teamsColRef, teamData);
      toast({ title: "Team Added", description: `${data.name} has been added to the leaderboard.` });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? 'Edit Team' : 'Add Team'}</DialogTitle>
          <DialogDescription>
            {team ? 'Update the details for this team.' : 'Fill in the details for a new team.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="captainName">Captain Name</Label>
              <Input id="captainName" {...register('captainName')} />
              {errors.captainName && <p className="text-red-500 text-xs mt-1">{errors.captainName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Team Logo URL</Label>
              <Input id="logoUrl" {...register('logoUrl')} placeholder="https://... or upload below"/>
              {errors.logoUrl && <p className="text-red-500 text-xs mt-1">{errors.logoUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoFile">Or Upload Logo</Label>
              <Input id="logoFile" type="file" accept="image/*" className='pt-2' onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="wins">Wins</Label>
              <Input id="wins" type="number" {...register('wins')} />
              {errors.wins && <p className="text-red-500 text-xs mt-1">{errors.wins.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Controller
                name="rank"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unranked">Unranked</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Elite">Elite</SelectItem>
                      <SelectItem value="Champion">Champion</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.rank && <p className="text-red-500 text-xs mt-1">{errors.rank.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tournamentsWon">Tournaments Won (comma-separated event names)</Label>
                <Textarea id="tournamentsWon" {...register('tournamentsWon')} placeholder="e.g. Valorant Series 1, Pubg Masters"/>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h4 className="text-lg font-semibold">Squad Members</h4>
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                 <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`squadMembers.${index}.name`}>Player {index + 1} Name</Label>
                    <Input {...register(`squadMembers.${index}.name`)} />
                     {errors.squadMembers?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.squadMembers?.[index]?.name?.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`squadMembers.${index}.gameId`}>Player {index + 1} Game ID</Label>
                    <Input {...register(`squadMembers.${index}.gameId`)} />
                    {errors.squadMembers?.[index]?.gameId && <p className="text-red-500 text-xs mt-1">{errors.squadMembers?.[index]?.gameId?.message}</p>}
                  </div>
                </div>
              </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append({ name: '', gameId: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Player
            </Button>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
