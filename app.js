document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');

    // IMPORTANTE: Adicione o nome dos seus arquivos .md aqui
    const postFiles = [
        'primeiro-post.md',
        'segundo-post.md'
    ];

    // Inverte a ordem para que os posts mais recentes apareçam primeiro
    const reversedPostFiles = postFiles.slice().reverse();

    reversedPostFiles.forEach(file => {
        fetch(`posts/${file}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível encontrar o arquivo: ${file}`);
                }
                return response.text();
            })
            .then(markdown => {
                // Extrair o título do markdown (primeira linha que começa com #)
                const lines = markdown.split('\n');
                let title = file.replace('.md', ''); // fallback
                let excerpt = '';
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('# ')) {
                        title = line.substring(2);
                        // Pegar as próximas linhas para o excerpt (até 3 linhas de texto)
                        excerpt = lines.slice(i + 1, i + 4)
                            .filter(line => line.trim() && !line.startsWith('#'))
                            .join(' ')
                            .substring(0, 150) + '...';
                        break;
                    }
                }

                // Criar card do post
                const postCard = document.createElement('article');
                postCard.classList.add('post-card');
                
                const fileName = file.replace('.md', '');
                postCard.innerHTML = `
                    <div class="post-card-content">
                        <h2 class="post-title">${title}</h2>
                        <p class="post-excerpt">${excerpt}</p>
                        <a href="post.html?file=${fileName}" class="read-more-btn">Ler mais</a>
                    </div>
                `;
                
                postsContainer.appendChild(postCard);
            })
            .catch(error => {
                console.error('Erro ao carregar o post:', error);
                const errorElement = document.createElement('article');
                errorElement.classList.add('post-card');
                errorElement.innerHTML = `<p>Ocorreu um erro ao carregar o post: ${file}. Verifique o console para mais detalhes.</p>`;
                postsContainer.appendChild(errorElement);
            });
    });
});
