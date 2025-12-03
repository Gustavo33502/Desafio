const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addTaskBtn');
const clearBtn = document.getElementById('clearAll');

// Colunas
const columns = {
    todo: document.getElementById('todo'),
    doing: document.getElementById('doing'),
    done: document.getElementById('done')
};

// 1. Carregar tarefas do LocalStorage
let tasks = JSON.parse(localStorage.getItem('gugaKanbanData')) || [];

// 2. Função para Renderizar (Cria os elementos na tela baseados nos dados)
function renderTasks() {
    // Limpa as colunas antes de recriar
    Object.values(columns).forEach(col => col.innerHTML = '');

    tasks.forEach((task) => {
        createCardElement(task);
    });
}

// 3. Cria o HTML do Card e adiciona eventos de Drag
function createCardElement(task) {
    const div = document.createElement('div');
    div.classList.add('kanban-card');
    div.setAttribute('draggable', 'true');
    div.dataset.id = task.id; // Guarda o ID no elemento HTML

    div.innerHTML = `
        <span>${task.text}</span>
        <button class="btn-del" onclick="removeTask(${task.id})">🗑️</button>
    `;

    // Eventos de Arrastar do Card
    div.addEventListener('dragstart', () => {
        div.classList.add('dragging');
    });

    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
        updateDataFromDOM(); // Salva a nova posição após soltar
    });

    // Adiciona na coluna correta baseada no status (todo, doing ou done)
    if (columns[task.status]) {
        columns[task.status].appendChild(div);
    }
}

// 4. Configurar as Colunas (Áreas de Drop)
document.querySelectorAll('.kanban-column').forEach(column => {
    
    column.addEventListener('dragover', e => {
        e.preventDefault(); // Permite soltar
        column.classList.add('drag-over');

        // Lógica para saber onde inserir (em cima ou embaixo de outro card)
        const afterElement = getDragAfterElement(column, e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (afterElement == null) {
            column.appendChild(draggable);
        } else {
            column.insertBefore(draggable, afterElement);
        }
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
    });

    column.addEventListener('drop', () => {
        column.classList.remove('drag-over');
        // A atualização dos dados ocorre no evento 'dragend' do card
    });
});

// 5. Função Matemática para posição do Drop (Cálculo do mouse)
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 6. Adicionar Nova Tarefa
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return alert('Escreva algo!');

    const newTask = {
        id: Date.now(), // ID único baseado no tempo
        text: text,
        status: 'todo' // Sempre começa em "A Fazer"
    };

    tasks.push(newTask);
    createCardElement(newTask); // Cria apenas o novo card visualmente
    saveLocal();
    taskInput.value = '';
}

// 7. Remover Tarefa
window.removeTask = function(id) {
    // Filtra array mantendo apenas os que NÃO têm esse ID
    tasks = tasks.filter(task => task.id !== id);
    
    // Remove do HTML visualmente (mais eficiente que re-renderizar tudo)
    const cardToRemove = document.querySelector(`[data-id="${id}"]`);
    if(cardToRemove) cardToRemove.remove();
    
    saveLocal();
}

// 8. Atualizar Array de Dados lendo o DOM (Ocorre após arrastar)
function updateDataFromDOM() {
    tasks = []; // Zera o array para reconstruir na ordem visual atual
    
    // Varre cada coluna para ver o que está dentro
    ['todo', 'doing', 'done'].forEach(status => {
        const column = document.getElementById(status);
        const cards = column.querySelectorAll('.kanban-card');
        
        cards.forEach(card => {
            tasks.push({
                id: parseInt(card.dataset.id),
                text: card.querySelector('span').innerText,
                status: status // Atualiza o status baseado na coluna que está agora
            });
        });
    });

    saveLocal();
}

// 9. Salvar no LocalStorage
function saveLocal() {
    localStorage.setItem('gugaKanbanData', JSON.stringify(tasks));
}

// 10. Limpar Tudo
clearBtn.addEventListener('click', () => {
    if(confirm("Tem certeza que deseja apagar tudo?")) {
        tasks = [];
        renderTasks();
        saveLocal();
    }
});

addBtn.addEventListener('click', addTask);

// Inicialização
renderTasks();