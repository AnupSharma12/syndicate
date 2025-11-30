export function Logo(props: { className?: string }) {
  return (
    <img
      src="/logo.jpg"
      alt="Syndicate ESP Logo"
      className={props.className}
      data-ai-hint="logo placeholder"
    ></img>
  );
}
