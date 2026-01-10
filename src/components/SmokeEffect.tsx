export function SmokeEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Camada 1 - Grande à esquerda */}
      <div 
        className="absolute -top-10 -left-10 w-80 h-80 rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.20), transparent 65%)',
          filter: 'blur(35px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Subindo à direita */}
      <div 
        className="absolute top-1/4 -right-10 w-72 h-72 rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.18), transparent 60%)',
          filter: 'blur(40px)',
          animationDelay: '2s' 
        }} 
      />
      
      {/* Camada 3 - Pulsante no centro */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.15), transparent 55%)',
          filter: 'blur(45px)',
          animationDelay: '1s' 
        }} 
      />
      
      {/* Camada 4 - Partícula pequena com swirl */}
      <div 
        className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full animate-smoke-swirl"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.25), transparent 70%)',
          filter: 'blur(20px)',
          animationDelay: '3s' 
        }} 
      />

      {/* Camada 5 - Respiração no canto inferior */}
      <div 
        className="absolute bottom-10 left-1/4 w-48 h-48 rounded-full animate-smoke-breathe"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.20), transparent 65%)',
          filter: 'blur(25px)',
          animationDelay: '4s' 
        }} 
      />

      {/* Camada 6 - Flutuante no topo */}
      <div 
        className="absolute -top-5 right-1/4 w-40 h-40 rounded-full animate-smoke-float"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.22), transparent 65%)',
          filter: 'blur(28px)',
          animationDelay: '5s' 
        }} 
      />

      {/* Camada 7 - Partícula de detalhe */}
      <div 
        className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.28), transparent 70%)',
          filter: 'blur(18px)',
          animationDelay: '2.5s' 
        }} 
      />

      {/* Camada 8 - Grande atrás */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.12), transparent 60%)',
          filter: 'blur(50px)',
          animationDelay: '1.5s' 
        }} 
      />
    </div>
  );
}
