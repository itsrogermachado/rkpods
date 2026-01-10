import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t bg-card/80 backdrop-blur-xl overflow-hidden">
      {/* Fumaça decorativa subindo do footer */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full animate-smoke-rise opacity-20"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.15), transparent 70%)',
            filter: 'blur(50px)',
          }} 
        />
        <div 
          className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full animate-vapor-pulse opacity-15"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.12), transparent 70%)',
            filter: 'blur(60px)',
            animationDelay: '2s'
          }} 
        />
        <div 
          className="absolute bottom-10 left-1/2 w-48 h-48 rounded-full animate-smoke-drift opacity-15"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(187 70% 55% / 0.1), transparent 70%)',
            filter: 'blur(40px)',
            animationDelay: '4s'
          }} 
        />
      </div>
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
                href="https://wa.me/5521979265042"
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