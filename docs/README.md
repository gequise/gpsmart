# 🚀 GPSsmart - Optimizador de Rutas

Aplicación web para optimizar rutas logísticas inteligentemente usando modelos de IA de Groq y geocodificación con Google Maps o OpenStreetMap.

## 📋 Estructura del Proyecto

```
maps-poc/
├── client/                 # Frontend (Vue.js/HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/                 # Backend (Express.js)
│   ├── server.js           # Servidor principal
│   └── api/
│       └── chat.js         # Función serverless para Vercel
├── config/                 # Configuración
│   └── .env.example
├── docs/                   # Documentación
├── package.json
└── vercel.json            # Configuración para Vercel
```

## 🔧 Instalación Local

### Requisitos
- Node.js v16+
- npm o yarn

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone <tu-repo>
   cd maps-poc
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp config/.env.example config/.env
   ```
   Edita `config/.env` y agrega:
   - `GROQ_API_KEY`: Obtén en [console.groq.com/keys](https://console.groq.com/keys)
   - `GOOGLE_MAPS_API_KEY` (opcional): Para mejor precisión
   - `GROQ_BASE_URL`: `https://api.groq.com/openai/v1`

4. **Inicia el servidor**
   ```bash
   npm start
   ```

5. **Abre en tu navegador**
   ```
   http://localhost:3001
   ```

## 📦 Dependencias Principales

- **express**: Framework web
- **cors**: CORS middleware
- **dotenv**: Gestión de variables de entorno

## 🧩 Funcionalidades

- ✅ **Optimización de rutas**: Algoritmo de viajante de comercio (TSP)
- ✅ **Geocodificación**: Google Maps o OpenStreetMap (fallback)
- ✅ **IA asistente**: Groq Llama para análisis de rutas
- ✅ **Interfaz moderna**: UI responsive y atractiva
- ✅ **Enlaces directos**: Genera URLs de Google Maps

## 🚀 Despliegue en Vercel

### Pasos

1. **Sube tu código a GitHub**
   ```bash
   git push origin main
   ```

2. **Conecta a Vercel**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Selecciona tu repositorio
   - Vercel detecta automáticamente la estructura

3. **Configura variables de entorno**
   - En Vercel: Settings → Environment Variables
   - Agrega los mismos valores de `.env`

4. **Deploy**
   ```bash
   Vercel realiza el deploy automáticamente
   ```

## 🔐 Variables de Entorno

```env
# API de Groq
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1

# API de Google Maps (opcional, pero recomendado)
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxx

# Puerto (default: 3001)
PORT=3001
```

## 📱 Uso

1. **Ingresa el punto de destino** en el campo superior
2. **Completa al menos 2 direcciones intermedias**
3. **Presiona "Calcular Ruta Optimizada"**
4. **Recibe la ruta optimizada con enlace a Google Maps**
5. **Copia el enlace para navegación directa**

## 🔄 API Endpoints

### POST `/api/chat`

Recibe direcciones y retorna la ruta optimizada.

**Request:**
```json
{
  "messages": [{"role": "user", "content": "..."}],
  "destinationPoint": "Av. García 123",
  "directions": ["Dirección 1", "Dirección 2", ...],
  "startDirection": "auto"
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "✅ La ruta optimizada es:\n1. Dirección 1\n2. Dirección 2\n..."
    }
  }]
}
```

## 🛠️ Desarrollo

### Estructura del código

- **Frontend**: HTML/CSS/JS vanilla (sin frameworks)
- **Backend**: Express.js con funciones async
- **Optimización**: Algoritmo nearest-neighbor para TSP

### Scripts npm

```bash
npm start        # Inicia servidor en puerto 3001
npm test         # Ejecutar tests (si están configurados)
```

## 🐛 Solución de Problemas

**Error: GOOGLE_MAPS_API_KEY no configurada**
- El sistema usa OpenStreetMap como fallback automáticamente
- Aunque google maps es opcional, proporciona mejor precisión

**Error: Cannot post /api/chat**
- Asegúrate que el servidor está corriendo
- Verifica que el puerto 3001 está disponible

**Rutas incorrectas**
- Verifica que las direcciones sean válidas
- Usa formato completo: "Calle 123, Ciudad, País"

## 📊 Algoritmo de Optimización

Usa el algoritmo nearest-neighbor:
1. Geocodifica todas las direcciones
2. Calcula matriz de distancias
3. Inicia desde el punto óptimo
4. Selecciona el destino más cercano sin visitar
5. Repite hasta completar la ruta

## 📝 Licencia

MIT - Libre para usar en proyectos personales o comerciales.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push y abre un Pull Request

## 📧 Soporte

¿Problemas? Abre un issue en GitHub o contacta al equipo.
