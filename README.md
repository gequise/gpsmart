# Optimizador de Rutas con Groq

Una página web simple para optimizar rutas logísticas en Buenos Aires usando modelos de Groq.

## Instalación

1. Instala Node.js si no lo tienes.
2. Ejecuta `npm install` para instalar las dependencias.

## Configuración

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edita `.env` y agrega tus claves API:
   - `GROQ_API_KEY`: Obtén una en [https://console.groq.com/keys](https://console.groq.com/keys)
   - `GOOGLE_MAPS_API_KEY` (opcional): Para mejor optimización de rutas

## Uso Local

1. Ejecuta `npm start` para iniciar el servidor.
2. Abre tu navegador en `http://localhost:3001`.
3. Ingresa las direcciones y presiona "Calcular Ruta".

## Despliegue en Vercel

Este proyecto está optimizado para Vercel. La carpeta `api/` contiene funciones serverless que se despliegan automáticamente.

### Pasos para desplegar:

1. **Sube el proyecto a un repositorio Git** (GitHub, GitLab, Bitbucket):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conéctate a Vercel**:
   - Ve a [https://vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio
   - Vercel detectará automáticamente la estructura de Next.js/Node.js

3. **Configura las variables de entorno** en Vercel:
   - En los settings del proyecto, ve a "Environment Variables"
   - Agrega:
     - `GROQ_API_KEY`: Tu clave de API de Groq
     - `GOOGLE_MAPS_API_KEY`: Tu clave de Google Maps (opcional)
     - `GROQ_BASE_URL`: `https://api.groq.com/openai/v1`

4. **Despliega**:
   - Vercel desplegará automáticamente tu proyecto
   - Los archivos estáticos (HTML, CSS, JS) se servirán desde la raíz
   - Los endpoints de la API estarán en `/api/chat`

## Estructura del Proyecto

```
.
├── index.html           # Frontend
├── script.js            # Lógica del cliente
├── style.css            # Estilos
├── api/
│   └── chat.js         # Endpoint serverless POST /api/chat
├── server.js           # Para desarrollo local (opcional)
├── package.json        # Dependencias
├── vercel.json         # Configuración de Vercel
└── .env.example        # Template de variables de entorno
```

## Requisitos

- Una API Key válida de Groq: [https://console.groq.com/keys](https://console.groq.com/keys)
- Node.js v14+ (local) o Vercel (para producción)
- (Opcional) Google Maps API Key para mejor optimización