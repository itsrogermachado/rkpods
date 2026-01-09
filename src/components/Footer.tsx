import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-gradient">
              RKPODS
            </Link>
            <p className="text-sm text-muted-foreground">
              Os melhores pods e essências para você. Qualidade e variedade que você merece.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5521979265042"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">Produtos</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/produtos?categoria=pods" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Pods
              </Link>
              <Link to="/produtos?categoria=essencias" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Essências
              </Link>
              <Link to="/produtos?categoria=dispositivos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dispositivos
              </Link>
              <Link to="/produtos?categoria=acessorios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Acessórios
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold">Minha Conta</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/minha-conta" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Meus Pedidos
              </Link>
              <Link to="/favoritos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Favoritos
              </Link>
              <Link to="/minha-conta" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Meus Endereços
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contato</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="https://wa.me/5521979265042"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                WhatsApp: (21) 97926-5042
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
