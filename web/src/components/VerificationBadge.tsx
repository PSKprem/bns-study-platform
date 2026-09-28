import type { Verification } from "../types/content";

// Surfaces the honesty rule (CR-2): every statute fact shows whether it is
// verified against an official source. Unverified facts are visibly flagged.
export default function VerificationBadge({
  verification,
  lastVerified,
}: {
  verification: Verification;
  lastVerified: string;
}) {
  const verified = verification.status === "verified";

  return (
    <div
      className={`rounded-md border p-3 text-xs ${
        verified
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      <p className="font-semibold">
        {verified
          ? "✓ Verified against official source"
          : "⚠ Unverified — do not rely for exams yet"}
      </p>
      <p className="mt-1">Source: {verification.source}</p>
      <p className="mt-0.5">Last verified: {lastVerified}</p>
    </div>
  );
}
