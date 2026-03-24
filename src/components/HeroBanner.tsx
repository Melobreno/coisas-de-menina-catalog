import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with lazy loading */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Acessórios delicados e elegantes"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      </div>

      {/* Content with solid background for readability */}
      <div className="relative z-10 w-full md:container md:mx-auto md:px-300 text-center">
        <div className="w-full mx-auto bg-card/95 backdrop-blur-sm md:rounded-2xl px-4 py-8 md:p-12 border-y md:border border-border">
          <p className="font-body text-sm md:text-base text-muted-foreground tracking-[0.2em] uppercase mb-3">
            Bem-vinda ao nosso universo
          </p>

          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
            <span className="text-gold">Unindo estilo, beleza e elegância</span>
          </h2>

          <p className="font-body text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-6">
            Acessórios artesanais feitos com amor e dedicação para realçar sua beleza única
          </p>

          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-10 h-px bg-gold/50" />
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="inline-block w-10 h-px bg-gold/50" />
          </div>
        </div>
      </div>

      {/* Subtle gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroBanner;
