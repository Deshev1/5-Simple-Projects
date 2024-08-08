//Page styles
const pageStyles = document.documentElement.style;

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
const transactionTable = document.querySelector(".table-body");
const tableTransactions = document.querySelector(".table-transactions");
const tableEmptyLabel = document.querySelector(".empty-label");

//Sort buttons
const sortBtns = document.querySelectorAll(".sort-btn");
const sortTypeBtn = document.querySelector(".sort-type");
const sortDateBtn = document.querySelector(".sort-date");
const sortNameBtn = document.querySelector(".sort-name");
const sortAmountBtn = document.querySelector(".sort-amount");
let sortAscending = false;
let sortColumn = "";

//Set default date to today
transactionDate.valueAsDate = new Date();
transactionDate.max = new Date().toISOString().split("T")[0];

//Dynamic variables
let currentBalance = 0;
let currentExpenses = 0;
let currentIncomes = 0;
let trnList = [];
let totalTransactions = trnList.length;

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */

//Budget input function
const setBudget = function (amount) {
  //Alert the user if budget input is empty
  if (!amount) {
    alert("Please enter your budget!");
    return false;
  } else {
    budgetDisplayLabel.innerHTML = `${amount}lv.`;
    incomesDisplayLabel.innerHTML = `${amount}lv.`;

    //Remove budget input card
    budgetInputCard.remove();
    //Show budget amount card
    movementCards.forEach((c) => (c.style.display = "flex"));
    return true;
  }
};

//Input field reset
const resetField = function (...fields) {
  fields.forEach((f) => (f.value = ""));
};

//Validate transaction inputs
const validateTransactionInputs = function (t, d, n, a) {
  //checks if all entries are entered
  if (!t || !d || !n || !a) {
    alert("Please fill in all expense details!");
    return;
  }
  //checks if budget is entered
  else if (!currentBalance && !currentBalance === 0) {
    alert("Please define your budget!");
    return;
  }
  //checks if expense is bigger than budget
  else if (t === "expense" && a > currentBalance) {
    alert("Insufficient funds!");
    return;
  }
  //processes transaction
  else return 1;
};

//Process transaction inputs (after validation)
const processTransactionInputs = function (type, dateInput, nameTrn, amount) {
  //Change to negative amount if type = expense
  if (type === "expense") amount = -amount;

  //Store transaction details in transactions list
  trnList.push({
    type: type,
    date: new Date(dateInput),
    name: nameTrn,
    amount: amount,
  });

  numOfTrn = trnList.length;

  //Update current budget value
  currentBalance = currentBalance + amount;
  //Update current budget label
  budgetDisplayLabel.innerHTML = `${currentBalance}lv.`;

  //Reset transaction date to today
  transactionDate.valueAsDate = new Date();
};

//Display incomes and expenses
const transactionTypeSums = function () {
  // reset expenses and incomes
  currentExpenses = 0;
  currentIncomes = 0;
  currentBalance = 0;

  // go through each transaction and tally up the expenses and incomes
  trnList.forEach((trn) =>
    trn.type == "expense"
      ? (currentExpenses += trn.amount)
      : (currentIncomes += trn.amount)
  );

  currentBalance = currentIncomes + currentExpenses;

  // display expenses and incomes
  expensesDisplayLabel.innerHTML = `${currentExpenses}lv.`;
  incomesDisplayLabel.innerHTML = `${currentIncomes}lv.`;
  budgetDisplayLabel.innerHTML = `${currentBalance}`;
  //ADD CURRENT BUDGET ( INCOMES - EXPENSES)
};

//Change sort button style
const styleSortBtn = function (ascending) {
  if (!ascending) {
    pageStyles.setProperty("--up-arrow-color", "#00000049");
    pageStyles.setProperty(
      "--up-arrow-shadow",
      "0px 0px 0px rgba(255, 255, 255, 0"
    );
    pageStyles.setProperty("--down-arrow-color", "#ffffff");
    pageStyles.setProperty("--down-arrow-shadow", "0px 0px 10px red");
  } else {
    pageStyles.setProperty("--up-arrow-color", "#ffffff");
    pageStyles.setProperty("--up-arrow-shadow", "0px 0px 10px green");
    pageStyles.setProperty("--down-arrow-color", "#00000049");
    pageStyles.setProperty(
      "--down-arrow-shadow",
      "0px 0px 0px rgba(255, 255, 255, 0)"
    );
  }
};

