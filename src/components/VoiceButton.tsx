
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const toggleListening = () => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Por favor, inicia sesión para usar el asistente de voz.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(!isListening);
    console.log(isListening ? 'Deteniendo escucha...' : 'Iniciando escucha...');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full shadow-lg ${
          !isAuthenticated
            ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
            : isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-white`}
        disabled={!isAuthenticated}
      >
        {!isAuthenticated ? (
          <Lock className="w-8 h-8" />
        ) : isListening ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>
      
      {isListening && isAuthenticated && (
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

      {!isAuthenticated && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Función bloqueada</span>
          </div>
          <p className="text-xs text-gray-600">
            Inicia sesión para usar el asistente de voz
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
