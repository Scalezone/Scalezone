const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element

//#region Handle Loading page onLoading
window.addEventListener("load", () => {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");
});

//#endregion
