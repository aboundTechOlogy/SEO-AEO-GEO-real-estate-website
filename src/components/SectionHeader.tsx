import ScrollReveal from "@/components/ScrollReveal";

interface Props {
  subtitle: string;
  title: string;
  watermark?: boolean;
  align?: "center" | "left";
  className?: string;
}

export default function SectionHeader({
  subtitle,
  title,
  watermark = false,
  align = "left",
  className = "",
}: Props) {
  const textAlign = align === "center" ? "text-center" : "text-left";

  return (
    <ScrollReveal className={`relative ${textAlign} ${className}`}>
      {watermark && (
        <img
          src="/w-icon-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[260px] opacity-[0.03] select-none pointer-events-none"
        />
      )}
      <p
        data-reveal
        className="font-inter text-sm tracking-[0.2em] uppercase text-neutral-500"
      >
        {subtitle}
      </p>
      <h2
        data-reveal
        className="font-playfair text-5xl md:text-6xl uppercase tracking-wider text-white mt-2"
      >
        {title}
      </h2>
    </ScrollReveal>
  );
}
