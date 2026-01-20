import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProductCategory = "lacos-infantil" | "lacos-adulto" | "tiaras" | "pulseiras";
export type ProductCollection = "carnaval" | "sao-joao" | "natal" | "ano-novo" | "escolar" | "especiais";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  code: string;
  category: ProductCategory;
  collection: ProductCollection | null;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  "lacos-infantil": "Laços Infantis",
  "lacos-adulto": "Laços Adulto",
  "tiaras": "Tiaras Aramadas",
  "pulseiras": "Pulseiras",
};

export const collectionLabels: Record<ProductCollection, string> = {
  "carnaval": "Carnaval",
  "sao-joao": "São João",
  "natal": "Natal",
  "ano-novo": "Ano Novo",
  "escolar": "Escolar",
  "especiais": "Especiais",
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Erro ao carregar produtos");
    } else {
      setProducts(data as Product[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (product == null) {
      console.error("Error adding product:", error);
      toast.error("Erro ao adicionar produto");
      return null;
    } else if (product.name === ""){
      console.error("Error adding product:", error);
      toast.error("Erro ao adicionar produto");
      return null;
    } else if (error) {
      console.error("Error adding product:", error);
      toast.error("Erro ao adicionar produto");
      return null;
    } 
    
      toast.success("Produto adicionado com sucesso");
      await fetchProducts();
      return data as Product;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating product:", error);
      toast.error("Erro ao atualizar produto");
      return false;
    }

    toast.success("Produto atualizado com sucesso");
    await fetchProducts();
    return true;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      toast.error("Erro ao excluir produto");
      return false;
    }

    toast.success("Produto excluído");
    await fetchProducts();
    return true;
  };

  const bulkUpdateCollection = async (ids: string[], collection: ProductCollection) => {
    const { error } = await supabase
      .from("products")
      .update({ collection })
      .in("id", ids);

    if (error) {
      console.error("Error updating collection:", error);
      toast.error("Erro ao atualizar coleção");
      return false;
    }

    toast.success(`Coleção atualizada para ${ids.length} produto(s)`);
    await fetchProducts();
    return true;
  };

  const bulkDelete = async (ids: string[]) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error deleting products:", error);
      toast.error("Erro ao excluir produtos");
      return false;
    }

    toast.success(`${ids.length} produto(s) excluído(s)`);
    await fetchProducts();
    return true;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    products,
    isLoading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateCollection,
    bulkDelete,
    uploadImage,
  };
};
