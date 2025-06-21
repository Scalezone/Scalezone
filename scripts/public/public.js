// DOM Elements - Navigation Components
const servicesDropdownTrigger = document.querySelector(".services-link");
const servicesDropdownMenu = document.querySelector(".services-menu");
const mobileMenuToggle = document.querySelector(".hamburger");
const mobileNavigationMenu = document.querySelector(".navbar");

/**
 * Toggles the visibility of services dropdown menu
 * Handles the click event on the services link to show/hide the dropdown
 */
servicesDropdownTrigger.addEventListener("click", () => {
  toggleElementVisibility(servicesDropdownMenu);
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
