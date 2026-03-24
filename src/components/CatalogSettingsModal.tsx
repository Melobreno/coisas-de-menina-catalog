import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { useCatalogSettings } from "@/hooks/useCatalogSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CatalogSettingsModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const { categories, collections, addCategory, deleteCategory, addCollection, deleteCollection } = useCatalogSettings();
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const slug = generateSlug(newCategoryName);
    addCategory(newCategoryName, slug);
    setNewCategoryName("");
  };

  const handleAddCollection = () => {
    if (!newCollectionName) return;
    const slug = generateSlug(newCollectionName);
    addCollection(newCollectionName, slug);
    setNewCollectionName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-body font-semibold">Gerenciar Catálogo</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="categories" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="collections">Coleções</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Nova categoria..." 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button variant="gold" size="icon" onClick={handleAddCategory}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2 bg-muted rounded-md border border-border">
                  <span className="font-body text-sm">{cat.name}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">Nenhuma categoria cadastrada</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Nova coleção..." 
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCollection()}
              />
              <Button variant="gold" size="icon" onClick={handleAddCollection}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {collections.map((col) => (
                <div key={col.id} className="flex items-center justify-between p-2 bg-muted rounded-md border border-border">
                  <span className="font-body text-sm">{col.name}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteCollection(col.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {collections.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">Nenhuma coleção cadastrada</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
