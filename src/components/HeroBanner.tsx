
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleVoiceAssistant = () => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Por favor, inicia sesión para usar el asistente de voz.",
        variant: "destructive",
      });
      return;
    }
    // Aquí iría la lógica del asistente de voz
    console.log('Activando asistente de voz...');
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Explora con tu voz.
            <br />
            <span className="text-yellow-300">Compra de forma inteligente.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Descubre los productos tecnológicos más innovadores con la ayuda de nuestra IA avanzada. 
            Una experiencia de compra completamente revolucionaria.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleVoiceAssistant}
              size="lg" 
              className={`text-lg px-8 py-4 rounded-full font-semibold shadow-lg ${
                isAuthenticated 
                  ? 'bg-white text-blue-600 hover:bg-gray-100' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Mic className="w-6 h-6 mr-3" />
              ) : (
                <Lock className="w-6 h-6 mr-3" />
              )}
              {isAuthenticated ? 'Activar Asistente IA' : 'Inicia Sesión para IA'}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white hover:bg-white text-lg px-8 py-4 rounded-full font-semibold text-blue-600"
              asChild
            >
              <Link to="/products">
                Explorar Productos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Productos disponibles</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Clientes satisfechos</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Soporte IA disponible</div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-8 bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-yellow-100">
                <Link to="/auth" className="underline font-semibold hover:text-white">
                  Inicia sesión
                </Link> para desbloquear todas las funcionalidades del asistente IA y realizar compras.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
