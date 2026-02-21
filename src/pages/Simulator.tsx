import { useState, useMemo } from "react";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";
import { cropData, formatCurrency } from "@/data/mockData";

export default function Simulator() {
  const [selectedCrop, setSelectedCrop] = useState(cropData[0].name);
  const [area, setArea] = useState(500);
  const [customCostPerHa, setCustomCostPerHa] = useState<number | null>(null);

  const crop = cropData.find((c) => c.name === selectedCrop)!;
  const costPerHa = customCostPerHa ?? crop.costPerHa;

  const results = useMemo(() => {
    const totalCost = costPerHa * area;
    const totalProduction = crop.yieldPerHa * area;
    const totalRevenue = totalProduction * crop.pricePerTon;
    const profit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const payback = profit > 0 ? totalCost / profit : Infinity;
    return { totalCost, totalProduction, totalRevenue, profit, roi, payback };
  }, [selectedCrop, area, costPerHa]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <Calculator className="h-7 w-7 text-primary" />
          Simulador agrícola
        </h1>
        <p className="text-muted-foreground mt-1">Estime receita, lucro e retorno de investimento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 space-y-5">
          <h3 className="font-display text-lg font-semibold text-card-foreground">Parâmetros</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cultura</label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setCustomCostPerHa(null);
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {cropData.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Área (hectares)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Math.max(1, Number(e.target.value) || 1))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="range"
              min={10}
              max={10000}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Custo/ha (R$)</label>
            <input
              type="number"
              value={costPerHa}
              onChange={(e) => setCustomCostPerHa(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Referência: {formatCurrency(crop.costPerHa)}/ha</p>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Rendimento: {crop.yieldPerHa} ton/ha · Preço: {formatCurrency(crop.pricePerTon)}/ton
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              icon={DollarSign}
              label="Receita bruta"
              value={formatCurrency(results.totalRevenue)}
              color="text-primary"
            />
            <ResultCard
              icon={DollarSign}
              label="Custo total"
              value={formatCurrency(results.totalCost)}
              color="text-muted-foreground"
            />
            <ResultCard
              icon={TrendingUp}
              label="Lucro líquido"
              value={formatCurrency(results.profit)}
              color={results.profit >= 0 ? "text-success" : "text-destructive"}
              highlight
            />
            <ResultCard
              icon={TrendingUp}
              label="ROI"
              value={`${results.roi.toFixed(1)}%`}
              color={results.roi >= 0 ? "text-success" : "text-destructive"}
              highlight
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-card-foreground">Payback</h3>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              {results.payback === Infinity ? "—" : `${results.payback.toFixed(1)} safras`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tempo estimado para recuperar o investimento
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-3">Produção estimada</h3>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {results.totalProduction.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">toneladas por safra</p>
              </div>
              <div className="flex-1 h-16 flex items-end gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/20"
                    style={{ height: `${30 + Math.random() * 70}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ icon: Icon, label, value, color, highlight }: {
  icon: any; label: string; value: string; color: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${highlight ? "border-primary/30" : "border-border"}`}>
      <Icon className={`h-5 w-5 mb-2 ${color}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-display font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
