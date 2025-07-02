import asyncio
import json
import os
import uuid
import base64
import datetime
from dotenv import load_dotenv

from google import genai
from google.genai import types
import websockets.server
from websockets.server import WebSocketServerProtocol
import wave

load_dotenv()

# Configuración de Gemini
os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY', '')
MODEL = "gemini-2.0-flash-live-001"
client = genai.Client(http_options={'api_version': 'v1alpha'})


def load_previous_session_handle():
    try:
        with open('session_handle.json') as f:
            data = json.load(f)
            print("Session cargada:", data.get('previous_session_handle'))
            return data.get('previous_session_handle')
    except FileNotFoundError:
        return None


def save_previous_session_handle(handle):
    with open('session_handle.json', 'w') as f:
        json.dump({'previous_session_handle': handle}, f)


previous_session_handle = load_previous_session_handle()


class ProductContextManager:
    def __init__(self):
        self.product_context = ""

    def update_product_context(self, info):
        self.product_context = info

    def get_system_instruction(self):
        instr = (
            "Eres un asistente de ventas experto en tecnología.\n"
            "Responde en español y sé profesional.\n"
            "Contexto del producto: "
            + (self.product_context or "Ninguno")
        )
        return instr


context_manager = ProductContextManager()


async def get_product_context_from_image(image_data):
    try:
        base64.b64decode(image_data)
        return "Producto detectado"
    except:
        return "Producto en pantalla"


