export function BackgroundSmoke() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Camada 1 - Fumaça grande no canto superior esquerdo */}
      <div 
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.12), transparent 55%)',
          filter: 'blur(90px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Fumaça média subindo à direita */}
      <div 
        className="absolute top-1/4 -right-20 w-[550px] h-[550px] rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 70% 55% / 0.1), transparent 60%)',
          filter: 'blur(80px)',
          animationDelay: '3s' 
        }} 
      />
      
      {/* Camada 3 - Névoa central grande */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.08), transparent 45%)',
          filter: 'blur(110px)',
          animationDelay: '1s' 
        }} 
      />
      
      {/* Camada 4 - Fumaça flutuante no canto inferior esquerdo */}
      <div 
        className="absolute bottom-20 -left-20 w-[500px] h-[500px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.1), transparent 60%)',
          filter: 'blur(70px)',
          animationDelay: '5s' 
        }} 
      />
      
      {/* Camada 5 - Vapor pulsante no canto inferior direito */}
      <div 
        className="absolute -bottom-20 right-1/4 w-[550px] h-[550px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 52% / 0.09), transparent 55%)',
          filter: 'blur(85px)',
          animationDelay: '7s' 
        }} 
      />

      {/* Camada 6 - Névoa sutil no topo central */}
      <div 
        className="absolute -top-10 left-1/3 w-[400px] h-[400px] rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 70% 60% / 0.08), transparent 60%)',
          filter: 'blur(65px)',
          animationDelay: '2s' 
        }} 
      />

      {/* Camada 7 - Fumaça densa no centro-esquerda */}
      <div 
        className="absolute top-2/3 left-1/4 w-[380px] h-[380px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.1), transparent 65%)',
          filter: 'blur(60px)',
          animationDelay: '4s' 
        }} 
      />

      {/* Camada 8 - Nova fumaça no topo direito */}
      <div 
        className="absolute top-10 right-1/3 w-[320px] h-[320px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(175 75% 50% / 0.08), transparent 65%)',
          filter: 'blur(55px)',
          animationDelay: '6s' 
        }} 
      />

      {/* Camada 9 - Fumaça sutil no centro-direita */}
      <div 
        className="absolute top-1/2 right-20 w-[280px] h-[280px] rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 80% 50% / 0.07), transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '8s' 
        }} 
      />

      {/* Camada 10 - Névoa flutuante no canto inferior central */}
      <div 
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.06), transparent 60%)',
          filter: 'blur(75px)',
          animationDelay: '9s' 
        }} 
      />
    </div>
  );
}
