export function SmokeOverlay() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Camada 1 - Grande no canto superior esquerdo */}
      <div 
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.12), transparent 60%)',
          filter: 'blur(50px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Média no topo direito */}
      <div 
        className="absolute top-1/4 -right-10 w-[400px] h-[400px] rounded-full animate-smoke-float"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.10), transparent 55%)',
          filter: 'blur(45px)',
          animationDelay: '3s' 
        }} 
      />
      
      {/* Camada 3 - Central grande com pulsação */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.08), transparent 50%)',
          filter: 'blur(55px)',
          animationDelay: '1s' 
        }} 
      />
      
      {/* Camada 4 - Swirl no canto inferior esquerdo */}
      <div 
        className="absolute bottom-10 -left-10 w-[350px] h-[350px] rounded-full animate-smoke-swirl"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.14), transparent 60%)',
          filter: 'blur(40px)',
          animationDelay: '5s' 
        }} 
      />
      
      {/* Camada 5 - Respiração no canto inferior direito */}
      <div 
        className="absolute -bottom-10 right-1/4 w-[450px] h-[450px] rounded-full animate-smoke-breathe"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.10), transparent 55%)',
          filter: 'blur(50px)',
          animationDelay: '7s' 
        }} 
      />

      {/* Camada 6 - Subindo na centro-esquerda */}
      <div 
        className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.12), transparent 65%)',
          filter: 'blur(35px)',
          animationDelay: '2s' 
        }} 
      />

      {/* Camada 7 - Flutuando na centro-direita */}
      <div 
        className="absolute top-1/2 right-10 w-[380px] h-[380px] rounded-full animate-smoke-float"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.10), transparent 60%)',
          filter: 'blur(42px)',
          animationDelay: '4s' 
        }} 
      />

      {/* Camada 8 - Névoa no topo central */}
      <div 
        className="absolute -top-5 left-1/3 w-[420px] h-[420px] rounded-full animate-smoke-swirl"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.09), transparent 60%)',
          filter: 'blur(48px)',
          animationDelay: '6s' 
        }} 
      />
    </div>
  );
}
