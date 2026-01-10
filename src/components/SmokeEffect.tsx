export function SmokeEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Camada 1 - Fumaça lenta à esquerda */}
      <div 
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.15), transparent 70%)',
          filter: 'blur(40px)',
          animationDelay: '0s' 
        }} 
      />
      
      {/* Camada 2 - Fumaça subindo à direita */}
      <div 
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full animate-smoke-rise"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 70% 55% / 0.12), transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '2s' 
        }} 
      />
      
      {/* Camada 3 - Vapor pulsante no canto inferior */}
      <div 
        className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.1), transparent 70%)',
          filter: 'blur(45px)',
          animationDelay: '4s' 
        }} 
      />
      
      {/* Camada 4 - Fumaça central grande */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-smoke-drift"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.08), transparent 60%)',
          filter: 'blur(60px)',
          animationDelay: '1s' 
        }} 
      />

      {/* Camada 5 - Névoa no topo */}
      <div 
        className="absolute -top-10 left-1/3 w-64 h-64 rounded-full animate-vapor-pulse"
        style={{ 
          background: 'radial-gradient(ellipse, hsl(187 70% 60% / 0.1), transparent 70%)',
          filter: 'blur(35px)',
          animationDelay: '3s' 
        }} 
      />
    </div>
  );
}
