import { Check, ShoppingCart, MapPin, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Carrinho', icon: ShoppingCart },
  { id: 2, name: 'Endereço', icon: MapPin },
  { id: 3, name: 'Pagamento', icon: CreditCard },
  { id: 4, name: 'Confirmação', icon: CheckCircle },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep > step.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === step.id
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.name}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
