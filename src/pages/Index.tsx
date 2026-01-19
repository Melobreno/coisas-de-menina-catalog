import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import { products, ProductCategory } from "@/data/products";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <ProductGrid products={filteredProducts} />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
