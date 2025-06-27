
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Aquí se integraría con el SDK de Gemini Live
    console.log(isListening ? 'Deteniendo escucha...' : 'Iniciando escucha...');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full shadow-lg ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-white`}
      >
        {isListening ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>
      
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Escuchando...</span>
          </div>
          <p className="text-xs text-gray-600">
            "¿Te gustaría comparar este producto con otros similares?"
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
