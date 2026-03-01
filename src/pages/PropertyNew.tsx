import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, MapPin } from "lucide-react";

const steps = ["Dados básicos", "Produção", "Infraestrutura", "Mídia", "Revisar"];

export default function PropertyNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    location: "",
    state: "",
    totalArea: "",
    productiveArea: "",
    soilType: "",
    avgRainfall: "",
    price: "",
    description: "",
    infrastructure: [] as string[],
    suggestedCrops: [] as string[],
  });

  const updateField = (field: string, value: any) => setForm({ ...form, [field]: value });

  const toggleArrayItem = (field: "infrastructure" | "suggestedCrops", item: string) => {
    const arr = form[field];
    updateField(field, arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const canNext = () => {
    if (step === 0) return form.name && form.location && form.state && form.totalArea && form.price;
    if (step === 1) return form.soilType;
    return true;
  };

  const infraOptions = ["Irrigação", "Armazém", "Curral", "Energia elétrica", "Pivôs centrais", "Silos", "Casa sede", "Lago", "Estufa", "Galpão", "Pista de pouso"];
  const cropOptions = ["Soja", "Milho", "Algodão", "Café", "Cana-de-açúcar", "Trigo", "Frutas", "Hortaliças"];
  const soilOptions = ["Latossolo Vermelho", "Latossolo Amarelo", "Latossolo Vermelho-Amarelo", "Terra Roxa", "Argissolo", "Cambissolo"];
  const stateOptions = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  const handlePublish = () => {
    navigate("/properties");
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Publicar imóvel</h1>
        <p className="text-muted-foreground mt-1">Preencha os dados para criar seu anúncio</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                i < step
                  ? "bg-success text-success-foreground"
                  : i === step
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? "bg-success" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-foreground">{steps[step]}</p>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5 animate-fade-in">
        {step === 0 && (
          <>
            <InputField label="Nome do imóvel" value={form.name} onChange={v => updateField("name", v)} placeholder="Ex: Fazenda Esperança" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Cidade" value={form.location} onChange={v => updateField("location", v)} placeholder="Ribeirão Preto" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estado</label>
                <select value={form.state} onChange={e => updateField("state", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Selecione</option>
                  {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Área total (ha)" type="number" value={form.totalArea} onChange={v => updateField("totalArea", v)} placeholder="1200" />
              <InputField label="Preço (R$)" type="number" value={form.price} onChange={v => updateField("price", v)} placeholder="18000000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <textarea value={form.description} onChange={e => updateField("description", e.target.value)} rows={3} placeholder="Descreva os diferenciais da propriedade..." className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de solo</label>
              <select value={form.soilType} onChange={e => updateField("soilType", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Selecione</option>
                {soilOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Área produtiva (ha)" type="number" value={form.productiveArea} onChange={v => updateField("productiveArea", v)} placeholder="980" />
              <InputField label="Média de chuva (mm/ano)" type="number" value={form.avgRainfall} onChange={v => updateField("avgRainfall", v)} placeholder="1420" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Culturas indicadas</label>
              <div className="flex flex-wrap gap-2">
                {cropOptions.map(c => (
                  <button key={c} onClick={() => toggleArrayItem("suggestedCrops", c)} className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${form.suggestedCrops.includes(c) ? "bg-primary/20 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Infraestrutura disponível</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {infraOptions.map(item => (
                <button key={item} onClick={() => toggleArrayItem("infrastructure", item)} className={`text-sm px-3 py-2.5 rounded-lg border text-left transition-colors ${form.infrastructure.includes(item) ? "bg-primary/20 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {form.infrastructure.includes(item) && <Check className="h-3 w-3 inline mr-1.5" />}
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arraste fotos aqui ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG ou WEBP · máx 10 fotos</p>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Adicionar vídeo (opcional)</p>
              <p className="text-xs text-muted-foreground/60 mt-1">MP4 · máx 100MB</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-card-foreground">Resumo do anúncio</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <ReviewItem label="Nome" value={form.name} />
              <ReviewItem label="Localização" value={`${form.location}, ${form.state}`} />
              <ReviewItem label="Área total" value={`${form.totalArea} ha`} />
              <ReviewItem label="Preço" value={`R$ ${Number(form.price).toLocaleString("pt-BR")}`} />
              <ReviewItem label="Solo" value={form.soilType} />
              <ReviewItem label="Área produtiva" value={`${form.productiveArea} ha`} />
              <ReviewItem label="Chuva média" value={`${form.avgRainfall} mm/ano`} />
            </div>
            {form.suggestedCrops.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Culturas</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.suggestedCrops.map(c => <span key={c} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{c}</span>)}
                </div>
              </div>
            )}
            {form.infrastructure.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Infraestrutura</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.infrastructure.map(i => <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{i}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-30 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
          >
            Próximo <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Publicar imóvel
          </button>
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}
