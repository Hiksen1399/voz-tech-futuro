import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight } from 'lucide-react';
const HeroBanner = () => {
  return <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
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
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold shadow-lg">
              <Mic className="w-6 h-6 mr-3" />
              Activar Asistente IA
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white text-lg px-8 py-4 rounded-full font-semibold text-blue-600">
              Explorar Productos
              <ArrowRight className="w-5 h-5 ml-2" />
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
        </div>
      </div>
    </section>;
};
export default HeroBanner;