// Script para alternar entre o ícone do hambúrguer e o "X" e exibir a sobreposição com links
document.getElementById('hamburger-btn').addEventListener('click', function() {
  var overlay = document.getElementById('menu-overlay');
  var togglerIcon = this.querySelector('.navbar-toggler-icon');

  // Alterna a classe 'show' para exibir ou esconder a sobreposição
  overlay.classList.toggle('show');

  // Altera o ícone de hambúrguer para 'X'
  if (overlay.classList.contains('show')) {
    togglerIcon.classList.add('close-icon'); // Mostra o 'X'
  } else {
    togglerIcon.classList.remove('close-icon'); // Volta ao hambúrguer
  }
});

// Fechar a sobreposição quando clicar no "X"
document.querySelector('.overlay').addEventListener('click', function(event) {
  // Verifica se a área clicada é a própria sobreposição (não em um link ou conteúdo)
  if (event.target === this) {
    var overlay = document.getElementById('menu-overlay');
    var togglerIcon = document.getElementById('hamburger-btn').querySelector('.navbar-toggler-icon');
    
    overlay.classList.remove('show'); // Fecha a sobreposição
    togglerIcon.classList.remove('close-icon'); // Volta ao ícone de hambúrguer
  }
});
