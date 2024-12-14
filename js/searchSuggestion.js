document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const helpButton = document.getElementById("helpButton");
  const message = document.getElementById("message");
  const suggestionsList = document.getElementById("suggestionsList");

  // Dados de exemplo (tags dos posts)
  const tags = [
    "Java Spring",
    "JavaScript",
    "React",
    "Node.js",
    "Angular",
    "Python",
    "Ruby on Rails",
    "C# .NET"
  ];

  // Função para expandir o campo de pesquisa
  searchInput.addEventListener("focus", function() {
    searchInput.classList.add("expanded"); // Expande o campo
    message.style.display = "none"; // Esconde a mensagem de ajuda
    suggestionsList.classList.add("active"); // Exibe a lista de sugestões
  });

  // Função para reduzir o campo de pesquisa
  searchInput.addEventListener("blur", function() {
    if (searchInput.value === "") {
      searchInput.classList.remove("expanded"); // Remove a expansão
      suggestionsList.classList.remove("active"); // Esconde as sugestões
    }
  });

  // Função para mostrar a mensagem de ajuda quando clicar no ícone "?"
  helpButton.addEventListener("click", function() {
    if (message.style.display === "block") {
      message.style.display = "none";
    } else {
      message.style.display = "block";
    }
  });

  // Função para mostrar sugestões conforme a pesquisa
  searchInput.addEventListener("input", function() {
    const query = searchInput.value.trim().toLowerCase();

    // Limpa a lista de sugestões a cada input
    suggestionsList.innerHTML = '';

    // Esconde a mensagem de ajuda se começar a digitar no campo
    message.style.display = "none";

    // Exibe sugestões somente se a pesquisa tiver 3 ou mais caracteres
    if (query.length >= 3) {
      const filteredTags = tags.filter(tag => tag.toLowerCase().includes(query));
      
      if (filteredTags.length > 0) {
        filteredTags.forEach(function(tag) {
          const suggestionItem = document.createElement("li");
          suggestionItem.textContent = tag;
          suggestionsList.appendChild(suggestionItem);

          // Quando o usuário clica em uma sugestão, preenche o campo de pesquisa
          suggestionItem.addEventListener("click", function() {
            searchInput.value = tag;
            suggestionsList.classList.remove("active");
          });
        });
      } else {
        const noResultsItem = document.createElement("li");
        noResultsItem.textContent = "Nenhuma sugestão encontrada.";
        suggestionsList.appendChild(noResultsItem);
      }
    } else {
      suggestionsList.classList.remove("active"); // Remove sugestões se não houver caracteres suficientes
    }
  });

  // Fechar sugestões e mensagem ao clicar fora do campo de pesquisa
  document.addEventListener("click", function(event) {
    if (!searchInput.contains(event.target) && !helpButton.contains(event.target)) {
      suggestionsList.classList.remove("active");
      message.style.display = "none";
    }
  });
});
