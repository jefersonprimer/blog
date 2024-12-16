<script>
  window.onload = function () {
    // Obter o valor do postId da URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Seletor do main onde vamos substituir o conteúdo
    const mainContainer = document.querySelector("#post-main");

    // Variável para armazenar o conteúdo dinâmico do post
    let postContent = "";
    let postTitle = ""; // Variável para armazenar o título do post

    // Lógica para gerar o conteúdo baseado no postId
    if (postId === "1") {
      postTitle = "Primeiros Passos no Spring Boot";
      postContent = `
        <main class="container mt-5">
          <div class="post-detalhes">
            <p class="product-path">
              <i class="fas fa-chevron-right"></i> <a href="index.html">Home</a> / <a href="#">Java</a> / <a href="#">Spring</a> / ${postTitle}
            <hr>
            </p>

            <h1>${postTitle}</h1>
            <div class="meu-perfil">
              <a href="https://jefersonprimer.github.com">
                <div class="meu-perfil">
                  <img src="/images_home/profile.jpg" alt="Foto de perfil" />
                  <div class="perfil-info">
                    <h1>Jeferson Primer</h1>
                    <p>Engenheiro de Software</p>
                  </div>
                </div>
              </a>
            </div>
            <hr>

            <p><strong>Data:</strong> 24 de agosto de 2024</p>
            <div class="container content">
              <article>
                <h1>Introdução ao Spring Boot</h1>
                <p>Spring Boot é um framework poderoso...</p>
              </article>
            </div>
          </div>
        </main>
      `;
    } else if (postId === "2") {
      postTitle = "Guia Iniciante sobre o Single Thread e Event Loop em JavaScript";
      postContent = `
        <main class="container mt-5">
          <div class="post-detalhes">
            <p class="product-path">
              <i class="fas fa-chevron-right"></i> <a href="index.html">Home</a> / <a href="#">JavaScript</a> / <a href="#">Event Loop</a> / ${postTitle}
            <hr>
            </p>

            <h1>${postTitle}</h1>
            <div class="meu-perfil">
              <a href="https://jefersonprimer.github.com">
                <div class="meu-perfil">
                  <img src="/images_home/profile.jpg" alt="Foto de perfil" />
                  <div class="perfil-info">
                    <h1>Jeferson Primer</h1>
                    <p>Engenheiro de Software</p>
                  </div>
                </div>
              </a>
            </div>
            <hr>
          </div>
        </main>
      `;
    } else {
      postTitle = "Post não encontrado";
      postContent = `<h1>${postTitle}</h1>`;
    }

    // Atualizar o conteúdo do main e o título da página
    mainContainer.innerHTML = postContent;
    document.title = `${postTitle} | Jeferson Primer | Dev`;
  };
</script>
