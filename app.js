let postsData = []; 
let allPosts = [];
const postsPerPage = 6;
let currentPage = 0;

const loadingElement = document.querySelector("#loading");

// Função para renderizar os posts (mantida para a página principal)
function renderPosts(postsToRender) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsToRender.forEach(post => {
        const postCard = document.createElement('article');
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

        postsContainer.appendChild(postCard);
    });
}

// Função para carregar os posts do JSON
async function loadPosts() {
    try {
        const response = await fetch('posts.json');

        
        if (!response.ok) {
            throw new Error('Não foi possível carregar posts.json');
        }
        const data = await response.json();
        
        allPosts = data.posts.slice().reverse();
        
        for (const post of allPosts) {
            const markdownResponse = await fetch(`posts/${post.fileName}`);
            if (markdownResponse.ok) {
                const markdown = await markdownResponse.text();
                post.content = markdown.toLowerCase();
            }
            postsData.push(post);
       
        }

        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            displayInitialPosts();
        }
    } catch (error) {
        console.error('Erro ao carregar os posts:', error);
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            const errorElement = document.createElement('article');
            errorElement.classList.add('post-card');
            errorElement.innerHTML = `<p>Ocorreu um erro ao carregar os posts. Verifique o console para mais detalhes.</p>`;
            postsContainer.appendChild(errorElement);
        }
    }
}

// Função para exibir os posts iniciais
function displayInitialPosts() {
    const loadMoreButton = document.getElementById('load-more-button');
    const initialPosts = allPosts.slice(0, postsPerPage);
    renderPosts(initialPosts);
    currentPage = 1;
    checkLoadMoreButtonVisibility(loadMoreButton);
}

// Função para carregar mais posts
function loadMorePosts() {
    const loadMoreButton = document.getElementById('load-more-button');
    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToLoad = allPosts.slice(startIndex, endIndex);
    renderPosts(postsToLoad);
    currentPage++;
    checkLoadMoreButtonVisibility(loadMoreButton);
}

// Função para verificar a visibilidade do botão "Carregar Mais"
function checkLoadMoreButtonVisibility(loadMoreButton) {
    if (!loadMoreButton) return;
    if (currentPage * postsPerPage >= allPosts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

// Função para abrir o modal de pesquisa
function openSearchModal(searchModal, searchInput) {
    searchModal.classList.add('show');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
}

// Função para controlar a visibilidade da dica de pesquisa
function toggleSearchHint(value, searchHint) {
    if (!searchHint) return;
    if (value.length >= 3) {
        searchHint.classList.add('hidden');
    } else {
        searchHint.classList.remove('hidden');
    }
}

// Função para fechar o modal de pesquisa
function closeSearchModalFunc(searchModal, searchInput, searchResults, searchHint) {
    searchModal.classList.remove('show');
    searchInput.value = '';
    searchResults.innerHTML = '';
    if (searchHint) searchHint.classList.remove('hidden');
    document.body.style.overflow = '';
}

// Função para pesquisar posts
function searchPosts(query, searchResults, searchHint) {
    if (!query.trim() || query.length < 3) {
        searchResults.innerHTML = '';
        if (searchHint) searchHint.classList.remove('hidden');
        return;
    }

    const searchTerm = query.toLowerCase();
    const results = postsData.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        (post.content && post.content.includes(searchTerm))
    );

    displaySearchResults(results, searchResults);
}

// Função para exibir os resultados da pesquisa
function displaySearchResults(results, searchResults) {
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

    const resultItems = searchResults.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const postId = item.dataset.file;
            const searchModal = document.getElementById('search-modal');
            const searchInput = document.getElementById('search-input');
            const searchResults = document.getElementById('search-results');
            const searchHint = document.getElementById('search-hint');
            closeSearchModalFunc(searchModal, searchInput, searchResults, searchHint);
            window.location.href = `post.html?file=${postId}`;
        });
    });
}

// Função para inicializar o modal de pesquisa
function initializeSearchModal() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchTriggerMobile = document.getElementById('search-trigger-mobile');
    const searchModal = document.getElementById('search-modal');
    const closeSearchModal = document.getElementById('close-search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchHint = document.getElementById('search-hint');

    if (searchModal && closeSearchModal && searchInput && searchResults) {
        const openModal = () => openSearchModal(searchModal, searchInput);

        if (searchTrigger) {
            searchTrigger.addEventListener('click', openModal);
        }
        if (searchTriggerMobile) {
            searchTriggerMobile.addEventListener('click', openModal);
        }

        closeSearchModal.addEventListener('click', () => closeSearchModalFunc(searchModal, searchInput, searchResults, searchHint));
        
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeSearchModalFunc(searchModal, searchInput, searchResults, searchHint);
            }
        });

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value;
            toggleSearchHint(value, searchHint);
            searchPosts(value, searchResults, searchHint);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearchModalFunc(searchModal, searchInput, searchResults, searchHint);
            }
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearchModal(searchModal, searchInput);
            }
        });
        console.log('Search modal initialized.');
    } else {
        console.log('Search modal elements not found, retrying...');
    }
}

// Observador para garantir que o modal de pesquisa seja inicializado quando os elementos estiverem disponíveis
const observer = new MutationObserver((mutationsList, observer) => {
    if (document.getElementById('search-trigger') && document.getElementById('search-modal')) {
        initializeSearchModal();
        observer.disconnect();
    }
});

// Iniciar observação no corpo do documento para mudanças na subárvore
observer.observe(document.body, { childList: true, subtree: true });

loadPosts();

// Event listener para o botão "Carregar Mais" na página principal
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreButton = document.getElementById('load-more-button');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMorePosts);
    }
});

// Hamburger menu logic
const hamburgerMenu = document.getElementById('hamburger-menu');
const mobileNavMenu = document.getElementById('mobile-nav-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

if (hamburgerMenu && mobileNavMenu) {
    hamburgerMenu.addEventListener('click', () => {
        const isActive = mobileNavMenu.classList.toggle('active');
        hamburgerIcon.style.display = isActive ? 'none' : 'block';
        closeIcon.style.display = isActive ? 'block' : 'none';
        document.body.classList.toggle('no-scroll');
    });

    mobileNavMenu.querySelectorAll('.link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!mobileNavMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileNavMenu.classList.contains('active')) {
            mobileNavMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavMenu.classList.contains('active')) {
            mobileNavMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    });
}
