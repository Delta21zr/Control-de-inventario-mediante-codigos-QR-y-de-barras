# Tarea 4 · Actividad 8 · Preparación y compilación APK Debug

Desde la raíz del proyecto, donde está package.json, con android/ ya creada:

1. Compilar Angular optimizado:

```powershell
npx ng build --configuration production
```

2. Sincronizar assets y plugins:

```powershell
npx cap sync android
```

3. Abrir Android Studio:

```powershell
npx cap open android
```

Esperar la sincronización Gradle.

4. Seleccionar variante debug para app. Usar Build > Build Bundle(s) / APK(s) > Build APK(s). En versiones recientes puede aparecer como Build > Generate App Bundles / APKs > Generate APKs.

5. Copiar el archivo generado desde:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Entregar al Integrante 5 por USB o como documento por WhatsApp/Drive. En el teléfono autorizar instalaciones desde esa fuente si se solicita. El build web optimizado no cambia la variante nativa: se está generando un APK Debug.

## Alternativa al menú (Windows PowerShell)

Desde la raíz:

```powershell
cd android
.\gradlew.bat assembleDebug
explorer .ppuild\outputspk\debug
```

Esperar BUILD SUCCESSFUL antes de abrir la carpeta.

## Ejecución por USB

Activar opciones de desarrollador y depuración USB, conectar cable de datos y aceptar autorización. Comprobar:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-toolsdb.exe" devices
```

Debe aparecer device. Desde la raíz se puede ejecutar npx cap run android.

## Incidencias tratadas

- Network is unreachable: revisar conectividad y URL de descarga Gradle/SDK; no modificar por ello el HTTP de la API LAN.
- Instalación de SDK Platform 35: esperar descarga y compilación.
- flatDir y SDK XML: advertencias que por sí solas no equivalen a BUILD FAILED.
- Run desactivado: abrir android/, sincronizar Gradle y comprobar Android App con módulo app.

## APK incluido

APK/app-debug.apk es una copia exacta de android/app/build/outputs/apk/debug/app-debug.apk del ZIP que enviaste. Se puede entregar al Integrante 5 para instalarlo.

El archivo proviene de la salida de compilación, no de intermediates. El ZIP original también contiene un APK intermedio de diferente tamaño y fecha; no se incluye ese archivo interno de Gradle. No se recompiló ni se puede garantizar que el APK de salida incorpore todos los cambios más recientes del código fuente. Para garantizarlo, vuelve a compilar desde el proyecto completo.

Referencias:
- https://capacitorjs.com/docs/getting-started
- https://developer.android.com/build/build-for-release
