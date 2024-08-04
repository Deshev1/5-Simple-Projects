function updatePageBtns(state1, v2, v3, v4, v5, v6) {
  state = state1;
  pageBtn2.textContent = v2;
  pageBtn3.textContent = v3;
  pageBtn4.textContent = v4;
  pageBtn5.textContent = v5;
  pageBtn6.textContent = v6;
}
let seeStart = updatePageBtns("start", 2, 3, 4, 5, "...");

let seeEnd = updatePageBtns(
  "end",
  "...",
  numberOfPages - 4,
  numberOfPages - 3,
  numberOfPages - 2,
  numberOfPages - 1
);

let seeThree = updatePageBtns(
  "three",
  "...",
  pageValue - 1,
  pageValue,
  pageValue + 1,
  "..."
);

let makeBtn4Active = function () {
  document.querySelector(".active-btn").classList.remove("active-btn");
  pageBtn4.classList.add("active-btn");
};
