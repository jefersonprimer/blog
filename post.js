document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById('post-container');
    const breadcrumbList = document.getElementById('breadcrumb-list');

    // Pegar o parâmetro 'file' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('file');
    console.log('postId:', postId);

    if (!postId) {
        postContainer.innerHTML = '<div class="error">Post não encontrado. <a href="index.html">Voltar para Home</a></div>';
        return;
    }

    // Função para criar o breadcrumb dinâmico
    function createBreadcrumb(postData) {
        try {
            console.log('Criando breadcrumb com dados:', postData);
            console.log('Tags disponíveis:', postData.tags);
            console.log('Título do post:', postData.title);
            
            // Limpar breadcrumb existente (exceto o primeiro item - Home)
            const homeItem = breadcrumbList.querySelector('.breadcrumb-item');
            breadcrumbList.innerHTML = '';
            breadcrumbList.appendChild(homeItem);

            // Adicionar separador após Home
            const separator1 = document.createElement('li');
            separator1.className = 'breadcrumb-item';
            separator1.innerHTML = `
                <svg class="breadcrumb-separator" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
                </svg>
            `;
            breadcrumbList.appendChild(separator1);

            // Adicionar todas as tags como categorias
            if (postData.tags && postData.tags.length > 0) {
                console.log('Adicionando todas as tags:', postData.tags);
                
                postData.tags.forEach((tag, index) => {
                    // Adicionar tag
                    const categoryItem = document.createElement('li');
                    categoryItem.className = 'breadcrumb-item';
                    categoryItem.innerHTML = `
                        <a href="tag.html?tag=${tag}" class="breadcrumb-category">${tag}</a>
                    `;
                    breadcrumbList.appendChild(categoryItem);
                    console.log(`Tag ${index + 1} adicionada ao DOM:`, categoryItem.outerHTML);

                    // Adicionar separador após cada tag (exceto a última)
                    if (index < postData.tags.length - 1) {
                        const separator = document.createElement('li');
                        separator.className = 'breadcrumb-item';
                        separator.innerHTML = `
                            <svg class="breadcrumb-separator" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
                            </svg>
                        `;
                        breadcrumbList.appendChild(separator);
                        console.log(`Separador adicionado após tag ${index + 1}`);
                    }
                });
            } else {
                console.log('Nenhuma tag encontrada para o post');
            }

            // Adicionar separador após as tags (antes do título)
            if (postData.tags && postData.tags.length > 0) {
                const finalSeparator = document.createElement('li');
                finalSeparator.className = 'breadcrumb-item';
                finalSeparator.innerHTML = `
                    <svg class="breadcrumb-separator" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
                    </svg>
                `;
                breadcrumbList.appendChild(finalSeparator);
                console.log('Separador final adicionado após todas as tags');
            }

            // Adicionar título do post
            console.log('Adicionando título:', postData.title);
            const titleItem = document.createElement('li');
            titleItem.className = 'breadcrumb-item';
            titleItem.innerHTML = `
                <span class="breadcrumb-title" aria-current="crumb">${postData.title}</span>
            `;
            breadcrumbList.appendChild(titleItem);
            
            console.log('Breadcrumb criado com sucesso');
            console.log('HTML final do breadcrumb:', breadcrumbList.innerHTML);
        } catch (error) {
            console.error('Erro ao criar breadcrumb:', error);
        }
    }

    // Função para carregar o post diretamente
    function loadPostDirectly() {
        console.log('Carregando post diretamente...');
        const filePath = `posts/${postId}.md`;
        console.log('Tentando carregar arquivo:', filePath);
        
        return fetch(filePath)
            .then(response => {
                console.log('Resposta do fetch:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Não foi possível encontrar o arquivo: ${postId}.md (Status: ${response.status})`);
                }
                return response.text();
            })
            .then(markdown => {
                console.log('Markdown carregado, tamanho:', markdown.length, 'caracteres');
                
                // Extrair o título do markdown
                const lines = markdown.split('\n');
                let title = postId; // fallback
                
                for (let line of lines) {
                    if (line.trim().startsWith('## ')) {
                        title = line.substring(3);
                        console.log('Título encontrado (##):', title);
                        break;
                    } else if (line.trim().startsWith('# ')) {
                        title = line.substring(2);
                        console.log('Título encontrado (#):', title);
                        break;
                    }
                }

                // Atualizar o título da página
                document.title = `${title} - Meu Blog`;
                console.log('Título da página atualizado:', document.title);

                // Converter markdown para HTML
                const htmlContent = marked.parse(markdown);
                console.log('HTML gerado, tamanho:', htmlContent.length, 'caracteres');
                
                // Criar a estrutura do post com título, autor e data
                const postWrapper = document.createElement('div');
                postWrapper.classList.add('post-wrapper');
                
                // Adicionar título
                const titleElement = document.createElement('h1');
                titleElement.classList.add('post-title');
                titleElement.textContent = title;
                postWrapper.appendChild(titleElement);
                
                // Adicionar seção do autor e data
                const authorSection = document.createElement('div');
                authorSection.classList.add('author-section');
                
                // Informações do autor (serão preenchidas depois com dados do JSON)
                authorSection.innerHTML = `
                    <div class="author-info">
                        <img src="./image/about-me.png" alt="Autor" class="author-image" id="author-image">
                        <div class="author-details">
                            <h3 class="author-name" id="author-name">Jeferson Primer</h3>
                            <p class="author-profession" id="author-profession">Autor</p>
                        </div>
                    </div>
                    <div class="post-date" >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            aria-hidden="true" 
                            data-slot="icon" 
                            id="icon-calendar"
                        >
                            <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd"></path>
                        </svg>
                        <span id="post-date"></span>
                    </div>
                `;
                
                postWrapper.appendChild(authorSection);
                
                // Criar o elemento do post
                const postElement = document.createElement('article');
                postElement.classList.add('post-full');
                postElement.innerHTML = htmlContent;
                
                postWrapper.appendChild(postElement);
                
                postContainer.innerHTML = '';
                postContainer.appendChild(postWrapper);
                console.log('Post adicionado ao DOM');

                return title; // Retornar o título para usar no breadcrumb
            });
    }

    // Primeiro, tentar carregar o post diretamente
    loadPostDirectly()
        .then((title) => {
            console.log('Post carregado com sucesso, título:', title);
            
            // Se o post foi carregado com sucesso, tentar carregar o JSON para o breadcrumb
            return fetch('posts.json')
                .then(response => {
                    console.log('Resposta do JSON:', response.status, response.statusText);
                    if (!response.ok) {
                        throw new Error('Não foi possível carregar posts.json');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Dados do JSON carregados:', data);
                    const postData = data.posts.find(post => post.id === postId);
                    
                    if (postData) {
                        console.log('Post encontrado no JSON:', postData);
                        console.log('Tags do post:', postData.tags);
                        
                        // Atualizar informações do autor e data
                        const authorImage = document.getElementById('author-image');
                        const authorName = document.getElementById('author-name');
                        const authorProfession = document.getElementById('author-profession');
                        const postDate = document.getElementById('post-date');
                        
                        if (authorImage && postData.author && postData.author.image) {
                            authorImage.src = postData.author.image;
                        }
                        if (authorName && postData.author && postData.author.name) {
                            authorName.textContent = postData.author.name;
                        }
                        if (authorProfession && postData.author && postData.author.profession) {
                            authorProfession.textContent = postData.author.profession;
                        }
                        if (postDate && postData.date) {
                            postDate.textContent = postData.date;
                        }
                        
                        createBreadcrumb(postData);
                    } else {
                        console.log('Post não encontrado no JSON, usando breadcrumb simples');
                        // Criar breadcrumb simples com apenas o título
                        const homeItem = breadcrumbList.querySelector('.breadcrumb-item');
                        breadcrumbList.innerHTML = '';
                        breadcrumbList.appendChild(homeItem);

                        const separator = document.createElement('li');
                        separator.className = 'breadcrumb-item';
                        separator.innerHTML = `
                            <svg class="breadcrumb-separator" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
                            </svg>
                        `;
                        breadcrumbList.appendChild(separator);

                        const titleItem = document.createElement('li');
                        titleItem.className = 'breadcrumb-item';
                        titleItem.innerHTML = `
                            <span class="breadcrumb-title" aria-current="crumb">${title}</span>
                        `;
                        breadcrumbList.appendChild(titleItem);
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar JSON para breadcrumb:', error);
                    // Criar breadcrumb simples se o JSON falhar
                    const homeItem = breadcrumbList.querySelector('.breadcrumb-item');
                    breadcrumbList.innerHTML = '';
                    breadcrumbList.appendChild(homeItem);

                    const separator = document.createElement('li');
                    separator.className = 'breadcrumb-item';
                    separator.innerHTML = `
                        <svg class="breadcrumb-separator" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
                        </svg>
                    `;
                    breadcrumbList.appendChild(separator);

                    const titleItem = document.createElement('li');
                    titleItem.className = 'breadcrumb-item';
                    titleItem.innerHTML = `
                        <span class="breadcrumb-title" aria-current="crumb">${title}</span>
                    `;
                    breadcrumbList.appendChild(titleItem);
                });
        })
        .catch(error => {
            console.error('Erro ao carregar post:', error);
            console.error('Stack trace:', error.stack);
            postContainer.innerHTML = `
                <div class="error">
                    <h2>Erro ao carregar o post</h2>
                    <p>Ocorreu um erro ao carregar o post: ${postId}</p>
                    <p>Detalhes do erro: ${error.message}</p>
                    <p>Verifique o console para mais informações.</p>
                    <a href="index.html" class="back-link">← Voltar para Home</a>
                </div>
            `;
        });
});
