const form = document.getElementById('formFinance');
const list = document.getElementById('transactionList');
const incomeDisplay = document.getElementById('displayIncome');
const expenseDisplay = document.getElementById('displayExpense');
const totalDisplay = document.getElementById('displayTotal');

let transactions = JSON.parse(localStorage.getItem('financasData')) || [];

function updateValues() {
  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  totalDisplay.innerText = `R$ ${total}`;
  incomeDisplay.innerText = `R$ ${income}`;
  expenseDisplay.innerText = `R$ ${expense}`;
}

function addTransactionDOM(transaction) {
  const item = document.createElement('li');
  item.classList.add('list-group-item');
  const sign = transaction.type === 'income' ? '+' : '-';
  const colorClass = transaction.type === 'income' ? 'amount-plus' : 'amount-minus';

  item.innerHTML = `
    ${transaction.desc} 
     <div>
    <span class="${colorClass}">${sign} R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="btn-delete ms-2" onclick="removeTransaction(${transaction.id})">x</button>
     </div>
  `;
  list.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('financasData', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const transaction = {
    id: Math.floor(Math.random() * 1000000),
    desc: document.getElementById('desc').value,
    amount: +document.getElementById('amount').value,
    type: document.getElementById('type').value
  };
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
});

init();