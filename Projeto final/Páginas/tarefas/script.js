const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addTaskBtn');
const clearBtn = document.getElementById('clearAll');


const columns = {
    todo: document.getElementById('todo'),
    doing: document.getElementById('doing'),
    done: document.getElementById('done')
};

let tasks = JSON.parse(localStorage.getItem('gugaKanbanData')) || [];

function renderTasks() {

    Object.values(columns).forEach(col => col.innerHTML = '');

    tasks.forEach((task) => {
        createCardElement(task);
    });
}


function createCardElement(task) {
    const div = document.createElement('div');
    div.classList.add('kanban-card');
    div.setAttribute('draggable', 'true');
    div.dataset.id = task.id;

    div.innerHTML = `
        <span>${task.text}</span>
        <button class="btn-del" onclick="removeTask(${task.id})">🗑️</button>
    `;

    div.addEventListener('dragstart', () => {
        div.classList.add('dragging');
    });

    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
        updateDataFromDOM();
    });

    if (columns[task.status]) {
        columns[task.status].appendChild(div);
    }
}


document.querySelectorAll('.kanban-column').forEach(column => {

    column.addEventListener('dragover', e => {
        e.preventDefault();
        column.classList.add('drag-over');


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

    });
});


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


function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return alert('Escreva algo!');

    const newTask = {
        id: Date.now(),
        text: text,
        status: 'todo'
    };

    tasks.push(newTask);
    createCardElement(newTask);
    saveLocal();
    taskInput.value = '';
}


window.removeTask = function (id) {

    tasks = tasks.filter(task => task.id !== id);


    const cardToRemove = document.querySelector(`[data-id="${id}"]`);
    if (cardToRemove) cardToRemove.remove();

    saveLocal();
}


function updateDataFromDOM() {
    tasks = [];

    ['todo', 'doing', 'done'].forEach(status => {
        const column = document.getElementById(status);
        const cards = column.querySelectorAll('.kanban-card');

        cards.forEach(card => {
            tasks.push({
                id: parseInt(card.dataset.id),
                text: card.querySelector('span').innerText,
                status: status
            });
        });
    });

    saveLocal();
}


function saveLocal() {
    localStorage.setItem('gugaKanbanData', JSON.stringify(tasks));
}


clearBtn.addEventListener('click', () => {
    if (confirm("Tem certeza que deseja apagar tudo?")) {
        tasks = [];
        renderTasks();
        saveLocal();
    }
});

addBtn.addEventListener('click', addTask);


renderTasks();