import { useState } from 'react';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

interface CouponInputProps {
  onApply: (coupon: Coupon | null) => void;
  appliedCoupon: Coupon | null;
}

// Demo coupons - in production, validate against database
const validCoupons: Record<string, Coupon> = {
  'DESCONTO10': { code: 'DESCONTO10', discountType: 'percentage', discountValue: 10 },
  'PRIMEIRACOMPRA': { code: 'PRIMEIRACOMPRA', discountType: 'percentage', discountValue: 15 },
  'FRETE50': { code: 'FRETE50', discountType: 'fixed', discountValue: 50 },
};

export function CouponInput({ onApply, appliedCoupon }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const coupon = validCoupons[code.toUpperCase()];
    
    if (coupon) {
      onApply(coupon);
      toast.success(`Cupom "${coupon.code}" aplicado!`);
      setCode('');
    } else {
      toast.error('Cupom inválido ou expirado');
    }

    setLoading(false);
  };

  const handleRemove = () => {
    onApply(null);
    toast.info('Cupom removido');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center gap-2 text-green-600">
          <Check className="h-4 w-4" />
          <span className="font-medium">{appliedCoupon.code}</span>
          <span className="text-sm">
            ({appliedCoupon.discountType === 'percentage' 
              ? `${appliedCoupon.discountValue}% OFF` 
              : `R$ ${appliedCoupon.discountValue.toFixed(2).replace('.', ',')} OFF`})
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cupom de desconto"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="pl-9"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={!code.trim() || loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Experimente: DESCONTO10, PRIMEIRACOMPRA, FRETE50
      </p>
    </div>
  );
}
