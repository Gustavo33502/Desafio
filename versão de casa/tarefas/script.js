const taskInput = document.getElementById('taskInput');
 const addBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
   const clearBtn = document.getElementById('clearAll');

let tasks = JSON.parse(localStorage.getItem('tarefasData')) || [];

 function renderTasks() {
  taskList.innerHTML = '';
   tasks.forEach((task, index) => {
    const li = document.createElement('li');
      li.className = `list-group-item task-item ${task.done ? 'list-group-item-success completed' : ''}`;
      
      li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
     <button class="btn-del"  onclick="removeTask(${index})">🗑️</button>
      `;
    taskList.appendChild(li);
   });
   saveLocal();
 }

function addTask() {
    const text = taskInput.value;
 if (text === '') return alert('Escreva algo!');
    tasks.push({ text, done: false });
  taskInput.value = '';
   renderTasks();
}

 function removeTask(index) {
  tasks.splice(index, 1);
    renderTasks();
 }

 function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
  renderTasks();
 }

 function saveLocal() {
    localStorage.setItem('tarefasData', JSON.stringify(tasks));
 }

 addBtn.addEventListener('click', addTask);
  clearBtn.addEventListener('click', () => {
    tasks = [];
     renderTasks();
  });

 renderTasks();