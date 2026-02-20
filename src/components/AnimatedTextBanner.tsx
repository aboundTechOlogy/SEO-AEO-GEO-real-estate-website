import ScrollReveal from "@/components/ScrollReveal";

export default function AnimatedTextBanner() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* TODO: Replace with looping video — cinematic South Florida aerial */}
      {/*
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/banner-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60" />
      */}

      {/* Subtle texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

      <ScrollReveal className="relative z-10 text-center px-6">
        <h2
          data-reveal
          className="font-playfair text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4"
        >
          Andrew Whalen
        </h2>
        <h3
          data-reveal
          className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight"
        >
          South Florida
          <br />
          Luxury Real Estate
        </h3>
      </ScrollReveal>
    </section>
  );
}
