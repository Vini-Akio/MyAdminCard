<?php
require_once '../middleware/auth.php';
require_once '../config/database.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM cards ORDER BY id DESC");
        $cards = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $cards]);
        
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $pdo->prepare("INSERT INTO cards (name_en, name_pt, game, edition_id, image_url, rarity) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name_en'],
            $data['name_pt'] ?? null,
            $data['game'],
            $data['edition_id'],
            $data['image_url'] ?? null,
            $data['rarity'] ?? null
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Carta criada com sucesso!', 'id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            throw new Exception("ID não fornecido");
        }
        
        $stmt = $pdo->prepare("UPDATE cards SET name_en = ?, name_pt = ?, game = ?, edition_id = ?, image_url = ?, rarity = ? WHERE id = ?");
        $stmt->execute([
            $data['name_en'],
            $data['name_pt'] ?? null,
            $data['game'],
            $data['edition_id'],
            $data['image_url'] ?? null,
            $data['rarity'] ?? null,
            $id
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Carta atualizada com sucesso!']);
        
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception("ID não fornecido");
        }
        
        $stmt = $pdo->prepare("DELETE FROM cards WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Carta removida com sucesso!']);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
