import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t bg-card overflow-hidden">
      <div className="container py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="RKPODS" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Os melhores produtos para você. Qualidade e variedade que você merece.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted text-muted-foreground hover:text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5521965206974"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted text-muted-foreground hover:text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>


          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Minha Conta</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/minha-conta" className="text-sm text-muted-foreground hover:text-primary transition-colors link-glow inline-block">
                Meus Pedidos
              </Link>
              <Link to="/favoritos" className="text-sm text-muted-foreground hover:text-primary transition-colors link-glow inline-block">
                Favoritos
              </Link>
              <Link to="/minha-conta" className="text-sm text-muted-foreground hover:text-primary transition-colors link-glow inline-block">
                Meus Endereços
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contato</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="https://wa.me/5521965206974"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                WhatsApp: (21) 96520-6974
              </a>
              <p>Atendimento: Seg à Sex, 9h às 18h</p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 RKPODS. Todos os direitos reservados.</p>
          <p className="text-center">
            ⚠️ Proibida a venda para menores de 18 anos.
          </p>
        </div>
      </div>
    </footer>
  );
}