/* ///////////////////////// */
/* PAGINATION START
/* ///////////////////////// */

const paginationLbl = document.querySelector(".pagination-lbl");
let trnPerPageInput = document.querySelector(".number-of-transactions");
let btnsContainer = document.querySelector(".pagination-btns");
const pageBtnsContainer = document.querySelector(".number-pages-container");
const previousPage = document.querySelector(".previous-page-btn");
const nextPage = document.querySelector(".next-page-btn");

let trnPerPage = Number(trnPerPageInput.value);

let numOfTrn = trnList.length;
let numOfPages = 0;
let pageBtnList = [];
let pageState;

let activeBtn;
let activeBtnIndex;
let activeBtnValue;
let startTrnIndex;
let endTrnIndex;

//Adds a page button
function addPageBtn(index) {
  //Creates, populates, stores and displays button
  const pageBtn = document.createElement("button");
  pageBtn.classList.add("page-btn");
  pageBtn.setAttribute("index", index);
  pageBtn.textContent = index;
  pageBtnsContainer.appendChild(pageBtn);
  pageBtnList.push(pageBtn);

  //Adds click event listener to make this button active again if clicked
  pageBtn.addEventListener("click", function () {
    if (!(pageBtn.textContent == "...")) {
      makeActiveBtn(pageBtn);
      displayTransactions(trnList);
    }
  });
}

//Makes a passed button active
function makeActiveBtn(btn) {
  //Removes active class from all buttons and adds it to this button
  pageBtnList.forEach((btn) => btn.classList.remove("active-btn"));
  btn.classList.add("active-btn"); // add active-btn class to current btn

  //Sets this button as active and its variables
  activeBtn = btn;
  activeBtnIndex = Number(btn.index);
  activeBtnValue = Number(btn.textContent);
}

//Checks if the number of pages has changed and handles it if so
function pageIncreaseCheck(numOfTrn) {
  let recalcNumPages = Math.ceil(numOfTrn / trnPerPage);

  if (numOfPages != recalcNumPages) {
    numOfPages = recalcNumPages;
    pageBtnList = [];
    pageBtnsContainer.innerHTML = "";

    if (numOfPages < 8) {
      for (let i = 0; i < numOfPages; i++) {
        addPageBtn(i + 1);
      }
    } else {
      for (let i = 0; i < 7; i++) {
        addPageBtn(i + 1);
      }

      setInitialState();

      pageBtnList.forEach((btn) =>
        btn.addEventListener("click", function (e) {
          clickLogic(e.target);
        })
      );
    }
    makeActiveBtn(pageBtnList[pageBtnList.length - 1]);
  }
}

//Displays transactions in the table
function displayTransactions(arr) {
  transactionTable.innerHTML = "";
  let arrLength = arr.length;

  startTrnIndex = (activeBtnValue - 1) * trnPerPage;
  endTrnIndex = startTrnIndex + trnPerPage;
  if (endTrnIndex > arrLength) {
    endTrnIndex = arrLength;
  } else {
    endTrnIndex = startTrnIndex + trnPerPage;
  }

  for (let i = startTrnIndex; i < endTrnIndex; i++) {
    let currTrn = arr[i];
    let html = `<tr class="${currTrn.type}-row">
        <td class="t-type">${currTrn.type}</td>
        <td class="t-date">${currTrn.date.toISOString().split("T")[0]}</td>
        <td class="t-name">${currTrn.name}</td>
        <td class="t-number">${currTrn.amount}lv.</td>
      </tr>`;

    transactionTable.insertAdjacentHTML("beforeend", html);
  }

  paginationLbl.textContent = `Currently showing ${
    startTrnIndex + 1
  } to ${endTrnIndex} out of ${arrLength} `;
}

