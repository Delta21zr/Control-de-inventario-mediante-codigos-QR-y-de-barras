# Inventario QR · Entrega completa organizada

Paquete organizado desde ionic-ngmodules(1).zip enviado por el usuario. El código fuente y las configuraciones se conservan sin cambios.

| Carpeta | Contenido |
| --- | --- |
| 00_Proyecto_Completo/ionic-ngmodules | Proyecto Ionic Angular con NgModules y proyecto nativo Android |
| Tarea_1_Actividad_6_Escaner | Servicio original de escáner y global.scss completo |
| Tarea_2_Actividad_5_Android | Manifest, Gradle y configuración Capacitor reales |
| Tarea_3_Actividad_7_Modelos | Tres interfaces originales |
| Tarea_4_Actividad_8_APK | APK Debug de salida, checksum y guía de cinco pasos |

## Cómo trabajar

Las carpetas por tarea son copias para revisión y entrega. No se ejecutan individualmente. Para continuar el desarrollo, abre 00_Proyecto_Completo/ionic-ngmodules en VS Code y ejecuta npm ci, npm run build y npx cap sync android. Luego abre Android Studio con npx cap open android.

No se copian node_modules, cachés Angular/Gradle, archivos de IDE, local.properties ni productos intermedios de compilación. Se conserva el wrapper Gradle y el código nativo; npm ci y la compilación regeneran las dependencias/assets. Configura la ruta del SDK en cada equipo antes de compilar. El APK entregable está separado en Tarea 4.

## Observaciones sobre lo recibido

- minSdkVersion 26, cámara, Internet y HTTP están configurados en los archivos reales.
- El servicio enviado conserva un stopScan propio que solo cancela la espera JavaScript: no cierra la cámara nativa. Se documenta esta diferencia respecto al acuerdo previo, sin cambiar tu archivo.
- La pantalla Inicio sigue siendo el cascarón: pantallas e integración API corresponden a los compañeros.
- El APK incluido es el de outputs/apk/debug del ZIP, sin recompilar. No se asegura correspondencia con cambios posteriores del código; la guía explica cómo regenerarlo.

INVENTARIO_ARCHIVOS.json relaciona cada archivo copiado con su origen y SHA-256. El APK también tiene su checksum junto a él.
