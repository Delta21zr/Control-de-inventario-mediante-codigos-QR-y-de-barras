<?php
declare(strict_types=1);

// ==========================================================================
// CABECERAS CORS (Ionic / Red Local) Y TIPO DE CONTENIDO
// ==========================================================================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Content-Type: application/json; charset=utf-8");

// Manejo temprano de petición Preflight (OPTIONS)
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ==========================================================================
// CREDENCIALES DE BASE DE DATOS
// Valores por defecto de XAMPP. Si tu MySQL es distinto, copia
// config.example.php a config.php (no se sube a Git) y cambia los valores.
// ==========================================================================
if (is_file(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}
defined('DB_HOST') || define('DB_HOST', '127.0.0.1'); // 127.0.0.1 evita resolución DNS lenta en PDO
defined('DB_NAME') || define('DB_NAME', 'reto_inventario_qr');
defined('DB_USER') || define('DB_USER', 'root');
defined('DB_PASS') || define('DB_PASS', '');

// ==========================================================================
// CLASE DE CONEXIÓN PDO
// ==========================================================================
final class Database
{
    private static ?PDO $instance = null;

    // Constructor privado para evitar instanciación directa
    private function __construct() {}

    /**
     * Retorna una instancia activa de PDO.
     *
     * @return PDO
     * @throws PDOException Si ocurre un error al conectar.
     */
    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=utf8mb4',
                DB_HOST,
                DB_NAME
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lanza excepciones en errores
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Devuelve arreglos asociativos por defecto
                PDO::ATTR_EMULATE_PREPARES   => false,                  // Sentencias preparadas nativas (seguridad y tipos reales)
                PDO::ATTR_TIMEOUT            => 5,                      // Timeout de 5 segundos para evitar cuelgues en red local
            ];

            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
        }

        return self::$instance;
    }
}
