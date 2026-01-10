export function SmokeOverlay() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Camada 1 - Fumaça grande no canto superior esquerdo */}
      <div 
        className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.05), transparent 55%)',
          filter: 'blur(90px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Fumaça média no topo direito */}
      <div 
        className="absolute top-1/4 -right-10 w-[500px] h-[500px] rounded-full animate-smoke-float"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.04), transparent 60%)',
          filter: 'blur(80px)',
          animationDelay: '3s' 
        }} 
      />
      
      {/* Camada 3 - Névoa central grande */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03), transparent 50%)',
          filter: 'blur(100px)',
          animationDelay: '1s' 
        }} 
      />
      
      {/* Camada 4 - Fumaça flutuante no canto inferior esquerdo */}
      <div 
        className="absolute bottom-10 -left-10 w-[450px] h-[450px] rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.05), transparent 60%)',
          filter: 'blur(70px)',
          animationDelay: '5s' 
        }} 
      />
      
      {/* Camada 5 - Vapor no canto inferior direito */}
      <div 
        className="absolute -bottom-10 right-1/4 w-[550px] h-[550px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.04), transparent 55%)',
          filter: 'blur(85px)',
          animationDelay: '7s' 
        }} 
      />

      {/* Camada 6 - Névoa sutil no centro-esquerda */}
      <div 
        className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full animate-smoke-float"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.05), transparent 65%)',
          filter: 'blur(65px)',
          animationDelay: '2s' 
        }} 
      />

      {/* Camada 7 - Fumaça no centro-direita */}
      <div 
        className="absolute top-1/2 right-10 w-[480px] h-[480px] rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.04), transparent 60%)',
          filter: 'blur(75px)',
          animationDelay: '4s' 
        }} 
      />

      {/* Camada 8 - Névoa flutuante no topo central */}
      <div 
        className="absolute -top-5 left-1/3 w-[520px] h-[520px] rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03), transparent 60%)',
          filter: 'blur(90px)',
          animationDelay: '6s' 
        }} 
      />
    </div>
  );
}
