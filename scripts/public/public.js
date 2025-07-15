// DOM Elements - Navigation Components
const servicesDropdownTrigger = document.querySelector(".services-link");
const servicesDropdownMenu = document.querySelector(".services-menu");
const resourcesDropdownTrigger = document.querySelector(".resources-link");
const resourcesDropdownMenu = document.querySelector(".resources-menu");
const mobileMenuToggle = document.querySelector(".hamburger");
const mobileNavigationMenu = document.querySelector(".navbar");
const navigationBar = document.querySelector(".header-container .bottom");
const headerContainer = document.querySelector(".header-container");
const loadingPage = document.querySelector(".loading");
const bodyEle = document.body;

const leftElements = document.querySelectorAll(".left-side-animated");
const rightElements = document.querySelectorAll(".right-side-animated");

const leftElement = document.querySelector(".left-side-animate");
const rightElement = document.querySelector(".right-side-animate");

window.addEventListener("scroll", () => {
  if (window.scrollY > headerContainer.offsetHeight) {
    addElementVisiblity(navigationBar, "scroll");
  } else {
    removeElementVisiblity(navigationBar, "scroll");
  }

  leftElements.forEach((e) => {
    animateElementOnVisibility(
      e,
      "animate__lightSpeedInLeft",
      isElementVisible(e, 25)
    );
  });

  rightElements.forEach((e) => {
    animateElementOnVisibility(
      e,
      "animate__lightSpeedInRight",
      isElementVisible(e, 25)
    );
  });
});

window.addEventListener("load", () => {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");

  addElementVisiblity(leftElement, "animate__lightSpeedInLeft");
  addElementVisiblity(rightElement, "animate__lightSpeedInRight");
});

/**
 * Toggles the visibility of services dropdown menu
 * Handles the click event on the services and resources links to show/hide the dropdown
 */
servicesDropdownTrigger.addEventListener("click", () => {
  toggleElementVisibility(servicesDropdownMenu);
  removeElementVisiblity(resourcesDropdownMenu);
});

resourcesDropdownTrigger.addEventListener("click", () => {
  toggleElementVisibility(resourcesDropdownMenu);
  removeElementVisiblity(servicesDropdownMenu);
});

/**
 * Mobile menu functionality
 * Toggles both the hamburger button animation and mobile navigation visibility
 */
mobileMenuToggle.addEventListener("click", () => {
  toggleElementVisibility(mobileMenuToggle);
  toggleElementVisibility(mobileNavigationMenu);
});

/**
 * Generic function to toggle CSS classes on DOM elements
 * @param {HTMLElement} element - The target element to modify
 * @param {string} className - The CSS class to toggle (defaults to "active")
 */
function toggleElementVisibility(element, className = "active") {
  element.classList.toggle(className);
}

function addElementVisiblity(element, className = "active") {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

function removeElementVisiblity(element, className = "active") {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

/**
 * Checks if the element is visible in the viewport with an offset
 * @param {Element} element - DOM element to check
 * @param {number} offset - Offset from bottom of viewport
 * @returns {boolean} - True if visible, false otherwise
 */
function isElementVisible(element, offset) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight - offset;
}

/**
 * Adds animation class to one element if visible
 * @param {Element} element - DOM element
 * @param {string} animationClass
 * @param {boolean} isVisible
 */
function animateElementOnVisibility(element, animationClass, isVisible) {
  if (isVisible) {
    addElementVisiblity(element, animationClass);
  }
}
