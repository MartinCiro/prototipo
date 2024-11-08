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
            if (isset($data['rolxpermiso']) && $data['rolxpermiso']) {
                $dataRolxpermiso = $data['rolxpermiso'];
                unset($data['rolxpermiso']);
                unset($data['id']);
            }

            $columns = implode(", ", array_keys($data));
            $placeholders = rtrim(str_repeat('?, ', count($data)), ', ');

            $pdo->beginTransaction();

            try {
                $stmt = $pdo->prepare("INSERT INTO $table ($columns) VALUES ($placeholders)");
                $stmt->execute(array_values($data));

                if ($stmt->rowCount() > 0) {
                    $id_rol = $pdo->lastInsertId();

                    if (isset($dataRolxpermiso) && !empty($dataRolxpermiso)) {
                        $dataRolxpermiso = explode(',', $dataRolxpermiso);
                        foreach ($dataRolxpermiso as $id_permiso) {
                            $stmt = $pdo->prepare("INSERT INTO rolxpermiso (id_rol, id_permiso) VALUES (?, ?)");
                            $stmt->execute([$id_rol, $id_permiso]);
                        }
                    }
                }

                $pdo->commit();
                
                return ['success' => true, 'message' => 'Registro creado con éxito.'];
            } catch (PDOException $e) {
                $pdo->rollBack();

                if ($e->errorInfo[1] == 1062) return ['success' => false, 'message' => 'El dato ya se encuentra registrado.'];
                if ($e->errorInfo[1] == 23000) return ['success' => false, 'message' => 'Error de integridad: ' . $e->getMessage()];
                return ['success' => false, 'message' => 'Error al crear el registro: ' . $e->getMessage()];
            }

        case 'update':
            if (!isset($data['id'])) return ['success' => false, 'message' => 'ID no proporcionado.'];

            if (isset($data['rolxpermiso']) && $data['rolxpermiso']) {
                $dataRolxpermiso = $data['rolxpermiso'];
                unset($data['rolxpermiso']);
            }

            $set = [];
            $values = []; 
            foreach ($data as $column => $value) {
                if ($column !== 'id') {  
                    $set[] = "$column = ?";
                    $values[] = $value;
                }
            }
            $setString = implode(", ", $set);

            $pdo->beginTransaction();

            try {
                $stmt = $pdo->prepare("UPDATE $table SET $setString WHERE id = ?");
                $values[] = $data['id']; 
                $stmt->execute($values);

                $stmt = $pdo->prepare("DELETE FROM rolxpermiso WHERE id_rol = ?");
                $stmt->execute([$data['id']]);

                if (isset($dataRolxpermiso) && !empty($dataRolxpermiso)) {
                    if (is_string($dataRolxpermiso)) $dataRolxpermiso = explode(',', $dataRolxpermiso);

                    foreach ($dataRolxpermiso as $id_permiso) {
                        $stmt = $pdo->prepare("INSERT INTO rolxpermiso (id_rol, id_permiso) VALUES (?, ?)");
                        $stmt->execute([$data['id'], $id_permiso]);
                    }
                }

                $pdo->commit();
                
                return ['success' => true, 'message' => 'Registro actualizado con éxito.'];
            } catch (PDOException $e) {
                $pdo->rollBack();
                if ($e->errorInfo[1] == 1062) return ['success' => false, 'message' => 'El dato ya se encuentra registrado.'];
                if ($e->errorInfo[1] == 23000) return ['success' => false, 'message' => 'Error de integridad: ' . $e->getMessage()];
                return ['success' => false, 'message' => 'Error al actualizar el registro: ' . $e->getMessage()];
            }

        case 'delete':
            $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
            $stmt->execute([$data['id']]);
            return ['success' => true, 'message' => 'Eliminado con éxito.'];

        case 'fetch':
            if (!isset($data['id'])) {
                if ($table !== 'usuarios' && $table !== 'rol') {
                    $stmt = $pdo->query("SELECT * FROM $table");
                } else if ($table === 'usuarios') {
                    $stmt = $pdo->prepare("SELECT 
                            usuarios.id,
                            usuarios.nombre,
                            usuarios.email,
                            usuarios.telefono,
                            usuarios.password,
                            usuarios.id_rol,
                            rol.nombre AS rol_nombre, 
                            GROUP_CONCAT(permiso.nombre) AS permiso_nombre
                        FROM usuarios
                        LEFT JOIN rol ON usuarios.id_rol = rol.id
                        LEFT JOIN rolxpermiso ON rolxpermiso.id_rol = rol.id
                        LEFT JOIN permiso ON rolxpermiso.id_permiso = permiso.id
                        GROUP BY usuarios.id
                        ");
                    $stmt->execute();
                } else if ($table === 'rol') {
                    $stmt = $pdo->prepare("
                        SELECT 
                            rol.id,
                            rol.nombre,
                            rol.descripcion,
                            GROUP_CONCAT(permiso.id) AS permisos_ids, 
                            GROUP_CONCAT(permiso.nombre) AS permisos_nombres
                        FROM rol
                        LEFT JOIN rolxpermiso ON rolxpermiso.id_rol = rol.id
                        LEFT JOIN permiso ON rolxpermiso.id_permiso = permiso.id
                        GROUP BY rol.id
                    ");
                    $stmt->execute();
                }
                return $stmt->fetchAll(PDO::FETCH_ASSOC); 
            } else {
                if ($table !== 'rol') {
                    $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
                } else if ($table === 'rol') {
                    $stmt = $pdo->prepare("
                        SELECT 
                            rol.id AS rol_id,
                            rol.nombre AS rol_nombre,
                            rol.descripcion AS rol_descripcion,
                            GROUP_CONCAT(permiso.id) AS permisos_ids,  -- Obtener los IDs de los permisos asociados al rol
                            GROUP_CONCAT(permiso.nombre) AS permisos_nombres  -- Obtener los nombres de los permisos
                        FROM rol
                        LEFT JOIN rolxpermiso ON rolxpermiso.id_rol = rol.id
                        LEFT JOIN permiso ON rolxpermiso.id_permiso = permiso.id
                        WHERE rol.id = ?
                        GROUP BY rol.id
                    ");
                }
                $stmt->execute([$data['id']]);
                $record = $stmt->fetch(PDO::FETCH_ASSOC);
                return $record ? $record : ['success' => false, 'message' => 'Registro no encontrado.'];
            }

        default:
            return ['success' => false, 'message' => 'Acción no válida.'];
    }
}
