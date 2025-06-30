// DOM Elements - Navigation Components
const servicesDropdownTrigger = document.querySelector(".services-link");
const servicesDropdownMenu = document.querySelector(".services-menu");
const resourcesDropdownTrigger = document.querySelector(".resources-link");
const resourcesDropdownMenu = document.querySelector(".resources-menu");
const mobileMenuToggle = document.querySelector(".hamburger");
const mobileNavigationMenu = document.querySelector(".navbar");
const navigationBar = document.querySelector(".header-container .bottom");
const headerContainer = document.querySelector(".header-container");

window.addEventListener("scroll", () => {
  if (window.scrollY > headerContainer.offsetHeight) {
    addElementVisiblity(navigationBar, "scroll");
  } else {
    removeElementVisiblity(navigationBar, "scroll");
  }
});

/**
 * Toggles the visibility of services dropdown menu
 * Handles the click event on the services and resources links to show/hide the dropdown
 */
servicesDropdownTrigger.addEventListener("click", () => {
  toggleElementVisibility(servicesDropdownMenu);
});

resourcesDropdownTrigger.addEventListener("click", () => {
  toggleElementVisibility(resourcesDropdownMenu);
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
