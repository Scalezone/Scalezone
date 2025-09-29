// DOM Elements - Navigation Components
const servicesDropdownTrigger = document.querySelector(".services-link"); // Services dropdown trigger
const servicesDropdownMenu = document.querySelector(".services-menu"); // Services dropdown menu
const resourcesDropdownTrigger = document.querySelector(".resources-link"); // Resources dropdown trigger
const resourcesDropdownMenu = document.querySelector(".resources-menu"); // Resources dropdown menu
const mobileMenuToggle = document.querySelector(".hamburger"); // Hamburger menu button
const mobileNavigationMenu = document.querySelector(".navbar"); // Mobile navigation menu
const navigationBar = document.querySelector(".header-container .bottom"); // Navigation bar
const headerContainer = document.querySelector(".header-container"); // Header container

const leftElements = document.querySelectorAll(".left-side-animated"); // Elements animated from left
const rightElements = document.querySelectorAll(".right-side-animated"); // Elements animated from right

// Animate left-side elements on initial load
leftElements.forEach((e) => {
  animateElementOnVisibility(
    e,
    "animate__lightSpeedInLeft",
    isElementVisible(e, 25)
  );
});

// Animate right-side elements on initial load
rightElements.forEach((e) => {
  animateElementOnVisibility(
    e,
    "animate__lightSpeedInRight",
    isElementVisible(e, 25)
  );
});

