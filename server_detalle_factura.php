<?php
header('Content-Type: application/json');
include_once 'server_global.php'; 

try {
    $pdo = connectDatabase(); 

    $action = $_POST['action'] ?? '';
    $table = 'detalle_factura'; 

    // Función para limpiar los datos
    function cleanData($data) {
        foreach ($data as $key => $value) {
            $data[$key] = trim(strip_tags($value));
        }
        return $data;
    }

    $cleanedData = cleanData($_POST);

    if ($action ) unset($cleanedData['action']);

    $response = handleOperation($pdo, $action, $table, $cleanedData);
    echo json_encode($response);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
