import { useState, useEffect } from "react";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { getProductAvailability } from "@/lib/productAvailability";
import { useIsMobile } from "@/hooks/use-mobile";

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
    colors: string[];
  };
  categoryName?: string;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const isMobile = useIsMobile();
  
  // Reset states when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsDescriptionExpanded(false);
      setSelectedColor("");
    }
  }, [isOpen, product.id]);

  const images = [product.image, product.image2].filter(Boolean) as string[];
  const hasMultipleImages = images.length > 1;

  const whatsappNumber = "5581988325302";
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no item ${product.name} (Código: ${product.code})${selectedColor ? ` na cor ${selectedColor}` : ''}.`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const availability = getProductAvailability({
    status: product.status,
    stock: product.stock,
  });

  const availableColors = product.colors 
    ? product.colors.flatMap(c => c.split(/[;,]/).map(s => s.trim()).filter(Boolean)) 
    : [];

  const requiresColorSelection = availableColors.length > 0;
  const hasSelectedRequiredColor = !requiresColorSelection || selectedColor !== "";
  const canConsult = availability.isAvailable && hasSelectedRequiredColor;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Check if description is long enough to need truncation (mobile only)
  const descriptionNeedsTruncation = isMobile && product.description && product.description.length > 80;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-card max-w-2xl p-0 overflow-hidden",
        isMobile ? "max-h-[95vh] flex flex-col" : "max-h-[90vh] overflow-y-auto"
      )}>
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Scrollable content area on mobile */}
        <div className={cn(isMobile && "flex-1 overflow-y-auto pb-20")}>
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
                 availability.badgeClassName
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
              <div className="mb-3 sm:mb-4">
                <p className={cn(
                  "font-body text-sm sm:text-base text-muted-foreground leading-relaxed",
                  isMobile && !isDescriptionExpanded && "line-clamp-2"
                )}>
                  {product.description}
                </p>
                {descriptionNeedsTruncation && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-xs text-gold hover:text-gold/80 font-medium mt-1 transition-colors"
                  >
                    {isDescriptionExpanded ? "ver menos" : "ver mais"}
                  </button>
                )}
              </div>
            )}

            {/* Colors */}
            {requiresColorSelection && (
              <div className="mb-4 sm:mb-6">
                <p className="font-body text-sm font-medium text-foreground mb-2">Selecione uma cor:</p>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full sm:w-64 font-body">
                     <SelectValue placeholder="Escolha uma cor" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {availableColors.map((color, idx) => (
                      <SelectItem key={idx} value={color} className="font-body">
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Desktop: Row layout with CTA */}
            {!isMobile && (
              <div className="flex items-center justify-between gap-4">
                <span className="font-body font-bold text-2xl text-gold">
                  {formatPrice(product.price)}
                </span>

                <Button
                  variant="whatsapp"
                  size="default"
                  asChild
                  disabled={!canConsult}
                  className={cn(
                    "gap-2",
                    !canConsult && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <a
                    href={canConsult ? whatsappLink : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {!availability.isAvailable 
                      ? "Indisponível" 
                      : (!hasSelectedRequiredColor ? "Selecione uma cor" : "Consultar")}
                  </a>
                </Button>
              </div>
            )}

            {/* Mobile: Only price in content area */}
            {isMobile && (
              <span className="font-body font-bold text-xl text-gold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile: Fixed CTA at bottom */}
        {isMobile && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border/50 shadow-lg">
            <Button
              variant="whatsapp"
              size="default"
              asChild
              disabled={!canConsult}
              className={cn(
                "gap-2 w-full justify-center",
                !canConsult && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <a
                href={canConsult ? whatsappLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                {!availability.isAvailable 
                  ? "Indisponível" 
                  : (!hasSelectedRequiredColor ? "Selecione uma cor" : "Consultar via WhatsApp")}
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
