document.addEventListener('DOMContentLoaded', () => {
    const tagNameElement = document.getElementById('tag-name');
    const tagPostsContainer = document.getElementById('tag-posts-container');
    const loadMoreButton = document.getElementById('load-more-button');

    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

    let filteredPosts = [];
    const postsPerPage = 6;
    let currentPage = 0;

    // Função para renderizar os posts
    function renderTagPosts(postsToRender) {
        postsToRender.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');

            postCard.innerHTML = `
                <a href="post.html?file=${post.id}" class="post-card-content">
                    <div class="post-image">
                        <img src="${post.coverImage}" alt="${post.title}" class="post-cover">
                    </div>
                    <div class="post-info">
                        <div class="post-meta">
                            <span class="post-date">${post.date}</span>
                            <div class="post-tags">
                                ${post.tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <h2 class="post-title">${post.title}</h2>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <div class="post-author">
                            <img src="${post.author.image}" alt="${post.author.name}" class="author-image">
                            <div class="author-info">
                                <span class="author-name">${post.author.name}</span>
                                <span class="author-profession">${post.author.profession}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;

            const tags = postCard.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const tagName = tag.dataset.tag;
                    window.location.href = `tag.html?tag=${tagName}`;
                });
            });

            tagPostsContainer.appendChild(postCard);
        });
    }

    // Função para exibir os posts iniciais da tag
    function displayInitialTagPosts() {
        const initialPosts = filteredPosts.slice(0, postsPerPage);
        renderTagPosts(initialPosts);
        currentPage = 1;
        checkLoadMoreButtonVisibility();
    }

    // Função para carregar mais posts da tag
    function loadMoreTagPosts() {
        const startIndex = currentPage * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToLoad = filteredPosts.slice(startIndex, endIndex);
        renderTagPosts(postsToLoad);
        currentPage++;
        checkLoadMoreButtonVisibility();
    }

    // Função para verificar a visibilidade do botão "Carregar Mais"
    function checkLoadMoreButtonVisibility() {
        if (currentPage * postsPerPage >= filteredPosts.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }

    if (tag) {
        tagNameElement.textContent = `Posts Em: ${tag}`;
        document.title = `Posts Em: ${tag} - Blog | Blog Jeferson Primer | Dev`;

        fetch('posts.json')
            .then(response => response.json())
            .then(data => {
                filteredPosts = data.posts.filter(post => post.tags && post.tags.includes(tag));
                if (filteredPosts.length > 0) {
                    displayInitialTagPosts();
                } else {
                    tagPostsContainer.innerHTML = '<p>Nenhum post encontrado com esta tag.</p>';
                    loadMoreButton.style.display = 'none'; // Hide button if no posts
                }
            })
            .catch(error => {
                console.error('Erro ao carregar posts:', error);
                tagPostsContainer.innerHTML = '<p>Erro ao carregar posts. Tente novamente mais tarde.</p>';
                loadMoreButton.style.display = 'none'; // Hide button on error
            });

        loadMoreButton.addEventListener('click', loadMoreTagPosts);

    } else {
        tagNameElement.textContent = 'Nenhuma tag especificada';
        loadMoreButton.style.display = 'none'; // Hide button if no tag specified
    }
});