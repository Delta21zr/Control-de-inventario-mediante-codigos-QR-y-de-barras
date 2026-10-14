# GUÍA DE PROMPTS PARA IA - INTEGRANTE 4 (FRONTEND UI Y CONEXIÓN)

> **Instrucciones de uso:** Estos prompts están diseñados para generar servicios e interfaces compatibles con NgModules (no Standalone) y con el cliente Axios que manejará las fallas de red requeridas en el manual de usuario.

## Tarea 1: Servicio centralizado Axios `api.service.ts` (Actividades 2 y 7)
**Objetivo:** Consumir el backend interceptando errores para mostrar mensajes legibles al operador.

**Copia y pega este prompt:**
```text
Actúa como desarrollador Frontend Angular experto. 
En mi proyecto Ionic (con NgModules), uso Axios para las peticiones HTTP (no HttpClient).
Crea un servicio `api.service.ts` (@Injectable).

Requisitos:
1. Debe tener un método para guardar y leer la `baseUrl` (ej. http://192.168.1.75/api/) desde localStorage.
2. Debe crear una instancia de axios con un timeout de 12 segundos usando esa baseUrl.
3. Debe tener un método genérico para atrapar errores de Axios (`handleError(error: any)`). 
- Si el servidor responde (error.response), debe extraer el código HTTP, la URL y el string `error.response.data.error`.
- Si el servidor NO responde (error de red o timeout), debe generar un mensaje "Error de Red. Servidor no disponible (503)".
- Debe retornar el error limpio usando `throwError` de RxJS o un Promise.reject legible para la UI.
```

## Tarea 2: Pantalla de Escáner y Conexión (Actividades 3 y 4)
**Objetivo:** Unir el botón de escaneo con la consulta a la base de datos.

**Copia y pega este prompt:**
```text
Actúa como desarrollador Ionic Angular.
Tengo un `ScannerService` que tiene el método `startScan()` que devuelve un string con el código.
Tengo un `ApiService` con un método `getProducto(codigo: string)` que hace la petición GET a Axios.

Genera el código TypeScript para el componente de mi página `scanner.page.ts`.
Flujo:
1. El usuario toca un botón en el HTML (no me des el HTML, solo el TS) que llama a `escanear()`.
2. Llama a `ScannerService.startScan()`.
3. Si el código está vacío (canceló), no hace nada.
4. Si hay código, activa un LoadingController de Ionic ("Buscando producto...").
5. Llama a `ApiService.getProducto(codigo)`.
6. Si es exitoso (HTTP 200), guarda los datos y redirige a `/detalle`.
7. Si falla (HTTP 404 o Error de red), muestra un ToastController o AlertController de Ionic con el mensaje de error procesado. Cierra el Loading.
```