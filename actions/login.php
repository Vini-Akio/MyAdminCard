<?php
session_start();
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $_SESSION['error'] = 'Preencha todos os campos.';
        header("Location: ../index.php");
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user) {
        $validPassword = false;

        // Verifica a senha (suporta o hash bcrypt ou texto limpo para o primeiro acesso)
        if (password_verify($password, $user['password_hash'])) {
            $validPassword = true;
        } elseif ($password === $user['password_hash']) {
            $validPassword = true;
            // Migra para o formato hash
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $updateStmt->execute([$newHash, $user['id']]);
        }

        if ($validPassword) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header("Location: ../dashboard.php");
            exit;
        }
    }

    $_SESSION['error'] = 'Usuário ou senha inválidos.';
    header("Location: ../index.php");
    exit;
}
?>
