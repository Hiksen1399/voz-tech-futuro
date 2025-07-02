/* geminiLive.ts — Cliente WebSocket para Gemini Live con RAG — salida solo AUDIO */

let socket: WebSocket | null = null;
let mediaStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let processor: ScriptProcessorNode | null = null;
let screenCaptureInterval: NodeJS.Timeout | null = null;

// Callbacks para el componente
let onErrorCallback: ((msg: string) => void) | null = null;
let onStatusCallback: ((status: 'disconnected' | 'connecting' | 'connected') => void) | null = null;
let onContextCallback: ((context: string) => void) | null = null;

declare class ImageCapture {
  constructor(videoTrack: MediaStreamTrack);
  grabFrame(): Promise<ImageBitmap>;
}

/* Float32 → PCM 16-bit LE */
function convertToPCM(buf: Float32Array): ArrayBuffer {
  const out = new ArrayBuffer(buf.length * 2);
  const view = new DataView(out);
  for (let i = 0; i < buf.length; i++) {
    const s = Math.max(-1, Math.min(1, buf[i]));
    view.setInt16(i * 2, s * 0x7fff, true);
  }
  return out;
}

/* Construye un ArrayBuffer WAV a partir de PCM raw */
function pcmToWav(
  pcm: Uint8Array,
  sampleRate = 16000,
  numChannels = 1,
  bitsPerSample = 16
): ArrayBuffer {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const wavBuffer = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(wavBuffer);

  /* RIFF header */
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeString(view, 8, "WAVE");

  /* fmt subchunk */
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);            // Subchunk1Size
  view.setUint16(20, 1, true);             // AudioFormat (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  /* data subchunk */
  writeString(view, 36, "data");
  view.setUint32(40, pcm.byteLength, true);

  /* PCM data */
  new Uint8Array(wavBuffer, 44).set(pcm);

  return wavBuffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/* ───── Captura de pantalla cada 3 s ─────────────────────────────── */
async function startScreenCapture() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { width: 1280, height: 720, frameRate: 1 },
  });

  const videoTrack = stream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(videoTrack);

  const capture = async () => {
    const bmp = await imageCapture.grabFrame();
    const cv = document.createElement("canvas");
    cv.width = Math.min(bmp.width, 1280);
    cv.height = Math.min(bmp.height, 720);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bmp, 0, 0, cv.width, cv.height);
    cv.toBlob((blob) => {
      if (!blob || !socket || socket.readyState !== WebSocket.OPEN) return;
      const fr = new FileReader();
      fr.onloadend = () => {
        const b64 = (fr.result as string).split(",")[1];
        socket!.send(
          JSON.stringify({
            realtime_input: {
              media_chunks: [
                { mime_type: "image/png", data: b64 },
              ],
            },
          })
        );
      };
      fr.readAsDataURL(blob);
    }, "image/png", 0.8);
  };

  await capture(); // primera instantánea
  screenCaptureInterval = setInterval(capture, 3000);
  videoTrack.onended = () => {
    if (screenCaptureInterval) {
      clearInterval(screenCaptureInterval);
      screenCaptureInterval = null;
    }
  };
}

/* ───── Captura micrófono y envía PCM ─────────────────────────────── */
async function startAudioCapture() {
  mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 16000,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 16000,
  });

  const source = audioContext.createMediaStreamSource(mediaStream);
  processor = audioContext.createScriptProcessor(4096, 1, 1);

  processor.onaudioprocess = (ev) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const pcm = convertToPCM(ev.inputBuffer.getChannelData(0));
    const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm)));
    socket.send(
      JSON.stringify({
        realtime_input: {
          media_chunks: [
            { mime_type: "audio/pcm", data: b64 },
          ],
        },
      })
    );
  };

  source.connect(processor);
  processor.connect(audioContext.destination);
}

/* ───── API pública ──────────────────────────────────────────────── */
export async function startGeminiLive(
  onError?: (msg: string) => void,
  onStatus?: (status: 'disconnected' | 'connecting' | 'connected') => void,
  onContext?: (context: string) => void
) {
  // Guardar callbacks
  onErrorCallback = onError || null;
  onStatusCallback = onStatus || null;
  onContextCallback = onContext || null;

  // Notificar estado de conexión
  onStatusCallback?.('connecting');

  socket = new WebSocket("ws://localhost:9084");

  socket.onopen = async () => {
    console.log("🚀 WS abierto - Conectando con Gemini Live RAG");
    onStatusCallback?.('connected');
    
    socket!.send(JSON.stringify({ config: "start" }));
    try {
      await startScreenCapture();
      await startAudioCapture();
    } catch (e: any) {
      const errorMsg = "Error capturando audio/video: " + e.message;
      console.error(errorMsg);
      onErrorCallback?.(errorMsg);
      onStatusCallback?.('disconnected');
    }
  };

  socket.onmessage = async (ev) => {
    console.log("📥 Mensaje WS del servidor:", ev.data.slice(0, 100));
    try {
      const data = JSON.parse(ev.data);

      // Manejar contexto de producto
      if (data.context) {
        onContextCallback?.(data.context);
      }

      // Manejar estado de conexión
      if (data.status) {
        onStatusCallback?.(data.status);
      }

      // Reproducción ultra simple y efectiva
      if (data.audio) {
        console.log(🎵 Fragmento de audio recibido, formato: ${data.format || 'wav'}, tamaño: ${data.audio.length} chars);
        
        // Reproducción inmediata con delay fijo
        setTimeout(() => {
          try {
            console.log("🔊 Reproduciendo fragmento WAV...");
            const audioEl = new Audio(data:audio/wav;base64,${data.audio});
            audioEl.play().catch(e => console.error("Error reproduciendo WAV:", e));
          } catch (e) {
            console.error("❌ Error reproduciendo fragmento:", e);
          }
        }, 800); // Delay fijo de 800ms
      }

      // Manejar transcripciones
      if (data.transcription) {
        console.log(📝 ${data.transcription.sender}: ${data.transcription.text});
      }

      // Manejar texto del asistente
      if (data.text) {
        console.log(🤖 Asistente: ${data.text});
      }

    } catch (e) {
      console.error("WS message error:", e);
    }
  };

  socket.onerror = (e) => {
    console.error("❌ Error WS:", e);
    onErrorCallback?.("Error de conexión con el servidor de IA");
    onStatusCallback?.('disconnected');
  };
  
  socket.onclose = (e) => {
    console.warn("🔒 WS cerrado", e);
    onStatusCallback?.('disconnected');
    stopGeminiLive();
  };
}

export function stopGeminiLive() {
  if (screenCaptureInterval) clearInterval(screenCaptureInterval);
  screenCaptureInterval = null;

  if (processor) processor.disconnect();
  if (audioContext) audioContext.close();

  mediaStream?.getTracks().forEach((t) => t.stop());
  mediaStream = null;
  processor = null;
  audioContext = null;

  socket?.close();
  socket = null;

  // Limpiar callbacks
  onErrorCallback = null;
  onStatusCallback = null;
  onContextCallback = null;
}

/* ───── Compatibilidad rápida ─────────────────────────────────────── */
export function checkBrowserCompatibility(): { supported: boolean; message?: string } {
  if (!navigator.mediaDevices?.getUserMedia)
    return { supported: false, message: "Tu navegador no soporta captura de audio." };
  if (!navigator.mediaDevices?.getDisplayMedia)
    return { supported: false, message: "Tu navegador no soporta compartir pantalla." };
  if (!window.WebSocket)
    return { supported: false, message: "Tu navegador no soporta WebSockets." };
  return { supported: true };
}