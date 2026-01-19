import lacoImg from "@/assets/product-laco-1.jpg";
import laco2Img from "@/assets/product-laco-2.jpg";
import laco3Img from "@/assets/product-laco-3.jpg";
import tiaraImg from "@/assets/product-tiara-1.jpg";
import tiara2Img from "@/assets/product-tiara-2.jpg";
import pulseiraImg from "@/assets/product-pulseira-1.jpg";

export type ProductCategory = "lacos-infantil" | "lacos-adulto" | "tiaras" | "pulseiras";
export type ProductStatus = "em-estoque" | "sob-encomenda" | "esgotado";
export type ProductCollection = "carnaval" | "sao-joao" | "natal" | "ano-novo" | "escolar" | "especiais";

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  status: ProductStatus;
  collection?: ProductCollection;
  stock?: number;
}

export const categoryLabels: Record<ProductCategory, string> = {
  "lacos-infantil": "Laços Infantis",
  "lacos-adulto": "Laços Adulto",
  "tiaras": "Tiaras Aramadas",
  "pulseiras": "Pulseiras",
};

export const statusLabels: Record<ProductStatus, string> = {
  "em-estoque": "Em Estoque",
  "sob-encomenda": "Sob Encomenda",
  "esgotado": "Esgotado",
};

export const collectionLabels: Record<ProductCollection, string> = {
  "carnaval": "Carnaval",
  "sao-joao": "São João",
  "natal": "Natal",
  "ano-novo": "Ano Novo",
  "escolar": "Escolar",
  "especiais": "Especiais",
};

export const products: Product[] = [
  {
    id: "1",
    code: "LI-001",
    name: "Laço Princesa Rosa",
    description: "Laço delicado em cetim rosa com acabamento premium",
    price: 35.90,
    category: "lacos-infantil",
    image: lacoImg,
    status: "em-estoque",
    collection: "especiais",
    stock: 5,
  },
  {
    id: "2",
    code: "LI-002",
    name: "Laço Borboleta Pérola",
    description: "Laço elegante com detalhes em pérolas sintéticas",
    price: 42.90,
    category: "lacos-infantil",
    image: lacoImg,
    status: "em-estoque",
    collection: "escolar",
    stock: 3,
  },
  {
    id: "3",
    code: "LA-001",
    name: "Laço Sofisticado Gold",
    description: "Laço adulto em tecido premium com estampa floral dourada",
    price: 58.90,
    category: "lacos-adulto",
    image: laco2Img,
    status: "sob-encomenda",
    collection: "especiais",
    stock: 0,
  },
  {
    id: "4",
    code: "TA-001",
    name: "Tiara Floral Encantada",
    description: "Tiara aramada com flores delicadas e pérolas",
    price: 89.90,
    category: "tiaras",
    image: tiaraImg,
    status: "em-estoque",
    collection: "especiais",
    stock: 2,
  },
  {
    id: "5",
    code: "TA-002",
    name: "Tiara Estrela Dourada",
    description: "Tiara com estrelas em metal dourado e cristais",
    price: 79.90,
    category: "tiaras",
    image: tiara2Img,
    status: "sob-encomenda",
    collection: "natal",
    stock: 0,
  },
  {
    id: "6",
    code: "PU-001",
    name: "Pulseira Quartzo Rosa",
    description: "Pulseira artesanal com pedras de quartzo rosa",
    price: 65.90,
    category: "pulseiras",
    image: pulseiraImg,
    status: "em-estoque",
    collection: "especiais",
    stock: 4,
  },
  {
    id: "7",
    code: "PU-002",
    name: "Pulseira Pérolas Delicadas",
    description: "Pulseira com pérolas naturais e fecho dourado",
    price: 78.90,
    category: "pulseiras",
    image: pulseiraImg,
    status: "em-estoque",
    collection: "especiais",
    stock: 6,
  },
  {
    id: "8",
    code: "LI-003",
    name: "Laço Festa Junina",
    description: "Laço temático xadrez vermelho para festas juninas",
    price: 38.90,
    category: "lacos-infantil",
    image: laco3Img,
    status: "em-estoque",
    collection: "sao-joao",
    stock: 10,
  },
  {
    id: "9",
    code: "LA-002",
    name: "Laço Marsala Elegance",
    description: "Laço adulto sofisticado em tecido bordô com flores",
    price: 62.90,
    category: "lacos-adulto",
    image: laco2Img,
    status: "em-estoque",
    collection: "natal",
    stock: 3,
  },
  {
    id: "10",
    code: "TA-003",
    name: "Tiara Celestial",
    description: "Tiara delicada com estrelas e cristais brilhantes",
    price: 95.90,
    category: "tiaras",
    image: tiara2Img,
    status: "em-estoque",
    collection: "ano-novo",
    stock: 2,
  },
];