//Sets the view state of the page buttons (start, mid, end)
function setInitialState() {
  //Update current pageBtnPosition
  if (activeBtnValue < 5) {
    pageState = "start";
  } else if (activeBtnValue > numOfPages - 5) {
    pageState = "end";
  } else {
    pageState = "three";
  }

  updateBtns();
  pageBtnList[6].textContent = numOfPages;
}

//Updates buttons depending on state
function updateBtns() {
  //Button update template
  function btnUpdateTemplate(c1, c2, c3, c4, c5) {
    pageBtnList[1].textContent = c1;
    pageBtnList[2].textContent = c2;
    pageBtnList[3].textContent = c3;
    pageBtnList[4].textContent = c4;
    pageBtnList[5].textContent = c5;
  }

  if (pageState == "start") {
    btnUpdateTemplate(2, 3, 4, 5, "...");
  } else if (pageState == "end") {
    btnUpdateTemplate(
      "...",
      numOfPages - 4,
      numOfPages - 3,
      numOfPages - 2,
      numOfPages - 1
    );
  } else {
    btnUpdateTemplate(
      "...",
      activeBtnValue - 1,
      activeBtnValue,
      activeBtnValue + 1,
      "..."
    );
    makeActiveBtn(pageBtnList[3]);
  }
}

//On-click logic for page btns (7+ buttons)
function clickLogic(btn) {
  let clickedBtn = btn;
  let clickedBtnIndex = Number(btn.getAttribute("index"));
  let clickedBtnValue = btn.textContent;

  if (!(clickedBtnValue == "...")) {
    makeActiveBtn(clickedBtn);
    if (clickedBtnIndex === 1) {
      pageState = "start";
    } else if (clickedBtnIndex === 7) {
      pageState = "end";
    } else if (pageState == "start" && clickedBtnIndex == 5) {
      pageState = "three";
    } else if (pageState == "end" && clickedBtnIndex == 3) {
      pageState = "three";
    } else if (pageState == "three" && Number(clickedBtnValue) < 5) {
      pageState = "start";
      makeActiveBtn(pageBtnList[3]);
    } else if (
      pageState == "three" &&
      Number(clickedBtnValue) > numOfPages - 4
    ) {
      pageState = "end";
      makeActiveBtn(pageBtnList[3]);
    }
  }

  updateBtns();
  displayTransactions(trnList);
}

//Creates direction buttons and their handlers
function createDirectionBtns() {
  //Creates next button
  const nextPageBtn = document.createElement("button");
  nextPageBtn.classList.add("next-page-btn", "change-page-btn");
  nextPageBtn.textContent = "Next";
  btnsContainer.insertAdjacentElement("beforeend", nextPageBtn);

  //Handles next button's click
  nextPageBtn.addEventListener("click", function () {
    let nextBtn = pageBtnList[Number(activeBtn.getAttribute("index"))];
    if (nextBtn) {
      if (pageBtnList.length < 7) {
        makeActiveBtn(nextBtn);
        displayTransactions(trnList);
      } else {
        clickLogic(nextBtn);
      }
    }
  });

  //Creates previous button
  const prevPageBtn = document.createElement("button");
  prevPageBtn.classList.add("prev-page-btn", "change-page-btn");
  prevPageBtn.textContent = "Previous";
  btnsContainer.insertAdjacentElement("afterbegin", prevPageBtn);

  //Handles previous button's click
  prevPageBtn.addEventListener("click", function () {
    console.log(prevPageBtn);
    let prevBtn = pageBtnList[Number(activeBtn.getAttribute("index")) - 2];
    if (prevBtn) {
      if (pageBtnList.length < 7) {
        makeActiveBtn(prevBtn);
        displayTransactions(trnList);
      } else {
        clickLogic(prevBtn);
      }
    }
  });
}

/* ///////////////////////// */
/* PAGINATION END
/* ///////////////////////// */

/* ///////////////////////// */
/* SEARCH BAR START
/* ///////////////////////// */
const searchField = document.querySelector(".search-field");
const searchFieldBtn = document.querySelector(".search-field-btn");

let searchCriteria;
let filteredTrns = [];
let currentlyDisplaying;

