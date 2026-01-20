import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";

const FloatingButtons = () => {
  const instagramUrl = "https://instagram.com/coisas10menina";
  const whatsappNumber = "5581988325302"; // Substituir pelo número real
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo catálogo digital e gostaria de mais informações.")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.a>

      {/* Instagram Button */}
      <motion.a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Siga no Instagram"
      >
        <Instagram className="w-6 h-6 text-white" />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
