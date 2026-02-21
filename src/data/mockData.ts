import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export interface Property {
  id: string;
  name: string;
  location: string;
  state: string;
  totalArea: number;
  productiveArea: number;
  soilType: string;
  avgRainfall: number;
  infrastructure: string[];
  suggestedCrops: string[];
  price: number;
  pricePerHectare: number;
  productivityScore: number;
  image: string;
  images: string[];
  lat: number;
  lng: number;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  status: "novo" | "contato" | "fechado";
  date: string;
  message: string;
}

export const properties: Property[] = [
  {
    id: "1",
    name: "Fazenda Esperança",
    location: "Ribeirão Preto",
    state: "SP",
    totalArea: 1200,
    productiveArea: 980,
    soilType: "Latossolo Vermelho",
    avgRainfall: 1420,
    infrastructure: ["Irrigação", "Armazém", "Curral", "Energia elétrica"],
    suggestedCrops: ["Soja", "Milho", "Cana-de-açúcar"],
    price: 18000000,
    pricePerHectare: 15000,
    productivityScore: 92,
    image: property1,
    images: [property1, property2, property3],
    lat: -21.17,
    lng: -47.81,
    description: "Fazenda com alto potencial produtivo, solo fértil e infraestrutura completa. Ideal para grãos e cana.",
  },
  {
    id: "2",
    name: "Fazenda Santa Maria",
    location: "Luís Eduardo Magalhães",
    state: "BA",
    totalArea: 3500,
    productiveArea: 2800,
    soilType: "Latossolo Amarelo",
    avgRainfall: 1100,
    infrastructure: ["Pivôs centrais", "Silos", "Balança"],
    suggestedCrops: ["Soja", "Algodão", "Milho safrinha"],
    price: 42000000,
    pricePerHectare: 12000,
    productivityScore: 88,
    image: property2,
    images: [property2, property1, property3],
    lat: -12.09,
    lng: -45.79,
    description: "Grande fazenda no MATOPIBA com infraestrutura moderna. Região de expansão agrícola.",
  },
  {
    id: "3",
    name: "Sítio Vale Verde",
    location: "Poços de Caldas",
    state: "MG",
    totalArea: 48,
    productiveArea: 35,
    soilType: "Argissolo",
    avgRainfall: 1600,
    infrastructure: ["Casa sede", "Lago", "Pomar"],
    suggestedCrops: ["Café", "Frutas", "Hortaliças"],
    price: 1200000,
    pricePerHectare: 25000,
    productivityScore: 75,
    image: property3,
    images: [property3, property1, property2],
    lat: -21.78,
    lng: -46.56,
    description: "Sítio encantador com produção diversificada, ideal para agricultura familiar e turismo rural.",
  },
  {
    id: "4",
    name: "Fazenda Rio Claro",
    location: "Sorriso",
    state: "MT",
    totalArea: 5200,
    productiveArea: 4600,
    soilType: "Latossolo Vermelho-Amarelo",
    avgRainfall: 1900,
    infrastructure: ["Armazém", "Secador", "Oficina", "Pista de pouso"],
    suggestedCrops: ["Soja", "Milho", "Algodão"],
    price: 78000000,
    pricePerHectare: 15000,
    productivityScore: 95,
    image: property1,
    images: [property1, property2, property3],
    lat: -12.55,
    lng: -55.72,
    description: "Mega propriedade na capital do agro brasileiro. Score produtivo excepcional.",
  },
  {
    id: "5",
    name: "Fazenda Boa Vista",
    location: "Cascavel",
    state: "PR",
    totalArea: 800,
    productiveArea: 720,
    soilType: "Terra Roxa",
    avgRainfall: 1800,
    infrastructure: ["Irrigação", "Armazém", "Galpão"],
    suggestedCrops: ["Soja", "Trigo", "Milho"],
    price: 16000000,
    pricePerHectare: 20000,
    productivityScore: 90,
    image: property2,
    images: [property2, property3, property1],
    lat: -24.96,
    lng: -53.46,
    description: "Terra Roxa de alta qualidade no oeste paranaense. Excelente para rotação de culturas.",
  },
  {
    id: "6",
    name: "Sítio Recanto da Serra",
    location: "Domingos Martins",
    state: "ES",
    totalArea: 22,
    productiveArea: 18,
    soilType: "Cambissolo",
    avgRainfall: 1350,
    infrastructure: ["Casa sede", "Estufa", "Poço artesiano"],
    suggestedCrops: ["Café arábica", "Morango", "Hortaliças orgânicas"],
    price: 850000,
    pricePerHectare: 38636,
    productivityScore: 68,
    image: property3,
    images: [property3, property2, property1],
    lat: -20.36,
    lng: -40.66,
    description: "Pequena propriedade de montanha com potencial para orgânicos e agroturismo.",
  },
];

export const leads: Lead[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    email: "carlos@email.com",
    phone: "(11) 98765-4321",
    propertyId: "1",
    propertyName: "Fazenda Esperança",
    status: "novo",
    date: "2026-02-20",
    message: "Tenho interesse na fazenda, gostaria de agendar visita.",
  },
  {
    id: "2",
    name: "Ana Lucia Ferreira",
    email: "ana.lucia@email.com",
    phone: "(62) 99876-5432",
    propertyId: "4",
    propertyName: "Fazenda Rio Claro",
    status: "contato",
    date: "2026-02-18",
    message: "Quero detalhes sobre a produtividade histórica.",
  },
  {
    id: "3",
    name: "Pedro Agostini",
    email: "pedro.a@email.com",
    phone: "(41) 91234-5678",
    propertyId: "5",
    propertyName: "Fazenda Boa Vista",
    status: "fechado",
    date: "2026-02-10",
    message: "Fechar negócio, já tenho financiamento aprovado.",
  },
  {
    id: "4",
    name: "Mariana Costa",
    email: "mari.costa@email.com",
    phone: "(27) 99871-2233",
    propertyId: "3",
    propertyName: "Sítio Vale Verde",
    status: "novo",
    date: "2026-02-21",
    message: "Quero saber mais sobre o potencial para café.",
  },
];

export const cropData = [
  { name: "Soja", yieldPerHa: 3.5, pricePerTon: 2200, costPerHa: 3800 },
  { name: "Milho", yieldPerHa: 6.0, pricePerTon: 1100, costPerHa: 3200 },
  { name: "Algodão", yieldPerHa: 4.2, pricePerTon: 6800, costPerHa: 7500 },
  { name: "Café", yieldPerHa: 2.0, pricePerTon: 12000, costPerHa: 8000 },
  { name: "Cana-de-açúcar", yieldPerHa: 80, pricePerTon: 130, costPerHa: 6500 },
  { name: "Trigo", yieldPerHa: 3.0, pricePerTon: 1600, costPerHa: 2800 },
];

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatArea(value: number): string {
  return `${value.toLocaleString("pt-BR")} ha`;
}
