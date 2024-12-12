// Função para filtrar os posts
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    const filter = this.getAttribute('data-filter'); // Pega o filtro selecionado
    const posts = document.querySelectorAll('.card'); // Pega todos os posts

    posts.forEach(post => {
      const tags = post.getAttribute('data-tags').split(' '); // Pega as tags do post

      // Se o filtro for "all", mostra todos os posts
      if (filter === 'all') {
        post.style.display = 'block';
      } else {
        // Se o post tiver a tag correspondente ao filtro, mostra ele
        if (tags.includes(filter)) {
          post.style.display = 'block';
        } else {
          post.style.display = 'none';
        }
      }
    });
  });
});
