# 🔐 Configuración de Secrets en GitHub y Vercel

Este documento guía la configuración de secrets para automatizar los despliegues y mantener seguras tus claves API.

## 1️⃣ Agregar Secrets en GitHub

### Ubicación
Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**

### Secrets Requeridos

#### Claves de APIs
- **GROQ_API_KEY**: Tu clave API de Groq
  - Obtén en: [console.groq.com/keys](https://console.groq.com/keys)
  
- **GOOGLE_MAPS_API_KEY**: Tu clave API de Google Maps (opcional pero recomendado)
  - Obtén en: [console.cloud.google.com](https://console.cloud.google.com)
  
- **GROQ_BASE_URL**: `https://api.groq.com/openai/v1`

#### Secrets de Vercel (para CI/CD automático)
- **VERCEL_TOKEN**: Token de autorización para Vercel
- **VERCEL_ORG_ID**: ID de tu organización en Vercel
- **VERCEL_PROJECT_ID**: ID de tu proyecto en Vercel

### Cómo obtener los valores

#### 1. GROQ_API_KEY
1. Ve a [console.groq.com/keys](https://console.groq.com/keys)
2. Crea una nueva API key si no tienes
3. Copia la clave completa

#### 2. GOOGLE_MAPS_API_KEY
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita la API de Maps
4. Crea una clave API
5. Restringe la clave a tus dominios

#### 3. VERCEL_TOKEN
1. Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Crea un nuevo token
3. Copia el token completo (⚠️ se muestra solo una vez)

#### 4. VERCEL_ORG_ID y VERCEL_PROJECT_ID
**Opción A - Automática (Recomendado):**
1. Instala Vercel CLI: `npm i -g vercel`
2. En tu proyecto local, ejecuta:
   ```bash
   vercel link
   ```
3. Se generará `.vercel/project.json` con ambos IDs

**Opción B - Manual:**
1. Ve a tu proyecto en [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **General**
4. Busca:
   - "Project ID": ID del proyecto
   - "Team ID": ID de la organización

## 2️⃣ Agregar Secrets en GitHub (UI)

1. En tu repositorio → **Settings** → **Secrets and variables** → **Actions**
2. Click en **New repository secret**
3. Ingresa los valores uno a uno:

```
Name: GROQ_API_KEY
Value: gsk_xxxxxxxxxxxxxxxxxxxxxxx

Name: GOOGLE_MAPS_API_KEY
Value: AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: GROQ_BASE_URL
Value: https://api.groq.com/openai/v1

Name: VERCEL_TOKEN
Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: VERCEL_ORG_ID
Value: xxxxxxxxxx

Name: VERCEL_PROJECT_ID
Value: xxxxxxxxxx
```

## 3️⃣ Agregar Secrets en Vercel (alternativa)

Si prefieres agregar los secrets directamente en Vercel (sin usar GitHub Actions):

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxx
   GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxx
   GROQ_BASE_URL=https://api.groq.com/openai/v1
   PORT=3001
   ```

## 4️⃣ Workflow de GitHub Actions

El proyecto incluye un workflow automático que:

1. Se ejecuta cuando haces `git push` a main
2. Ejecuta tests (si están configurados)
3. Hace deploy a Vercel automáticamente

### Verificar el Workflow

1. Ve a tu repositorio → **Actions**
2. Busca el workflow "Deploy to Vercel"
3. Si ves ✅, el deploy fue exitoso
4. Si ves ❌, haz click para ver los logs del error

### Ejemplo de logs

```
✓ Deployment Ready [2m21s]
✓ Created in vercel
✓ https://maps-poc.vercel.app
```

## ⚠️ Notas de Seguridad

### ✅ DO's (SÍ)
- Usar secrets de GitHub/Vercel para variables sensibles
- Mantener `.env` en `.gitignore`
- Revocar tokens si los expones accidentalmente
- Usar tokens con scopes limitados

### ❌ DON'Ts (NO)
- ❌ Hacer commit de archivos `.env`
- ❌ Compartir tokens en Issues/PRs
- ❌ Usar la misma clave en múltiples proyectos
- ❌ Commitear claves en el código

### Si accidentalmente expusiste una clave:

1. **Revoca la clave inmediatamente**
   - Groq: [console.groq.com/keys](https://console.groq.com/keys)
   - Google: [console.cloud.google.com](https://console.cloud.google.com)
   - Vercel: [vercel.com/account/tokens](https://vercel.com/account/tokens)

2. **Crea una nueva clave**

3. **Actualiza en GitHub y Vercel**

## 🧪 Probar localmente

### Sin desplegar a Vercel:
```bash
npm start
```

### Con Vercel CLI:
```bash
npm i -g vercel     # Instalar CLI
vercel dev          # Inicia dev server con variables de Vercel
```

## 🔄 Flujo de Despliegue

```
1. git push a main
   ↓
2. GitHub Actions ejecuta workflow
   ↓
3. Se usan los secrets configurados
   ↓
4. Deploy a Vercel (automático)
   ↓
5. App vive en https://tu-proyecto.vercel.app
```

## 📋 Checklist Final

Antes de hacer push:

- [ ] `.env` está en `.gitignore`
- [ ] Los secrets están en GitHub
- [ ] Los secrets están en Vercel
- [ ] `.gitignore` incluye `node_modules/`
- [ ] `config/.env.example` tiene ejemplos (sin valores reales)
- [ ] Hablis ejecutado `npm start` localmente sin errores

## 🆘 Troubleshooting

### El workflow falla con "No environment variables"
→ Verifica que los secrets están en GitHub Actions (no confundir con Vercel)

### Error 401 en GROQ_API_KEY
→ La clave expiró o es incorrecta. Crea una nueva en console.groq.com

### El deploy no llega a Vercel
→ Verifica que tienes los secrets de Vercel (ORG_ID, PROJECT_ID, TOKEN)

### Las variables no se cargan en "npm start"
→ Crea un archivo `.env` localmente (no comitear) con tus keys

## 📚 Referencias

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Secrets Management](https://vercel.com/docs/concepts/projects/environment-variables)
- [Groq API Keys](https://console.groq.com/keys)
- [Google Cloud API Keys](https://console.cloud.google.com)
