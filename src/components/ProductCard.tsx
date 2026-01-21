import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { collectionLabels, ProductCollection } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import ProductModal from "./ProductModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  category: string;
  collection: ProductCollection | null;
  status: "em-estoque" | "sob-encomenda" | "esgotado";
  stock: number;
  image: string;
  image2?: string | null;
}

interface ProductCardProps {
  product: Product;
}

const statusLabels = {
  "em-estoque": "Em Estoque",
  "sob-encomenda": "Sob Encomenda",
  "esgotado": "Esgotado",
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappNumber = "5581988325302";
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no item ${product.name} (Código: ${product.code}).`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const isUnavailable = product.stock === 0 || product.status === "esgotado";

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
    <>
      <article className="relative bg-card rounded-2xl overflow-hidden border border-border">
        {/* Image Container - Clickable */}
        <div 
          className="relative aspect-square overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          
          {/* Unavailable Overlay */}
          {isUnavailable && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-card px-4 py-2 rounded-lg font-body text-sm font-medium text-foreground">
                Indisponível
              </span>
            </div>
          )}
          
          {/* Code Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-card/90 rounded-lg text-xs font-body font-medium text-gold border border-gold/30">
              {product.code}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline" 
              className={cn("text-xs font-body", getStatusColor(product.status))}
            >
              {statusLabels[product.status]}
            </Badge>
          </div>

          {/* Collection Badge */}
          {product.collection && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-block px-3 py-1 bg-gold/90 rounded-lg text-xs font-body text-secondary-foreground">
                {collectionLabels[product.collection]}
              </span>
            </div>
          )}

          {/* Multiple Images Indicator */}
          {product.image2 && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-card/90 rounded-full text-xs font-body font-medium text-foreground border border-border">
                +1
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-body font-semibold text-base text-foreground mb-1">
            {product.name}
          </h4>
          
          <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-3">
            <span className="font-body font-bold text-lg text-gold">
              {formatPrice(product.price)}
            </span>

            <Button
              variant="whatsapp"
              size="sm"
              asChild
              disabled={isUnavailable}
              className={cn(
                isUnavailable && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <a
                href={!isUnavailable ? whatsappLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Consultar</span>
              </a>
            </Button>
          </div>
        </div>
      </article>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
