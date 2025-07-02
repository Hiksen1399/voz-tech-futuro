@echo off
echo 🚀 Instalando Gemini Live + Langchain RAG Assistant...
echo ======================================================

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python no está instalado. Por favor instala Python 3.8+
    pause
    exit /b 1
)

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 16+
    pause
    exit /b 1
)

echo ✅ Python y Node.js detectados

REM Crear directorio backend si no existe
if not exist "backend" (
    echo 📁 Creando directorio backend...
    mkdir backend
)

REM Navegar al backend e instalar dependencias
echo 📦 Instalando dependencias del backend...
cd backend

REM Crear entorno virtual si no existe
if not exist "venv" (
    echo 🐍 Creando entorno virtual...
    python -m venv venv
)

REM Activar entorno virtual
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate.bat

REM Instalar dependencias
echo 📚 Instalando dependencias de Python...
pip install -r requirements.txt

echo ✅ Backend configurado

REM Volver al directorio raíz
cd ..

REM Configurar frontend
echo 🎨 Configurando frontend...
cd frontend\voz-tech-futuro

REM Instalar dependencias del frontend
echo 📦 Instalando dependencias del frontend...
npm install

echo ✅ Frontend configurado

REM Volver al directorio raíz
cd ..\..

REM Crear archivo .env de ejemplo si no existe
if not exist "backend\.env" (
    echo 📝 Creando archivo .env de ejemplo...
    copy backend\env_example.txt backend\.env
    echo ⚠️  IMPORTANTE: Edita backend\.env con tus credenciales antes de ejecutar
)

echo.
echo 🎉 ¡Instalación completada!
echo.
echo 📋 Próximos pasos:
echo 1. Edita backend\.env con tus credenciales:
echo    - GOOGLE_API_KEY (de Google Cloud)
echo    - SUPABASE_URL y SUPABASE_KEYS (de tu proyecto Supabase)
echo.
echo 2. Ejecuta las migraciones de Supabase:
echo    cd frontend\voz-tech-futuro
echo    supabase db push
echo.
echo 3. Genera productos de ejemplo:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python generate_product_embeddings.py
echo.
echo 4. Inicia el servidor backend:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python gemini_rag_server.py
echo.
echo 5. Inicia el frontend:
echo    cd frontend\voz-tech-futuro
echo    npm run dev
echo.
echo 🌐 El asistente estará disponible en http://localhost:5173
echo.
pause 