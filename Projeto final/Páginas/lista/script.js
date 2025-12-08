const itemInput = document.getElementById('itemInput');
const categorySelect = document.getElementById('categorySelect');
const addBtn = document.getElementById('addBtn');
const shoppingList = document.getElementById('shoppingList');
const totalCount = document.getElementById('totalCount');

const icons = { food: '🍎', drink: '🧃', home: '🏠', other: '📦' };
const bgClasses = { food: 'bg-food', drink: 'bg-drink', home: 'bg-home', other: 'bg-other' };

document.addEventListener('DOMContentLoaded', loadItems);

addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

function addItem() {
    const text = itemInput.value.trim();
    const category = categorySelect.value;

    if (text === '') {
        alert("O campo não pode estar vazio!");
        return;
    }

    const item = { id: Date.now(), text: text, category: category, completed: false };

    saveLocal(item);
    createListItem(item);

    itemInput.value = '';
    itemInput.focus();
    updateTotal();
}

function createListItem(item) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
    if (item.completed) li.classList.add('completed');
    li.setAttribute('data-id', item.id);

    const btnCheckClass = item.completed ? 'btn-success' : 'btn-outline-success';
    const checkIcon = item.completed ? 'ph-check-circle' : 'ph-circle';

    li.innerHTML = `
        <div class="d-flex align-items-center gap-3">
            <div class="cat-icon ${bgClasses[item.category]}">
                ${icons[item.category]}
            </div>
            <span class="fw-bold text-secondary item-text">${item.text}</span>
        </div>
        
        <div class="d-flex gap-2">
            <button class="btn ${btnCheckClass} btn-sm rounded-circle p-2 d-flex align-items-center" onclick="toggleComplete(${item.id})">
                <i class="ph ${checkIcon} fs-5"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center" onclick="deleteItem(this, ${item.id})">
                <i class="ph ph-trash fs-5"></i>
            </button>
        </div>
    `;
    shoppingList.appendChild(li);
}

window.toggleComplete = function (id) {
    const items = getLocalItems();
    const updatedItems = items.map(item => {
        if (item.id === id) return { ...item, completed: !item.completed };
        return item;
    });
    localStorage.setItem('smartItems', JSON.stringify(updatedItems));

    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
        li.classList.toggle('completed');
        const btn = li.querySelector('button.rounded-circle');
        const icon = btn.querySelector('i');
        const isCompleted = li.classList.contains('completed');

        if (isCompleted) {
            btn.classList.remove('btn-outline-success');
            btn.classList.add('btn-success');
            icon.classList.remove('ph-circle');
            icon.classList.add('ph-check-circle');
        } else {
            btn.classList.add('btn-outline-success');
            btn.classList.remove('btn-success');
            icon.classList.add('ph-circle');
            icon.classList.remove('ph-check-circle');
        }
    }
}

window.deleteItem = function (element, id) {
    const li = element.closest('li');
    li.classList.add('fall');
    removeLocal(id);
    
    li.addEventListener('transitionend', () => {
        li.remove();
        updateTotal();
    });
}

function saveLocal(item) {
    let items = getLocalItems();
    items.push(item);
    localStorage.setItem('smartItems', JSON.stringify(items));
}

function getLocalItems() {
    return JSON.parse(localStorage.getItem('smartItems')) || [];
}

function loadItems() {
    const items = getLocalItems();
    items.forEach(item => createListItem(item));
    updateTotal();
}

function removeLocal(id) {
    const items = getLocalItems().filter(item => item.id !== id);
    localStorage.setItem('smartItems', JSON.stringify(items));
}

function updateTotal() {
    totalCount.innerText = getLocalItems().length;
}

window.clearList = function () {
    if (confirm("Deseja apagar toda a lista?")) {
        localStorage.removeItem('smartItems');
        shoppingList.innerHTML = '';
        updateTotal();
    }
}