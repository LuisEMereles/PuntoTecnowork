# Instrucciones de Despliegue en EasyPanel

## Pre-requisitos
1. Tener una cuenta en EasyPanel o servidor con EasyPanel instalado
2. Tener el repositorio en GitHub, GitLab o Bitbucket
3. Base de datos (si aplica) configurada

## Pasos de Despliegue

### 1. Subir el Repositorio Convertido
- Descomprime el archivo ZIP descargado
- Sube los archivos a tu repositorio (GitHub, GitLab, etc.)
- Asegúrate de incluir todos los archivos generados:
  - Dockerfile
  - nixpacks.toml
  - docker-compose.yml
  - .env.example

### 2. Crear un Proyecto en EasyPanel
1. Ingresa a tu panel de EasyPanel
2. Crea un nuevo Proyecto
3. Nómbralo apropiadamente (ej: "vite_react_shadcn_ts")

### 3. Agregar un Servicio
1. Dentro del proyecto, haz clic en "Add Service"
2. Selecciona "Docker Compose" o "Nixpacks" según tu preferencia
3. Conecta tu repositorio Git
4. Selecciona la rama principal (main/master)

### 4. Configurar Variables de Entorno
En la sección de Environment Variables de EasyPanel, agrega:

```
NODE_ENV=production
```

Luego agrega las variables específicas de tu aplicación (ver .env.example):
- Si usas Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Si usas base de datos: `DATABASE_URL`
- Cualquier otra variable necesaria

### 5. Configurar Puertos
- Asegúrate de exponer el puerto 3000
- Configura el dominio o subdominio en EasyPanel

### 6. Desplegar
1. Haz clic en "Deploy"
2. EasyPanel construirá la imagen Docker usando el Dockerfile generado
3. Espera a que el build termine
4. Accede a tu aplicación en la URL configurada

## Verificación
Después del despliegue, verifica:
- [ ] La aplicación carga correctamente
- [ ] No hay errores en los logs de EasyPanel
- [ ] Las variables de entorno están configuradas
- [ ] El dominio/certificado SSL funciona
- [ ] La integración con Supabase (si aplica) funciona

## Troubleshooting

### Build falla
- Revisa los logs en EasyPanel
- Asegúrate de que package.json tiene los scripts necesarios (build, start)
- Verifica que no haya problemas de dependencias

### Variables de entorno no funcionan
- Verifica que las variables estén correctamente configuradas en EasyPanel
- Asegúrate de no cometer variables sensibles en el repositorio
- Reinicia el servicio después de actualizar variables

### Problemas de Supabase
- Verifica que las credenciales sean correctas
- Asegúrate de que las políticas RLS de Supabase permitan el acceso
- Revisa las URLs configuradas en Supabase (CORS)

## Actualizaciones Futuras
Cada vez que hagas push al repositorio, EasyPanel detectará el cambio y
reconstruirá automáticamente la aplicación.

## Soporte
Para más información sobre EasyPanel, visita: https://easypanel.io/docs
