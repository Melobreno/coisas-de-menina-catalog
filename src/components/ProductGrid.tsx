import ProductCard from "./ProductCard";
import { ProductCategory, ProductCollection } from "@/hooks/useProducts";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  category: ProductCategory;
  collection: ProductCollection | null;
  status: "em-estoque" | "sob-encomenda" | "esgotado";
  stock: number;
  image: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h4 className="font-display text-lg text-foreground mb-1">
          Nenhum produto encontrado
        </h4>
        <p className="font-body text-sm text-muted-foreground">
          Tente selecionar outra categoria ou coleção
        </p>
      </div>
    );
  }

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
