// The $MIDTERMS mark (public/brand/logo.png, rendered from the brand artwork).
export default function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/logo.png" alt="" aria-hidden="true" width={size} height={size} className={className} />
  );
}
