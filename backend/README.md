# Backend Gemini Live + Langchain RAG

Este backend implementa un servidor WebSocket que integra **Gemini Live** con **Langchain + RAG (Retrieval-Augmented Generation)** para crear una IA de voz inteligente que puede interactuar con clientes basándose en lo que ven en pantalla y lo que dicen por audio.

## 🚀 Características

- **IA de voz**: Integración con Gemini Live para conversaciones por voz
- **Langchain RAG**: Búsqueda inteligente de productos usando embeddings vectoriales de Gemini
- **Sugerencias contextuales**: Sugiere productos similares basándose en el contexto
- **Análisis de imagen**: Identificación automática de productos en pantalla
- **Base de datos vectorial**: Almacenamiento de embeddings en Supabase con pgvector
- **Respuestas en español**: IA configurada para responder en español
- **Contexto dinámico**: Actualización automática del contexto según lo que ve el usuario

## 📋 Requisitos

- Python 3.8+
- Cuenta de Google Cloud con API de Gemini habilitada
- Cuenta de Supabase con pgvector habilitado

## 🛠️ Instalación

1. **Clonar y navegar al directorio:**
```bash
cd backend
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**
```bash
cp env_example.txt .env
```

Editar `.env` con tus credenciales:
```env
# Google Gemini API
GOOGLE_API_KEY=tu_api_key_de_gemini

# Supabase Configuration
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase

# Server Configuration
HOST=0.0.0.0
PORT=9084
```

## 🗄️ Configuración de Supabase

1. **Habilitar pgvector en tu proyecto de Supabase:**
   - Ve a tu dashboard de Supabase
   - Navega a Extensions
   - Habilita la extensión `vector`

2. **Ejecutar las migraciones:**
```bash
supabase db push
```

3. **Generar productos de ejemplo y embeddings:**
```bash
python generate_product_embeddings.py
```

## 🚀 Ejecutar el servidor

```bash
python gemini_rag_server.py
```

El servidor estará disponible en `ws://localhost:9084`

## 🔧 Configuración del Frontend

El frontend ya está configurado para conectarse al backend. Solo asegúrate de que:

1. El servidor esté ejecutándose en el puerto 9084
2. Las variables de entorno estén correctamente configuradas
3. Los embeddings se hayan generado

## 📊 Flujo de funcionamiento

1. **Usuario activa la IA**: Hace clic en el botón de voz en el frontend
2. **Captura de pantalla**: Se captura la pantalla cada 3 segundos
3. **Análisis de imagen**: Gemini analiza la imagen para identificar productos
4. **Búsqueda RAG**: Langchain busca productos similares usando embeddings de Gemini
5. **Sugerencias**: Se generan sugerencias de productos similares
6. **Contexto dinámico**: Se actualiza el contexto con información del producto y sugerencias
7. **Respuesta por voz**: La IA responde con audio en español incluyendo sugerencias

## 🎯 Ejemplo de uso

**Usuario**: "Me interesa esta cámara. ¿Es buena para grabar en la montaña?"

**IA (Gemini Live)**: "Esta cámara tiene un excelente sensor para poca luz, ideal para grabar en exteriores. Te sugiero también la Sony ZV-E10, que ofrece mejor zoom por un precio similar y es perfecta para vlogs en exteriores."

## 🔍 Estructura del proyecto

```
backend/
├── gemini_rag_server.py      # Servidor principal con Langchain RAG
├── supabase_client.py        # Cliente de Supabase con Langchain
├── generate_product_embeddings.py  # Script para generar productos con Gemini
├── requirements.txt          # Dependencias de Python
├── env_example.txt          # Variables de entorno de ejemplo
└── README.md               # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Google Gemini Live**: IA conversacional y análisis de imágenes
- **Langchain**: Framework para RAG y gestión de embeddings
- **Google Generative AI**: Embeddings vectoriales
- **Supabase**: Base de datos PostgreSQL con pgvector
- **WebSockets**: Comunicación en tiempo real
- **Python**: Lenguaje principal

## 🐛 Solución de problemas

### Error de conexión WebSocket
- Verifica que el servidor esté ejecutándose en el puerto correcto
- Revisa los logs del servidor para errores

### Error de embeddings
- Verifica que pgvector esté habilitado en Supabase
- Asegúrate de que las migraciones se hayan ejecutado
- Revisa que la API key de Gemini sea válida

### Error de Gemini
- Verifica que la API key de Google sea válida
- Asegúrate de que Gemini Live esté habilitado en tu cuenta

## 📝 Notas importantes

- El servidor mantiene sesiones persistentes para mejor experiencia
- Los embeddings se generan automáticamente al iniciar el servidor usando Gemini
- La IA está configurada para responder solo en español
- El contexto se actualiza dinámicamente según lo que ve el usuario
- Las sugerencias de productos se generan usando Langchain RAG

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request 