import { MapPin, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useZone } from '@/contexts/ZoneContext';

export function ZoneSelectionModal() {
  const { zones, selectedZoneId, selectZone, isZoneModalOpen, closeZoneModal, loading } = useZone();

  if (loading) return null;

  return (
    <Dialog open={isZoneModalOpen} onOpenChange={(open) => !open && closeZoneModal()}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Fumaça decorativa */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full animate-smoke-drift opacity-30"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.2), transparent 70%)',
              filter: 'blur(40px)',
            }} 
          />
          <div 
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full animate-vapor-pulse opacity-25"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.15), transparent 70%)',
              filter: 'blur(50px)',
            }} 
          />
        </div>

        <DialogHeader className="relative z-10">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Selecione sua <span className="text-primary">Zona</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Escolha sua região para ver os produtos disponíveis com entrega para você
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 grid gap-3 py-4">
          {zones.map((zone) => (
            <Button
              key={zone.id}
              variant={selectedZoneId === zone.id ? 'default' : 'outline'}
              className={`w-full justify-between h-auto py-4 px-5 text-left transition-all duration-300 ${
                selectedZoneId === zone.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : 'hover:border-primary/50 hover:bg-primary/5'
              }`}
              onClick={() => selectZone(zone.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedZoneId === zone.id 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-primary/10'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    selectedZoneId === zone.id ? 'text-primary-foreground' : 'text-primary'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold text-base">{zone.name}</p>
                  <p className={`text-sm ${
                    selectedZoneId === zone.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    Entrega disponível
                  </p>
                </div>
              </div>
              {selectedZoneId === zone.id && (
                <Check className="w-5 h-5 text-primary-foreground" />
              )}
            </Button>
          ))}
        </div>

        {zones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma zona de entrega disponível no momento.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
