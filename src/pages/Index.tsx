import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import { useProducts, ProductCategory, ProductCollection } from "@/hooks/useProducts";
import { useCatalogSettings } from "@/hooks/useCatalogSettings";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, collections, isLoading: settingsLoading } = useCatalogSettings();
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
    status: p.status,
    stock: p.stock,
    image: p.image_url || "/placeholder.svg",
    image2: p.image_url_2,
    colors: p.colors || [],
  }));

  const isLoading = productsLoading || settingsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CategoryFilter
          selectedCategory={selectedCategory}
          selectedCollection={selectedCollection}
          categories={categories}
          collections={collections}
          onCategoryChange={setSelectedCategory}
          onCollectionChange={setSelectedCollection}
        />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <ProductGrid products={displayProducts} collections={collections} />
        )}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
