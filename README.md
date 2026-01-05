# Punto Tecnowork

Sistema de Gestión de Impresiones con Programa de Fidelización.

## Despliegue en Vercel

1.  Sube este repositorio a GitHub.
2.  Importa el proyecto en Vercel.
3.  Vercel detectará automáticamente que es un proyecto Vite.
4.  Configura las siguientes variables de entorno en el panel de Vercel (Settings > Environment Variables):
    *   `VITE_SUPABASE_URL`: Tu URL de proyecto Supabase.
    *   `VITE_SUPABASE_ANON_KEY`: Tu llave pública (anon) de Supabase.

## Base de Datos (Supabase)

El script SQL necesario para configurar la base de datos se encuentra en este repositorio en:
`miscellaneous/db_setup.txt`

**Instrucciones:**
1. Ve a tu proyecto en Supabase.
2. Abre el **SQL Editor**.
3. Copia el contenido de `miscellaneous/db_setup.txt`.
4. Pégalo y ejecútalo.

## Configuración de URLs (Obligatorio)

Para que el Login y la Recuperación de Contraseña funcionen correctamente, debes configurar las URLs permitidas en Supabase.

1. Ve a tu proyecto en Supabase.
2. Navega a **Authentication** -> **URL Configuration**.
3. En **Site URL**, pon tu URL de producción (o `http://localhost:5173` mientras desarrollas).
4. En **Redirect URLs**, agrega manualmente las siguientes direcciones:

   *   `http://localhost:5173` (Puerto por defecto de Vite)
   *   `http://localhost:3000` (Puerto alternativo común)
   *   `http://localhost:5174` (Respaldo si el puerto 5173 está ocupado)
   *   `https://NOMBRE-DE-TU-PROYECTO.vercel.app` (Tu URL final de Vercel)

> **Nota:** Si no agregas estas URLs, los correos de recuperación de contraseña darán error o no redirigirán a tu aplicación.