/* ///////////////////////// */
/* SELECTORS */
/* ///////////////////////// */

const titleVal = document.querySelector(".title-input");
const contentVal = document.querySelector(".content-input");
const charLabel = document.querySelector(".char-count");
const submitBtn = document.querySelector(".submit-btn");
const cancelBtn = document.querySelector(".clear-btn");

const pendingList = document.querySelector(".pending-list");
const canceledList = document.querySelector(".canceled-list");
const completedList = document.querySelector(".completed-list");

let processedTask;

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */

//Resize textarea
function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
  let charCount = this.value.length;

  if (!this.value) {
    charLabel.style.opacity = "0";
  } else {
    charLabel.style.opacity = "1";
    charLabel.innerHTML = `${200 - charCount} characters remaining`;
  }
}

//Reset fields
let resetFields = function () {
  titleVal.value = "";
  contentVal.value = "";
  titleVal.style.height = "4rem";
  contentVal.style.height = "10rem";
  charLabel.style.opacity = "0";
};

//Add pending task
let addPending = function () {
  let li = document.createElement("li");
  li.classList.add("task-container");
  li.innerHTML = `
              <h4 class="task-title">${titleVal.value}</h4>
              <p class="task-content">${contentVal.value}</p>
              <div class="buttons-container">
                <ion-icon class="btn cancel-task-btn" name="trash-outline"></ion-icon>
                <ion-icon class="btn complete-task-btn" name="shield-checkmark-outline"></ion-icon>
              </div>
            `;
  pendingList.append(li);
};

//Process pending task
let processPendingTask = function (e) {
  let currentTask = e.target.parentElement.parentElement;
  let taskTitle = currentTask.childNodes[1].innerText;
  let taskContent = currentTask.childNodes[3].innerText;

  processedTask = document.createElement("li");
  processedTask.classList.add("task-container");
  processedTask.innerHTML = `
              <h4 class="task-title">${taskTitle}</h4>
              <div class="buttons-container fill hidden-btns">
                <ion-icon class="btn remove-task-btn" name="trash-outline"></ion-icon>
                <ion-icon class="btn see-task-btn" name="eye-outline"></ion-icon>
              </div>
              <div class="modal hidden">
                <p class="modal-content">${taskContent}</p>
              </div>
            `;
  currentTask.remove();
};

/* ///////////////////////// */
/* FORM BUTTON HANDLERS */
/* ///////////////////////// */
//Field resize
contentVal.addEventListener("input", autoResize, false);

//Submit button
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (!titleVal.value) {
    alert("Please enter a title for your task!");
  } else if (!contentVal.value) {
    alert("Please enter a task!");
  } else {
    addPending();
    resetFields();
  }
});

//Cancel button
cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  resetFields();
});

/* ///////////////////////// */
/* PROCESS PENDING TASK HANDLER */
/* ///////////////////////// */

//Process pending task
document.addEventListener("click", function (e) {
  e.preventDefault;
  let currentTask = e.target.parentElement.parentElement;

  if (e.target.classList.contains("complete-task-btn")) {
    processPendingTask(e);
    completedList.append(processedTask);
  } else if (e.target.classList.contains("cancel-task-btn")) {
    processPendingTask(e);
    canceledList.append(processedTask);
  } else if (e.target.classList.contains("remove-task-btn")) {
    currentTask.remove();
  } else if (e.target.classList.contains("see-task-btn")) {
    currentTask.parentElement.parentElement.style.backdropFilter = "none";
    currentTask.childNodes[5].classList.remove("hidden");
    currentTask.childNodes[5].style.opacity = "1";
  }
});

//Close modal
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("modal") &&
    !e.target.classList.contains("hidden")
  ) {
    e.target.classList.add("hidden");
  }
});
