/**
 * Official MLH 2027-season trust badge — hangs flush from the top edge.
 *
 * MLH's compliance check looks for `#mlh-trust-badge`, so exactly one instance
 * may carry the id. The navbar owns it; any additional instance (the intro
 * gate) must omit the id to keep the document valid.
 */
export default function MlhTrustBadge({
  id,
  className = "block w-[72px] shrink-0 self-start sm:w-[90px]",
}: {
  id?: string;
  className?: string;
}) {
  return (
    <a
      id={id}
      href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-white.svg"
        alt="Major League Hacking 2026 Hackathon Season"
        className="w-full"
      />
    </a>
  );
}
