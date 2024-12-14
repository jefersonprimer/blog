/* Garantir que o header ocupe 100% da largura */
header {
  width: 100%;
  display: flex;
  justify-content: center;  /* Centraliza todo o conteúdo */
  align-items: center;  /* Alinha verticalmente o conteúdo */
}

/* Navbar que envolve todos os itens */
.navbar {
  display: flex;
  justify-content: space-between; /* Espaço entre logo, input e links */
  align-items: center;  /* Alinha todos os itens verticalmente */
  width: 100%;  /* Ocupa a largura total */
  max-width: 1200px;  /* Limita a largura total do navbar */
  padding: 0 20px;  /* Espaçamento nas laterais */
}

/* Logo à esquerda */
.logo {
  flex: 0 0 auto;  /* Impede que o logo se redimensione */
}

/* Container do input de busca no meio */
.search-container {
  display: flex;
  justify-content: center;  /* Centraliza o input horizontalmente */
  padding: 0 20px;  /* Espaçamento nas laterais */
  flex-grow: 1;  /* Faz o input ocupar o máximo de espaço possível */
  max-width: 500px;  /* Limita a largura máxima do input */
}

/* Alinha os links à direita */
.nav-links {
  display: flex;
  gap: 20px;
  justify-content: flex-end; /* Alinha os links à direita */
  flex: 0 0 auto;  /* Impede que os links sejam redimensionados */
}

/* Estilos adicionais para o input */
.search-container input {
  width: 100%;  /* Faz o input de busca ocupar a largura do container */
  max-width: 400px;  /* Limita a largura máxima do input */
}
