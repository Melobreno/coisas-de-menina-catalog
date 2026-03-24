import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, Save, Upload, Check, LogOut, Loader2, Search, Download, Filter, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
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
import { useProducts, ProductCategory, ProductCollection, ProductStatus, statusLabels } from "@/hooks/useProducts";
import { useCatalogSettings, Category, Collection } from "@/hooks/useCatalogSettings";
import LoginForm from "@/components/LoginForm";
import { CatalogSettingsModal } from "@/components/CatalogSettingsModal";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name: string;
  code: string;
  description: string;
  price: number;
  category: ProductCategory;
  collection: ProductCollection;
  status: ProductStatus;
  stock: number;
  image_url: string | null;
  image_url_2: string | null;
  colors: string[];
}

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSubmit: () => void;
  submitLabel: string;
  isUploading: boolean;
  isUploading2: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload2: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Category[];
  collections: Collection[];
}

const ProductForm = ({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
  isUploading,
  isUploading2,
  handleImageUpload,
  handleImageUpload2,
  categories,
  collections
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
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="font-body text-sm">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as ProductStatus })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <Label className="font-body text-sm">Coleção</Label>
      <Select
        value={formData.collection}
        onValueChange={(value) => setFormData({ ...formData, collection: value })}
      >
        <SelectTrigger className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card z-50">
          <SelectItem value="none" className="text-muted-foreground italic">Nenhuma coleção</SelectItem>
          {collections.map((col) => (
            <SelectItem key={col.id} value={col.slug}>{col.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="colors" className="font-body text-sm">Cores (separadas por vírgula ou ponto e vírgula)</Label>
      <Input
        id="colors"
        value={formData.colors ? formData.colors.join(', ') : ''}
        onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(/[;,]/).map(c => c.trim()).filter(Boolean) })}
        className="mt-1"
        placeholder="Ex: Dourado; Rosa; Azul"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="font-body text-sm">Imagem Principal</Label>
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
            className="mt-2 w-16 h-16 rounded-lg object-cover"
          />
        )}
      </div>
      <div>
        <Label className="font-body text-sm">Imagem Secundária</Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            className="flex-1"
            onChange={handleImageUpload2}
            disabled={isUploading2}
          />
          {isUploading2 ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        {formData.image_url_2 && (
          <img
            src={formData.image_url_2}
            alt="Preview 2"
            className="mt-2 w-16 h-16 rounded-lg object-cover"
          />
        )}
      </div>
    </div>

    <Button onClick={onSubmit} className="w-full mt-4" disabled={isUploading || isUploading2}>
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

  const { categories, collections, addCategory, deleteCategory, addCollection, deleteCollection, isLoading: settingsLoading } = useCatalogSettings();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bulkCollection, setBulkCollection] = useState<ProductCollection | "">("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);

  // Admin Management state
  const [isAdminManageOpen, setIsAdminManageOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminAssignSubmitting, setAdminAssignSubmitting] = useState(false);
  const [adminAssignError, setAdminAssignError] = useState("");
  const [adminAssignSuccess, setAdminAssignSuccess] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Search and Filter states
  const [searchCode, setSearchCode] = useState("");
  const [filterCategory, setFilterCategory] = useState<ProductCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "all">("all");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    code: "",
    description: "",
    price: 0,
    category: "lacos-infantil",
    collection: "especiais",
    status: "em-estoque",
    stock: 0,
    image_url: null,
    image_url_2: null,
    colors: [],
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const codeMatch = searchCode === "" || product.code.toLowerCase().includes(searchCode.toLowerCase());
      const categoryMatch = filterCategory === "all" || product.category === filterCategory;
      const statusMatch = filterStatus === "all" || product.status === filterStatus;
      return codeMatch && categoryMatch && statusMatch;
    });
  }, [products, searchCode, filterCategory, filterStatus]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
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

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAssignError("");
    setAdminAssignSuccess("");
    setAdminAssignSubmitting(true);

    const { error } = await supabase.rpc('assign_admin_role_by_email', { target_email: adminEmail });
    setAdminAssignSubmitting(false);

    if (error) {
      setAdminAssignError(error.message);
    } else {
      setAdminAssignSuccess("Usuário promovido a administrador com sucesso!");
      setAdminEmail("");
    }
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

  const handleImageUpload2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading2(true);
    const url = await uploadImage(file);
    setIsUploading2(false);

    if (url) {
      setFormData({ ...formData, image_url_2: url });
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
      status: "em-estoque",
      stock: 0,
      image_url: null,
      image_url_2: null,
      colors: [],
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
      status: product.status,
      stock: product.stock,
      image_url: product.image_url,
      image_url_2: product.image_url_2,
      colors: product.colors || [],
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Código", "Categoria", "Preço", "Imagem"];
    const rows = filteredProducts.map(p => [
      p.name,
      p.code,
      categories.find(c => c.slug === p.category)?.name || p.category,
      p.price.toFixed(2).replace(".", ","),
      p.image_url || ""
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `produtos-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (authLoading || settingsLoading) {
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
          <h2 className="font-body font-semibold text-xl text-foreground mb-2">Acesso Restrito</h2>
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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground w-8 h-8">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <h1 className="font-body font-semibold text-lg sm:text-xl text-foreground truncate">
                  Admin
                </h1>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} className="sm:hidden w-8 h-8 text-muted-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
              <Button variant="outline" size="sm" onClick={() => setIsSettingsModalOpen(true)} className="shrink-0">
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline-block">Catálogo</span>
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold" size="sm" onClick={resetForm} className="shrink-0">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline-block">Produto</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-body font-semibold">Adicionar Produto</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleAddProduct}
                    submitLabel="Adicionar Produto"
                    isUploading={isUploading}
                    isUploading2={isUploading2}
                    handleImageUpload={handleImageUpload}
                    handleImageUpload2={handleImageUpload2}
                    categories={categories}
                    collections={collections}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isAdminManageOpen} onOpenChange={(open) => {
                setIsAdminManageOpen(open);
                if (!open) {
                  setAdminEmail("");
                  setAdminAssignError("");
                  setAdminAssignSuccess("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex shrink-0">
                    <Shield className="w-4 h-4 mr-2" />
                    Acessos
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="font-body font-semibold">Novo Administrador</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <p className="text-sm font-body text-muted-foreground">
                      O usuário já deve ter uma conta para que você possa promovê-lo a administrador.
                    </p>
                    <form onSubmit={handleAssignAdmin} className="space-y-4">
                      <div>
                        <Label htmlFor="adminEmail" className="font-body text-sm">E-mail do Usuário</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="usuario@email.com"
                          required
                          className="mt-1"
                        />
                      </div>

                      {adminAssignError && (
                        <p className="text-sm text-destructive font-body">{adminAssignError}</p>
                      )}

                      {adminAssignSuccess && (
                        <p className="text-sm text-emerald-600 font-body">{adminAssignSuccess}</p>
                      )}

                      <Button type="submit" className="w-full" disabled={adminAssignSubmitting || !adminEmail}>
                        {adminAssignSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4 mr-2" />
                        )}
                        Conceder Acesso Admin
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon" onClick={signOut} title="Sair" className="hidden sm:flex shrink-0 text-muted-foreground w-8 h-8">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <CatalogSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />

      <main className="container mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            <div className="flex-1 w-full">
              <Label className="font-body text-xs text-muted-foreground mb-1 block">Buscar por Código</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o código..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full sm:w-40 shrink-0">
              <Label className="font-body text-xs text-muted-foreground mb-1 block">Categoria</Label>
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as ProductCategory | "all")}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 hidden sm:block" />
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40 shrink-0">
              <Label className="font-body text-xs text-muted-foreground mb-1 block">Status</Label>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ProductStatus | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="default" onClick={exportToCSV} className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline-block">Exportar</span>
            </Button>
          </div>
        </div>

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
                  {collections.map((col) => (
                    <SelectItem key={col.id} value={col.slug}>{col.name}</SelectItem>
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
        ) : filteredProducts.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="font-body text-muted-foreground">
              {products.length === 0 ? "Nenhum produto cadastrado." : "Nenhum produto encontrado com os filtros atuais."}
            </p>
            {products.length === 0 && (
              <p className="font-body text-sm text-muted-foreground mt-1">
                Clique em "Novo Produto" para começar.
              </p>
            )}
          </div>
        ) : (
          /* Products Table */
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full relative">
              <Table className="w-full min-w-[800px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        {product.image_url_2 && (
                          <img
                            src={product.image_url_2}
                            alt={`${product.name} 2`}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-xs text-gold font-medium">
                      {product.code}
                    </TableCell>
                    <TableCell className="font-body text-sm">{product.name}</TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">
                      {categories.find(c => c.slug === product.category)?.name || product.category}
                    </TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">
                      {product.collection ? (collections.find(c => c.slug === product.collection)?.name || product.collection) : "-"}
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
                    <TableCell>
                      <span className={cn(
                        "font-body text-xs px-2 py-1 rounded",
                        product.status === "em-estoque" && "bg-emerald-100 text-emerald-700",
                        product.status === "sob-encomenda" && "bg-amber-100 text-amber-700",
                        product.status === "esgotado" && "bg-rose-100 text-rose-700"
                      )}>
                        {statusLabels[product.status]}
                      </span>
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
                              <DialogTitle className="font-body font-semibold">Editar Produto</DialogTitle>
                            </DialogHeader>
                            <ProductForm
                              formData={formData}
                              setFormData={setFormData}
                              onSubmit={handleEditProduct}
                              submitLabel="Salvar Alterações"
                              isUploading={isUploading}
                              isUploading2={isUploading2}
                              handleImageUpload={handleImageUpload}
                              handleImageUpload2={handleImageUpload2}
                              categories={categories}
                              collections={collections}
                            />
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
