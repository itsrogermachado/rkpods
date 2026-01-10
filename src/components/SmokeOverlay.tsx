export function SmokeOverlay() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Camada 1 - Grande no canto superior esquerdo - Visible on mobile */}
      <div 
        className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.35), transparent 55%)',
          filter: 'blur(30px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Média no topo direito - Hidden on mobile */}
      <div 
        className="absolute top-1/4 -right-10 w-[500px] h-[500px] rounded-full animate-smoke-float hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.30), transparent 50%)',
          filter: 'blur(25px)',
          animationDelay: '3s' 
        }} 
      />
      
      {/* Camada 3 - Central grande com pulsação - Visible on mobile */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.25), transparent 45%)',
          filter: 'blur(35px)',
          animationDelay: '1s' 
        }} 
      />
      
      {/* Camada 4 - Swirl no canto inferior esquerdo - Hidden on mobile */}
      <div 
        className="absolute bottom-10 -left-10 w-[450px] h-[450px] rounded-full animate-smoke-swirl hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.38), transparent 55%)',
          filter: 'blur(22px)',
          animationDelay: '5s' 
        }} 
      />
      
      {/* Camada 5 - Respiração no canto inferior direito - Hidden on mobile */}
      <div 
        className="absolute -bottom-10 right-1/4 w-[550px] h-[550px] rounded-full animate-smoke-breathe hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.32), transparent 50%)',
          filter: 'blur(28px)',
          animationDelay: '7s' 
        }} 
      />

      {/* Camada 6 - Subindo na centro-esquerda - Hidden on mobile */}
      <div 
        className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full animate-smoke-rise hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.35), transparent 60%)',
          filter: 'blur(20px)',
          animationDelay: '2s' 
        }} 
      />

      {/* Camada 7 - Flutuando na centro-direita - Hidden on mobile */}
      <div 
        className="absolute top-1/2 right-10 w-[480px] h-[480px] rounded-full animate-smoke-float hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.28), transparent 55%)',
          filter: 'blur(25px)',
          animationDelay: '4s' 
        }} 
      />

      {/* Camada 8 - Névoa no topo central - Hidden on mobile */}
      <div 
        className="absolute -top-5 left-1/3 w-[520px] h-[520px] rounded-full animate-smoke-swirl hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.30), transparent 55%)',
          filter: 'blur(24px)',
          animationDelay: '6s' 
        }} 
      />

      {/* Camada 9 - Extra grande atrás de tudo - Hidden on mobile */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full animate-vapor-pulse hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.20), transparent 50%)',
          filter: 'blur(40px)',
          animationDelay: '0.5s' 
        }} 
      />

      {/* Camada 10 - Partícula concentrada - Hidden on mobile */}
      <div 
        className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] rounded-full animate-smoke-drift hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.40), transparent 60%)',
          filter: 'blur(18px)',
          animationDelay: '3.5s' 
        }} 
      />
    </div>
  );
}
