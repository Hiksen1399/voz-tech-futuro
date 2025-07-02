import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Mic, MicOff, Lock, AlertTriangle, Monitor, Volume2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { startGeminiLive, stopGeminiLive, checkBrowserCompatibility } from "../integrations/geminiLive";

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  /* Verificar soporte navegador */
  const [isCompatible, setIsCompatible] = useState(true);
  useEffect(() => {
    const c = checkBrowserCompatibility();
    setIsCompatible(c.supported);
    if (!c.supported)
      toast({ title: "Navegador no compatible", description: c.message, variant: "destructive" });
  }, [toast]);

  const toggleListening = async () => {
    if (!isAuthenticated)
      return toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para usar el asistente.",
        variant: "destructive",
      });

    if (!isCompatible)
      return toast({
        title: "Navegador no compatible",
        description: "Tu navegador carece de funciones necesarias.",
        variant: "destructive",
      });

    /* Activar */
    if (!isListening) {
      setIsLoading(true);
      await startGeminiLive((e) =>
        toast({ title: "Error asistente", description: e, variant: "destructive" })
      );
      setIsListening(true);
      setIsLoading(false);
      toast({
        title: "Asistente activado",
        description: "Habla y comparte pantalla: responderá con audio.",
      });
    }
    /* Desactivar */
    else {
      stopGeminiLive();
      setIsListening(false);
      toast({ title: "Asistente detenido" });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleListening}
        disabled={!isAuthenticated || !isCompatible || isLoading}
        className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
          !isAuthenticated || !isCompatible
            ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
            : isLoading
            ? "bg-yellow-500 hover:bg-yellow-600"
            : isListening
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        } text-white`}
      >
        {!isAuthenticated ? (
          <Lock className="w-8 h-8" />
        ) : !isCompatible ? (
          <AlertTriangle className="w-8 h-8" />
        ) : isLoading ? (
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isListening ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>

      {/* Panel de estado */}
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl border p-4 w-80">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-800">Asistente activo</span>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span>Capturando pantalla cada 3 s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-green-500" />
              <span>Escuchando micrófono</span>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-purple-500" />
              <span>Respuestas por audio</span>
            </div>
          </div>
        </div>
      )}

      {/* Spinner al arrancar */}
      {isLoading && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-3 w-48">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-700">Iniciando asistente…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;