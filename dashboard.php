<?php
require_once 'middleware/auth.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - MyAdminCard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <script>
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    </script>
</head>

<body>
    <header class="topbar">
        <div class="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
                <rect x="2" y="6" width="14" height="16" rx="2" fill="#fff" stroke="var(--primary)" />
                <path d="M6 2h14a2 2 0 0 1 2 2v14" stroke="#f59e0b" fill="#fef3c7" />
                <circle cx="9" cy="14" r="2" fill="var(--primary)" />
            </svg>
            MyAdmin<span>Card</span>
        </div>
        <div class="user-info">
            <button id="theme-toggle" class="btn btn-outline btn-sm" title="Alternar Tema Escuro"
                style="font-size: 1.2rem; padding: 0.2rem 0.5rem; border: none;">🌙</button>
            <div class="avatar"><?php echo strtoupper(substr($_SESSION['username'], 0, 1)); ?></div>
            <span>Olá, <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong></span>
            <a href="actions/logout.php" class="btn btn-outline btn-sm">Sair</a>
        </div>
    </header>

    <div class="tabs-nav">
        <div class="tabs-container-inner">
            <button class="tab-btn active" data-target="view-tab">📖 Visualizar Coleção</button>
            <button class="tab-btn" data-target="form-tab" id="tab-add-card">✨ Adicionar Carta</button>
        </div>
    </div>

    <main class="dashboard-container">
        <!-- Tab de Visualização -->
        <section id="view-tab" class="tab-content active list-panel">
            <div class="panel-header">
                <h2>Cartas Cadastradas</h2>
                <div class="filters">
                    <input type="text" id="search-input" placeholder="🔍 Pesquisar carta...">
                    <select id="filter-game">
                        <option value="">Todos os Jogos</option>
                        <option value="Magic: The Gathering">Magic: The Gathering</option>
                        <option value="Pokémon">Pokémon</option>
                        <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
                    </select>
                    <select id="filter-edition" disabled>
                        <option value="">Selecione o Jogo primeiro</option>
                    </select>
                    <select id="filter-rarity" disabled>
                        <option value="">Selecione o Jogo primeiro</option>
                    </select>
                </div>
            </div>
            <div class="table-responsive">
                <table id="cards-table">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>Jogo</th>
                            <th>Edição</th>
                            <th>Raridade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Linhas renderizadas via JS -->
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Tab de Formulário -->
        <aside id="form-tab" class="tab-content form-panel">
            <h2 id="form-title">Nova Carta</h2>
            <form id="card-form">
                <input type="hidden" id="card_id" name="id">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name_en">Nome (EN) *</label>
                        <input type="text" id="name_en" name="name_en" required placeholder="Ex: Black Lotus">
                    </div>
                    <div class="form-group">
                        <label for="name_pt">Nome (PT)</label>
                        <input type="text" id="name_pt" name="name_pt" placeholder="Ex: Lótus Negra">
                    </div>
                    <div class="form-group">
                        <label for="game">Card Game *</label>
                        <select id="game" name="game" required>
                            <option value="">Selecione...</option>
                            <option value="Magic: The Gathering">Magic: The Gathering</option>
                            <option value="Pokémon">Pokémon</option>
                            <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edition_id">Edição *</label>
                        <select id="edition_id" name="edition_id" disabled required>
                            <option value="">Selecione um jogo primeiro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="rarity">Raridade</label>
                        <select id="rarity" name="rarity" disabled required>
                            <option value="">Selecione um jogo primeiro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="image_url">URL da Imagem</label>
                        <input type="url" id="image_url" name="image_url" placeholder="https://...">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="btn-save">Salvar Carta</button>
                    <button type="button" class="btn btn-secondary" id="btn-cancel" style="display:none;">Cancelar
                        Edição</button>
                </div>
            </form>
        </aside>
    </main>

    <!-- Toast Container -->
    <div id="toast-container"></div>

    <!-- Custom Confirm Modal -->
    <div id="confirm-modal" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-icon">⚠️</div>
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir esta carta? Esta ação não pode ser desfeita e a carta será perdida para
                sempre.</p>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="modal-cancel">Cancelar</button>
                <button class="btn btn-danger" id="modal-confirm">Sim, Excluir</button>
            </div>
        </div>
    </div>

    <!-- Image Viewer Modal -->
    <div id="image-modal" class="modal-overlay" style="cursor: zoom-out;">
        <img id="image-modal-content" class="modal-image" src="" alt="Visualização da Carta">
    </div>

    <script src="assets/js/app.js"></script>
</body>

</html>