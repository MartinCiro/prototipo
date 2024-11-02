<?php
// Configuración de conexión
$db_host = 'localhost';
$db_name = 'sistema_facturacion';
$db_charset = 'utf8';
$db_user = 'root';
$db_pass = '';

// Definir constantes automáticamente
define('DB_HOST', $db_host);
define('DB_NAME', $db_name);
define('DB_CHARSET', $db_charset);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT => true,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES ' . DB_CHARSET,
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false, // Opcional, si usas SSL
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}
?>
