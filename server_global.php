<?php
header('Content-Type: application/json');
include_once 'server_conexion.php'; 

function connectDatabase() {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT => true
    ]);
}

function handleOperation($pdo, $action, $table, $data) {
    switch ($action) {
        case 'add':
            $columns = implode(", ", array_keys($data));
            $placeholders = rtrim(str_repeat('?, ', count($data)), ', ');
        
            try {
                $stmt = $pdo->prepare("INSERT INTO $table ($columns) VALUES ($placeholders)");
                $stmt->execute(array_values($data));
        
                return ['success' => true, 'message' => 'Registro creado con éxito.'];
                
            } catch (PDOException $e) {
                if ($e->errorInfo[1] == 1062) return ['success' => false, 'message' => 'El dato ya se encuentra registrado.'];

                if ($e->errorInfo[1] == 23000) return ['success' => false, 'message' => 'Error de integridad: ' . $e->getMessage()];

                return ['success' => false, 'message' => 'Error al crear el registro: ' . $e->getMessage()];
            }
        
        case 'update':
            $set = [];
            $values = []; 
        
            foreach ($data as $column => $value) {
                if ($column !== 'id') {
                    $set[] = "$column = ?";
                    $values[] = $value; 
                }
            }
            $setString = implode(", ", $set);
        
            if (!isset($data['id'])) return ['success' => false, 'message' => 'ID no proporcionado.'];
        
            $stmt = $pdo->prepare("UPDATE $table SET $setString WHERE id = ?");
            $values[] = $data['id']; 
        
            $stmt->execute($values); 
            return ['success' => true, 'message' => 'Registro actualizado con éxito.'];
            

        case 'delete':
            $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
            $stmt->execute([$data['id']]);
            return ['success' => true, 'message' => 'Eliminado con éxito.'];

        case 'fetch':
            if (!isset($data['id'])) {
                $stmt = $pdo->query("SELECT * FROM $table");
                return $stmt->fetchAll(PDO::FETCH_ASSOC); 
            } else {
                $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
                $stmt->execute([$data['id']]);
                $record = $stmt->fetch(PDO::FETCH_ASSOC);
                return $record ? $record : ['success' => false, 'message' => 'Registro no encontrado.'];
            }

        default:
            return ['success' => false, 'message' => 'Acción no válida.'];
    }
}
