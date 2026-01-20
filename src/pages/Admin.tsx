import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, Save, Upload, Check, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, ProductCategory, ProductCollection, categoryLabels, collectionLabels } from "@/hooks/useProducts";
import LoginForm from "@/components/LoginForm";
import { cn } from "@/lib/utils";

const statusLabels = {
  "em-estoque": "Em Estoque",
  "sob-encomenda": "Sob Encomenda",
  "esgotado": "Esgotado",
};

interface ProductFormData {
  name: string;
  code: string;
  description: string;
  price: number;
  category: ProductCategory;
  collection: ProductCollection;
  stock: number;
  image_url: string | null;
}

// 2. Defina as props que o formulário vai receber
interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSubmit: () => void;
  submitLabel: string;
  isUploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 3. O componente agora é independente e recebe tudo via props
const ProductForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitLabel, 
  isUploading, 
  handleImageUpload 
}: ProductFormProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name" className="font-body text-sm">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="code" className="font-body text-sm">Código Único</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="description" className="font-body text-sm">Descrição</Label>
      <Input
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="mt-1"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price" className="font-body text-sm">Preço (R$)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="stock" className="font-body text-sm">Estoque</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          className="mt-1"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="font-body text-sm">Categoria</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value as ProductCategory })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="font-body text-sm">Coleção</Label>
        <Select
          value={formData.collection}
          onValueChange={(value) => setFormData({ ...formData, collection: value as ProductCollection })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            {Object.entries(collectionLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <Label className="font-body text-sm">Imagem</Label>
      <div className="mt-1 flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          className="flex-1"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      {formData.image_url && (
        <img 
          src={formData.image_url} 
          alt="Preview" 
          className="mt-2 w-20 h-20 rounded-lg object-cover"
        />
      )}
    </div>

    <Button onClick={onSubmit} className="w-full mt-4" disabled={isUploading}>
      <Save className="w-4 h-4 mr-2" />
      {submitLabel}
    </Button>
  </div>
);

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { 
    products, 
    isLoading: productsLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    bulkUpdateCollection, 
    bulkDelete,
    uploadImage 
  } = useProducts();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bulkCollection, setBulkCollection] = useState<ProductCollection | "">("");
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    price: 0,
    category: "lacos-infantil" as ProductCategory,
    collection: "especiais" as ProductCollection,
    stock: 0,
    image_url: null as string | null,
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    await bulkDelete(selectedProducts);
    setSelectedProducts([]);
  };

  const handleBulkCollectionChange = async () => {
    if (selectedProducts.length === 0 || !bulkCollection) return;
    await bulkUpdateCollection(selectedProducts, bulkCollection);
    setSelectedProducts([]);
    setBulkCollection("");
  };

  const handleAddProduct = async () => {
    await addProduct(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = async () => {
    if (!editingProductId) return;
    await updateProduct(editingProductId, formData);
    setEditingProductId(null);
    resetForm();
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadImage(file);
    setIsUploading(false);

    if (url) {
      setFormData({ ...formData, image_url: url });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      price: 0,
      category: "lacos-infantil",
      collection: "especiais",
      stock: 0,
      image_url: null,
    });
  };

  const startEdit = (product: typeof products[0]) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      code: product.code,
      description: product.description || "",
      price: product.price,
      category: product.category,
      collection: product.collection || "especiais",
      stock: product.stock,
      image_url: product.image_url,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "esgotado";
    if (stock <= 3) return "sob-encomenda";
    return "em-estoque";
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
          <LoginForm />
          <div className="mt-6 text-center">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <h2 className="font-display text-xl text-foreground mb-2">Acesso Restrito</h2>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <div className="flex gap-2 justify-center">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="font-display text-xl text-foreground">
                Painel Administrativo
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold" size="sm" onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display">Adicionar Produto</DialogTitle>
                  </DialogHeader>
                  <ProductForm formData={formData} setFormData={setFormData} onSubmit={handleAddProduct} submitLabel="Adicionar Produto" isUploading={isUploading} handleImageUpload={handleImageUpload}/>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
            <span className="font-body text-sm text-foreground">
              {selectedProducts.length} produto(s) selecionado(s)
            </span>
            
            <div className="flex items-center gap-2">
              <Select value={bulkCollection} onValueChange={(v) => setBulkCollection(v as ProductCollection)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Alterar coleção" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {Object.entries(collectionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkCollectionChange}
                disabled={!bulkCollection}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Selecionados
            </Button>
          </div>
        )}

        {/* Loading */}
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="font-body text-muted-foreground">Nenhum produto cadastrado.</p>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Clique em "Novo Produto" para começar.
            </p>
          </div>
        ) : (
          /* Products Table */
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-body text-xs">Imagem</TableHead>
                  <TableHead className="font-body text-xs">Código</TableHead>
                  <TableHead className="font-body text-xs">Nome</TableHead>
                  <TableHead className="font-body text-xs">Categoria</TableHead>
                  <TableHead className="font-body text-xs">Coleção</TableHead>
                  <TableHead className="font-body text-xs">Preço</TableHead>
                  <TableHead className="font-body text-xs">Estoque</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <img 
                        src={product.image_url || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-body text-xs text-gold font-medium">
                      {product.code}
                    </TableCell>
                    <TableCell className="font-body text-sm">{product.name}</TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">
                      {categoryLabels[product.category]}
                    </TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">
                      {product.collection ? collectionLabels[product.collection] : "-"}
                    </TableCell>
                    <TableCell className="font-body text-sm text-gold">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-body text-xs px-2 py-1 rounded",
                        product.stock === 0 
                          ? "bg-rose-100 text-rose-700" 
                          : "bg-emerald-100 text-emerald-700"
                      )}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="font-body text-xs">
                      {statusLabels[getStockStatus(product.stock)]}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => startEdit(product)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-display">Editar Produto</DialogTitle>
                            </DialogHeader>
                            <ProductForm formData={formData} setFormData={setFormData} onSubmit={handleEditProduct} submitLabel="Salvar Alterações" isUploading={isUploading} handleImageUpload={handleImageUpload}/>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
