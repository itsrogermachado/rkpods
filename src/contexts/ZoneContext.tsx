import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Zone, ZoneStock } from '@/types';

interface ZoneContextType {
  zones: Zone[];
  selectedZone: Zone | null;
  selectedZoneId: string | null;
  zoneStock: ZoneStock[];
  selectZone: (zoneId: string | null) => void;
  isZoneModalOpen: boolean;
  openZoneModal: () => void;
  closeZoneModal: () => void;
  hasSelectedZone: boolean;
  getProductStock: (productId: string) => number | null;
  isProductAvailable: (productId: string) => boolean;
  loading: boolean;
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

const ZONE_STORAGE_KEY = 'rkpods_selected_zone';

export function ZoneProvider({ children }: { children: ReactNode }) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoneStock, setZoneStock] = useState<ZoneStock[]>([]);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch zones on mount
  useEffect(() => {
    fetchZones();
  }, []);

  // Check localStorage and show modal if needed
  useEffect(() => {
    if (!hasInitialized && zones.length > 0) {
      const savedZoneId = localStorage.getItem(ZONE_STORAGE_KEY);
      
      if (savedZoneId) {
        // Verify the saved zone still exists
        const zoneExists = zones.some(z => z.id === savedZoneId);
        if (zoneExists) {
          setSelectedZoneId(savedZoneId);
        } else {
          // Zone no longer exists, show modal
          localStorage.removeItem(ZONE_STORAGE_KEY);
          setIsZoneModalOpen(true);
        }
      } else {
        // No zone saved, show modal
        setIsZoneModalOpen(true);
      }
      
      setHasInitialized(true);
    }
  }, [zones, hasInitialized]);

  // Fetch zone stock when zone changes
  useEffect(() => {
    if (selectedZoneId) {
      fetchZoneStock(selectedZoneId);
    } else {
      setZoneStock([]);
    }
  }, [selectedZoneId]);

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setZones(data as Zone[]);
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchZoneStock = async (zoneId: string) => {
    try {
      const { data, error } = await supabase
        .from('zone_stock')
        .select('*')
        .eq('zone_id', zoneId);

      if (error) throw error;
      setZoneStock(data as ZoneStock[]);
    } catch (error) {
      console.error('Error fetching zone stock:', error);
    }
  };

  const selectZone = (zoneId: string | null) => {
    setSelectedZoneId(zoneId);
    if (zoneId) {
      localStorage.setItem(ZONE_STORAGE_KEY, zoneId);
    } else {
      localStorage.removeItem(ZONE_STORAGE_KEY);
    }
    setIsZoneModalOpen(false);
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId) || null;

  const getProductStock = (productId: string): number | null => {
    if (!selectedZoneId) return null;
    const entry = zoneStock.find(zs => zs.product_id === productId);
    return entry?.stock ?? 0;
  };

  const isProductAvailable = (productId: string): boolean => {
    if (!selectedZoneId) return true; // No zone selected, show all
    const stock = getProductStock(productId);
    return stock !== null && stock > 0;
  };

  return (
    <ZoneContext.Provider
      value={{
        zones,
        selectedZone,
        selectedZoneId,
        zoneStock,
        selectZone,
        isZoneModalOpen,
        openZoneModal: () => setIsZoneModalOpen(true),
        closeZoneModal: () => setIsZoneModalOpen(false),
        hasSelectedZone: !!selectedZoneId,
        getProductStock,
        isProductAvailable,
        loading,
      }}
    >
      {children}
    </ZoneContext.Provider>
  );
}

export function useZone() {
  const context = useContext(ZoneContext);
  if (context === undefined) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
}
