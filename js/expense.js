let expenseDate = document.querySelector(".expense-date");

let budgetCard = document.querySelector(".set-budget-card");
let budget = document.querySelector(".budget-input");
let submit = document.querySelector(".budget-btn");

let budgetDisplay = document.querySelector(".budget-display-card");
let budgetNumber = document.querySelector(".budget-number");

let transactionCard = document.querySelector(".transaction-details");
let transactionType = document.querySelector(".transaction-type");
let transctionName = document.querySelector(".expense-name");
let transactionDate = document.querySelector(".expense-date");
let transactionNumber = document.querySelector(".expense-number");
let transactionSubmit = document.querySelector(".expense-submit");

let table = document.querySelector(".table");
let emptyLabel = document.querySelector(".empty-label");

let currentBudget;
let transactions = [];

expenseDate.valueAsDate = new Date();

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */

let setBudget = function () {
  if (!budget.value) {
    alert("Please enter your budget!");
  } else {
    currentBudget = Number(budget.value);
    budgetNumber.innerHTML = `${currentBudget}lv.`;
    budgetCard.style.display = "none";
    budgetDisplay.style.display = "flex";
    resetField(budget);
  }
};

let resetField = function (...fields) {
  fields.forEach((f) => (f.value = ""));
  document.querySelector(".expense-date").valueAsDate = new Date();
};

let addTransaction = function (type, date, nameT, number) {
  budgetNumber.innerHTML = `${currentBudget}lv.`;
  emptyLabel.style.display = "none";
  table.insertAdjacentHTML(
    "beforeend",
    `<tr class="${type}">
        <td class="t-type">${type}</td>
        <td class="t-date">${date}</td>
        <td class="t-name">${nameT}</td>
        <td class="t-number">${number}lv.</td>
      </tr>`
  );
  resetField(transactionDate, transctionName, transactionNumber);
};

/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
submit.addEventListener("click", function () {
  setBudget();
});

//Add expense
transactionSubmit.addEventListener("click", function () {
  //collect entries
  let type = transactionType.value;
  let date = transactionDate.value;
  let nameT = transctionName.value;
  let number = Number(transactionNumber.value);

  //process entries
  let processTransaction = function () {
    //save negative number if expense
    if (type === "expense") {
      number = -number;
    }

    //store transaction details
    transactions.push({
      type: type,
      date: date,
      name: nameT,
      amount: number,
    });

    //update balance
    currentBudget = currentBudget + number;
    budgetNumber.innerHTML = `${currentBudget}lv.`;
    console.log(transactions);
  };

  let displayTransactions = function () {
    table.innerHTML = `<tr class="table-headings">
            <th>Type</th>
            <th>Date</th>
            <th>Name</th>
            <th>Amount</th>
          </tr>`;

    transactions.forEach((t) =>
      table.insertAdjacentHTML(
        "beforeend",
        `<tr class="${t.type}">
        <td class="t-type">${t.type}</td>
        <td class="t-date">${t.date}</td>
        <td class="t-name">${t.name}</td>
        <td class="t-number" lenumber="${t.amount}">${t.amount}lv.</td>
      </tr>`
      )
    );
  };

  //validate entries
  let validate = function () {
    //checks if all entries are entered
    if (!type || !date || !nameT || !number) {
      alert("Please fill in all expense details!");
      return;
    }
    //checks if budget is entered
    else if (!currentBudget) {
      alert("Please define your budget!");
      return;
    }
    //checks if expense is bigger than budget
    else if (type === "expense" && number > currentBudget) {
      alert("Insufficient funds!");
      return;
    }
    //processes transaction
    else {
      processTransaction();
      displayTransactions();
    }
  };

  validate();
});

// //Remove expense
// table.addEventListener("click", function (e) {
//   if (e.target.classList.contains("remove-transaction")) {
//     let transaction = e.target.parentElement.parentElement;
//     let transactionNumber = Number(
//       transaction.querySelector(".t-number").getAttribute("lenumber")
//     );
//     console.log(transactionNumber);
//     console.log(typeof transactionNumber);

//     console.log(currentBudget);
//     currentBudget = currentBudget - transactionNumber;
//     budgetNumber.innerHTML = `${currentBudget}lv.`;

//     console.log(currentBudget);

//     transaction.remove();
//   }
// });
