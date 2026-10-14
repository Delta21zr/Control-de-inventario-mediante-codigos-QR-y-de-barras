# GUÍA DE PROMPTS Y PROTOCOLO PARA IA - INTEGRANTE 5 (PRUEBAS E INTEGRACIÓN)
> **Rol:** Responsable del entorno de red LAN, generación de códigos físicos, ejecución del plan de pruebas P01 a P11, prueba de concurrencia/rollback y captura de evidencias multimedia para el Integrante 1.
> **Instrucciones de uso:** Copia y pega estos prompts en tu IA de preferencia (ChatGPT, Claude, Gemini, DeepSeek).

---

## Tarea 1: Generador HTML de Códigos QR y Códigos de Barras Imprimibles (Actividad 2)
**Objetivo:** Crear una página web simple y local que permita imprimir en papel los códigos QR y de barras de prueba exigidos para el reto (`PRD001`, `PRD002`, `PRD003`).

```text
Actúa como desarrollador web.
Necesito un archivo único `imprimir_codigos.html` para abrir en el navegador e imprimir en una hoja de papel bond para un reto de escaneo móvil.

Requisitos:
1. Usar librerías CDN ligeras (ej. qrcodejs y JsBarcode).
2. Generar tarjetas visuales limpias para los 3 productos de prueba:
   - Producto 1: Código 'PRD001' | Nombre: Mouse inalámbrico | Stock inicial: 10
   - Producto 2: Código 'PRD002' | Nombre: Teclado USB | Stock inicial: 5
   - Producto 3: Código 'PRD003' | Nombre: Cable HDMI | Stock inicial: 12
3. Para cada producto debe mostrar:
   - Un código QR nítido y grande con el valor exacto del string (ej. "PRD001").
   - Un código de barras en formato Code 128 con el mismo valor ("PRD001").
   - Texto en negrita debajo para identificarlo fácilmente.
4. Incluir estilos CSS para impresión (`@media print`) para que los códigos salgan bien distribuidos y legibles por la cámara de un teléfono Android.
```

---

## Tarea 2: Script de Prueba de Concurrencia y Bloqueo Pesimista (Caso P10 / Actividad 7)
**Objetivo:** Simular en la terminal dos peticiones POST simultáneas enviadas a `movimientos.php` para demostrar que el bloqueo `SELECT ... FOR UPDATE` de MySQL solo aprueba una y rechaza la otra por saldo insuficiente.

```text
Actúa como Ingeniero de QA y Pruebas de Software.
Necesito un script de PowerShell (para Windows) que envíe DOS peticiones HTTP POST SIMULTÁNEAS mediante curl o Invoke-RestMethod a mi servidor local:
URL: `http://192.168.1.X/inventarioqr/api/movimientos.php`

Escenario de prueba (Caso P10):
- El producto tiene stock disponible de 5 unidades.
- Ambas peticiones intentan registrar una 'salida' de 4 unidades cada una al mismo milisegundo:
  Payload: `{"codigo":"PRD001","tipo":"salida","cantidad":4}`
- Objetivo: Demostrar que una de las dos peticiones es aceptada (HTTP 200, dejando stock en 1) y la otra es rechazada (HTTP 400, "Stock insuficiente").

El script debe:
1. Ejecutar ambas solicitudes en paralelo (usando Start-Job o Runspaces en PowerShell).
2. Capturar el código de estado HTTP y la respuesta JSON de cada petición.
3. Imprimir claramente en consola cuál pasó y cuál fue rechazada.
```

---

## Tarea 3: Plantilla de Registro y Control de Defectos P01-P11 (Actividades 1, 5 y 6)
**Objetivo:** Llevar la bitácora de ejecución en vivo para entregársela al Integrante 1.

```text
Actúa como Líder de QA.
Genera una tabla en formato Markdown para registrar la ejecución en vivo de los 11 casos de prueba del proyecto Inventario QR:
Casos:
- P01: Escaneo QR PRD001 (Stock 10)
- P02: Entrada de 2 unidades (Stock 12)
- P03: Salida de 1 unidad (Stock 11)
- P04: Salida de 12 unidades (Rechazo HTTP 400 por sobregiro)
- P05: Escaneo de código de barras Code 128 con PRD001
- P06: Escaneo de código inexistente (PRD999 - Error 404)
- P07: Entrada de cantidades 0, negativas o decimales (Rechazo)
- P08: Cancelación de cámara / botón atrás
- P09: Caída de Apache o MySQL (Error 503)
- P10: Dos salidas simultáneas de 4 con stock 5 (Concurrencia)
- P11: Cierre forzado y reapertura de la app (Persistencia)

Columnas: Caso ID | Acción | Resultado Esperado | Resultado Obtenido | Estado (Aprobado/Fallido) | Responsable de corrección | Archivo de Evidencia (.png / .mp4).
```
