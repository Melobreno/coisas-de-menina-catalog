import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
}

export const useCatalogSettings = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    const [categoriesRes, collectionsRes] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("collections").select("*").order("name")
    ]);

    if (categoriesRes.error) console.error("Error fetching categories:", categoriesRes.error);
    if (collectionsRes.error) console.error("Error fetching collections:", collectionsRes.error);

    setCategories(categoriesRes.data || []);
    setCollections(collectionsRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const addCategory = async (name: string, slug: string) => {
    const { error } = await supabase.from("categories").insert({ name, slug });
    if (error) {
      toast.error("Erro ao adicionar categoria");
      return false;
    }
    toast.success("Categoria adicionada");
    fetchSettings();
    return true;
  };

  const deleteCategory = async (id: string) => {
    // Basic deletion, assume cascade or constraint prevents if in use
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir. Verifique se está em uso.");
      return false;
    }
    toast.success("Categoria excluída");
    fetchSettings();
    return true;
  };

  const addCollection = async (name: string, slug: string) => {
    const { error } = await supabase.from("collections").insert({ name, slug });
    if (error) {
      toast.error("Erro ao adicionar coleção");
      return false;
    }
    toast.success("Coleção adicionada");
    fetchSettings();
    return true;
  };

  const deleteCollection = async (id: string) => {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir. Verifique se está em uso.");
      return false;
    }
    toast.success("Coleção excluída");
    fetchSettings();
    return true;
  };

  return {
    categories,
    collections,
    isLoading,
    addCategory,
    deleteCategory,
    addCollection,
    deleteCollection
  };
};
