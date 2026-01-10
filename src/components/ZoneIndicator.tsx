import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useZone } from '@/contexts/ZoneContext';

export function ZoneIndicator() {
  const { selectedZone, openZoneModal, hasSelectedZone } = useZone();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openZoneModal}
      className="gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all"
    >
      <MapPin className="w-4 h-4 text-primary" />
      <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
        {hasSelectedZone ? selectedZone?.name : 'Selecionar zona'}
      </span>
      <ChevronDown className="w-3 h-3 text-muted-foreground" />
    </Button>
  );
}
