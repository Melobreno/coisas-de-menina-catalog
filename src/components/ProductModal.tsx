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
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  // Reset states when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-card w-[95vw] max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto p-5 md:p-8",
        "rounded-2xl shadow-2xl border-border"
      )}>
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 relative shrink-0">
             <div className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden bg-muted/20">
                 <img
                   src={images[currentImageIndex] || "/placeholder.svg"}
                   alt={product.name}
                   className="w-full h-full object-cover transition-opacity duration-300"
                 />
                 
                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/95 backdrop-blur-sm h-10 w-10 rounded-full shadow-md"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/95 backdrop-blur-sm h-10 w-10 rounded-full shadow-md"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </Button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-background/30 backdrop-blur-md">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            idx === currentImageIndex 
                              ? "bg-foreground scale-125 shadow-sm" 
                              : "bg-foreground/50 hover:bg-foreground/80"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
             </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full md:w-1/2 flex flex-col pt-2 md:pt-0">
            <div className="flex-1 space-y-6">
              
              {/* Header: Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-gold/10 rounded-md text-xs font-body font-semibold text-gold border border-gold/20 tracking-wider">
                  {product.code}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-md text-xs font-body font-semibold border tracking-wider",
                   availability.badgeClassName
                )}>
                  {availability.label}
                </span>
              </div>

              {/* Title & Price */}
              <div className="space-y-3">
                <h2 className="font-body font-bold text-3xl md:text-4xl text-foreground leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="font-body font-bold text-3xl md:text-4xl text-gold drop-shadow-sm">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-2 border-t border-border/40">
                  <h3 className="font-body font-semibold text-sm text-foreground mb-2">Detalhes da peça</h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Colors Dropdown */}
              {requiresColorSelection && (
                <div className="pt-4 border-t border-border/40">
                  <h3 className="font-body font-semibold text-sm text-foreground mb-3">
                    Selecione a cor desejada <span className="text-destructive">*</span>
                  </h3>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className={cn(
                      "w-full font-body h-14 rounded-xl border-ring focus:ring-gold transition-all duration-200",
                      selectedColor ? "bg-muted/30 border-gold/50" : "bg-background"
                    )}>
                       <SelectValue placeholder="Escolha uma cor..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50 rounded-xl">
                      {availableColors.map((color, idx) => (
                        <SelectItem key={idx} value={color} className="font-body py-3 text-base cursor-pointer">
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* CTA Footer */}
            <div className="mt-8 pt-6 border-t border-border/40">
              <Button
                variant="whatsapp"
                size="lg"
                asChild
                disabled={!canConsult}
                style={{ backgroundColor: canConsult ? '#25D366' : undefined }}
                className={cn(
                  "w-full h-14 rounded-xl font-body font-bold tracking-wide text-base shadow-lg transition-all duration-300 hover:scale-[1.02]",
                  !canConsult && "opacity-50 cursor-not-allowed pointer-events-none shadow-none hover:scale-100"
                )}
              >
                <a
                  href={canConsult ? whatsappLink : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full"
                >
                  <MessageCircle className="w-6 h-6" />
                  {!availability.isAvailable 
                    ? "Peça Esgotada" 
                    : (!hasSelectedRequiredColor ? "Selecione a cor para consultar" : "Consultar Disponibilidade")}
                </a>
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
