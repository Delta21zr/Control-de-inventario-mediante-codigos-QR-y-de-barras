# GUÍA DE PROMPTS PARA IA - INTEGRANTE 2 (FRAMEWORKS Y ANDROID)
> **Rol:** Responsable del proyecto base Ionic/Angular con NgModules, integración del plugin nativo `@capacitor/barcode-scanner`, configuración de Android y generación del APK.
> **Instrucciones de uso:** Copia y pega estos prompts en tu IA de preferencia (ChatGPT, Claude, Gemini, DeepSeek). Incluyen el contexto estricto del proyecto para evitar código incompatible (evitan Standalone Components y garantizan compatibilidad con Android 8.0+ / API 26).

---

## Tarea 1: Servicio Nativo de Escáner `scanner.service.ts` (Actividad 6)
**Objetivo:** Implementar la lectura nativa con Capacitor manejando permisos y cancelaciones sin crashear la app ni dejar la pantalla transparente.

```text
Actúa como un desarrollador experto en Ionic Angular y Capacitor. 
Estoy trabajando en una aplicación móvil (sin Standalone Components, usando NgModules estrictamente). 
Necesito que me generes el código completo para un servicio inyectable llamado `scanner.service.ts`.

Requisitos estrictos:
1. Debe usar el plugin `@capacitor/barcode-scanner`.
2. Debe tener un método para verificar/solicitar permisos de cámara (`checkPermission`).
3. Debe tener un método `startScan()` que ponga el fondo transparente (agregando la clase CSS 'scanner-active' al document.body) para mostrar la cámara nativa, e inicie el escaneo.
4. MUY IMPORTANTE: Debe manejar correctamente el escenario donde el usuario cancela el escaneo (presionando el botón atrás) o la cámara no lee nada. En esos casos, debe limpiar el fondo (remover la clase del body), detener el escáner (`BarcodeScanner.stopScan()`) y devolver un string vacío o un error controlado para que la UI no intente buscar un código nulo en la API.
5. Debe incluir un método `stopScan()` público para detener la cámara si el usuario navega fuera de la pantalla.
6. El código debe ser compatible con Angular (@Injectable({ providedIn: 'root' })).
```

---

## Tarea 2: Configuración de Android Manifest y Gradle (Actividad 5)
**Objetivo:** Ajustar el proyecto Android para compilar el APK con la SDK correcta y los permisos de cámara y red LAN.

```text
Tengo un proyecto Ionic Capacitor donde acabo de instalar `@capacitor/barcode-scanner`. 
El requerimiento oficial dice que necesito `minSdkVersion 26` y conexión HTTP a una red local LAN.
Dime exactamente:
1. ¿En qué ruta y archivo de mi carpeta `android/` debo cambiar el `minSdkVersion`? Muestra el bloque de código exacto (`android/variables.gradle`).
2. ¿Qué permisos debo verificar en el `AndroidManifest.xml`? (Cámara e Internet).
3. ¿Cómo habilito el tráfico HTTP no seguro (cleartext traffic) en `AndroidManifest.xml` para que Android permita conectarme a la IP de mi laptop (ej. http://192.168.1.X) sin que bloquee las peticiones por no ser HTTPS?
4. Dame los comandos de terminal de Capacitor (npx cap...) que debo ejecutar después de compilar Angular para asegurar que mis cambios se sincronicen antes de abrir Android Studio.
```

---

## Tarea 3: Modelos Compartidos de TypeScript (Actividad 7)
**Objetivo:** Definir las interfaces de datos que utilizarán el Frontend y el Backend para mantener la coherencia con la base de datos MySQL y el contrato de API.

```text
Actúa como Desarrollador TypeScript Senior.
Para nuestro proyecto de inventario QR, necesito generar los archivos de interfaces de TypeScript que compartirán las páginas y servicios:

1. `src/app/models/producto.model.ts`:
   - id: number;
   - codigo: string;
   - nombre: string;
   - stock: number;

2. `src/app/models/movimiento.model.ts`:
   - id?: number;
   - producto_id?: number;
   - producto?: string; // Nombre del producto para visualización en historial
   - tipo: 'entrada' | 'salida';
   - cantidad: number;
   - stock_antes?: number;
   - stock_despues?: number;
   - creado_en?: string;

3. `src/app/models/api-response.model.ts`:
   - Interfaz genérica `ApiResponse<T>` con:
     * success: boolean;
     * data?: T;
     * error?: string;

Genera los archivos con export interface limpios y tipados estrictos.
```

---

## Tarea 4: Preparación y Compilación del APK Final (Actividad 8)
**Objetivo:** Generar el archivo `.apk` instalable en teléfonos Android físicos para el Integrante 5.

```text
Dame una guía rápida en terminal de 5 pasos para compilar un proyecto Ionic Angular con Capacitor y generar el APK Debug en Android Studio:
1. Comando de build optimizado de Angular.
2. Comando para sincronizar assets y plugins en la carpeta nativa de Android.
3. Cómo abrir Android Studio desde la consola.
4. En qué menú de Android Studio se genera el APK Debug (`Build > Build Bundle(s) / APK(s) > Build APK(s)`).
5. En qué subcarpeta de `android/app/build/...` queda guardado el archivo `.apk` final para copiarlo al teléfono por cable USB o WhatsApp/Drive.
```
