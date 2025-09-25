// Select skeleton loading elements
const skeletonElements = document.querySelectorAll(".skeleton");

// Select hero section elements
const heroTitleElement = document.querySelector(
  ".hero-container .content .title h1"
);
const heroTextElements = document.querySelectorAll(
  ".hero-container .content .text-bx p"
);
const heroImageElement = document.querySelector(".hero-container .img img");

// Select services section elements
const servicesTitleElement = document.querySelector(
  ".packages-container .title h2"
);
const servicesContainer = document.querySelector(
  ".packages-container .packages-bx"
);

const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element

// Fetch page data from API
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=scale-sales")
  .then((response) => {
    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  })
  .then((data) => {
    // Check if data exists
    if (!data || data.length === 0) {
      throw new Error("No data found for the specified slug.");
    }
    // Populate sections with fetched data
    populateAllSections(data[0]);
    // Remove skeleton loading classes
    removeClassFromElements(skeletonElements);

    handleLoading(bodyEle, loadingPage);
  })
  .catch((error) => console.error(error));

/**
 * Populate all scale your sales page sections with fetched data
 * @param {Object} data - Home page data object
 */
function populateAllSections(data) {
  // Set document title
  document.title = `${
    data.title || "Boost Your Amazon Sales with Proven Growth Strategies"
  } | scalezone`;

  populateHeroSection(data);
  populateServicesSection(data);
  // Add more section population functions as needed
}

//#region Hero section

/**
 * Populate hero section with data
 * @param {Object} data
 */
function populateHeroSection(data) {
  const { hero } = data.sections;
  setHeroContent(hero);
  setHeroImage(hero);
}

/**
 * Set hero section text content
 * @param {Object} data
 */
function setHeroContent(data) {
  if (!data.content) {
    return;
  }
  setSingleElement(heroTitleElement, data.content.title);
  setMultipleElements(heroTextElements, data.content.text_list);
}

/**
 * Set hero section image
 * @param {Object} data
 */
function setHeroImage(data) {
  if (!data.image) {
    return;
  }
  setImageElement(heroImageElement, data.image, data.content.title);
}
//#endregion

//#region Services section
/**
 * Populate services section with data
 * @param {Object} data
 */
function populateServicesSection(data) {
  const { services } = data.sections;
  if (!services) {
    return;
  }

  setSingleElement(servicesTitleElement, services.title);

  // If no services, show not found message
  if (services.services_list.length === 0) {
    servicesContainer.appendChild(notFoundMessage("packages"));
    return;
  }

  // Create and append each service package
  services.services_list.forEach((service) => {
    servicesContainer.appendChild(createPackageContainer(service));
  });
}

/**
 * Create a package container element for a service
 * @param {Object} servicePackage
 * @returns {HTMLElement}
 */
function createPackageContainer(servicePackage) {
  if (!servicePackage) {
    return;
  }

  // container box
  const packageElement = createElement("div", [
    "package",
    "d-flex",
    "flex-column",
    "gap-4",
    "justify-content-between",
    "align-items-center",
    "p-3",
  ]);

  // content
  const contentBox = createElement("div", [
    "box",
    "d-flex",
    "flex-column",
    "gap-4",
    "align-items-center",
  ]);

  const image = createPackageImage(servicePackage.image, servicePackage.title);
  const textBox = createTextBoxElement(
    servicePackage.title,
    servicePackage.items
  );

  // button
  const button = createPackageButton(
    servicePackage.button_text,
    servicePackage.button_link
  );

  contentBox.appendChild(image);
  contentBox.appendChild(textBox);

  packageElement.appendChild(contentBox);
  packageElement.appendChild(button);

  return packageElement;
}

/**
 * Create image element for a package
 * @param {string} imgSrc
 * @param {string} imgAlt
 * @returns {HTMLElement}
 */
function createPackageImage(imgSrc, imgAlt) {
  if (!imgSrc || !imgAlt) {
    return;
  }

  const imageBox = createElement("div", ["img"]);
  const imageElement = createElement("img");

  setImageElement(imageElement, imgSrc, imgAlt);

  imageBox.appendChild(imageElement);

  return imageBox;
}

/**
 * Create text box element for a package
 * @param {string} title
 * @param {Array|string} items
 * @returns {HTMLElement}
 */
function createTextBoxElement(title, items) {
  const contentBox = createElement("div", ["content"]);
  const titleBox = createElement("div", ["title", "text-center"]);
  const titleElement = createElement("h3", ["caption"]);
  const itemsBox = createElement("div", ["text-bx"]);
  const itemsListElement = createElement("ul");
  // Support both array and string with "|" separator
  const itemsList = Array.isArray(items) ? items : items.split("|");

  setSingleElement(titleElement, title);

  for (let i = 0; i < itemsList.length; i++) {
    const itemElement = document.createElement("li");
    itemElement.textContent = itemsList[i];

    itemsListElement.appendChild(itemElement);
  }

  titleBox.appendChild(titleElement);
  itemsBox.appendChild(itemsListElement);

  contentBox.append(titleBox, itemsBox);
  return contentBox;
}

/**
 * Create button element for a package
 * @param {string} buttonText
 * @param {string} buttonLink
 * @returns {HTMLElement}
 */
function createPackageButton(buttonText, buttonLink) {
  if (!buttonText || !buttonLink) {
    return;
  }

  const buttonElement = createElement("a", [
    "public-btn",
    "text-decoration-none",
    "position-relative",
    "overflow-hidden",
    "z-1",
    "animate__zoomInRight",
    "animate__animated",
  ]);

  buttonElement.href = buttonLink;
  setSingleElement(buttonElement, buttonText);

  return buttonElement;
}
//#endregion

//#region Helper Methods

/**
 * Create not found message element
 * @param {string} elementsName
 * @returns {HTMLElement}
 */
function notFoundMessage(elementsName) {
  const noVideosMessage = createElement("p", [
    "not-found",
    "text-center",
    "mb-5",
  ]);
  setSingleElement(
    noVideosMessage,
    `No ${elementsName.trim()} available at the moment.`
  );

  return noVideosMessage;
}

/**
 * Set multiple elements' text content from array
 * @param {NodeList} elementsArray
 * @param {Array} content
 */
function setMultipleElements(elementsArray, content) {
  if (!content || !elementsArray) {
    return;
  }

  content.forEach((el, index) => {
    if (elementsArray[index]) {
      elementsArray[index].textContent = el;
    }
  });
}

/**
 * Set single element's text content
 * @param {HTMLElement} element
 * @param {string} content
 */
function setSingleElement(element, content) {
  if (!element || !content) {
    return;
  }

  element.textContent = content;
}

/**
 * Set image element's src, alt, and loading attributes
 * @param {HTMLImageElement} image
 * @param {string} src
 * @param {string} alt
 */
function setImageElement(image, src, alt) {
  if (!image || !src || !alt) {
    return;
  }

  image.src = src || "assets/public/default.webp";
  image.alt = alt;
  image.loading = "lazy";
}

/**
 * Remove a class from all elements in array
 * @param {NodeList} elementArray
 * @param {string} className
 */
function removeClassFromElements(elementArray, className = "skeleton") {
  elementArray.forEach((element) => {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  });
}

/**
 * Create an element with optional classes and text content
 * @param {string} tag
 * @param {Array} classes
 * @param {string} content
 * @returns {HTMLElement}
 */
function createElement(tag, classes = [], content = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (content) el.textContent = content;
  return el;
}

//#endregion
//#region Handle Loadin page on fetching
function handleLoading() {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");
}
//#endregion
