import { cn } from "@/lib/utils";
import { ProductCategory, ProductCollection, categoryLabels, collectionLabels } from "@/data/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: ProductCategory | "all";
  selectedCollection: ProductCollection | "all";
  onCategoryChange: (category: ProductCategory | "all") => void;
  onCollectionChange: (collection: ProductCollection | "all") => void;
}

const categories: (ProductCategory | "all")[] = [
  "all",
  "lacos-infantil",
  "lacos-adulto",
  "tiaras",
  "pulseiras",
];

const collections: (ProductCollection | "all")[] = [
  "all",
  "carnaval",
  "sao-joao",
  "natal",
  "ano-novo",
  "escolar",
  "especiais",
];

const CategoryFilter = ({ 
  selectedCategory, 
  selectedCollection,
  onCategoryChange, 
  onCollectionChange 
}: CategoryFilterProps) => {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="font-display text-xl md:text-2xl text-foreground mb-1">
            Nossas Categorias
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            Explore nossa coleção exclusiva
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "px-4 py-2 rounded-xl font-body text-sm border-2",
                selectedCategory === category
                  ? "bg-gold text-secondary-foreground border-gold"
                  : "bg-transparent text-foreground border-border hover:border-gold hover:text-gold"
              )}
            >
              {category === "all" ? "Todos" : categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Collection Dropdown */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <Select 
              value={selectedCollection} 
              onValueChange={(value) => onCollectionChange(value as ProductCollection | "all")}
            >
              <SelectTrigger className="w-full bg-card border-border font-body">
                <SelectValue placeholder="Filtrar por Coleção" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {collections.map((collection) => (
                  <SelectItem 
                    key={collection} 
                    value={collection}
                    className="font-body cursor-pointer"
                  >
                    {collection === "all" ? "Todas as Coleções" : collectionLabels[collection]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
