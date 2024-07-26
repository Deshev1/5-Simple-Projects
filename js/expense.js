let currentBudget;

let budget = document.querySelector(".budget-input");
let submit = document.querySelector(".budget-btn");
let budgetNumber = document.querySelector(".budget-number");

let transactionDetails = document.querySelector(".transaction-details");
let expenseName = document.querySelector(".expense-name");
let expenseDate = document.querySelector(".expense-date");
let expenseNumber = document.querySelector(".expense-number");
let expenseSubmit = document.querySelector(".expense-submit");

let table = document.querySelector(".table");
let emptyLabel = document.querySelector(".empty-label");

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */
let resetField = function (...fields) {
  fields.forEach((e) => (e.value = ""));
};
/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
submit.addEventListener("click", function () {
  if (!budget.value) {
    alert("Please enter your budget!");
  } else {
    currentBudget = Number(budget.value);

    budgetNumber.innerHTML = `${currentBudget}lv.`;
  }
});

//Add expense
expenseSubmit.addEventListener("click", function () {
  let date = expenseDate.value;

  let name = expenseName.value;
  let number = Number(expenseNumber.value);

  //   transactionDetails.querySelectorAll(".textarea").forEach(function (info) {
  //     if (!info.value) {
  //       alert("Please fill in all transaction details!");
  //     }
  //   });

  console.log(transactionDetails.children);
  if (!date || !name || !number) {
    alert("Please fill in all expense details!");
  } else if (!currentBudget) {
    alert("Please define your budget!");
  } else if (number > currentBudget) {
    alert("Insufficient funds!");
  } else {
    currentBudget = currentBudget - number;
    budgetNumber.innerHTML = `${currentBudget}lv.`;
    emptyLabel.style.display = "none";
    table.insertAdjacentHTML(
      "beforeend",
      `<tr class="expense">
              <td class="e-date">${date}</td>
        <td class="e-date">${date}</td>
        <td class="e-name">${name}</td>
        <td class="e-date">${number}lv.</td>
        <td class='e-remove'>
            <ion-icon
                class="btn remove-expense"
                name="close-circle-outline"
            >
            </ion-icon>
        </td>
      </tr>`
    );
    resetField(expenseDate, expenseName, expenseNumber);
  }
});

//Remove expense
