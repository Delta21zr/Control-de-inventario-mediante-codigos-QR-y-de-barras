<?php
declare(strict_types=1);

// ==========================================================================
// CABECERAS CORS Y TIPO DE CONTENIDO
// ==========================================================================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Content-Type: application/json; charset=utf-8");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error'   => 'Método no permitido. Usa GET.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/db.php';

// ==========================================================================
// CONSULTA DE PRODUCTOS
//   GET productos.php?codigo=PRD001 -> un producto (404 si no existe)
//   GET productos.php               -> lista completa de productos
// ==========================================================================
try {
    $pdo = Database::getConnection();

    $codigo = isset($_GET['codigo']) ? trim((string)$_GET['codigo']) : '';

    if ($codigo !== '') {
        // El código escaneado debe coincidir EXACTAMENTE con la columna codigo
        $stmt = $pdo->prepare('SELECT id, codigo, nombre, stock FROM productos WHERE codigo = ?');
        $stmt->execute([$codigo]);
        $producto = $stmt->fetch();

        if (!$producto) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error'   => 'Producto no encontrado'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $producto['id']    = (int)$producto['id'];
        $producto['stock'] = (int)$producto['stock'];

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data'    => $producto
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $productos = $pdo
        ->query('SELECT id, codigo, nombre, stock FROM productos ORDER BY codigo ASC')
        ->fetchAll();

    foreach ($productos as &$p) {
        $p['id']    = (int)$p['id'];
        $p['stock'] = (int)$p['stock'];
    }
    unset($p);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data'    => $productos
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // error_log("Error en productos.php: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Error interno al consultar los productos'
    ], JSON_UNESCAPED_UNICODE);
}