def pcm_to_wav(pcm_data, sample_rate=16000, num_channels=1, bits_per_sample=16):
    """Convierte datos PCM a formato WAV"""
    byte_rate = sample_rate * num_channels * (bits_per_sample // 8)
    block_align = num_channels * (bits_per_sample // 8)
    
    wav_buffer = bytearray(44 + len(pcm_data))
    
    # RIFF header
    wav_buffer[0:4] = b'RIFF'
    wav_buffer[4:8] = (36 + len(pcm_data)).to_bytes(4, 'little')
    wav_buffer[8:12] = b'WAVE'
    
    # fmt subchunk
    wav_buffer[12:16] = b'fmt '
    wav_buffer[16:20] = (16).to_bytes(4, 'little')  # Subchunk1Size
    wav_buffer[20:22] = (1).to_bytes(2, 'little')   # AudioFormat (PCM)
    wav_buffer[22:24] = (num_channels).to_bytes(2, 'little')
    wav_buffer[24:28] = (sample_rate).to_bytes(4, 'little')
    wav_buffer[28:32] = (byte_rate).to_bytes(4, 'little')
    wav_buffer[32:34] = (block_align).to_bytes(2, 'little')
    wav_buffer[34:36] = (bits_per_sample).to_bytes(2, 'little')
    
    # data subchunk
    wav_buffer[36:40] = b'data'
    wav_buffer[40:44] = (len(pcm_data)).to_bytes(4, 'little')
    
    # PCM data
    wav_buffer[44:] = pcm_data
    
    return bytes(wav_buffer)


async def gemini_session_handler(ws: WebSocketServerProtocol):
    print("Iniciando sesión Gemini")
    
    while True:  # Loop de reconexión
        try:
            # Esperar mensaje de configuración del cliente
            print("Esperando mensaje de configuración del cliente...")
            msg = await ws.recv()
            print(f"Mensaje recibido: {msg}...")
            cfg = json.loads(msg)
            print(f"Configuración recibida: {cfg}")
            
            # Enviar confirmación de configuración
            await ws.send(json.dumps({"status": "config_received"}))
            
            system_inst = context_manager.get_system_instruction()
            print("Instrucción del sistema configurada")

            config = types.LiveConnectConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Kore")
                    )
                )
            )
            print("Configuración de audio configurada")

            async with client.aio.live.connect(model=MODEL, config=config) as session:
                print("Conectado a Gemini API")
                print("Iniciando loop de envío a Gemini...")

                # Variables para control de timeout
                last_response_time = asyncio.get_event_loop().time()
                response_received = False

                async def send_to_gemini():
                    nonlocal last_response_time, response_received
                    try:
                        print("receiving from gemini")
                        async for message in ws:
                            print(f"Mensaje recibido del cliente: {message[:100]}...")
                            data = json.loads(message)
                            
                            if "realtime_input" in data:
                                chunks = data["realtime_input"].get("media_chunks", [])
                                print(f"Procesando realtime_input con {len(chunks)} chunks")
                                
                                for chunk in chunks:
                                    mime_type = chunk.get("mime_type")
                                    chunk_data = chunk.get("data")
                                    
                                    if mime_type == "image/png":
                                        print("Enviando imagen a Gemini...")
                                        await session.send(input={
                                            "mime_type": "image/png",
                                            "data": chunk_data
                                        })
                                    elif mime_type == "audio/pcm":
                                        print("Enviando audio PCM a Gemini...")
                                        # Enviar PCM directamente como funcionaba antes
                                        await session.send(input={
                                            "mime_type": "audio/pcm",
                                            "data": chunk_data
                                        })
                                        # Marcar que se envió audio y esperar respuesta
                                        response_received = False
                                        last_response_time = asyncio.get_event_loop().time()
                                    
                            elif "text" in data:
                                print("Enviando texto a Gemini...")
                                await session.send(input={
                                    "mime_type": "text/plain",
                                    "data": data["text"]
                                })
                                
                    except Exception as e:
                        print("Error enviando a Gemini:", e)
                        print("send_to_gemini closed")
                        raise  # Re-lanzar para que se reconecte

                async def receive_from_gemini():
                    nonlocal last_response_time, response_received
                    try:
                        print("Esperando respuestas de Gemini...")
                        async for response in session.receive():
                            print(f"Respuesta recibida de Gemini: {type(response)}")
                            response_received = True
                            last_response_time = asyncio.get_event_loop().time()
                            
                            content = response.server_content
                            if not content:
                                print("Contenido vacío, continuando...")
                                continue

                            print(f"Contenido del servidor: {content}")

                            if hasattr(content, 'output_transcription') and content.output_transcription:
                                print(f"Transcripción recibida: {content.output_transcription.text}")
                                await ws.send(json.dumps({
                                    "transcription": content.output_transcription.text
                                }))

                            if content.model_turn:
                                print(f"Model turn recibido con {len(content.model_turn.parts)} partes")
                                for i, part in enumerate(content.model_turn.parts):
                                    print(f"Procesando parte {i}: {type(part)}")
                                    if hasattr(part, 'text') and part.text:
                                        print(f"Texto recibido: {part.text}")
                                        await ws.send(json.dumps({"text": part.text}))
                                    elif hasattr(part, 'inline_data') and part.inline_data:
                                        print(f"Audio recibido, tamaño: {len(part.inline_data.data)} bytes")
                                        audio_bytes = part.inline_data.data
                                        fname = f"tmp_{uuid.uuid4().hex}.wav"
                                        with wave.open(fname, "wb") as wf:
                                            wf.setnchannels(1)
                                            wf.setsampwidth(2)
                                            wf.setframerate(24000)
                                            wf.writeframes(audio_bytes)
                                        with open(fname, "rb") as af:
                                            b64 = base64.b64encode(af.read()).decode()
                                        await ws.send(json.dumps({"audio": b64, "format": "wav"}))
                                        os.remove(fname)
                                        print("Audio enviado al cliente")
                                        
                            # Verificar si la sesión sigue activa
                            if hasattr(content, 'session_state') and content.session_state:
                                print(f"Estado de sesión: {content.session_state}")
                                
                    except Exception as e:
                        print("Error recibiendo de Gemini:", e)
                        print("Gemini connection closed (receive)")
                        raise  # Re-lanzar para que se reconecte

                async def timeout_checker():
                    nonlocal last_response_time, response_received
                    while True:
                        await asyncio.sleep(5)  # Verificar cada 5 segundos
                        current_time = asyncio.get_event_loop().time()
                        if not response_received and (current_time - last_response_time) > 10:
                            print("Timeout detectado - reiniciando sesión...")
                            return  # Esto causará que se reconecte

                t1 = asyncio.create_task(send_to_gemini())
                t2 = asyncio.create_task(receive_from_gemini())
                t3 = asyncio.create_task(timeout_checker())
                
                # Esperar a que cualquiera de las tareas termine
                done, pending = await asyncio.wait(
                    [t1, t2, t3], 
                    return_when=asyncio.FIRST_COMPLETED
                )
                
                # Cancelar tareas pendientes
                for task in pending:
                    task.cancel()

        except Exception as e:
            print("Error en sesión Gemini:", e)
            print("Gemini session closed.")
            print("Reconectando en 1 segundo...")
            await asyncio.sleep(1)
            continue  # Reconectar automáticamente


async def main():
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "9084"))
    server = await websockets.server.serve(gemini_session_handler, host, port)
    print(f"Running websocket server on {host}:{port}...")
    print("Gemini Live + Langchain RAG Assistant ready to help!")
    await asyncio.Future()  # Mantiene el servidor activo


if __name__ == "__main__":
    asyncio.run(main())
