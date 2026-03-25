import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Droplets, Mountain, Sprout, Building, Ruler, DollarSign, MessageSquare, X, Loader2 } from "lucide-react";
import { useProperty } from "@/hooks/useProperties";
import { formatCurrency, formatArea } from "@/types/property";
import { ScoreBadge } from "@/components/ScoreBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function PropertyDetail() {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Propriedade não encontrada.</p>
        <Link to="/properties" className="text-primary hover:underline mt-2 inline-block">Voltar</Link>
      </div>
    );
  }

  const statusLabel: Record<string, string> = { ativo: "Ativo", pausado: "Pausado", vendido: "Vendido" };
  const statusColor: Record<string, string> = { ativo: "bg-success/10 text-success", pausado: "bg-accent/20 text-accent", vendido: "bg-muted text-muted-foreground" };

  const handleSendLead = async () => {
    if (!contactForm.name || !contactForm.email) {
      toast.error("Preencha nome e email");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone || null,
        property_id: property.id,
        message: contactForm.message || null,
      } as any);
      if (error) throw error;
      toast.success("Mensagem enviada com sucesso!");
      setShowContact(false);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const images = property.images?.length ? property.images : (property.image ? [property.image] : []);

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden aspect-[16/7] bg-muted">
            <img src={images[selectedImage]} alt={property.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`rounded-lg overflow-hidden w-20 h-14 border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-bold text-foreground">{property.name}</h1>
            <ScoreBadge score={property.productivity_score} size="lg" />
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[property.status]}`}>
              {statusLabel[property.status]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.location}, {property.state}
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-foreground">{formatCurrency(property.price)}</p>
          {property.price_per_hectare && <p className="text-sm text-muted-foreground">{formatCurrency(property.price_per_hectare)}/ha</p>}
        </div>
      </div>

      {property.description && <p className="text-muted-foreground leading-relaxed">{property.description}</p>}

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { icon: Ruler, label: "Área total", value: formatArea(property.total_area) },
          { icon: Sprout, label: "Área produtiva", value: formatArea(property.productive_area) },
          { icon: Mountain, label: "Tipo de solo", value: property.soil_type || "—" },
          { icon: Droplets, label: "Chuva média", value: property.avg_rainfall ? `${property.avg_rainfall} mm/ano` : "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <Icon className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold text-card-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Infrastructure & Crops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {property.infrastructure?.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-card-foreground">Infraestrutura</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {property.infrastructure.map((item) => (
                <span key={item} className="text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground">{item}</span>
              ))}
            </div>
          </div>
        )}
        {property.suggested_crops?.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-card-foreground">Culturas indicadas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {property.suggested_crops.map((crop) => (
                <span key={crop} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{crop}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map placeholder */}
      {property.lat && property.lng && (
        <div className="rounded-xl border border-border bg-muted h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Mapa da localização</p>
            <p className="text-xs">{property.lat.toFixed(2)}°, {property.lng.toFixed(2)}°</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <button onClick={() => setShowContact(true)} className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Receber contato
        </button>
        <Link to="/simulator" className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Simular lucro
        </Link>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-card-foreground">Receber contato</h3>
              <button onClick={() => setShowContact(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground">Sobre: {property.name}</p>
            <div className="space-y-3">
              <input value={contactForm.name} onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Seu nome *" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="Seu email *" type="email" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={contactForm.phone} onChange={(e) => setContactForm(f => ({ ...f, phone: e.target.value }))} placeholder="Seu telefone" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea value={contactForm.message} onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder="Sua mensagem..." rows={3} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSendLead} disabled={sending} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                {sending ? "Enviando..." : "Enviar mensagem"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
