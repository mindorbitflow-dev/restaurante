# Produccion en Render con Supabase

## 1. Preparar Supabase

1. Crea un proyecto en Supabase.
2. Abre `SQL Editor` y ejecuta completo el archivo `supabase_schema.sql`.
3. Verifica que exista al menos una fila en `business_profile`.
4. En `Authentication > Users`, crea el usuario administrador que usaras para `/admin`.

## 2. Variables de entorno en Render

Configura estas variables antes de ejecutar el build:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=https://your-render-service.onrender.com
```

Las variables `NEXT_PUBLIC_*` se incrustan durante `npm run build`. Si cambias una de ellas en Render, debes hacer un nuevo deploy/rebuild.

## 3. Servicio web en Render

Usa esta configuracion:

```bash
Build Command: npm install && npm run build
Start Command: npm run start
```

Render asigna `PORT` automaticamente y `next start` lo usa en produccion.

## 4. Validacion despues del deploy

1. Abre la URL publica de Render.
2. Entra a `/admin`.
3. Debe aparecer `Acceso seguro a base de datos Supabase`, no `Modo Demo Activo`.
4. Inicia sesion con el usuario creado en Supabase Auth.
5. Crea o edita un producto y confirma que el cambio aparece en Supabase.

## 5. Si sigue apareciendo modo demo

Revisa estos puntos:

1. Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` existen en Render antes del build.
2. `NEXT_PUBLIC_DEMO_MODE` esta en `false`.
3. Hiciste un redeploy despues de cambiar variables `NEXT_PUBLIC_*`.
4. La tabla `business_profile` existe y tiene una fila.
5. Las tablas creadas por `supabase_schema.sql` existen en el mismo proyecto de Supabase usado por Render.
