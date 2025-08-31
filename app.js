document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const closeSearchModal = document.getElementById('close-search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchHint = document.getElementById('search-hint');

    // Array para armazenar os dados dos posts para pesquisa
    let postsData = [];

    // Função para carregar os posts do JSON
    async function loadPosts() {
        try {
            // Carregar o arquivo JSON com os metadados dos posts
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error('Não foi possível carregar posts.json');
            }
            const data = await response.json();
            
            // Inverte a ordem para que os posts mais recentes apareçam primeiro
            const posts = data.posts.slice().reverse();
            
            for (const post of posts) {
                // Carregar o conteúdo Markdown para pesquisa
                const markdownResponse = await fetch(`posts/${post.fileName}`);
                if (markdownResponse.ok) {
                    const markdown = await markdownResponse.text();
                    post.content = markdown.toLowerCase(); // Para pesquisa no conteúdo
                }
                
                // Armazenar dados para pesquisa
                postsData.push(post);

                // Criar card do post com novo layout
                const postCard = document.createElement('article');
                postCard.classList.add('post-card');
                
                postCard.innerHTML = `
                    <div >
                        <a href="post.html?file=${post.id}" class="post-card-content">
                            <div class="post-image">
                                <img src="${post.coverImage}" alt="${post.title}" class="post-cover">
                            </div>
                            <div class="post-info">
                                <div class="post-meta">
                                    <span class="post-date">${post.date}</span>
                                    <div class="post-tags">
                                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
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
                    </div>
                `;
                
                postsContainer.appendChild(postCard);
            }
        } catch (error) {
            console.error('Erro ao carregar os posts:', error);
            const errorElement = document.createElement('article');
            errorElement.classList.add('post-card');
            errorElement.innerHTML = `<p>Ocorreu um erro ao carregar os posts. Verifique o console para mais detalhes.</p>`;
            postsContainer.appendChild(errorElement);
        }
    }

    // Função para abrir o modal de pesquisa
    function openSearchModal() {
        searchModal.classList.add('show');
        searchInput.focus();
        document.body.style.overflow = 'hidden'; // Previne scroll da página
    }

    // Função para controlar a visibilidade da dica de pesquisa
    function toggleSearchHint(value) {
        if (value.length >= 3) {
            searchHint.classList.add('hidden');
        } else {
            searchHint.classList.remove('hidden');
        }
    }

    // Função para fechar o modal de pesquisa
    function closeSearchModalFunc() {
        searchModal.classList.remove('show');
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchHint.classList.remove('hidden'); // Mostra a dica novamente
        document.body.style.overflow = ''; // Restaura scroll da página
    }

    // Função para pesquisar posts
    function searchPosts(query) {
        if (!query.trim() || query.length < 3) {
            searchResults.innerHTML = '';
            return;
        }

        const searchTerm = query.toLowerCase();
        const results = postsData.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            (post.content && post.content.includes(searchTerm))
        );

        displaySearchResults(results);
    }

    // Função para exibir os resultados da pesquisa
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Nenhum post encontrado com esses termos.</div>';
            return;
        }

        searchResults.innerHTML = results.map(post => `
            <div class="search-result-item" data-file="${post.id}">
                <h3 class="search-result-title">${post.title}</h3>
                <p class="search-result-excerpt">${post.excerpt}</p>
            </div>
        `).join('');

        // Adicionar eventos de clique nos resultados
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const postId = item.dataset.file;
                closeSearchModalFunc();
                window.location.href = `post.html?file=${postId}`;
            });
        });
    }

    // Event Listeners
    searchTrigger.addEventListener('click', openSearchModal);
    closeSearchModal.addEventListener('click', closeSearchModalFunc);
    
    // Fechar modal ao clicar fora dele
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearchModalFunc();
        }
    });

    // Pesquisa em tempo real
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        toggleSearchHint(value);
        searchPosts(value);
    });

    // Navegação com teclado
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearchModalFunc();
        }
    });

    // Mapeamento da tecla Ctrl+K para abrir o modal de pesquisa
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault(); // Previne o comportamento padrão do navegador
            openSearchModal();
        }
    });

    // Carregar os posts
    loadPosts();
});
