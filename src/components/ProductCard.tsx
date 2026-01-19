import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, statusLabels } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const whatsappNumber = "5511999999999"; // Substituir pelo número real
  const whatsappMessage = encodeURIComponent(
    `Olá Roberta! Gostei do produto ${product.name} (Código: ${product.code}). Poderia me passar mais informações?`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "em-estoque":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "sob-encomenda":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "esgotado":
        return "bg-rose-100 text-rose-700 border-rose-200";
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Code Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-card/90 backdrop-blur-sm rounded-lg text-xs font-body font-medium text-gold border border-gold/30">
            {product.code}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="outline" 
            className={cn("text-xs font-body backdrop-blur-sm", getStatusColor(product.status))}
          >
            {statusLabels[product.status]}
          </Badge>
        </div>

        {/* Collection Badge */}
        {product.collection && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="inline-block px-3 py-1 bg-gold/90 backdrop-blur-sm rounded-lg text-xs font-body text-secondary-foreground">
              {product.collection}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-display text-lg text-foreground mb-1 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h4>
        
        <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-xl text-gold">
            {formatPrice(product.price)}
          </span>

          <Button
            variant="whatsapp"
            size="sm"
            asChild
            disabled={product.status === "esgotado"}
            className={cn(
              product.status === "esgotado" && "opacity-50 cursor-not-allowed"
            )}
          >
            <a
              href={product.status !== "esgotado" ? whatsappLink : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Consultar</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/20 transition-colors duration-500 pointer-events-none" />
    </motion.article>
  );
};

export default ProductCard;
