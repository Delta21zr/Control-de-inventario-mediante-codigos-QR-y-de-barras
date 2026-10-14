# GUÍA DE PROMPTS PARA IA - INTEGRANTE 3 (BACKEND Y BASE DE DATOS)
> **Rol:** Responsable de la persistencia en MySQL, configuración PDO y desarrollo de los endpoints en PHP 8.x con bloqueo transaccional.
> **Instrucciones de uso:** Copia y pega estos prompts en tu IA de preferencia (ChatGPT, Claude, Gemini, DeepSeek). Están blindados con el esquema SQL exacto (`schema.sql`) y el Contrato de API para evitar el uso de MySQLi y garantizar transacciones seguras con `SELECT ... FOR UPDATE`.

---

## Tarea 1: Conexión PDO y Endpoint de Diagnóstico `health.php` (Actividades 2 y 3)
**Objetivo:** Crear la conexión centralizada con PDO y el endpoint de prueba para validar que PHP y MySQL están corriendo en XAMPP.

```text
Actúa como Arquitecto Backend PHP Senior.
Para un reto de inventario en red local con XAMPP y MySQL, necesito dos archivos en PHP 8.x nativo:

1. `backend/config.php` (y su plantilla `config.example.php`):
   - Archivo que devuelva o defina: host ('localhost'), port (3306), database ('reto_inventario_qr'), username ('root') y password ('').

2. `backend/db.php`:
   - Función `db(): PDO` que lea la configuración y devuelva una instancia de PDO.
   - Opciones obligatorias:
     * PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
     * PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
     * PDO::ATTR_EMULATE_PREPARES => false
     * Charset utf8mb4.

3. `backend/api/health.php`:
   - Endpoint GET que incluya cabeceras CORS (`Access-Control-Allow-Origin: *`, `Content-Type: application/json; charset=utf-8`).
   - Ejecute `SELECT 1` para probar MySQL.
   - Si funciona: HTTP 200 `{"success": true, "data": {"php": PHP_VERSION, "mysql": "ok"}}`.
   - Si falla la conexión: HTTP 503 `{"success": false, "error": "No se pudo conectar a la base de datos."}`.
```

---

## Tarea 2: Endpoint de Consulta de Productos `productos.php` (Actividad 4)
**Objetivo:** Permitir la búsqueda de un producto por su código tras escanear un QR/barra, o devolver el catálogo completo.

```text
Actúa como desarrollador Backend PHP.
Genera el archivo `backend/api/productos.php` (Método GET) conectado mediante PDO a MySQL.

Estructura de la tabla `productos`: (id, codigo VARCHAR(80) UNIQUE, nombre VARCHAR(160), stock INT UNSIGNED).

Reglas del endpoint:
1. Incluir cabeceras CORS (Allow-Origin: *, Allow-Methods: GET, OPTIONS, Content-Type: application/json).
2. Si la petición es OPTIONS, devolver HTTP 204 y terminar.
3. Verificar si viene el parámetro query `codigo` (ejemplo: `productos.php?codigo=PRD001`).
   - Si viene `codigo`:
     * Usar consulta preparada: `SELECT id, codigo, nombre, stock FROM productos WHERE codigo = ?`.
     * Si existe: devolver HTTP 200 con `{"success": true, "data": {"id": 1, "codigo": "PRD001", "nombre": "Mouse inalámbrico", "stock": 10}}`.
     * Si NO existe: devolver HTTP 404 con `{"success": false, "error": "Producto no encontrado"}`.
   - Si NO viene `codigo`:
     * Devolver HTTP 200 con la lista completa de productos: `{"success": true, "data": [...]}`.
4. Manejar excepciones con try/catch devolviendo HTTP 500 en formato JSON si ocurre un error inesperado.
```

---

## Tarea 3: Registro Atómico de Movimientos con Bloqueo Pesimista (Actividades 5 y 6)
**Objetivo:** El núcleo del sistema. Validar datos e impedir existencias negativas ante condiciones de carrera (dos salidas simultáneas).

```text
Actúa como desarrollador PHP Senior experto en transacciones SQL y consistencia de datos.
Escribe el archivo `backend/api/movimientos.php` para atender peticiones POST.

Recibe este payload JSON:
`{"codigo": "PRD001", "tipo": "entrada" | "salida", "cantidad": 2}`

Tablas de MySQL:
- `productos`: id, codigo, nombre, stock (INT UNSIGNED).
- `movimientos`: id, producto_id, tipo ('entrada','salida'), cantidad, stock_antes, stock_despues, creado_en.

Reglas ESTRICTAS de negocio:
1. Habilita cabeceras CORS completas y lee el cuerpo con `file_get_contents('php://input')`. Decodifica el JSON.
2. Valida:
   - Que `codigo` no esté vacío.
   - Que `tipo` sea estrictamente 'entrada' o 'salida'.
   - Que `cantidad` sea un entero estrictamente MAYOR A 0 (`filter_var($cant, FILTER_VALIDATE_INT) && $cant > 0`). Si no, responder HTTP 400 `{"success": false, "error": "Cantidad inválida"}`.
3. Inicia una transacción PDO: `$pdo->beginTransaction();`.
4. Ejecuta una lectura con BLOQUEO PESIMISTA:
   `SELECT id, stock FROM productos WHERE codigo = ? FOR UPDATE;`
5. Si el producto no existe: `$pdo->rollBack();` y responder HTTP 404 `{"success": false, "error": "Producto inexistente"}`.
6. Si el tipo es 'salida' y `cantidad > stock`:
   - ABORTAR: `$pdo->rollBack();`
   - Responder HTTP 400 `{"success": false, "error": "Stock insuficiente para realizar la salida"}`.
7. Si la operación es válida:
   - Calcular: `$nuevo_stock = ($tipo === 'entrada') ? $stock + $cantidad : $stock - $cantidad;`
   - Actualizar: `UPDATE productos SET stock = ? WHERE id = ?;`
   - Insertar en kardex: `INSERT INTO movimientos (producto_id, tipo, cantidad, stock_antes, stock_despues) VALUES (?, ?, ?, ?, ?);`
   - Confirmar: `$pdo->commit();`
8. Devolver HTTP 200:
   `{"success": true, "data": {"codigo": "PRD001", "stock_anterior": $stock, "stock_actual": $nuevo_stock}}`.
9. En el bloque catch: `$pdo->rollBack();` y responder HTTP 500 con error JSON.
```

---

## Tarea 4: Consulta de Historial de Movimientos (Actividad 7)
**Objetivo:** Exponer el listado de transacciones recientes ordenadas de forma descendente para la pantalla de historial.

```text
Actúa como desarrollador Backend PHP.
Agrega en `backend/api/movimientos.php` el soporte para el método GET (o crea la lógica cuando el `$_SERVER['REQUEST_METHOD'] === 'GET'`).

Objetivo:
1. Consultar los movimientos recientes uniendo la tabla `movimientos` con `productos` mediante `producto_id`:
   `SELECT m.id, p.codigo, p.nombre AS producto, m.tipo, m.cantidad, m.stock_antes, m.stock_despues, m.creado_en FROM movimientos m INNER JOIN productos p ON m.producto_id = p.id ORDER BY m.creado_en DESC, m.id DESC LIMIT 50;`
2. Devolver HTTP 200 con formato:
   `{"success": true, "data": [ ... registros ... ]}`
3. Si no hay movimientos, devolver `{"success": true, "data": []}`.
4. Responder siempre con cabeceras JSON y CORS.
```
