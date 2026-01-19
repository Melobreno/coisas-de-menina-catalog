import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-soft"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-script text-3xl md:text-4xl text-gold">
            Coisas de Menina
          </h1>
          <p className="font-body text-xs md:text-sm text-muted-foreground tracking-widest uppercase mt-1">
            Acessórios Especiais
          </p>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
