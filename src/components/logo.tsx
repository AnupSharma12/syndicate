export function Logo(props: { className?: string }) {
  return (
    <img
      src="https://picsum.photos/seed/logo/200/200"
      alt="Syndicate ESP Logo"
      className={props.className}
      data-ai-hint="logo placeholder"
    ></img>
  );
}
