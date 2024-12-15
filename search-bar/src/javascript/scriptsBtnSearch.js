// Seleciona o input de busca e outros elementos
const searchInput = document.getElementById('search');
const inputGroup = document.querySelector('.input-group');
const helpLabel = document.getElementById('help-label');
const message = document.getElementById('message');
const items = document.querySelectorAll('.items .item'); // Seleciona todos os itens
const noResults = document.getElementById('no_results'); // Seleciona o elemento da mensagem "nenhum resultado"

// Evento para quando o usuário digitar no campo de busca
searchInput.addEventListener('focus', () => {
    inputGroup.classList.add('active');  // Expande o campo de pesquisa
    helpLabel.style.opacity = '1'; // Exibe a label de ajuda
    message.style.opacity = '0';  // Inicialmente oculta a mensagem
    message.style.transform = 'translateY(-10px)';  // Inicialmente oculta a mensagem
});

// Evento para quando o usuário sair do campo de busca (perde o foco)
searchInput.addEventListener('blur', () => {
    if (searchInput.value === '') {
        inputGroup.classList.remove('active'); // Encolhe o campo de pesquisa
        helpLabel.style.opacity = '0'; // Oculta a label de ajuda
        message.style.opacity = '0';  // Oculta a mensagem de ajuda
        message.style.transform = 'translateY(-10px)';  // Oculta a mensagem
    }
});

// Quando o usuário interagir com o input, esta função será executada
searchInput.addEventListener('input', (event) => {
    const value = formatString(event.target.value); // Armazena e formata o valor do input
    let hasResults = false; // Indica se há resultados correspondentes

    // Se o valor do input for "?", exibe a mensagem de ajuda
    if (value === '?') {
        message.textContent = 'Digite 3 ou mais caracteres para começar a busca';
        message.style.opacity = '1';
        message.style.transform = 'translateY(10px)';
    } else {
        message.style.opacity = '0';
        message.style.transform = 'translateY(-10px)';
    }

    // Se o valor tiver 3 ou mais caracteres, inicia a busca
    if (value.length >= 3 && value !== '?') {
        items.forEach(item => {
            const itemTitle = formatString(item.querySelector('.item-title').textContent); // Formata o texto do título
            const itemDescription = formatString(item.querySelector('.item-description').textContent); // Formata o texto da descrição

            // Se o valor digitado está contido no título ou na descrição
            if (itemTitle.indexOf(value) !== -1 || itemDescription.indexOf(value) !== -1) {
                item.style.display = 'flex'; // Exibe o item
                hasResults = true; // Indica que há resultados
            } else {
                item.style.display = 'none'; // Oculta o item
            }
        });

        // Exibe ou oculta a mensagem "nenhum resultado"
        noResults.style.display = hasResults ? 'none' : 'block';
        document.querySelector('.items').style.display = 'block'; // Garante que a lista de itens seja mostrada
    } else if (value === '') {
        // Se o input estiver vazio, oculta todos os itens e a mensagem de "nenhum resultado"
        items.forEach(item => item.style.display = 'none');
        noResults.style.display = 'none'; // Oculta a mensagem "nenhum resultado"
        document.querySelector('.items').style.display = 'none'; // Esconde a lista
    }
});

// Função para formatar strings: remove espaços em branco, transforma em lowercase e remove acentos
function formatString(value) {
    return value
        .trim() // Remove espaços em branco
        .toLowerCase() // Transforma em lowercase
        .normalize('NFD') // Normaliza para separar os acentos
        .replace(/[\u0300-\u036f]/g, ''); // Remove os acentos
}
