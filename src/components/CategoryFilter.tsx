import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductCategory, categoryLabels } from "@/data/products";

interface CategoryFilterProps {
  selectedCategory: ProductCategory | "all";
  onCategoryChange: (category: ProductCategory | "all") => void;
}

const categories: (ProductCategory | "all")[] = [
  "all",
  "lacos-infantil",
  "lacos-adulto",
  "tiaras",
  "pulseiras",
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">
            Nossas Categorias
          </h3>
          <p className="font-body text-muted-foreground">
            Explore nossa coleção exclusiva
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-body text-sm transition-all duration-300",
                "border-2",
                selectedCategory === category
                  ? "bg-gold text-secondary-foreground border-gold shadow-gold"
                  : "bg-transparent text-foreground border-border hover:border-gold hover:text-gold"
              )}
            >
              {category === "all" ? "Todos" : categoryLabels[category]}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryFilter;
