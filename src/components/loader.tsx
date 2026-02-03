'use client';

import Image from 'next/image';
import { useAppSettings } from '@/firebase';

export function Loader() {
  const { settings } = useAppSettings();
  const appName = settings.appName || 'Syndicate ESP';
  const appLogoUrl = settings.logoUrl || '/logo.jpg';

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-primary/20 animate-ping"></div>
        <Image src={appLogoUrl} alt={`${appName} Logo`} width={80} height={80} className="h-20 w-20 rounded-full" />
      </div>
      <p className="mt-6 font-headline text-lg text-muted-foreground animate-pulse">
        Entering the Arena...
      </p>
    </div>
  );
}
