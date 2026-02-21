import { Link } from "react-router-dom";
import { MapPin, Ruler, Sprout } from "lucide-react";
import { Property, formatCurrency, formatArea } from "@/data/mockData";
import { ScoreBadge } from "./ScoreBadge";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      to={`/property/${property.id}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <ScoreBadge score={property.productivityScore} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
          <p className="font-display text-lg font-bold text-primary-foreground leading-tight">
            {formatCurrency(property.price)}
          </p>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-card-foreground">
          {property.name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {property.location}, {property.state}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" />
            {formatArea(property.totalArea)}
          </span>
          <span className="flex items-center gap-1">
            <Sprout className="h-3.5 w-3.5" />
            {property.suggestedCrops.slice(0, 2).join(", ")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(property.pricePerHectare)}/ha
        </p>
      </div>
    </Link>
  );
}
