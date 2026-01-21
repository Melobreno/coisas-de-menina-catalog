import { useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Determine availability based on stock AND status
  const getAvailabilityInfo = () => {
    if (product.status === "esgotado" || product.stock === 0) {
      return { 
        label: "Esgotado", 
        className: "bg-destructive/10 text-destructive border-destructive/20",
        isAvailable: false 
      };
    }
    if (product.status === "sob-encomenda") {
      return { 
        label: "Sob encomenda", 
        className: "bg-amber-50 text-amber-700 border-amber-200",
        isAvailable: true 
      };
    }
    return { 
      label: "Em estoque", 
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      isAvailable: true 
    };
  };

  const availability = getAvailabilityInfo();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Image Gallery - Smaller on mobile */}
        <div className="relative aspect-[4/3] sm:aspect-square bg-muted">
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200",
                      idx === currentImageIndex 
                        ? "bg-gold scale-110" 
                        : "bg-card/60 hover:bg-card/80"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Code Badge - Smaller on mobile */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 bg-card/90 rounded-lg text-xs sm:text-sm font-body font-medium text-gold border border-gold/30">
              {product.code}
            </span>
          </div>

          {/* Availability Badge - Delicate style */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-body font-medium border transition-all",
              availability.className
            )}>
              {availability.label}
            </span>
          </div>
        </div>

        {/* Content - Compact on mobile */}
        <div className="p-4 sm:p-6">
          <h2 className="font-body font-semibold text-lg sm:text-2xl text-foreground mb-1.5 sm:mb-2 leading-tight">
            {product.name}
          </h2>
          
          {product.description && (
            <p className="font-body text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {product.description}
            </p>
          )}

          {/* Mobile: Stack layout / Desktop: Row layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <span className="font-body font-bold text-xl sm:text-2xl text-gold">
              {formatPrice(product.price)}
            </span>

            <Button
              variant="whatsapp"
              size="default"
              asChild
              disabled={!availability.isAvailable}
              className={cn(
                "gap-2 w-full sm:w-auto justify-center text-sm sm:text-base py-2.5 sm:py-3",
                !availability.isAvailable && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <a
                href={availability.isAvailable ? whatsappLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {!availability.isAvailable ? "Indisponível" : "Consultar"}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
