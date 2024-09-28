document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('capturePhoto').addEventListener('click', function() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                const captureButton = document.createElement('button');
                captureButton.innerText = 'Capturar';
                document.body.appendChild(video);
                document.body.appendChild(captureButton);

                captureButton.addEventListener('click', function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = 150;  // Defina a largura desejada
                    canvas.height = 150; // Defina a altura desejada
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const photoData = canvas.toDataURL('image/png');
                    document.getElementById('photo').value = photoData;
                    document.getElementById('photoPreview').src = photoData;
                    document.getElementById('photoPreview').style.display = 'block';
                    
                    document.getElementById('addCardButton').style.display = 'block';

                    stream.getTracks().forEach(track => track.stop());
                    video.remove();
                    captureButton.remove();
                });
            })
            .catch(error => {
                console.error("Erro ao acessar a câmera:", error);
            });
    });

    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const equipamento = document.getElementById('equipamento').value;
        const servico = document.getElementById('servico').value;
        const id = gerarId();
        const photoData = document.getElementById('photo').value;
        criarCard(id, nome, equipamento, servico, photoData);
        this.reset();
        document.getElementById('photoPreview').style.display = 'none';
        document.getElementById('addCardButton').style.display = 'none';
    });
});

// Função para criar um card
function criarCard(id, nome, equipamento, servico, photoData) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.id = id;
    card.setAttribute('ondragstart', 'drag(event)');

    let timer = 0; 
    const timerInterval = setInterval(() => {
        timer++;
        card.querySelector('.timer').textContent = `Tempo: ${timer}s`;
        
        if (timer >= 1000) {
            clearInterval(timerInterval);
            card.querySelector('.timer').textContent = 'Tempo esgotado!';
        } else if (timer > 60) {
            card.style.backgroundColor = 'yellow'; 
        } 
        if (timer > 120) { 
            card.style.backgroundColor = 'red'; 
        }
    }, 1000);

    card.innerHTML = `
        <p class="timer">Tempo: ${timer}s</p>
        <p><strong>Senha:</strong> ${id}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Equipamento:</strong> ${equipamento}</p>
        <p><strong>Serviço:</strong> ${servico}</p>
        <img src="${photoData}" alt="Foto" style="width: 60px; height: auto;"/>
        <button onclick="editarCard('${id}')">Editar</button>
        <button onclick="deletarCard('${id}')">Excluir</button>
    `;

    document.getElementById('triagem').appendChild(card);
}

// Funções de arrastar e soltar
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
    const nome = prompt('Nome Completo:', card.querySelector('p:nth-of-type(2)').textContent.split(': ')[1]);
    const equipamento = prompt('Equipamento:', card.querySelector('p:nth-of-type(3)').textContent.split(': ')[1]);
    const servico = prompt('Serviço:', card.querySelector('p:nth-of-type(4)').textContent.split(': ')[1]);
    if (nome && equipamento && servico) {
        card.innerHTML = `
            <p><strong>Senha:</strong> ${id}</p>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Equipamento:</strong> ${equipamento}</p>
            <p><strong>Serviço:</strong> ${servico}</p>
            <img src="${card.querySelector('img').src}" alt="Foto" style="width: 100px; height: auto;"/>
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

// Função para gerar um ID único para cada card
function gerarId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}
