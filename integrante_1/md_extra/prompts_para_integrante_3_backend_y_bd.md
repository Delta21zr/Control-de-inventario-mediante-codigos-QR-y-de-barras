# GUÍA DE PROMPTS PARA IA - INTEGRANTE 3 (BACKEND Y BASE DE DATOS)

> **Instrucciones de uso:** Estos prompts están blindados con la estructura de la base de datos y el Contrato de API. Evitarán que la IA use MySQLi (forzando PDO) y garantizarán el bloqueo de base de datos requerido.

## Tarea 1: Configuración PDO y Endpoint `health.php` (Actividades 2 y 3)
**Objetivo:** Crear la conexión base y el endpoint de diagnóstico para el Integrante 5.

**Copia y pega este prompt:**
```text
Actúa como Arquitecto Backend PHP.
Necesito dos archivos en PHP 8 nativo (sin frameworks):

1. `db.php`: Una clase o script que retorne una conexión PDO a MySQL. Debe usar manejo de excepciones (PDO::ERRMODE_EXCEPTION), charset utf8mb4 y cargar las credenciales desde constantes (DB_HOST, DB_NAME, DB_USER, DB_PASS).
2. `health.php`: Un endpoint que devuelva un JSON. Debe intentar conectar a la base de datos usando `db.php`. 
- Si conecta, devuelve HTTP 200 con `{"success": true, "data": {"php": "8.x", "mysql": "ok"}}`.
- Si falla, debe capturar la excepción PDO y devolver HTTP 503 con `{"success": false, "error": "No se pudo conectar a la base de datos"}`.
- Ambos archivos deben incluir cabeceras CORS para permitir peticiones desde Ionic en red local.
```

## Tarea 2: Registro Atómico de Movimientos con Bloqueo (Actividades 5 y 6)
**Objetivo:** El núcleo del sistema. Validar stock e impedir saldos negativos en concurrencia.

**Copia y pega este prompt:**
```text
Actúa como desarrollador PHP Senior experto en bases de datos transaccionales.
Escribe el archivo `movimientos.php` (método POST) que recibe este payload JSON: `{"codigo": "PRD001", "tipo": "entrada", "cantidad": 2}`.

Reglas ESTRICTAS de negocio:
1. Usa PDO. Habilita cabeceras CORS y lee el JSON con `file_get_contents('php://input')`.
2. Valida que cantidad > 0 y que tipo sea 'entrada' o 'salida'.
3. DEBES usar una transacción (`$pdo->beginTransaction()`).
4. Haz una lectura bloqueante para el producto: `SELECT id, stock FROM productos WHERE codigo = ? FOR UPDATE`.
5. Si no existe, lanza rollback y error 404.
6. Si es 'salida' y la cantidad solicitada es MAYOR al stock devuelto por el SELECT, lanza rollback y devuelve HTTP 400 con `{"success": false, "error": "Stock insuficiente"}`.
7. Si todo está bien, calcula el nuevo stock, haz un `UPDATE` en productos y un `INSERT` en movimientos (campos: producto_id, tipo, cantidad, stock_antes, stock_despues).
8. Haz commit y devuelve HTTP 200 con formato `{"success": true, "data": {"nuevo_stock": X}}`.
```