const transationsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))

let transactions = localStorage.
  getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction => 
    transaction.id !== ID)
  updateLocalStorage()
  init()
}

const addTranscationIntoDom = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const cssClass = amount < 0 ? 'minus' : 'plus'
  const amoutWithOperator = Math.abs(amount); // abs retorna o valor absoluto do número
  const li = document.createElement('li')

  li.classList.add(cssClass)
  li.innerHTML = `
    ${name}
    <span>${operator} R$ ${amoutWithOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
  transationsUl.append(li)
}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2)

const getIncome = transactionAmounts => transactionAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

const getTotal = transactionAmounts => transactionAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2)

const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount)

  const total = getTotal(transactionAmounts)

  const income = getIncome(transactionAmounts)

  const expense = getExpenses(transactionAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transationsUl.innerHTML = ''
  transactions.forEach(addTranscationIntoDom)
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateId = () => Math.round(Math.random() * 1000)

const addToTransactionArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateId(),
    name: transactionName,
    amount: Number(transactionAmount) // Number
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if(isSomeInputEmpty) {
    alert('Ocorreu um erro! Preencha o nome e o valor da transação.')
    return
  }

  addToTransactionArray(transactionName, transactionAmount)

  init()
  updateLocalStorage()

  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)