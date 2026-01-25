export type ProductStatus = "em-estoque" | "sob-encomenda" | "esgotado";

type ProductAvailability = {
  label: string;
  isAvailable: boolean;
  badgeClassName: string;
};

// Centraliza a regra: disponibilidade deve refletir status + estoque.
export function getProductAvailability(input: {
  status: ProductStatus;
  stock: number;
}): ProductAvailability {
  const { status, stock } = input;

  if (status === "esgotado" || stock === 0) {
    return {
      label: "Indisponível",
      isAvailable: false,
      badgeClassName: "bg-destructive/10 text-destructive border-destructive/20",
    };
  }

  if (status === "sob-encomenda") {
    return {
      label: "Sob encomenda",
      isAvailable: true,
      badgeClassName: "bg-primary/40 text-primary-foreground border-primary/30",
    };
  }

  return {
    label: "Em estoque",
    isAvailable: true,
    badgeClassName: "bg-accent/40 text-accent-foreground border-accent/40",
  };
}
