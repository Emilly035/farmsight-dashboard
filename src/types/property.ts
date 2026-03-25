export interface Property {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  state: string;
  total_area: number;
  productive_area: number;
  soil_type: string | null;
  avg_rainfall: number | null;
  infrastructure: string[];
  suggested_crops: string[];
  price: number;
  price_per_hectare: number | null;
  productivity_score: number;
  image: string | null;
  images: string[];
  lat: number | null;
  lng: number | null;
  description: string | null;
  status: "ativo" | "pausado" | "vendido";
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  property_id: string;
  status: "novo" | "contato" | "fechado";
  message: string | null;
  created_at: string;
  // joined
  property?: Property;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatArea(value: number): string {
  return `${value.toLocaleString("pt-BR")} ha`;
}
