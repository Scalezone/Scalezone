const leftElement = document.querySelector(".left-animate");
const rightElement = document.querySelector(".right-animate");
const blogCards = document.querySelectorAll(".blog-card");

window.addEventListener("load", () => {
  addAnimationClassToElement(leftElement, "animate__rotateInDownLeft");
  addAnimationClassToElement(rightElement, "animate__rotateInDownRight");
});

window.addEventListener("scroll", () => {
  blogCards.forEach((e) => {
    animateElementOnVisibility(e, "animate__jello", isElementVisible(e, 25));
  });
});

/**
 * Checks if the element is visible in the viewport with an offset
 * @param {Element} element - DOM element to check
 * @param {number} offset - Offset from bottom of viewport
 * @returns {boolean} - True if visible, false otherwise
 */
function isElementVisible(element, offset) {
  let rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight - offset;
}

/**
 * Adds animation class to one element if visible
 * @param {Element} element - DOM element
 * @param {string} animationClass
 * @param {boolean} isVisible
 */
function animateElementOnVisibility(element, className, isVisible) {
  if (isVisible) {
    addAnimationClassToElement(element, className);
  }
}

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
