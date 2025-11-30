import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="/logo.jpg"
      alt="Syndicate ESP Logo"
      className={props.className}
      width={500}
      height={500}
      data-ai-hint="logo"
    />
  );
}