// Handle scroll events for navigation bar and animations
window.addEventListener("scroll", () => {
  // Show/hide navigation bar on scroll
  if (window.scrollY > headerContainer.offsetHeight) {
    addElementVisiblity(navigationBar, "scroll");
  } else {
    removeElementVisiblity(navigationBar, "scroll");
  }

  // Animate left-side elements on scroll
  leftElements.forEach((e) => {
    animateElementOnVisibility(
      e,
      "animate__lightSpeedInLeft",
      isElementVisible(e, 25)
    );
  });

  // Animate right-side elements on scroll
  rightElements.forEach((e) => {
    animateElementOnVisibility(
      e,
      "animate__lightSpeedInRight",
      isElementVisible(e, 25)
    );
  });
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

/**
 * Adds a CSS class to an element if not already present
 * @param {HTMLElement} element
 * @param {string} className
 */
function addElementVisiblity(element, className = "active") {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

/**
 * Removes a CSS class from an element if present
 * @param {HTMLElement} element
 * @param {string} className
 */
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

// Fetch Header and Footer data from API
// Select elements for header/footer population
const whatsappNumber = document.querySelector(
  "header .top .number a:first-child"
); // WhatsApp link
const phoneNumber = document.querySelector("header .top .number a:last-child"); // Phone link
const email = document.querySelector("header .top .mail a"); // Email link

const logo = document.querySelector("header .bottom .logo a img"); // Logo image
const homeLink = document.querySelector(
  "header .bottom .navbar nav a[href='/']"
); // Home link
const servicesButton = document.querySelector(
  "header .bottom .navbar nav .dropdown-services button"
); // Services button
const servicesMenu = document.querySelector(
  "header .bottom .navbar nav .dropdown-services .services-menu"
); // Services menu
const resourcesButton = document.querySelector(
  "header .bottom .navbar nav .dropdown-resources button"
); // Resources button
const blogs = document.getElementById("blogs"); // Blogs link
const podcasts = document.getElementById("podcasts"); // Podcasts link
const videos = document.getElementById("videos"); // Videos link
const about = document.getElementById("about"); // About link
const contact = document.getElementById("contact"); // Contact link
const button = document.querySelector("header .bottom .navbar .public-btn"); // Public button

const followTitle = document.getElementById("follow-title");
const facebook = document.getElementById("facebook");
const youtube = document.getElementById("youtube");
const instagram = document.getElementById("instagram");
const linkedin = document.getElementById("linkedin");
const whatsapp = document.getElementById("whatsapp");
const tiktok = document.getElementById("tiktok");
const logoElement = document.getElementById("logo");
const servicesElement = document.getElementById("services");
const quickElement = document.getElementById("quick");
const contactElement = document.getElementById("contact-links");
const informationsElement = document.getElementById("informations");
const year = document.getElementById("year");

const path = window.location.pathname; // Current page path

// Fetch header and footer data from CMS API
fetch(`https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=header-and-footer`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  })
  .then((data) => {
    if (!data[0]) {
      throw new Error("No data found");
    }
    populateHeaderFooter(data[0]);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

/**
 * Populates header and footer with fetched data
 * @param {Object} data
 */
function populateHeaderFooter(data) {
  populateHeader(data);
  populateFooter(data);
  const current = new Date();
  changeContent(year, current.getFullYear());
}

//#region Header
/**
 * Populates header sections (top and bottom)
 * @param {Object} data
 */
function populateHeader(data) {
  const { top, bottom } = data.header;
  if (!top || !bottom) {
    console.log("Top or Bottom data is missing!");
    return;
  }
  setTopHeader(top);
  setBottomHeader(bottom);
}

/**
 * Sets top header content (WhatsApp, phone, email)
 * @param {Object} top
 */
function setTopHeader(top) {
  whatsappNumber.href = `https://wa.me/${top.whats_app_number}`;
  changeContentWithIcon(
    whatsappNumber,
    top.whatsapp_text,
    '<i class="fa-brands fa-whatsapp"></i>'
  );

  phoneNumber.href = `tel:${top.phone_number}`;
  changeContentWithIcon(
    phoneNumber,
    top.phone_number,
    '<i class="fa-solid fa-phone"></i>'
  );

  email.href = `mailto:${top.email}`;
  changeContentWithIcon(
    email,
    top.email,
    '<i class="fa-regular fa-envelope"></i>'
  );
}

/**
 * Sets bottom header content (logo, navigation, services, resources)
 * @param {Object} bottom
 */
function setBottomHeader(bottom) {
  setImageElement(logo, bottom.logo, "Logo Image");
  logo.setAttribute("decoding", "async");
  logo.setAttribute("fetchpriority", "high");
  logo.style.maxHeight = "100px";
  changeContent(homeLink, bottom.navbar.home);
  changeContent(servicesButton, bottom.navbar.services.text);
  changeContent(resourcesButton, bottom.navbar.resources.resources_text);
  changeContent(blogs, bottom.navbar.resources.blogs);
  changeContent(podcasts, bottom.navbar.resources.podcasts);
  changeContent(videos, bottom.navbar.resources.videos);
  changeContent(about, bottom.navbar.about_us);
  changeContent(contact, bottom.navbar.contact_us);
  changeContent(button, bottom.button);
  const serviceList = bottom.navbar.services.list;

  // Add service items to services menu
  serviceList.forEach((service) => {
    servicesMenu.appendChild(createServiceElement(service.title, service.slug));
  });
}
//#endregion

//#region Footer
function populateFooter(data) {
  const { top, links } = data.footer;
  if (!top || !links) {
    console.warn("Top or Links data is missing!");
    return;
  }

  setTopFooter(top);
  setFooterLinks(links);
}

function setTopFooter(top) {
  if (!top.follows) {
    console.warn("Follows data is missing!");
    return;
  }

  changeContent(followTitle, top.follows.text);
  changeHref(facebook, top.follows.facebook);
  changeHref(youtube, top.follows.youtube);
  changeHref(instagram, top.follows.instagram);
  changeHref(linkedin, top.follows.linkedin);
  changeHref(whatsapp, `https://wa.me/${top.follows.whatsapp_number}`);
  changeHref(tiktok, top.follows.tiktok);
}

function setFooterLinks(links) {
  const { logo, services, quick, contact, informations } = links;
  if (!logo || !services || !quick || !contact || !informations) {
    console.warn("Links data is missing!");
    return;
  }

  setLogoElements(logoElement, logo);
  setServicesElements(servicesElement, services);
  setQuickElements(quickElement, quick);
  setContactElements(contactElement, contact);
  setInformationElemnets(informationsElement, informations);
}

function setLogoElements(element, logo) {
  const logoImage = element.querySelector("img");
  const logoDescription = element.querySelector("p");

  setImageElement(logoImage, logo.image, "Logo Image");
  changeContent(logoDescription, logo.description);
}

function setServicesElements(element, services) {
  const title = element.querySelector("h3");
  const listElements = element.querySelector("ul");

  changeContent(title, services.title);

  services.list.forEach((service) => {
    listElements.appendChild(createServiceElement(service.title, service.slug));
  });
}

function setQuickElements(element, quickLinks) {
  const title = element.querySelector("h3");
  const home = element.querySelector("p:nth-child(2) a");
  const about = element.querySelector("p:nth-child(3) a");
  const contact = element.querySelector("p:last-child a");

  changeContent(title, quickLinks.quick_title);
  changeContent(home, quickLinks.home_link);
  changeContent(about, quickLinks.about_link);
  changeContent(contact, quickLinks.contact_link);
}

function setContactElements(element, contact) {
  const title = element.querySelector("h3");
  const whatsappElement = element.querySelector("a:nth-child(2)");
  const whatsappText = whatsappElement.querySelector("span");
  const emailElement = element.querySelector("a:nth-child(3)");
  const emailText = emailElement.querySelector("span");
  const phoneElement = element.querySelector("a:nth-child(4)");
  const phoneText = phoneElement.querySelector("span");

  changeContent(title, contact.contact_title);
  changeContent(whatsappText, contact.whatsapp.whatsapp_text);
  changeContent(emailText, contact.email);
  changeContent(
    phoneText,
    `${
      contact.phone_number.includes("+")
        ? contact.phone_number
        : "+" + contact.phone_number
    }`
  );

  changeHref(
    whatsappElement,
    `https://wa.me/${contact.whatsapp.whatsapp_number}`
  );
  changeHref(emailElement, `mailto:${contact.email}`);
  changeHref(phoneElement, `tel:${contact.phone_number}`);
}

function setInformationElemnets(element, informations) {
  const title = element.querySelector("h3");
  const terms = element.querySelector("p:nth-child(2) a");
  const privacy = element.querySelector("p:nth-child(3) a");
  const cookies = element.querySelector("p:nth-child(4) a");
  const disclaimer = element.querySelector("p:nth-child(5) a");

  changeContent(title, informations.title);
  changeContent(terms, informations.terms_text);
  changeContent(privacy, informations.policy_text);
  changeContent(cookies, informations.cookies);
  changeContent(disclaimer, informations.disclaimer_text);
}

//#endregion

//#region Helper methods
/**
 * Creates a service menu item element
 * @param {string} text
 * @param {string} slug
 * @returns {HTMLElement}
 */
function createServiceElement(text, slug) {
  const listElement = createElement("li", ["px-3", "py-2"]);
  const link = createElement("a", ["text-decoration-none"], "", text);

  // Set link href based on current path depth
  if ((path.match(/\//g) || []).length <= 1) {
    link.href = `services/service.html?slug=${slug}`;
  } else {
    link.href = `/services/service.html?slug=${slug}`;
  }

  listElement.appendChild(link);
  return listElement;
}

function changeHref(element, href) {
  if (element && href) element.href = href;
}

/**
 * Create an element with optional classes and text content
 * @param {string} tag
 * @param {Array} classes
 * @param {string} content
 * @returns {HTMLElement}
 */
function createElement(
  tag,
  classes = [],
  id = "",
  content = "",
  inputType = ""
) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (id) el.id = id;
  if (content) el.textContent = content;
  if (inputType) el.type = inputType;
  return el;
}

/**
 * Sets image src and alt to an element
 * @param {HTMLElement} element
 * @param {string} imageUrl
 * @param {string} imageAlt
 */
function setImageElement(element, imageUrl, imageAlt = "") {
  if (element && imageUrl) {
    element.src = imageUrl;
    element.alt = imageAlt || "Image";
  }
}

/**
 * Change the text content of an element
 * @param {Element} element - DOM element
 * @param {string} content - New content to set
 */
function changeContent(element, content) {
  if (element) {
    element.textContent = content;
  }
}

/**
 * Change the content of an element with icon
 * @param {Element} element - DOM element
 * @param {string} content - New content to set
 * @param {string} icon - Icon HTML
 */
function changeContentWithIcon(element, content, icon) {
  if (element) {
    element.innerHTML = `${icon} ${content}`;
  }
}
//#endregion
