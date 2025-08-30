document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById('post-container');
    const postTitle = document.getElementById('post-title');

    // Pegar o parâmetro 'file' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    if (!fileName) {
        postContainer.innerHTML = '<div class="error">Post não encontrado. <a href="index.html">Voltar para Home</a></div>';
        return;
    }

    // Carregar o post
    fetch(`posts/${fileName}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Não foi possível encontrar o arquivo: ${fileName}.md`);
            }
            return response.text();
        })
        .then(markdown => {
            // Extrair o título do markdown
            const lines = markdown.split('\n');
            let title = fileName; // fallback
            
            for (let line of lines) {
                if (line.trim().startsWith('# ')) {
                    title = line.substring(2);
                    break;
                }
            }

            // Atualizar o título da página
            document.title = `${title} - Meu Blog`;
            postTitle.textContent = title;

            // Converter markdown para HTML
            const htmlContent = marked.parse(markdown);
            
            // Criar o elemento do post
            const postElement = document.createElement('article');
            postElement.classList.add('post-full');
            postElement.innerHTML = htmlContent;
            
            postContainer.innerHTML = '';
            postContainer.appendChild(postElement);
        })
        .catch(error => {
            console.error('Erro ao carregar o post:', error);
            postContainer.innerHTML = `
                <div class="error">
                    <h2>Erro ao carregar o post</h2>
                    <p>Ocorreu um erro ao carregar o post: ${fileName}</p>
                    <a href="index.html" class="back-link">← Voltar para Home</a>
                </div>
            `;
        });
});