function searchBarLogic() {
  searchCriteria = searchField.value;

  if (trnList.length != 0) {
    if (searchCriteria != "") {
      filteredTrns = trnList.filter(
        (el) =>
          el.name.includes(searchCriteria) ||
          el.amount.toString().includes(searchCriteria)
      );
      if (filteredTrns.length > 0) {
        currentlyDisplaying = "filtered";
        searchField.value = "";
        pageIncreaseCheck(filteredTrns.length);
        displayTransactions(filteredTrns);
      }
    } else if (currentlyDisplaying == "filtered") {
      currentlyDisplaying = "all";
      pageIncreaseCheck(trnList.length);
      displayTransactions(trnList);
    }
  }
}

searchFieldBtn.addEventListener("click", function () {
  searchBarLogic();
});

/* ///////////////////////// */
/* SEARCH BAR END
/* ///////////////////////// */

/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
budgetSubmit.addEventListener("click", function () {
  let type = "budget";
  let date = new Date();
  let nameTrn = "Initial budget.";
  let amount = Number(budgetInput.value);

  if (setBudget(amount)) {
    processTransactionInputs(type, date, nameTrn, amount);
    pageIncreaseCheck(numOfTrn);
    displayTransactions(trnList);
    createDirectionBtns();
  }
});

//Add transaction¸
transactionSubmit.addEventListener("click", function () {
  //Take input values
  let type = transactionType.value;
  let dateInput = transactionDate.value;
  let nameTrn = transactionName.value;
  let amount = Number(transactionAmount.value);
  nameTrn = nameTrn.charAt(0).toUpperCase() + nameTrn.slice(1);
  numberOfTransactions = trnList.length;

  //If validation is successful...
  if (validateTransactionInputs(type, dateInput, nameTrn, amount)) {
    processTransactionInputs(type, dateInput, nameTrn, amount); // process transaction
    transactionTypeSums(); // update incomes and expenses
    resetField(transactionType, transactionName, transactionAmount); // reset input fields
    pageIncreaseCheck(numOfTrn);
    displayTransactions(trnList);
  }
});

//Sort buttons
sortBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    styleSortBtn(sortAscending); // styles the sort button
    sortBtns.forEach((btn) => btn.classList.remove("sort-focus")); // removes focus from all buttons
    sortColumn = e.target.getAttribute("value"); //gets the name of the column
    e.target.classList.add("sort-focus"); //sets focus on the clicked button

    function sortDate() {
      sortAscending
        ? trnList.sort((a, b) => new Date(a[sortColumn] - b[sortColumn]))
        : trnList.sort((a, b) => new Date(b[sortColumn] - a[sortColumn]));
    }

    function sortRest() {
      sortAscending
        ? trnList.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
        : trnList.sort((a, b) => (a[sortColumn] > b[sortColumn] ? -1 : 1));
    }

    sortColumn == "date" ? sortDate() : sortRest();

    sortAscending = !sortAscending; // change ascending to false
    displayTransactions(trnList);
  });
});

trnPerPageInput.onchange = (e) => {
  trnPerPage = Number(e.target.value);
  pageIncreaseCheck(numOfTrn);
  displayTransactions(trnList);
};

//TEST BTN - ADD 5 TRN

//Add: random rate, random amount, random type
let testBtn = document.querySelector(".test-btn");

testBtn.addEventListener("click", function () {
  function randomDateFunc(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  let typeData;
  let dateData;
  let nameData;
  let amountData;

  for (let i = 0; i < 5; i++) {
    dateData = randomDateFunc(new Date(2012, 0, 1), new Date());
    nameData = "Big biznis.";
    amountData = Math.floor(Math.random() * 1000);
    typeData = "income";

    if (Math.floor(Math.random() * 2) == 1) {
      typeData = "income";
    } else {
      typeData = "expense";
      amountData = Math.floor(Math.random() * currentBalance);
    }

    processTransactionInputs(typeData, dateData, nameData, amountData);
  }

  transactionTypeSums(); // update incomes and expenses
  pageIncreaseCheck(trnList.length);
  displayTransactions(trnList);
});
//TEST BTN END
