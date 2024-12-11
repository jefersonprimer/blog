document.getElementById('search-input').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase(); // Obtém o termo de pesquisa digitado
  const postsContainer = document.getElementById('posts-container'); // Container dos posts
  const posts = Array.from(postsContainer.querySelectorAll('.card')); // Obtém todos os posts como array

  // Se o termo de pesquisa for vazio, exibe todos os posts novamente
  if (!searchTerm) {
    posts.forEach(post => post.style.display = 'block');
    return;
  }

  // Filtra os posts que contêm o termo de pesquisa
  const matchingPosts = posts.filter(post => {
    const postTitle = post.querySelector('h1').textContent.toLowerCase();
    const postContent = post.querySelector('p').textContent.toLowerCase();
    const postTags = post.querySelector('.data span').textContent.toLowerCase();
    
    return postTitle.includes(searchTerm) || postContent.includes(searchTerm) || postTags.includes(searchTerm);
  });

  // Oculta todos os posts
  posts.forEach(post => post.style.display = 'none');
  
  // Exibe apenas os posts que correspondem à pesquisa
  matchingPosts.forEach(post => post.style.display = 'block');
});
