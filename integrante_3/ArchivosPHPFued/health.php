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

require_once __DIR__ . '/db.php';

// ==========================================================================
// VERIFICACIÓN DE SALUD DEL SERVICIO (HEALTH CHECK)
// ==========================================================================
try {
    $pdo = Database::getConnection();

    // Ping real al motor de base de datos
    $pdo->query('SELECT 1');

    // Obtiene versión limpia en formato 8.x (ej. "8.2")
    $phpVersion = PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION;

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data'    => [
            'php'   => $phpVersion,
            'mysql' => 'ok'
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // error_log("Error de conexión en health.php: " . $e->getMessage());

    http_response_code(503);
    echo json_encode([
        'success' => false,
        'error'   => 'No se pudo conectar a la base de datos'
    ], JSON_UNESCAPED_UNICODE);
}
