// Função para gerar um ID único para cada card
function gerarId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Função para adicionar um novo card ao painel
document.getElementById('cardForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const equipamento = document.getElementById('equipamento').value;
    const servico = document.getElementById('servico').value;

    const id = gerarId();
    criarCard(id, nome, equipamento, servico);

    // Limpar o formulário
    this.reset();
});

// Função para criar um card dos dados
function criarCard(id, nome, equipamento, servico) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.id = id;
    card.setAttribute('ondragstart', 'drag(event)');

    card.innerHTML = `
        <p><strong>Senha:</strong> ${id}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Equipamento:</strong> ${equipamento}</p>
        <p><strong>Serviço:</strong> ${servico}</p>
        <button onclick="editarCard('${id}')">Editar</button>
        <button onclick="deletarCard('${id}')">Excluir</button>
    `;

    // Adiciona o card na coluna Triagem para inicio do serviço
    document.getElementById('triagem').appendChild(card);
}

// Função para permitir o arrastar e soltar de elementos
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const draggedElement = document.getElementById(data);
    
    if (event.target.classList.contains('column')) {
        event.target.appendChild(draggedElement);
    } else if (event.target.classList.contains('card')) {
        const column = event.target.closest('.column');
        column.insertBefore(draggedElement, event.target.nextSibling);
    }
}

// Função para editar um card
function editarCard(id) {
    const card = document.getElementById(id);
    //p:nth-of-type seleciona um elemento 'p' no grupo dos elementos, sendo o primeiro 'id' e o ultimo 'serviço'
    const nome = prompt('Nome Completo:', card.querySelector('p:nth-of-type(2)').textContent.split(': ')[1]);
    const equipamento = prompt('Equipamento:', card.querySelector('p:nth-of-type(3)').textContent.split(': ')[1]);
    const servico = prompt('Serviço:', card.querySelector('p:nth-of-type(4)').textContent.split(': ')[1]);

    if (nome && equipamento && servico) {
        card.innerHTML = `
            <p><strong>Senha:</strong> ${id}</p>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Equipamento:</strong> ${equipamento}</p>
            <p><strong>Serviço:</strong> ${servico}</p>
            <button onclick="editarCard('${id}')">Editar</button>
            <button onclick="deletarCard('${id}')">Excluir</button>
        `;
    }
}

// Função para deletar um card
function deletarCard(id) {
    const card = document.getElementById(id);
    if (card) {
        card.remove();
    }
}
