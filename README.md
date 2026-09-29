# MyAdminCard - Gestão de Cartas TCG

Um sistema de gerenciamento de cartas (CRUD) focado em performance, acessibilidade e experiência do usuário (UX). Construído de forma modular utilizando **PHP puro** no back-end (sem frameworks) e **Vanilla JavaScript / HTML5 / CSS3** no front-end. 

## 🚀 Tecnologias Utilizadas
- **Back-end:** PHP Puro (PDO para conexão segura com banco de dados)
- **Banco de Dados:** MySQL
- **Front-end:** HTML5 Semântico, CSS3 (CSS Variables, Flexbox, Grid), JavaScript Vanilla (Fetch API)

---

## ⚙️ Como rodar o projeto localmente

### 1. Requisitos
- PHP 7.4 ou superior
- MySQL 5.7 ou superior (ou MariaDB)

### 2. Configurando o Banco de Dados
1. Crie um banco de dados vazio no seu MySQL ou utilize o script de inicialização para criá-lo automaticamente.
2. Importe o arquivo de inicialização executando:
   ```bash
   mysql -u root -p < database/init.sql
   ```
3. Opcional: Caso a senha do seu usuário `root` no MySQL não seja em branco, acesse o arquivo `config/database.php` e altere a variável `$pass` para a sua senha real.

### 3. Iniciando o Servidor Embutido do PHP
Abra o terminal na pasta raiz do projeto e execute o comando:
```bash
php -S localhost:8000
```

### 4. Acessando a Aplicação
Abra o seu navegador e acesse: [http://localhost:8000](http://localhost:8000)

---

## 🔑 Credenciais para Teste

Um usuário administrador já vem configurado por padrão ao rodar o script `init.sql`:

- **Usuário:** `admin`
- **Senha:** `admin123`

*(Nota de segurança: No primeiro acesso, o sistema converterá automaticamente esta senha pura do banco de dados para um Hash seguro usando `bcrypt` (`password_hash`), simulando um fluxo real de migração/primeiro acesso de sistema).*

---

## 🌟 Principais Funcionalidades & UX

1. **Dark Mode:** Tema claro/escuro integrado para conforto visual, salvando a preferência do usuário.
2. **Visualizador de Imagens (Lightbox):** Ao clicar na miniatura de qualquer carta na tabela, a imagem se expande em alta resolução.
3. **Filtros Avançados:** Filtre as cartas simultaneamente por **Nome**, **Jogo** (Magic, Pokémon, Yu-Gi-Oh!), **Edição** e **Raridade**. As raridades e edições se adaptam dinamicamente ao jogo selecionado.
4. **Feedback Visual (Toast Alerts):** Operações CRUD exibem notificações discretas e elegantes sem recarregar a página.
5. **Modal de Confirmação:** Previne a exclusão acidental de cartas com um alerta claro e customizado.
