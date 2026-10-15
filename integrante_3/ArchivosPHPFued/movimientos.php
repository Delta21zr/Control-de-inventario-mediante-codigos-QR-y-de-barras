<?php
declare(strict_types=1);

// ==========================================================================
// 1. CABECERAS CORS Y PREFLIGHT
// ==========================================================================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Content-Type: application/json; charset=utf-8");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Validar que el método sea exclusivamente POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error'   => 'Método no permitido. Usa POST.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/db.php';

// ==========================================================================
// 2. LECTURA Y VALIDACIÓN DEL PAYLOAD JSON
// ==========================================================================
$rawInput = file_get_contents('php://input');
$payload  = json_decode($rawInput ?: '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Payload JSON inválido o malformado'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$codigo   = isset($payload['codigo']) ? trim((string)$payload['codigo']) : '';
$tipo     = isset($payload['tipo']) ? trim((string)$payload['tipo']) : '';
$cantidad = $payload['cantidad'] ?? null;

// Validar reglas de entrada: código no vacío, tipo ('entrada'|'salida') y cantidad > 0 (entero)
if (
    $codigo === '' ||
    !in_array($tipo, ['entrada', 'salida'], true) ||
    !is_numeric($cantidad) ||
    (int)$cantidad <= 0 ||
    (int)$cantidad != $cantidad // Evita decimales si el stock se maneja en unidades enteras
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Datos inválidos: verifica que codigo no esté vacío, tipo sea "entrada" o "salida" y cantidad sea un entero mayor a 0'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$cantidad = (int)$cantidad;

// ==========================================================================
// 3. TRANSACCIÓN Y LÓGICA DE NEGOCIO (ACID)
// ==========================================================================
$pdo = null;

try {
    $pdo = Database::getConnection();
    
    // Iniciar transacción
    $pdo->beginTransaction();

    // 4. Lectura bloqueante (Row-level lock en InnoDB)
    $stmtSelect = $pdo->prepare('SELECT id, stock FROM productos WHERE codigo = ? FOR UPDATE');
    $stmtSelect->execute([$codigo]);
    $producto = $stmtSelect->fetch();

    // 5. Si el producto no existe -> Rollback y HTTP 404
    if (!$producto) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error'   => 'Producto no encontrado'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $productoId = (int)$producto['id'];
    $stockAntes = (int)$producto['stock'];

    // 6. Validar stock disponible en salidas -> Rollback y HTTP 400
    if ($tipo === 'salida' && $cantidad > $stockAntes) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error'   => 'Stock insuficiente'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 7. Calcular nuevo stock
    $stockDespues = ($tipo === 'entrada')
        ? $stockAntes + $cantidad
        : $stockAntes - $cantidad;

    // Actualizar stock en tabla productos
    $stmtUpdate = $pdo->prepare('UPDATE productos SET stock = ? WHERE id = ?');
    $stmtUpdate->execute([$stockDespues, $productoId]);

    // Registrar trazabilidad en tabla movimientos
    $stmtInsert = $pdo->prepare('
        INSERT INTO movimientos (producto_id, tipo, cantidad, stock_antes, stock_despues)
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmtInsert->execute([
        $productoId,
        $tipo,
        $cantidad,
        $stockAntes,
        $stockDespues
    ]);

    // 8. Confirmar transacción y devolver HTTP 200
    $pdo->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data'    => [
            'nuevo_stock' => $stockDespues
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Si la transacción sigue abierta al ocurrir un fallo de BD, revertir cambios
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // error_log("Error transaccional en movimientos.php: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Error interno al procesar el movimiento de inventario'
    ], JSON_UNESCAPED_UNICODE);
}