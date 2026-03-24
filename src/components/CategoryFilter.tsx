import { cn } from "@/lib/utils";
import { ProductCategory, ProductCollection } from "@/hooks/useProducts";
import { Category, Collection } from "@/hooks/useCatalogSettings";
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
  categories: Category[];
  collections: Collection[];
}

const CategoryFilter = ({ 
  selectedCategory, 
  selectedCollection,
  categories,
  collections,
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
          <button
            onClick={() => onCategoryChange("all")}
            className={cn(
              "px-4 py-2 rounded-xl font-body text-sm border-2",
              selectedCategory === "all"
                ? "bg-gold text-secondary-foreground border-gold"
                : "bg-transparent text-foreground border-border hover:border-gold hover:text-gold"
            )}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "px-4 py-2 rounded-xl font-body text-sm border-2",
                selectedCategory === category.slug
                  ? "bg-gold text-secondary-foreground border-gold"
                  : "bg-transparent text-foreground border-border hover:border-gold hover:text-gold"
              )}
            >
              {category.name}
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
                <SelectItem value="all" className="font-body cursor-pointer">Todas as Coleções</SelectItem>
                {collections.map((collection) => (
                  <SelectItem 
                    key={collection.id} 
                    value={collection.slug}
                    className="font-body cursor-pointer"
                  >
                    {collection.name}
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
