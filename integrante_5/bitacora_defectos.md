# Bitácora de Ejecución de Pruebas - Inventario QR

| Caso ID | Acción | Resultado Esperado | Resultado Obtenido | Estado (Aprobado/Fallido) | Responsable de corrección | Archivo de Evidencia (.png / .mp4) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P01** | Escaneo QR PRD001 (Stock inicial: 10) | La aplicación decodifica el QR correctamente y muestra en pantalla los detalles del producto con stock igual a 10. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P02** | Registrar entrada de 2 unidades | La API responde con HTTP 200. El stock se actualiza correctamente a 12 en la base de datos y en la interfaz. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P03** | Registrar salida de 1 unidad | La API responde con HTTP 200. El stock se actualiza a 11 en BD y app. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P04** | Intentar salida de 12 unidades (Sobregiro) | API rechaza con HTTP 400 (Stock insuficiente). Stock se mantiene en 11. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P05** | Escaneo de código de barras Code 128 (PRD001) | La cámara lee el código y carga la información del producto exactamente igual que en el caso P01. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P06** | Escaneo de código inexistente (PRD999) | La API devuelve HTTP 404. App muestra mensaje amigable indicando que el producto no existe. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P07** | Entrada de cantidades 0, negativas o decimales | Se bloquea la transacción y muestra mensaje de error de validación. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P08** | Cancelación de cámara / Botón atrás | La cámara se cierra sin causar crash, retornando a la pantalla anterior. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P09** | Caída de Apache o MySQL durante operación | App maneja el timeout o HTTP 503 correctamente, mostrando error de red sin cerrarse inesperadamente. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P10** | Dos salidas simultáneas de 4 (Stock 5) | Una petición pasa (HTTP 200, stock en 1), la otra es rechazada (HTTP 400, stock insuficiente). | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |
| **P11** | Cierre forzado y reapertura de la app | La aplicación inicia sin problemas y no presenta corrupción de estado. | [Por llenar] | [Por llenar] | [Por llenar] | [Por llenar] |