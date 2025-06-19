const servicesLink = document.querySelector(".services-link");
const servicesDropdown = document.querySelector(".services-menu");

servicesLink.addEventListener("click", () => {
  toggleActiveClass(servicesDropdown);
});

function toggleActiveClass(ele) {
  ele.classList.toggle("active");
}
