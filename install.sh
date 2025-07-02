#!/bin/bash

echo "🚀 Instalando Gemini Live + Langchain RAG Assistant..."
echo "======================================================"

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor instala Python 3.8+"
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 16+"
    exit 1
fi

echo "✅ Python y Node.js detectados"

# Crear directorio backend si no existe
if [ ! -d "backend" ]; then
    echo "📁 Creando directorio backend..."
    mkdir backend
fi

# Navegar al backend e instalar dependencias
echo "📦 Instalando dependencias del backend..."
cd backend

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "🐍 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📚 Instalando dependencias de Python..."
pip install -r requirements.txt

echo "✅ Backend configurado"

# Volver al directorio raíz
cd ..

# Configurar frontend
echo "🎨 Configurando frontend..."
cd frontend/voz-tech-futuro

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

echo "✅ Frontend configurado"

# Volver al directorio raíz
cd ../..

# Crear archivo .env de ejemplo si no existe
if [ ! -f "backend/.env" ]; then
    echo "📝 Creando archivo .env de ejemplo..."
    cp backend/env_example.txt backend/.env
    echo "⚠️  IMPORTANTE: Edita backend/.env con tus credenciales antes de ejecutar"
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita backend/.env con tus credenciales:"
echo "   - GOOGLE_API_KEY (de Google Cloud)"
echo "   - SUPABASE_URL y SUPABASE_KEYS (de tu proyecto Supabase)"
echo ""
echo "2. Ejecuta las migraciones de Supabase:"
echo "   cd frontend/voz-tech-futuro"
echo "   supabase db push"
echo ""
echo "3. Genera productos de ejemplo:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python generate_product_embeddings.py"
echo ""
echo "4. Inicia el servidor backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python gemini_rag_server.py"
echo ""
echo "5. Inicia el frontend:"
echo "   cd frontend/voz-tech-futuro"
echo "   npm run dev"
echo ""
echo "🌐 El asistente estará disponible en http://localhost:5173"
echo "" 