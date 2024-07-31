//Budget input selectors
const budgetInputCard = document.querySelector(".set-budget-card");
const budgetInput = document.querySelector(".budget-input");
const budgetSubmit = document.querySelector(".budget-btn");

//Budget/Expense/Income display selectors
const movementCards = document.querySelectorAll(".movement-card");
const budgetDisplayLabel = document.querySelector(".budget-amount");
const expensesDisplayLabel = document.querySelector(".expense-amount");
const incomesDisplayLabel = document.querySelector(".income-amount");

//Transaction input selectors
const transactionType = document.querySelector(".transaction-type");
const transactionName = document.querySelector(".expense-name");
const transactionDate = document.querySelector(".expense-date");
const transactionAmount = document.querySelector(".expense-number");
const transactionSubmit = document.querySelector(".expense-submit");

//Transaction table selectors
const transactionTable = document.querySelector(".transaction-table");
const tableTransactions = document.querySelector(".table-transactions");
const tableEmptyLabel = document.querySelector(".empty-label");

//Set default date to today
transactionDate.valueAsDate = new Date();
transactionDate.max = new Date().toISOString().split("T")[0];

//Dynamic variables
let currentBudget = 0;
let transactions = [];
let totalTransactions = transactions.length;

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */

//Budget input function
const setBudget = function (amount) {
  //Alert the user if budget input is empty
  if (!amount) {
    alert("Please enter your budget!");
  } else {
    console.log(typeof amount);
    budgetDisplayLabel.innerHTML = `${amount}lv.`;
    incomesDisplayLabel.innerHTML = `${amount}lv.`;

    //Remove budget input card
    budgetInputCard.remove();
    //Show budget amount card
    movementCards.forEach((c) => (c.style.display = "flex"));
  }
};

//Input field reset
const resetField = function (...fields) {
  fields.forEach((f) => (f.value = ""));
};

//Validate transaction inputs
const validate = function (t, d, n, a) {
  //checks if all entries are entered
  if (!t || !d || !n || !a) {
    alert("Please fill in all expense details!");
    return;
  }
  //checks if budget is entered
  else if (!currentBudget && !currentBudget === 0) {
    alert("Please define your budget!");
    return;
  }
  //checks if expense is bigger than budget
  else if (t === "expense" && a > currentBudget) {
    alert("Insufficient funds!");
    return;
  }
  //processes transaction
  else return 1;
};

//Process transaction inputs (after validation)
const processTransactionInputs = function (t, d, n, a) {
  //Change to negative amount if type = expense
  if (t === "expense") a = -a;

  //Store transaction details in transactions list
  transactions.push({
    type: t,
    date: d,
    name: n,
    amount: a,
  });

  //Update current budget value
  currentBudget = currentBudget + a;
  //Update current budget label
  budgetDisplayLabel.innerHTML = `${currentBudget}lv.`;
  //Reset input fields
  resetField(transactionType, transactionName, transactionAmount);
  //Reset transaction date to today
  transactionDate.valueAsDate = new Date();
  console.log(transactions);
};

//Display transactions
const displayTransactions = function () {
  //Clear table
  transactionTable.innerHTML = "";

  //Display transaction row
  transactions.forEach((t) =>
    transactionTable.insertAdjacentHTML(
      "afterbegin",
      `<tr class="${t.type}-row">
        <td class="t-type">${t.type}</td>
        <td class="t-date">${t.date}</td>
        <td class="t-name">${t.name}</td>
        <td class="t-number">${t.amount}lv.</td>
      </tr>`
    )
  );

  //Display table labels
  transactionTable.insertAdjacentHTML(
    "afterbegin",
    `<tr class="transaction-table-headings">
            <th>Type</th>
            <th>Date</th>
            <th>Name</th>
            <th>Amount</th>
          </tr>`
  );
};

//Calculate transactions amount
//Calculate expenses
let expensesAmount = 0;
let incomesAmount = 0;

const transactionTypeSums = function () {
  expensesAmount = 0;
  incomesAmount = 0;
  transactions.forEach((transaction) =>
    transaction.type == "expense"
      ? (expensesAmount += transaction.amount)
      : (incomesAmount += transaction.amount)
  );

  expensesDisplayLabel.innerHTML = `${expensesAmount}lv.`;
  incomesDisplayLabel.innerHTML = `${incomesAmount}lv.`;
};

/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
budgetSubmit.addEventListener("click", function () {
  let type = "budget";
  let date = new Date().toISOString().split("T")[0];
  let name = "initial budget";
  let amount = Number(budgetInput.value);
  setBudget(amount);
  processTransactionInputs(type, date, name, amount);
  displayTransactions();
});

//Add expense
transactionSubmit.addEventListener("click", function () {
  //Take input values
  let type = transactionType.value;
  let date = transactionDate.value;
  let nameT = transactionName.value;
  let amount = Number(transactionAmount.value);

  //If validation is successful, run process and display transactions
  if (validate(type, date, nameT, amount)) {
    processTransactionInputs(type, date, nameT, amount);
    displayTransactions();
    transactionTypeSums();
  }
});

// //Remove expense
// transactionTable.addEventListener("click", function (e) {
//   if (e.target.classList.contains("remove-transaction")) {
//     let transaction = e.target.parentElement.parentElement;
//     let transactionAmount = Number(
//       transaction.querySelector(".t-number").getAttribute("lenumber")
//     );
//     console.log(transactionAmount);
//     console.log(typeof transactionAmount);

//     console.log(currentBudget);
//     currentBudget = currentBudget - transactionAmount;
//     budgetDisplayLabel.innerHTML = `${currentBudget}lv.`;

//     console.log(currentBudget);

//     transaction.remove();
//   }
// });
