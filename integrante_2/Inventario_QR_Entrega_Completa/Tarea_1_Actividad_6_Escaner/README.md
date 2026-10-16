# Tarea 1 · Actividad 6 · Servicio nativo de escáner

Archivos originales extraídos de tu ZIP, sin modificar código ni estilos.

- src/app/core/services/scanner.service.ts
- src/global.scss (archivo completo del proyecto, incluidos imports)

El servicio utiliza @capacitor/barcode-scanner y @capacitor/camera para permisos. Conserva providedIn: root y no necesita registrarse en AppModule.

IMPORTANTE: tu archivo todavía contiene stopScan(). Es un método propio que cancela la espera JavaScript, invalida resultados y limpia CSS; NO invoca ni equivale a un cierre nativo de cámara. @capacitor/barcode-scanner no expone BarcodeScanner.stopScan(). Se conserva el archivo enviado porque esta entrega organiza el proyecto sin alterar su funcionamiento. El acuerdo previo era omitir este método, por lo que esta versión enviada difiere de ese acuerdo.

La limpieza normal ocurre en finally. Si no se detecta un código, la sesión puede seguir abierta hasta que el usuario cierre la interfaz nativa. La lectura física se verificará al integrar la pantalla; la captura anterior solo comprobó la pantalla inicial.

Las dependencias exactas y su lockfile están en 00_Proyecto_Completo/ionic-ngmodules/. Los compañeros deben validar el string recibido antes de consultar su API. No se agregan pantallas, botones ni llamadas HTTP en esta organización.
