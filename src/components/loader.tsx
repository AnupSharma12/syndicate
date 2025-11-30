import Image from 'next/image';

export function Loader() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-primary/20 animate-ping"></div>
        <Image src="/logo.png" alt="Syndicate ESP Logo" width={80} height={80} className="h-20 w-20" />
      </div>
      <p className="mt-6 font-headline text-lg text-muted-foreground animate-pulse">
        Entering the Arena...
      </p>
    </div>
  );
}
