import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";

export default function SearchPage() {
  const { data: properties = [], isLoading } = useProperties();
  const [query, setQuery] = useState("");
  const [minArea, setMinArea] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "price">("score");
  const [showFilters, setShowFilters] = useState(true);

  const allCrops = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => p.suggested_crops.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [properties]);

  const filtered = useMemo(() => {
    let result = properties.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.location.toLowerCase().includes(query.toLowerCase())) return false;
      if (p.total_area < minArea) return false;
      if (p.price > maxPrice) return false;
      if (selectedCrop && !p.suggested_crops.includes(selectedCrop)) return false;
      return true;
    });
    result.sort((a, b) =>
      sortBy === "score" ? b.productivity_score - a.productivity_score : a.price - b.price
    );
    return result;
  }, [properties, query, minArea, maxPrice, selectedCrop, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Carregando propriedades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Buscar propriedades</h1>
        <p className="text-muted-foreground">Encontre fazendas e sítios pelo potencial produtivo</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou localização..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${
            showFilters ? "bg-primary text-primary-foreground border-primary" : "border-input text-foreground hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-card animate-fade-in">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase">Cultura</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todas</option>
              {allCrops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase">Área mínima (ha)</label>
            <input
              type="number"
              value={minArea || ""}
              onChange={(e) => setMinArea(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase">Preço máximo (R$)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 100000000)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "price")}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="score">Mais rentáveis</option>
              <option value="price">Menor preço</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "propriedade encontrada" : "propriedades encontradas"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Nenhuma propriedade encontrada com esses filtros.</p>
        </div>
      )}
    </div>
  );
}
