import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import { useProducts, ProductCategory, ProductCollection } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedCollection, setSelectedCollection] = useState<ProductCollection | "all">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      const collectionMatch = selectedCollection === "all" || product.collection === selectedCollection;
      return categoryMatch && collectionMatch;
    });
  }, [products, selectedCategory, selectedCollection]);

  // Transform products to match ProductCard expected format
  const displayProducts = filteredProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    price: p.price,
    code: p.code,
    category: p.category,
    collection: p.collection,
    status: p.stock === 0 ? "esgotado" as const : p.stock <= 3 ? "sob-encomenda" as const : "em-estoque" as const,
    stock: p.stock,
    image: p.image_url || "/placeholder.svg",
  }));

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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <ProductGrid products={displayProducts} />
        )}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
