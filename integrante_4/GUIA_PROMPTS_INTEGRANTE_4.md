# GUÍA DE PROMPTS PARA IA - INTEGRANTE 4 (FRONTEND UI Y CONEXIÓN)
> **Rol:** Responsable de las páginas de Ionic/Angular (NgModules), navegación, formularios de entrada/salida y consumo de la API PHP mediante Axios.
> **Instrucciones de uso:** Copia y pega estos prompts en tu IA de preferencia (ChatGPT, Claude, Gemini, DeepSeek). Están diseñados para generar componentes de Angular basados en módulos (`NgModule`), inyectando `ApiService` con Axios y componentes visuales de Ionic (`ion-card`, `ion-button`, `ion-badge`, `ion-toast`, `LoadingController`).

---

## Tarea 1: Servicio Centralizado Axios `api.service.ts` (Actividades 2 y 7)
**Objetivo:** Manejar las peticiones HTTP y formatear los errores de red/servidor para que la UI muestre diagnósticos legibles.

```text
Actúa como desarrollador Frontend Angular experto en Ionic.
En mi proyecto (con NgModules, sin HttpClient), uso la librería Axios para consumir la API PHP.
Genera el servicio `src/app/services/api.service.ts`.

Requisitos:
1. Métodos `setBaseUrl(url: string)` y `getBaseUrl(): string` que persistan la URL en `localStorage` (ej. 'http://192.168.1.75/inventarioqr/api').
2. Instancia de Axios configurada con un `timeout` de 12 segundos.
3. Métodos tipados:
   - `get<T>(endpoint: string): Promise<T>`
   - `postJson<T>(endpoint: string, payload: any): Promise<T>`
4. Método `explainError(error: unknown): string`:
   - Si es un error de Axios (`axios.isAxiosError(error)`):
     * Si el servidor respondió (`error.response`): extraer código HTTP, URL de la petición y el mensaje de la API (`error.response.data?.error || error.message`). Ejemplo: "HTTP 400 | /api/movimientos.php | Stock insuficiente".
     * Si no hubo respuesta (timeout o servidor apagado): devolver "Error de conexión (HTTP 503 / Timeout). Servidor no disponible en [URL]".
   - Si es un error genérico: devolver `error.message`.
```

---

## Tarea 2: Pantalla del Escáner `scanner.page.ts` y `.html` (Actividades 3 y 4)
**Objetivo:** Conectar el botón de la cámara con el escáner nativo y consultar el producto por Axios.

```text
Actúa como desarrollador Ionic Angular con NgModules.
Genera el código para `scanner.page.ts` y `scanner.page.html`.

Inyecta:
- `ScannerService` (tiene `startScan(): Promise<string>` y `stopScan()`).
- `ApiService` (tiene `get<ApiResponse<Producto>>(endpoint)` y `explainError(err)`).
- `LoadingController`, `ToastController`, `NavController` de Ionic.

Flujo de la página:
1. Vista HTML:
   - Header con título "Control de Inventario QR" y botón para ir a Configuración e Historial.
   - Botón grande y centrado con icono de cámara: "Escanear Código QR / Barras".
   - Tarjeta informativa sobre cómo enfocar el código.
2. Lógica TypeScript:
   - Al presionar "Escanear", invocar `scannerService.startScan()`.
   - Si devuelve vacío o 'CANCELLED', no hacer nada.
   - Si devuelve un código (ej. "PRD001"):
     * Mostrar loader: "Consultando producto...".
     * Llamar a `apiService.get('productos.php?codigo=' + encodeURIComponent(codigo))`.
     * Si responde exitoso: cerrar loader y navegar a `/detalle` pasando el producto (vía NavigationExtras o servicio de estado).
     * Si falla: cerrar loader y mostrar Toast rojo con el mensaje de error procesado con `explainError`.
```

---

## Tarea 3: Pantalla de Detalle y Formulario de Movimiento (Actividades 4, 5 y 6)
**Objetivo:** Mostrar los datos del producto, permitir elegir Entrada o Salida, validar la cantidad y actualizar el stock en pantalla.

```text
Actúa como desarrollador Ionic Angular con NgModules.
Genera el código para `detalle.page.ts` y `detalle.page.html`.

Requisitos de la pantalla:
1. Vista HTML:
   - Botón atrás para volver al escáner.
   - Tarjeta (`ion-card`) con: Código, Nombre del Producto y un `ion-badge` grande que muestre el **Stock Actual** (verde si stock > 5, amarillo si <= 5, rojo si 0).
   - Selector (`ion-segment`) para elegir entre "Entrada" (color verde) o "Salida" (color rojo/peligro).
   - Campo de entrada (`ion-input`) de tipo numérico para la `cantidad` (entero positivo).
   - Botón "Confirmar Movimiento" con estado `[disabled]="cargando || cantidad <= 0"`.
2. Lógica TypeScript:
   - Valida que `cantidad` sea un entero estrictamente mayor que 0.
   - Al confirmar, llama por POST a `movimientos.php` enviando `{ codigo: producto.codigo, tipo: tipoSeleccionado, cantidad: cantidad }`.
   - Si tiene éxito:
     * Actualiza el stock en la tarjeta con el dato retornado por la API (`data.stock_actual`).
     * Muestra Toast verde: "Movimiento registrado con éxito".
     * Limpia el campo cantidad.
   - Si falla (ejemplo: stock insuficiente devuelto por el servidor con HTTP 400):
     * Muestra alerta o Toast rojo con el mensaje exacto devuelto por la API.
     * Mantiene los datos en el formulario para que el operador pueda corregir la cantidad.
```

---

## Tarea 4: Pantalla de Configuración de Servidor y Test de Conexión (Actividad 2)
**Objetivo:** Permitir guardar la IP local de la laptop y probar que Apache/MySQL responden antes de iniciar las operaciones.

```text
Actúa como desarrollador Ionic Angular con NgModules.
Genera el código para `config.page.ts` y `config.page.html`.

Requisitos:
1. Input para ingresar la URL base del backend (ejemplo: `http://192.168.1.75/inventarioqr/api`).
2. Texto de advertencia visible: "No usar localhost ni 127.0.0.1. Ingresa la IP de la laptop conectada a la misma red Wi-Fi".
3. Botón "Probar Conexión" que consuma `health.php`:
   - Muestra indicador de carga mientras prueba.
   - Si `health.php` devuelve 200: muestra mensaje de éxito verde indicando versiones de PHP y estado de MySQL ("Conexión exitosa con el servidor").
   - Si falla o devuelve 503: muestra mensaje de error rojo indicando que el servidor no responde o MySQL está caído.
4. Botón "Guardar Configuración" que guarde la URL en `ApiService` y regrese al inicio.
```
