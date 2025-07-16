const buildCards = document.querySelectorAll(".cards-side .card");
const buildCardsContainer = document.querySelector(".cards-side");

window.addEventListener("scroll", () => {
  buildCards.forEach((e) => {
    animateElementOnVisibility(
      e,
      "animate__tada",
      isElementVisible(buildCardsContainer, 100)
    );
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
