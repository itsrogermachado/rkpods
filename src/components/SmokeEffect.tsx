export function SmokeEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Camada 1 - Grande à esquerda */}
      <div 
        className="absolute -top-10 -left-10 w-96 h-96 rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.45), transparent 60%)',
          filter: 'blur(25px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Subindo à direita */}
      <div 
        className="absolute top-1/4 -right-10 w-80 h-80 rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.40), transparent 55%)',
          filter: 'blur(22px)',
          animationDelay: '2s' 
        }} 
      />
      
      {/* Camada 3 - Pulsante no centro */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.35), transparent 50%)',
          filter: 'blur(30px)',
          animationDelay: '1s' 
        }} 
      />
      
      {/* Camada 4 - Partícula com swirl */}
      <div 
        className="absolute top-1/4 left-1/3 w-44 h-44 rounded-full animate-smoke-swirl"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.50), transparent 65%)',
          filter: 'blur(15px)',
          animationDelay: '3s' 
        }} 
      />

      {/* Camada 5 - Respiração no canto inferior */}
      <div 
        className="absolute bottom-10 left-1/4 w-56 h-56 rounded-full animate-smoke-breathe"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.42), transparent 60%)',
          filter: 'blur(18px)',
          animationDelay: '4s' 
        }} 
      />

      {/* Camada 6 - Flutuante no topo */}
      <div 
        className="absolute -top-5 right-1/4 w-52 h-52 rounded-full animate-smoke-float"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.48), transparent 60%)',
          filter: 'blur(16px)',
          animationDelay: '5s' 
        }} 
      />

      {/* Camada 7 - Partícula de detalhe nítida */}
      <div 
        className="absolute bottom-1/3 right-1/3 w-36 h-36 rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.55), transparent 65%)',
          filter: 'blur(12px)',
          animationDelay: '2.5s' 
        }} 
      />

      {/* Camada 8 - Grande atrás */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.30), transparent 55%)',
          filter: 'blur(28px)',
          animationDelay: '1.5s' 
        }} 
      />

      {/* Camada 9 - Névoa intensa */}
      <div 
        className="absolute top-2/3 right-1/4 w-64 h-64 rounded-full animate-smoke-swirl"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.45), transparent 60%)',
          filter: 'blur(20px)',
          animationDelay: '6s' 
        }} 
      />

      {/* Camada 10 - Partícula concentrada */}
      <div 
        className="absolute top-1/2 left-1/4 w-28 h-28 rounded-full animate-smoke-breathe"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.60), transparent 70%)',
          filter: 'blur(10px)',
          animationDelay: '3.5s' 
        }} 
      />
    </div>
  );
}
