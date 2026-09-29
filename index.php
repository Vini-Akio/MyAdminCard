<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - MyAdminCard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <script>
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    </script>
</head>
<body class="login-body">
    <div class="login-container">
        <div class="login-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
                <rect x="2" y="6" width="14" height="16" rx="2" fill="#fff" stroke="var(--primary)"/>
                <path d="M6 2h14a2 2 0 0 1 2 2v14" stroke="#f59e0b" fill="#fef3c7"/>
                <circle cx="9" cy="14" r="2" fill="var(--primary)"/>
            </svg>
        </div>
        <h1>MyAdminCard</h1>
        <p class="subtitle">Bem-vindo(a) ao seu gerenciador de coleção!</p>
        <?php
        if (isset($_SESSION['error'])) {
            echo '<div class="alert error">' . htmlspecialchars($_SESSION['error']) . '</div>';
            unset($_SESSION['error']);
        }
        ?>
        <form action="actions/login.php" method="POST" class="login-form">
            <div class="form-group">
                <label for="username">Usuário</label>
                <input type="text" id="username" name="username" required autocomplete="username">
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary btn-large">Entrar na Coleção</button>
        </form>
    </div>
</body>
</html>
