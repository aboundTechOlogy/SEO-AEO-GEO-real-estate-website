"use client";

interface Props {
  prevLabel?: string;
  nextLabel?: string;
  ctaText: string;
  ctaHref: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function NavArrows({
  prevLabel = "Prev",
  nextLabel = "Next",
  ctaText,
  ctaHref,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-6 mt-10 md:mt-14">
      {/* Prev arrow */}
      <button
        onClick={onPrev}
        aria-label={prevLabel}
        className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/60 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* CTA */}
      <a
        href={ctaHref}
        className="border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/60 transition-all whitespace-nowrap"
      >
        {ctaText}
      </a>

      {/* Next arrow */}
      <button
        onClick={onNext}
        aria-label={nextLabel}
        className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/60 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}
