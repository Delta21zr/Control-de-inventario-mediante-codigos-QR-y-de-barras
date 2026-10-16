# Tarea 2 · Actividad 5 · Android, Gradle y LAN

Esta carpeta contiene los archivos REALES completos de tu proyecto, no los fragmentos del paquete anterior. Se copiaron sin cambios. Para abrir o compilar usa el proyecto completo de 00_Proyecto_Completo, no esta selección aislada.

Verificado en los archivos:
- android/variables.gradle: minSdkVersion 26; compileSdkVersion y targetSdkVersion 35.
- android/app/src/main/AndroidManifest.xml: permisos CAMERA e INTERNET, y usesCleartextTraffic=true en application. Conserva MainActivity y FileProvider.
- capacitor.config.ts: webDir www.

Desde la raíz del proyecto completo:

```powershell
npm ci
npx ng build --configuration production
npx cap sync android
npx cap open android
```

No ejecutes cap add android: la carpeta nativa ya está incluida. El SDK local y sus licencias se configuran en cada equipo; no se distribuye local.properties, porque apunta a la laptop original. Android Studio debe reconocer/configurar el SDK antes de compilar.

Para LAN, el compañero de la API establece la IP y puerto en su servicio de datos. HTTP permitido no resuelve por sí solo firewall, conectividad o CORS. El servicio del escáner no necesita apiUrl.
