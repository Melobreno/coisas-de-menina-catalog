import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import { products, ProductCategory, ProductCollection } from "@/data/products";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedCollection, setSelectedCollection] = useState<ProductCollection | "all">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      const collectionMatch = selectedCollection === "all" || product.collection === selectedCollection;
      return categoryMatch && collectionMatch;
    });
  }, [selectedCategory, selectedCollection]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CategoryFilter
          selectedCategory={selectedCategory}
          selectedCollection={selectedCollection}
          onCategoryChange={setSelectedCategory}
          onCollectionChange={setSelectedCollection}
        />
        <ProductGrid products={filteredProducts} />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
