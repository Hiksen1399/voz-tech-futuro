# 🎯 Gemini Live + Langchain RAG Assistant

Un asistente de IA de voz inteligente que integra **Gemini Live** con **Langchain + RAG (Retrieval-Augmented Generation)** para crear una experiencia de compra conversacional revolucionaria.

## 🌟 Características Principales

- **🎤 IA de Voz**: Conversaciones naturales en español usando Gemini Live
- **🔍 Langchain RAG**: Búsqueda inteligente de productos usando embeddings vectoriales de Gemini
- **💡 Sugerencias Contextuales**: Sugiere productos similares basándose en el contexto
- **📸 Análisis Visual**: Identificación automática de productos en pantalla
- **🗄️ Base de Datos Vectorial**: Almacenamiento eficiente con Supabase + pgvector
- **🎯 Respuestas Contextuales**: Información precisa basada en lo que ve el usuario
- **⚡ Tiempo Real**: Captura de pantalla y audio en tiempo real

## 🎬 Demo

**Usuario**: "Me interesa esta cámara. ¿Es buena para grabar en la montaña?"

**IA (Gemini Live)**: "Esta cámara tiene un excelente sensor para poca luz, ideal para grabar en exteriores. Te sugiero también la Sony ZV-E10, que ofrece mejor zoom por un precio similar y es perfecta para vlogs en exteriores."

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Supabase      │
│   React + TS    │◄──►│   Python        │◄──►│   PostgreSQL    │
│                 │    │   WebSocket     │    │   + pgvector    │
│ • VoiceButton   │    │   Gemini Live   │    │                 │
│ • Product UI    │    │   Langchain RAG │    │ • Productos     │
│ • Real-time     │    │   Image Analysis│    │ • Embeddings    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Instalación Rápida

### 1. Clonar y Instalar

```bash
git clone <tu-repositorio>
cd fail_fast
chmod +x install.sh
./install.sh
```

### 2. Configurar Credenciales

Edita `backend/.env` con tus credenciales:

```env
# Google Gemini API
GOOGLE_API_KEY=tu_api_key_de_gemini

# Supabase Configuration
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
```

### 3. Configurar Supabase

```bash
cd frontend/voz-tech-futuro
supabase db push
```

### 4. Generar Datos de Ejemplo

```bash
cd backend
source venv/bin/activate
python generate_product_embeddings.py
```

### 5. Ejecutar

**Backend:**
```bash
cd backend
source venv/bin/activate
python gemini_rag_server.py
```

**Frontend:**
```bash
cd frontend/voz-tech-futuro
npm run dev
```

## 📋 Requisitos

- **Python 3.8+** con pip
- **Node.js 16+** con npm
- **Cuenta de Google Cloud** con Gemini API habilitada
- **Cuenta de Supabase** con pgvector habilitado

## 🔧 Configuración Detallada

### Google Cloud (Gemini API)

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea un nuevo proyecto
3. Habilita la API de Gemini
4. Genera una API key
5. Copia la key a `backend/.env`

### Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/)
2. Ve a Extensions y habilita `vector`
3. Ejecuta las migraciones: `supabase db push`
4. Copia las credenciales a `backend/.env`

## 🎯 Cómo Usar

1. **Inicia sesión** en la aplicación
2. **Navega** a cualquier página de producto
3. **Haz clic** en el botón de micrófono flotante
4. **Comparte pantalla** cuando se solicite
5. **Habla** con el asistente sobre productos
6. **Recibe respuestas** por audio con contexto relevante y sugerencias

## 🔍 Flujo de Funcionamiento

1. **Activación**: Usuario hace clic en el botón de voz
2. **Captura**: Se captura pantalla cada 3 segundos
3. **Análisis**: Gemini analiza la imagen para identificar productos
4. **Búsqueda RAG**: Langchain busca productos similares usando embeddings de Gemini
5. **Sugerencias**: Se generan sugerencias de productos similares
6. **Contexto**: Se actualiza el contexto con información del producto y sugerencias
7. **Respuesta**: La IA responde con audio en español incluyendo sugerencias

## 📁 Estructura del Proyecto

```
fail_fast/
├── backend/                          # Servidor Python
│   ├── gemini_rag_server.py         # Servidor principal con Langchain RAG
│   ├── supabase_client.py           # Cliente de Supabase con Langchain
│   ├── generate_product_embeddings.py # Generador de datos con Gemini
│   ├── requirements.txt             # Dependencias Python
│   └── README.md                    # Documentación backend
├── frontend/voz-tech-futuro/        # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   └── VoiceButton.tsx      # Botón de voz mejorado
│   │   ├── integrations/
│   │   │   └── geminiLive.ts        # Cliente WebSocket
│   │   └── pages/                   # Páginas de la app
│   ├── supabase/migrations/         # Migraciones de BD
│   └── package.json                 # Dependencias Node.js
├── install.sh                       # Script de instalación
└── README.md                        # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.8+**: Lenguaje principal
- **Google Gemini Live**: IA conversacional y análisis de imágenes
- **Langchain**: Framework para RAG y gestión de embeddings
- **Google Generative AI**: Embeddings vectoriales
- **WebSockets**: Comunicación en tiempo real
- **Supabase**: Base de datos y autenticación
- **pgvector**: Almacenamiento vectorial

### Frontend
- **React 18**: Framework de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Shadcn/ui**: Componentes
- **Vite**: Build tool
- **WebSocket API**: Comunicación con backend

## 🐛 Solución de Problemas

### Error de Conexión WebSocket
```bash
# Verificar que el servidor esté ejecutándose
curl http://localhost:9084
```

### Error de Embeddings
```bash
# Verificar pgvector en Supabase
supabase db reset
supabase db push
```

### Error de Gemini
```bash
# Verificar API key
echo $GOOGLE_API_KEY
```

## 📈 Próximas Mejoras

- [ ] Soporte para múltiples idiomas
- [ ] Análisis de sentimientos del usuario
- [ ] Recomendaciones personalizadas
- [ ] Integración con carrito de compras
- [ ] Historial de conversaciones
- [ ] Métricas de uso y análisis
- [ ] Mejoras en las sugerencias de productos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Google** por Gemini Live y Generative AI
- **Langchain** por el framework de RAG
- **Supabase** por la infraestructura de base de datos
- **Lovable** por el frontend inicial

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo. 