# 📁 Estructura del Proyecto - GPSsmart

Este documento describe la nueva estructura organizada del proyecto. 

## 🏗️ Árbol de Directorios

```
maps-poc/
├── client/                    # 🎨 Frontend - Interfaz de usuario
│   ├── index.html            # Página principal
│   ├── style.css             # Estilos CSS
│   └── script.js             # Lógica del cliente
│
├── server/                    # 🔧 Backend - API y lógica
│   ├── server.js             # Servidor Express principal
│   └── api/
│       └── chat.js           # Función serverless para Vercel
│
├── config/                    # ⚙️ Configuración
│   └── .env.example          # Plantilla de variables de entorno
│
├── docs/                      # 📚 Documentación
│   ├── README.md             # Guía de uso
│   └── GITHUB_SECRETS_SETUP.md  # Configuración de secrets
│
├── package.json              # 📦 Dependencias de Node.js
├── vercel.json               # ☁️ Configuración para Vercel
└── .gitignore                # Git ignorar archivos
```

## 📋 Descripción de Carpetas

### `client/` - Frontend
Contiene toda la interfaz de usuario y lógica del navegador.

- **index.html**: Estructura HTML con layout de dos paneles
- **style.css**: Estilos modernos con gradientes y animaciones
- **script.js**: Lógica de eventos y comunicación con servidor

### `server/` - Backend
API y lógica del servidor.

- **server.js**: Servidor Express que sirve archivos estáticos y maneja rutas API
- **api/chat.js**: Función serverless compatible con Vercel

### `config/` - Configuración
Variables de entorno y configuración.

- **.env.example**: Plantilla con todas las variables necesarias
- **.env** (no comitear): Archivo local con tus claves (gitignored)

### `docs/` - Documentación
Guías y referencias.

- **README.md**: Documentación completa de uso
- **GITHUB_SECRETS_SETUP.md**: Guía para configurar secrets en GitHub y Vercel

## 🚀 Flujo de Desarrollo Local

```
1. npm install
   ↓
2. cp config/.env.example .env
   (Editar .env con tus claves)
   ↓
3. npm start
   ↓
4. http://localhost:3001
```

## 📦 Estructura de Archivos Servidos

Cuando ejecutas `npm start`:

```
Client (navegador)
    ↓
http://localhost:3001
    ↓
Server (server.js)
    ├── Sirve: client/index.html
    ├── Sirve: client/style.css
    ├── Sirve: client/script.js
    │
    └── API: /api/chat
        ├── Recibe: direcciones y destino
        └── Retorna: ruta optimizada
```

## 🔄 Comunicación Entre Capas

```
┌─────────────────┐
│   NAVEGADOR     │
│  (index.html)   │
│  (style.css)    │  ← Servidos como archivos estáticos
│  (script.js)    │
└────────┬────────┘
         │
         │ fetch('/api/chat', {...})
         ↓
┌─────────────────────────┐
│   SERVIDOR EXPRESS      │
│  (server.js)            │
│  - Geocodificación      │
│  - Optimización TSP     │
│  - Llamadas a Groq      │
└────────┬────────────────┘
         │
         ↓
    Respuesta JSON
```

## 📝 Ventajas de Esta Estructura

✅ **Separación de responsabilidades**: Frontend y backend claramente separados
✅ **Escalabilidad**: Fácil agregar más endpoints o funciones
✅ **Mantenibilidad**: Código organizado en carpetas lógicas
✅ **Documentación**: Cada carpeta tiene su propósito definido
✅ **Despliegue**: Funciona tanto en desarrollo como en Vercel
✅ **Git limpio**: Solo archivos necesarios (node_modules y .env ignorados)

## 🔧 Modificar la Estructura

### Agregar un nuevo archivo HTML/CSS/JS
```
client/
├── index.html          (existente)
├── style.css          (existente)
├── script.js          (existente)
└── utils.js           (nuevo - agregarlo aquí)
```

### Agregar un nuevo endpoint API
```
server/
├── server.js          (existente)
└── api/
    ├── chat.js        (existente)
    └── routes.js      (nuevo - agregar verbs los routes aquí)
```

### Agregar utilidades compartidas
```
Crear carpeta utils/ con funciones reutilizables:
- utils/geocoding.js
- utils/optimization.js
```

## 🔐 Seguridad

✅ `.env` está en `.gitignore` - No se comiete
✅ `node_modules/` está en `.gitignore` - No se comiete
✅ Claves API en variables de entorno, no en código
✅ CORS configurado en servidor
✅ Validaciones en inputs

## 📖 Próximos Pasos

1. Para desarrollo local: Ver [README.md](docs/README.md)
2. Para desplegar: Ver [GITHUB_SECRETS_SETUP.md](docs/GITHUB_SECRETS_SETUP.md)
3. Para entender las APIs: Ver comentarios en `server/server.js`

---

**Última actualización**: Abril 2026
**Estructura**: Frontend + Backend + Config
