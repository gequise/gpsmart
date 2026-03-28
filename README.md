# Optimizador de Rutas con Groq

Una página web simple para optimizar rutas logísticas en Buenos Aires usando modelos de Groq.

## Instalación

1. Instala Node.js si no lo tienes.
2. Ejecuta `npm install` para instalar las dependencias.

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto (ya está creado como ejemplo).
2. Agrega tu API Key de Groq: `GROQ_API_KEY=tu_clave_api_aqui`
3. La URL base ya está configurada: `GROQ_BASE_URL=https://api.groq.com/openai/v1`

## Uso

1. Ejecuta `npm start` para iniciar el servidor.
2. Abre tu navegador en `http://localhost:3001`.
3. Ingresa las direcciones separadas por comas en el campo de entrada.
4. Presiona "Calcular Ruta" o Enter para obtener la ruta optimizada con enlace a Google Maps.

## Requisitos

- Una API Key válida de Groq. Obtén una en [https://console.groq.com/keys](https://console.groq.com/keys).
- Node.js instalado.

## Notas de Seguridad

La API Key se almacena en el archivo `.env` y no se expone al cliente. Asegúrate de no compartir este archivo.

## Solución de Problemas

- Si no funciona, verifica que tu API Key de Groq sea correcta y que tengas créditos en tu cuenta.
- Asegúrate de que el servidor esté corriendo.