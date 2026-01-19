import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Upload, Check } from "lucide-react";
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
import { 
  products as initialProducts, 
  Product, 
  ProductCategory, 
  ProductCollection,
  ProductStatus,
  categoryLabels, 
  collectionLabels,
  statusLabels 
} from "@/data/products";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Admin = () => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bulkCollection, setBulkCollection] = useState<ProductCollection | "">("");

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    code: "",
    description: "",
    price: 0,
    category: "lacos-infantil",
    collection: "especiais",
    status: "em-estoque",
    stock: 0,
    image: "/placeholder.svg",
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(productList.map(p => p.id));
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

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    setProductList(productList.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    toast.success(`${selectedProducts.length} produto(s) excluído(s)`);
  };

  const handleBulkCollectionChange = () => {
    if (selectedProducts.length === 0 || !bulkCollection) return;
    setProductList(productList.map(p => 
      selectedProducts.includes(p.id) 
        ? { ...p, collection: bulkCollection as ProductCollection }
        : p
    ));
    setSelectedProducts([]);
    setBulkCollection("");
    toast.success(`Coleção atualizada para ${selectedProducts.length} produto(s)`);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      ...formData as Product,
      id: Date.now().toString(),
    };
    setProductList([...productList, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Produto adicionado com sucesso");
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    setProductList(productList.map(p => 
      p.id === editingProduct.id ? { ...editingProduct, ...formData } as Product : p
    ));
    setEditingProduct(null);
    resetForm();
    toast.success("Produto atualizado com sucesso");
  };

  const handleDeleteProduct = (productId: string) => {
    setProductList(productList.filter(p => p.id !== productId));
    toast.success("Produto excluído");
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
      image: "/placeholder.svg",
    });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const ProductForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
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

      <div>
        <Label className="font-body text-sm">Imagem</Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            className="flex-1"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setFormData({ ...formData, image: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <Upload className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full mt-4">
        <Save className="w-4 h-4 mr-2" />
        {submitLabel}
      </Button>
    </div>
  );

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
                <ProductForm onSubmit={handleAddProduct} submitLabel="Adicionar Produto" />
              </DialogContent>
            </Dialog>
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

        {/* Products Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === productList.length && productList.length > 0}
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
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <img 
                      src={product.image} 
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
                      {product.stock ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="font-body text-xs">
                    {statusLabels[product.status]}
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
                          <ProductForm onSubmit={handleEditProduct} submitLabel="Salvar Alterações" />
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
      </main>
    </div>
  );
};

export default Admin;
