import { useState } from "react";
import { Check, Crown, X } from "lucide-react";
import { plans } from "@/data/mockData";
import { formatCurrency } from "@/types/property";

export default function Plans() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const currentPlan = "profissional";

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <Crown className="h-7 w-7 text-accent" />
          Planos e assinatura
        </h1>
        <p className="text-muted-foreground mt-1">Escolha o plano ideal para o seu negócio</p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Plano atual</p>
            <p className="text-lg font-display font-bold text-accent mt-1">Profissional</p>
            <p className="text-sm text-muted-foreground">R$ 39,90/mês · 3 de 15 imóveis utilizados</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Próxima cobrança</p>
            <p className="text-sm font-medium text-foreground">15 de março, 2026</p>
          </div>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isHighlighted = plan.highlight;
          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-5 flex flex-col transition-all ${
                isHighlighted
                  ? "border-accent/40 bg-accent/5 ring-1 ring-accent/20"
                  : "border-border bg-card"
              }`}
            >
              {isHighlighted && (
                <span className="text-[10px] uppercase tracking-wider text-accent font-bold mb-2">
                  Mais popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-card-foreground">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-display font-bold text-foreground">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium cursor-default"
                >
                  Plano atual
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setShowUpgrade(true);
                  }}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 ${
                    isHighlighted
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  Fazer upgrade
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-card-foreground">Confirmar upgrade</h3>
              <button onClick={() => setShowUpgrade(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Você está fazendo upgrade para o plano <strong className="text-foreground">{plans.find(p => p.id === selectedPlan)?.name}</strong>.
            </p>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Novo valor mensal</p>
              <p className="text-2xl font-display font-bold text-foreground">
                {formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}/mês
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgrade(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Confirmar upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
