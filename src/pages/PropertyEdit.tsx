import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProperty } from "@/hooks/useProperties";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const steps = ["Dados básicos", "Produção", "Infraestrutura", "Mídia", "Revisar"];

export default function PropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: property, isLoading } = useProperty(id);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", location: "", state: "", totalArea: "", productiveArea: "",
    soilType: "", avgRainfall: "", price: "", description: "",
    infrastructure: [] as string[], suggestedCrops: [] as string[],
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (property && !initialized) {
      setForm({
        name: property.name,
        location: property.location,
        state: property.state,
        totalArea: String(property.total_area),
        productiveArea: String(property.productive_area),
        soilType: property.soil_type || "",
        avgRainfall: property.avg_rainfall ? String(property.avg_rainfall) : "",
        price: String(property.price),
        description: property.description || "",
        infrastructure: property.infrastructure || [],
        suggestedCrops: property.suggested_crops || [],
      });
      setExistingImages(property.images || (property.image ? [property.image] : []));
      setInitialized(true);
    }
  }, [property, initialized]);

  const updateField = (field: string, value: any) => setForm({ ...form, [field]: value });

  const toggleArrayItem = (field: "infrastructure" | "suggestedCrops", item: string) => {
    const arr = form[field];
    updateField(field, arr.includes(item) ? arr.filter((i: string) => i !== item) : [...arr, item]);
  };

  const canNext = () => {
    if (step === 0) return form.name && form.location && form.state && form.totalArea && form.price;
    if (step === 1) return form.soilType;
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + imageFiles.length;
    const remaining = 10 - totalImages;
    const selected = files.slice(0, remaining);
    setImageFiles((prev) => [...prev, ...selected]);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Upload new images
      const newImageUrls: string[] = [];
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("property-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
        newImageUrls.push(urlData.publicUrl);
      }

      const allImages = [...existingImages, ...newImageUrls];
      const totalArea = Number(form.totalArea);
      const price = Number(form.price);

      const { error } = await supabase.from("properties").update({
        name: form.name,
        location: form.location,
        state: form.state,
        total_area: totalArea,
        productive_area: Number(form.productiveArea) || 0,
        soil_type: form.soilType || null,
        avg_rainfall: Number(form.avgRainfall) || null,
        infrastructure: form.infrastructure,
        suggested_crops: form.suggestedCrops,
        price,
        price_per_hectare: totalArea > 0 ? Math.round(price / totalArea) : null,
        image: allImages[0] || null,
        images: allImages,
        description: form.description || null,
      } as any).eq("id", id!);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      toast.success("Imóvel atualizado com sucesso!");
      navigate(`/property/${id}`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!property) {
    return <div className="text-center py-16"><p className="text-muted-foreground">Propriedade não encontrada.</p></div>;
  }

  const infraOptions = ["Irrigação", "Armazém", "Curral", "Energia elétrica", "Pivôs centrais", "Silos", "Casa sede", "Lago", "Estufa", "Galpão", "Pista de pouso"];
  const cropOptions = ["Soja", "Milho", "Algodão", "Café", "Cana-de-açúcar", "Trigo", "Frutas", "Hortaliças"];
  const soilOptions = ["Latossolo Vermelho", "Latossolo Amarelo", "Latossolo Vermelho-Amarelo", "Terra Roxa", "Argissolo", "Cambissolo"];
  const stateOptions = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  const totalImages = existingImages.length + imageFiles.length;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Editar imóvel</h1>
        <p className="text-muted-foreground mt-1">Atualize os dados do seu anúncio</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => setStep(i)} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${i < step ? "bg-success text-success-foreground" : i === step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-success" : "bg-muted"}`} />}
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
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFileSelect} />
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arraste fotos ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG ou WEBP · máx 10 fotos ({totalImages}/10)</p>
            </div>
            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {existingImages.map((src, i) => (
                  <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {imagePreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-primary/30">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeNewImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground">
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-primary/80 text-primary-foreground">Nova</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-card-foreground">Resumo das alterações</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <ReviewItem label="Nome" value={form.name} />
              <ReviewItem label="Localização" value={`${form.location}, ${form.state}`} />
              <ReviewItem label="Área total" value={`${form.totalArea} ha`} />
              <ReviewItem label="Preço" value={`R$ ${Number(form.price).toLocaleString("pt-BR")}`} />
              <ReviewItem label="Solo" value={form.soilType} />
              <ReviewItem label="Área produtiva" value={`${form.productiveArea} ha`} />
              <ReviewItem label="Chuva média" value={`${form.avgRainfall} mm/ano`} />
              <ReviewItem label="Fotos" value={`${totalImages} imagem(s)`} />
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
        <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-30 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Anterior
        </button>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2">
            Próximo <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Salvando..." : "Salvar alterações"}
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
