<?php
header('Content-Type: application/json');
include_once 'server_conexiong.php'; // Cargar la configuración de la base de datos

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT => true
    ]);

    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'add':
            $id_usuario = $_POST['id_usuario'];
            $permiso = $_POST['permiso'];

            $stmt = $pdo->prepare("INSERT INTO permisos_usuario (id_usuario, permiso) VALUES (?, ?)");
            $stmt->execute([$id_usuario, $permiso]);
            echo json_encode(['success' => true, 'message' => 'Permiso agregado con éxito.']);
            break;

        case 'update':
            $id_permiso = $_POST['id_permiso'];
            $permiso = $_POST['permiso'];

            $stmt = $pdo->prepare("UPDATE permisos_usuario SET permiso = ? WHERE id_permiso = ?");
            $stmt->execute([$permiso, $id_permiso]);
            echo json_encode(['success' => true, 'message' => 'Permiso actualizado con éxito.']);
            break;

        case 'delete':
            $id_permiso = $_POST['id_permiso'];

            $stmt = $pdo->prepare("DELETE FROM permisos_usuario WHERE id_permiso = ?");
            $stmt->execute([$id_permiso]);
            echo json_encode(['success' => true, 'message' => 'Permiso eliminado con éxito.']);
            break;

        case 'fetch':
            if (isset($_POST['id_usuario'])) {
                $id_usuario = $_POST['id_usuario'];
                $stmt = $pdo->prepare("SELECT * FROM permisos_usuario WHERE id_usuario = ?");
                $stmt->execute([$id_usuario]);
                $permisos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($permisos); // Enviar permisos de un usuario específico
            } else {
                $stmt = $pdo->query("SELECT * FROM permisos_usuario");
                $permisos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($permisos); // Enviar todos los permisos
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>
