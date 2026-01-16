# Instrucciones de Despliegue en EasyPanel

## Pre-requisitos
1. Tener una cuenta en EasyPanel o servidor con EasyPanel instalado
2. Tener el repositorio en GitHub, GitLab o Bitbucket
3. Base de datos (si aplica) configurada

## Pasos de Despliegue

### 1. Subir el Código al Repositorio
- Descomprime el archivo ZIP descargado
- Sube todos los archivos a tu repositorio (GitHub, GitLab, etc.)
- Asegúrate de incluir todos los archivos generados:
  - Dockerfile (MUY IMPORTANTE: debe estar en la raíz del repositorio)
  - nixpacks.toml
  - docker-compose.yml
  - .env.example
  - EASYPANEL_DEPLOY.md (este archivo)

### 2. Crear un Proyecto en EasyPanel
1. Ingresa a tu panel de EasyPanel
2. Crea un nuevo Proyecto
3. Nómbralo apropiadamente (ej: "vite_react_shadcn_ts")

### 3. Agregar Servicio y Conectar Repositorio
1. Dentro del proyecto, haz clic en "Add Service" o "Create Service"
2. Selecciona "GitHub" como fuente del código (también puedes usar GitLab o Bitbucket)
3. Conecta tu cuenta de Git
4. Selecciona el repositorio que acabas de subir
5. Selecciona la rama principal (main/master)

### 4. Configurar el Método de Build (IMPORTANTE)
1. En "Build Method", selecciona "Dockerfile"
2. EasyPanel buscará automáticamente el Dockerfile en la raíz del repositorio
3. No necesitas especificar la ruta si el Dockerfile está en la raíz

### 5. Configurar Variables de Entorno
En la sección de Environment Variables de EasyPanel, agrega:

```
NODE_ENV=production
```

Luego agrega las variables específicas de tu aplicación (ver .env.example):
- Si usas Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Si usas base de datos: `DATABASE_URL`
- Cualquier otra variable necesaria

**NOTA:** Las variables deben coincidir exactamente con las del archivo .env.example generado.

### 6. Configurar Puertos
- Para React, configura el puerto **3000** (si usas serve) o **80** (si usas Nginx)
- Este puerto depende de la configuración del Dockerfile

### 7. Configurar Dominio
- Configura el dominio o subdominio en EasyPanel
- El certificado SSL se generará automáticamente
- Asegúrate de apuntar el DNS a tu servidor EasyPanel

### 8. Desplegar
1. Haz clic en "Deploy" o "Create Service"
2. EasyPanel clonará el repositorio desde GitHub/GitLab/Bitbucket
3. EasyPanel construirá la imagen Docker usando el **Dockerfile** generado
4. Espera a que el proceso de build termine (puede tardar varios minutos)
5. Revisa los logs en el panel de EasyPanel si hay algún error
6. Accede a tu aplicación en la URL configurada

## Verificación
Después del despliegue, verifica:
- [ ] La aplicación carga correctamente en la URL configurada
- [ ] No hay errores en los logs de EasyPanel
- [ ] Las variables de entorno están configuradas correctamente
- [ ] El dominio/certificado SSL funciona
- [ ] La integración con Supabase (si aplica) funciona
- [ ] Las rutas de la aplicación funcionan correctamente

## Troubleshooting

### Build falla
- Revisa los logs en tiempo real en el panel de EasyPanel
- Asegúrate de que package.json tiene los scripts necesarios (build, start)
- Verifica que el Dockerfile esté en la raíz del repositorio
- Confirma que "Dockerfile" esté seleccionado como método de build
- Verifica que no haya problemas de dependencias o versiones de Node.js

### La aplicación no carga
- Verifica que el puerto esté correctamente configurado
- Confirma que el dominio apunta al servidor correcto
- Revisa los logs de la aplicación en EasyPanel
- Verifica que no haya firewall bloqueando el puerto

### Variables de entorno no funcionan
- Verifica que las variables estén correctamente configuradas en EasyPanel
- Asegúrate de que los nombres coincidan exactamente con .env.example
- Asegúrate de no cometer variables sensibles en el repositorio
- Reinicia el servicio después de actualizar variables

### Problemas de Supabase
- Verifica que las credenciales sean correctas
- Asegúrate de que las políticas RLS de Supabase permitan el acceso
- Revisa las URLs configuradas en Supabase (CORS)
- Confirma que las variables NEXT_PUBLIC_SUPABASE_* están configuradas

### Errores de rutas (404)
- Para Next.js: Verifica que el modo standalone esté configurado en next.config.js
- Para React: Asegúrate de que el servidor web (Nginx/serve) tenga configuración de SPA
- Revisa que las rutas estén correctamente implementadas en tu aplicación

## Actualizaciones Futuras
Cada vez que hagas push al repositorio:
1. EasyPanel detectará el cambio automáticamente
2. Volverá a construir la imagen Docker
3. Desplegará la nueva versión
4. El proceso es completamente automático si habilitas "Auto Deploy"

## Soporte
Para más información sobre EasyPanel, visita: https://easypanel.io/docs

## Recursos Adicionales
- Documentación oficial de EasyPanel: https://easypanel.io/docs
- Guía de Docker: https://docs.docker.com/get-started/
- Comunidad de EasyPanel: https://github.com/EasyPanel-io
