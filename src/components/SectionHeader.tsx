import ScrollReveal from "@/components/ScrollReveal";

interface Props {
  subtitle: string;
  title: string;
  watermark?: boolean;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}

export default function SectionHeader({
  subtitle,
  title,
  watermark = false,
  align = "left",
  tone = "dark",
  className = "",
}: Props) {
  const textAlign = align === "center" ? "text-center" : "text-left";
  const subtitleClass = tone === "dark" ? "text-neutral-500" : "text-gray-500";
  const titleClass = tone === "dark" ? "text-white" : "text-[#1a1a1a]";
  const watermarkClass = tone === "dark" ? "opacity-[0.03]" : "opacity-[0.07]";

  return (
    <ScrollReveal className={`relative ${textAlign} ${className}`}>
      {watermark && (
        <img
          src="/w-icon-logo.png"
          alt=""
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[260px] ${watermarkClass} select-none pointer-events-none`}
        />
      )}
      <p
        data-reveal
        className={`font-inter text-sm tracking-[0.2em] uppercase ${subtitleClass}`}
      >
        {subtitle}
      </p>
      <h2
        data-reveal
        className={`font-playfair text-3xl sm:text-5xl md:text-6xl uppercase tracking-wider mt-2 ${titleClass}`}
      >
        {title}
      </h2>
    </ScrollReveal>
  );
}
