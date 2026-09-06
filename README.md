# ¿Greenwashed?

Verificador de greenwashing en ofertas de empleo de sostenibilidad/impacto social.
Pegas el texto de una oferta, y un análisis basado en Claude evalúa 4 dimensiones
(coherencia negocio-discurso, requisitos técnicos, seniority/autoridad del rol,
naturaleza de las funciones) para detectar si el puesto tiene sustancia real o
es principalmente decorativo.

## Correr en local

1. Instala dependencias:
   ```
   npm install
   ```

2. Copia el archivo de variables de entorno y añade tu API key de Anthropic:
   ```
   cp .env.local.example .env.local
   ```
   Edita `.env.local` y pega tu key (la consigues en console.anthropic.com → API Keys).

3. Arranca el servidor de desarrollo:
   ```
   npm run dev
   ```
   Abre http://localhost:3000

## Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub (o usa `vercel` directamente desde
   esta carpeta si tienes la CLI instalada: `npm i -g vercel`).

2. Desde la CLI:
   ```
   vercel
   ```
   o importa el repo desde el dashboard de vercel.com.

3. **Importante:** añade la variable de entorno en Vercel antes de que el primer
   deploy funcione en producción:
   ```
   vercel env add ANTHROPIC_API_KEY
   ```
   O desde el dashboard: Project → Settings → Environment Variables.

4. Vuelve a desplegar si ya habías hecho un deploy antes de añadir la variable:
   ```
   vercel --prod
   ```

## Estructura del proyecto

```
app/
  page.tsx              → interfaz: formulario + visualización del resultado
  layout.tsx            → fuentes (Source Serif 4, IBM Plex Mono) y metadata
  globals.css           → estilos base
  api/analyze/route.ts  → endpoint del servidor que llama a la API de Claude
lib/
  prompt.ts             → el system prompt de análisis (edítalo aquí, no en route.ts)
```

## Cómo iterar el criterio de análisis

Todo el criterio de detección vive en `lib/prompt.ts`, separado de la lógica de
la app. Si quieres ajustar qué cuenta como señal de greenwashing, o el peso de
cada dimensión, edita ese archivo — no hace falta tocar la API route ni la UI.

Prueba los cambios primero con casos conocidos (una oferta que consideres genuina,
una que consideres sospechosa) antes de asumir que el ajuste generaliza bien.
