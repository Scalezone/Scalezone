const leftAnimationEle = document.querySelector(".left-animate");
const rightAnimationEle = document.querySelector(".right-animate");

// Animate hero section elements on page load
window.addEventListener("load", () => {
  addAnimationClassToElement(leftAnimationEle, "animate__jackInTheBox");
  addAnimationClassToElement(rightAnimationEle, "animate__jackInTheBox");
});

/**
 * Adds a class to an element if not already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function addAnimationClassToElement(element, className = "active") {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}
