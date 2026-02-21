import { Sparkles, Star } from "lucide-react";
import { properties, formatCurrency, formatArea } from "@/data/mockData";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Link } from "react-router-dom";

export default function Matching() {
  const sorted = [...properties].sort((a, b) => b.productivityScore - a.productivityScore);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-accent" />
          Recomendações para você
        </h1>
        <p className="text-muted-foreground mt-1">Propriedades ranqueadas por compatibilidade com seu perfil</p>
      </div>

      <div className="space-y-4">
        {sorted.map((property, index) => (
          <Link
            key={property.id}
            to={`/property/${property.id}`}
            className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all animate-fade-in group"
          >
            <div className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0">
              <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              {index < 3 && (
                <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Star className="h-3 w-3 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-semibold text-card-foreground">{property.name}</h3>
                  <p className="text-sm text-muted-foreground">{property.location}, {property.state} · {formatArea(property.totalArea)}</p>
                </div>
                <ScoreBadge score={property.productivityScore} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-card-foreground">{formatCurrency(property.price)}</span>
                <div className="flex gap-1.5">
                  {property.suggestedCrops.slice(0, 3).map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
