import { useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    code: string;
    image: string;
    image2?: string | null;
    status: "em-estoque" | "sob-encomenda" | "esgotado";
    stock: number;
  };
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [product.image, product.image2].filter(Boolean) as string[];
  const hasMultipleImages = images.length > 1;

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-2xl p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Image Gallery */}
        <div className="relative aspect-square bg-muted">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card h-10 w-10 rounded-full"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card h-10 w-10 rounded-full"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === currentImageIndex ? "bg-gold" : "bg-card/60"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Code Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1.5 bg-card/90 rounded-lg text-sm font-body font-medium text-gold border border-gold/30">
              {product.code}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-body font-semibold text-2xl text-foreground mb-2">
            {product.name}
          </h2>
          
          <p className="font-body text-muted-foreground mb-4 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-4">
            <span className="font-body font-bold text-2xl text-gold">
              {formatPrice(product.price)}
            </span>

            <Button
              variant="whatsapp"
              size="lg"
              asChild
              disabled={isUnavailable}
              className={cn(
                "gap-2",
                isUnavailable && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <a
                href={!isUnavailable ? whatsappLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                {isUnavailable ? "Indisponível" : "Consultar"}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
