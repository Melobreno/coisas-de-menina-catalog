import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card border-t border-border py-12 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <h2 className="font-script text-4xl text-gold mb-2">
            Coisas de Menina
          </h2>
          <p className="font-body text-sm text-muted-foreground tracking-widest uppercase mb-6">
            Acessórios Especiais
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-16 h-px bg-border" />
            <svg className="w-4 h-4 text-rose-pastel" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="w-16 h-px bg-border" />
          </div>

          {/* Tagline */}
          <p className="font-body text-muted-foreground max-w-md mb-8">
            Unindo estilo, beleza e elegância em cada peça artesanal
          </p>

          {/* Social Link */}
          <a
            href="https://instagram.com/coisas10menina"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/50 hover:bg-primary transition-colors duration-300"
          >
            <Instagram className="w-5 h-5 text-gold" />
            <span className="font-body text-sm text-foreground">@coisas10menina</span>
          </a>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-border w-full">
            <p className="font-body text-xs text-muted-foreground flex items-center justify-center gap-1">
              Feito com <Heart className="w-3 h-3 text-rose-pastel fill-current" /> em 2025
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
