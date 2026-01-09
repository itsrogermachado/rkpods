import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const AGE_VERIFIED_KEY = 'rkpods_age_verified';

export function AgeVerificationModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(AGE_VERIFIED_KEY);
    if (!verified) {
      setOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, 'true');
    setOpen(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
            <ShieldAlert className="h-8 w-8 text-primary-foreground" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Verificação de Idade
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Para acessar a <span className="font-semibold text-primary">RKPODS</span>, você precisa confirmar que tem 18 anos ou mais.
            <br />
            <br />
            Este site contém produtos destinados exclusivamente a maiores de idade.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-3 sm:flex-col">
          <AlertDialogAction asChild>
            <Button
              onClick={handleConfirm}
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 text-lg py-6"
            >
              Tenho 18 anos ou mais
            </Button>
          </AlertDialogAction>
          <Button
            variant="outline"
            onClick={handleDeny}
            className="w-full"
          >
            Sou menor de idade
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
