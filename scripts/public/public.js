// Select the service dropdown elements
const servicesLink = document.querySelector(".services-link");
const servicesDropdown = document.querySelector(".services-menu");

// Add a click event listener to the services link
servicesLink.addEventListener("click", () => {
  // Toggle the 'active' class on the dropdown menu
  toggleActiveClass(servicesDropdown);
});

// Function to toggle the 'active' class on a given element
function toggleActiveClass(ele, className = "active") {
  ele.classList.toggle(className);
}
