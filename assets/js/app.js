document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('card-form');
    const gameSelect = document.getElementById('game');
    const editionSelect = document.getElementById('edition_id');
    const raritySelect = document.getElementById('rarity');
    const tableBody = document.querySelector('#cards-table tbody');
    const formTitle = document.getElementById('form-title');
    const btnCancel = document.getElementById('btn-cancel');

    // ================= THEME TOGGLE =================
    const themeToggle = document.getElementById('theme-toggle');

    // Sincroniza o icone no start
    if (themeToggle && document.documentElement.getAttribute('data-theme') === 'dark') {
        themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Filters
    const searchInput = document.getElementById('search-input');
    const filterGame = document.getElementById('filter-game');
    const filterEdition = document.getElementById('filter-edition');
    let allEditionsMap = {};
    let rawEditionsData = {};
    const filterRarity = document.getElementById('filter-rarity');
    let allCards = []; // State para os filtros

    const raritiesByGame = {
        'Pokémon': [
            'Comum', 'Incomum', 'Rara', 'Holográfica (Holo)', 'Holográfica Reversa (Reverse Holo)',
            'Rara Dupla (Double Rare)', 'Ultra Rara', 'Ilustração Rara (Illustration Rare - IR)',
            'Ilustração Rara Especial (Special Illustration Rare - SIR)', 'Hiper Rara (Hyper Rare / Gold)',
            'Rara Secreta (Secret Rare)', 'Rara Incrível (Amazing Rare)', 'Rara Radiante (Radiant Rare)',
            'ACE SPEC', 'Promo'
        ],
        'Magic: The Gathering': [
            'Comum (Common)', 'Incomum (Uncommon)', 'Rara (Rare)', 'Mítica Rara (Mythic Rare)',
            'Terreno Básico (Basic Land)', 'Especial / Timeshifted'
        ],
        'Yu-Gi-Oh!': [
            'Comum', 'Rara', 'Super Rara', 'Ultra Rara', 'Rara Secreta (Secret Rare)',
            'Rara Ultimate (Ultimate Rare)', 'Rara Fantasma (Ghost Rare)', 'Rara Luz Estelar (Starlight Rare)',
            'Rara Secreta Quarto de Século (Quarter Century Secret Rare - QSSE)', 'Rara de Colecionador (Collector\'s Rare)',
            'Rara Dourada (Gold Rare / Premium Gold)', 'Prismatic Secret Rare', 'Platinum Rare',
            'Platinum Secret Rare', 'Shatterfoil / Starfoil / Mosaic Rare'
        ]
    };

    // Inicialização da listagem
    async function initApp() {
        try {
            const res = await fetch('api/editions.php?game=all');
            rawEditionsData = await res.json();
            for (const game in rawEditionsData) {
                rawEditionsData[game].forEach(ed => {
                    allEditionsMap[ed.id] = ed.name;
                });
            }
        } catch (e) { console.error('Erro carregando edições:', e); }
        loadCards();
    }
    initApp();

    // ================= TABS LOGIC =================
    function switchTab(targetId) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === targetId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === targetId);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.target));
    });

    // ================= DYNAMIC SELECT =================
    async function fetchEditions(game) {
        editionSelect.innerHTML = '<option value="">Buscando edições...</option>';
        editionSelect.disabled = true;

        if (!game) {
            editionSelect.innerHTML = '<option value="">Selecione um jogo primeiro</option>';
            return;
        }

        try {
            const response = await fetch(`api/editions.php?game=${encodeURIComponent(game)}`);
            const editions = await response.json();

            editionSelect.innerHTML = '<option value="">Selecione a edição...</option>';
            editions.forEach(ed => {
                const option = document.createElement('option');
                option.value = ed.id;
                option.textContent = ed.name;
                editionSelect.appendChild(option);
            });
            editionSelect.disabled = false;
        } catch (error) {
            showToast('Erro ao carregar edições', 'error');
            editionSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    }

    function updateRaritiesForForm(game) {
        raritySelect.innerHTML = '<option value="">Selecione a raridade...</option>';
        raritySelect.disabled = !game;
        if (game && raritiesByGame[game]) {
            raritiesByGame[game].forEach(rar => {
                const option = document.createElement('option');
                option.value = rar;
                option.textContent = rar;
                raritySelect.appendChild(option);
            });
        } else if (!game) {
            raritySelect.innerHTML = '<option value="">Selecione um jogo primeiro</option>';
        }
    }

    gameSelect.addEventListener('change', (e) => {
        fetchEditions(e.target.value);
        updateRaritiesForForm(e.target.value);
    });

    // ================= CRUD: SAVE =================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const isEdit = !!data.id;

        const btnSave = document.getElementById('btn-save');
        btnSave.disabled = true;
        btnSave.textContent = 'Salvando...';

        try {
            const url = isEdit ? `api/cards.php?id=${data.id}` : 'api/cards.php';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showToast(result.message, 'success');
                resetForm();
                switchTab('view-tab'); // Volta pra lista após salvar
                loadCards();
            } else {
                showToast(result.error || 'Erro ao salvar', 'error');
            }
        } catch (error) {
            showToast('Erro de conexão ao salvar', 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.textContent = 'Salvar Carta';
        }
    });

    btnCancel.addEventListener('click', () => {
        resetForm();
        switchTab('view-tab');
    });

    // ================= CRUD: READ & FILTER =================
    async function loadCards() {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando cartas...</td></tr>';
        try {
            const response = await fetch('api/cards.php');
            const result = await response.json();

            if (result.success) {
                allCards = result.data; // Atualiza o state local
                applyFilters(); // Renderiza já com filtros (se houver)
            }
        } catch (error) {
            showToast('Erro ao carregar cartas do banco', 'error');
        }
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const gameFilter = filterGame.value;
        const rarityFilter = filterRarity.value;
        const editionFilter = filterEdition.value;

        const filtered = allCards.filter(card => {
            const matchName = card.name_en.toLowerCase().includes(searchTerm) ||
                (card.name_pt && card.name_pt.toLowerCase().includes(searchTerm));
            const matchGame = gameFilter === "" || card.game === gameFilter;
            const matchRarity = rarityFilter === "" || card.rarity === rarityFilter;
            const matchEdition = editionFilter === "" || String(card.edition_id) === editionFilter;
            return matchName && matchGame && matchRarity && matchEdition;
        });

        renderTable(filtered);
    }

    searchInput.addEventListener('input', applyFilters);

    function updateEditionsForFilter(game) {
        filterEdition.innerHTML = '<option value="">Todas as Edições</option>';
        filterEdition.disabled = !game;
        if (game && rawEditionsData[game]) {
            rawEditionsData[game].forEach(ed => {
                const option = document.createElement('option');
                option.value = ed.id;
                option.textContent = ed.name;
                filterEdition.appendChild(option);
            });
        } else if (!game) {
            filterEdition.innerHTML = '<option value="">Selecione o Jogo primeiro</option>';
        }
    }

    function updateRaritiesForFilter(game) {
        filterRarity.innerHTML = '<option value="">Todas as Raridades</option>';
        filterRarity.disabled = !game;
        if (game && raritiesByGame[game]) {
            raritiesByGame[game].forEach(rar => {
                const option = document.createElement('option');
                option.value = rar;
                option.textContent = rar;
                filterRarity.appendChild(option);
            });
        } else if (!game) {
            filterRarity.innerHTML = '<option value="">Selecione o Jogo primeiro</option>';
        }
    }

    filterGame.addEventListener('change', (e) => {
        updateRaritiesForFilter(e.target.value);
        updateEditionsForFilter(e.target.value);
        filterRarity.value = '';
        filterEdition.value = '';
        applyFilters();
    });
    filterRarity.addEventListener('change', applyFilters);
    filterEdition.addEventListener('change', applyFilters);

    function renderTable(cards) {
        tableBody.innerHTML = '';
        if (cards.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 3rem;">Nenhuma carta encontrada.</td></tr>';
            return;
        }

        cards.forEach(card => {
            const tr = document.createElement('tr');

            const imgHtml = card.image_url
                ? `<img src="${card.image_url}" alt="${card.name_en}" class="card-thumb" onerror="this.src=''; this.className='card-thumb-placeholder'; this.alt='Sem Img';">`
                : `<div class="card-thumb-placeholder">Sem Img</div>`;

            const getRarityClass = (r) => {
                if (!r) return 'comum';
                const lower = r.toLowerCase();
                if (lower.includes('mítica') || lower.includes('starlight') || lower.includes('sir')) return 'mítica';
                if (lower.includes('secreta') || lower.includes('ultra') || lower.includes('hiper') || lower.includes('ultimate')) return 'secreta';
                if (lower.includes('rara') || lower.includes('holo')) return 'rara';
                if (lower.includes('incomum')) return 'incomum';
                return 'comum';
            };
            const rarityClass = getRarityClass(card.rarity);

            tr.innerHTML = `
                <td>${imgHtml}</td>
                <td>
                    <strong>${card.name_en}</strong>
                    ${card.name_pt ? `<br><small class="text-muted">${card.name_pt}</small>` : ''}
                </td>
                <td>${card.game}</td>
                <td><small class="text-muted">${allEditionsMap[card.edition_id] || 'Desconhecida'}</small></td>
                <td><span class="badge badge-${rarityClass}">${card.rarity || 'N/A'}</span></td>
                <td class="actions-cell">
                    <div class="actions-wrapper">
                        <button class="btn btn-sm btn-outline edit-btn" data-id="${card.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${card.id}">Excluir</button>
                    </div>
                </td>
            `;

            tr.querySelector('.edit-btn').addEventListener('click', () => populateForm(card));
            tr.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(card.id));

            tableBody.appendChild(tr);
        });
    }

    // ================= CRUD: UPDATE PREP =================
    async function populateForm(card) {
        formTitle.textContent = 'Editar Carta';
        btnCancel.style.display = 'inline-flex';

        document.getElementById('card_id').value = card.id;
        document.getElementById('name_en').value = card.name_en;
        document.getElementById('name_pt').value = card.name_pt || '';
        document.getElementById('game').value = card.game;
        document.getElementById('image_url').value = card.image_url || '';
        updateRaritiesForForm(card.game);
        document.getElementById('rarity').value = card.rarity || '';

        switchTab('form-tab'); // Muda para a aba do form

        await fetchEditions(card.game);
        document.getElementById('edition_id').value = card.edition_id;
    }

    function resetForm() {
        form.reset();
        document.getElementById('card_id').value = '';
        formTitle.textContent = 'Nova Carta';
        btnCancel.style.display = 'none';

        editionSelect.innerHTML = '<option value="">Selecione um jogo primeiro</option>';
        editionSelect.disabled = true;

        raritySelect.innerHTML = '<option value="">Selecione um jogo primeiro</option>';
        raritySelect.disabled = true;
    }

    // ================= CRUD: DELETE =================
    const modal = document.getElementById('confirm-modal');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');
    let deleteIdPending = null;

    function confirmDelete(id) {
        deleteIdPending = id;
        modal.classList.add('active');
    }

    modalCancel.addEventListener('click', () => {
        deleteIdPending = null;
        modal.classList.remove('active');
    });

    modalConfirm.addEventListener('click', async () => {
        if (!deleteIdPending) return;

        const originalText = modalConfirm.textContent;
        modalConfirm.textContent = 'Excluindo...';
        modalConfirm.disabled = true;

        try {
            const response = await fetch(`api/cards.php?id=${deleteIdPending}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.success) {
                showToast(result.message, 'success');
                loadCards();
                if (document.getElementById('card_id').value == deleteIdPending) {
                    resetForm();
                }
            } else {
                showToast(result.error || 'Erro ao excluir', 'error');
            }
        } catch (error) {
            showToast('Erro de conexão ao excluir', 'error');
        } finally {
            modalConfirm.textContent = originalText;
            modalConfirm.disabled = false;
            modal.classList.remove('active');
            deleteIdPending = null;
        }
    });

    // ================= IMAGE VIEWER (MODAL) =================
    const imageModal = document.getElementById('image-modal');
    const imageModalContent = document.getElementById('image-modal-content');

    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('card-thumb')) {
            imageModalContent.src = e.target.src;
            imageModal.classList.add('active');
        }
    });

    if (imageModal) {
        imageModal.addEventListener('click', () => {
            imageModal.classList.remove('active');
        });
    }

    // ================= TOAST =================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
});
