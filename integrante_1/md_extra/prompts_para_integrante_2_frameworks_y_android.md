# GUÍA DE PROMPTS PARA IA - INTEGRANTE 2 (FRAMEWORKS Y ANDROID)

> **Instrucciones de uso:** Copia y pega estos prompts en tu IA de preferencia. Incluyen el contexto estricto del proyecto para evitar que la IA genere código incompatible (ej. Standalone Components o dependencias incorrectas).

## Tarea 1: Creación del `scanner.service.ts` (Actividad 6)
**Objetivo:** Implementar la lectura nativa con Capacitor manejando permisos y cancelaciones sin crashear la app.

**Copia y pega este prompt:**
```text
Actúa como un desarrollador experto en Ionic Angular y Capacitor. 
Estoy trabajando en una aplicación móvil (sin Standalone Components, usando NgModules estrictamente). 
Necesito que me generes el código completo para un servicio inyectable llamado `scanner.service.ts`.

Requisitos estrictos:
1. Debe usar el plugin `@capacitor/barcode-scanner`.
2. Debe tener un método para verificar/solicitar permisos de cámara (`checkPermission`).
3. Debe tener un método `startScan()` que ponga el fondo transparente (agregando una clase al body) para mostrar la cámara, e inicie el escaneo.
4. MUY IMPORTANTE: Debe manejar correctamente el escenario donde el usuario cancela el escaneo (presionando el botón atrás) o la cámara no lee nada. En esos casos, debe limpiar el fondo, detener el escáner y devolver un string vacío o un error controlado para que la UI no intente buscar un código nulo en la API.
5. El código debe ser compatible con Angular (Decorador @Injectable).
```

## Tarea 2: Configuración del Android Manifest y Gradle (Actividad 5)
**Objetivo:** Ajustar el proyecto Android para compilar el APK con la SDK correcta para el plugin.

**Copia y pega este prompt:**
```text
Tengo un proyecto Ionic Capacitor donde acabo de instalar `@capacitor/barcode-scanner`. 
El requerimiento oficial dice que necesito `minSdkVersion 26`.
Dime exactamente:
1. ¿En qué ruta y archivo de mi carpeta `android/` debo cambiar el `minSdkVersion`? Muestra el bloque de código exacto.
2. ¿Qué permiso de cámara debo verificar que exista en el `AndroidManifest.xml`?
3. Dame los comandos de terminal de Capacitor (npx cap...) que debo ejecutar antes de abrir Android Studio para asegurar que mis cambios de Angular se reflejen en el APK.
```