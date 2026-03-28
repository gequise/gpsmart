# 🔐 Configuración de Secrets en GitHub

Este documento guía la configuración de secrets tanto en GitHub como en Vercel para automatizar los despliegues.

## 1️⃣ Agregar Secrets en GitHub

Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions** y agrega estos secrets:

### Secrets de las APIs
- `GROQ_API_KEY`: Tu clave API de Groq
- `GOOGLE_MAPS_API_KEY`: Tu clave API de Google Maps  
- `GROQ_BASE_URL`: `https://api.groq.com/openai/v1`

### Secrets de Vercel (para CI/CD)
- `VERCEL_TOKEN`: Tu token de Vercel
- `VERCEL_ORG_ID`: ID de tu organización en Vercel
- `VERCEL_PROJECT_ID`: ID de tu proyecto en Vercel

## 2️⃣ Obtener los secrets de Vercel

### VERCEL_TOKEN
1. Ve a [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Crea un nuevo token
3. Copia el token completo

### VERCEL_ORG_ID y VERCEL_PROJECT_ID
Opción A - Automática (recomendado):
```bash
vercel link
```
Esto genera `.vercel/project.json` con ambos IDs.

Opción B - Manual:
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a **Settings** → **General**
3. Busca "Project ID" y "Team ID"

## 3️⃣ Verificar el Workflow

Una vez agregados todos los secrets:

1. Haz un `git push` a cualquier rama (main o master)
2. Ve a tu repositorio → **Actions**
3. El workflow "Deploy to Vercel" debería ejecutarse automáticamente
4. Si ocurren errores, revisa los logs del workflow

## ⚠️ Notas de Seguridad

- **Nunca commits las claves** en el código
- El `.env` ya está en `.gitignore` (no se subirá)
- Los secrets están encriptados en GitHub
- Solo se desencriptan cuando se ejecuta el workflow
- Revoca claves si las expones accidentalmente

## 🧪 Probar localmente

Para probar localmente sin Vercel:
```bash
npm start
```

O con Vercel CLI:
```bash
vercel dev
```
