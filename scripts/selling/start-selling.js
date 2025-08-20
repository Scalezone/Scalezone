// Select hero section elements
const skeletonElements = document.querySelectorAll(".skeleton");

const heroTitleElement = document.querySelector(".hero-container .title h1");
const heroSubscribeButton = document.querySelector(
  ".hero-container .subscribe .public-btn"
);
const trustedAvatarsImage = document.querySelector(
  ".hero-container .subscribe .trusted-by .avatars img"
);
const trustedBusinessesNumber = document.querySelector(
  ".hero-container .subscribe .trusted-by p strong"
);

// Select selling section elements
const sellingTitle = document.querySelector(".selling-container .content h2");
const sellingSubtitle = document.querySelector(".selling-container .caption");
const sellingIntroText = document.querySelector("#intro");
const sellingTextElements = document.querySelectorAll(
  ".selling-container .text-bx p:not(#intro)"
);
const sellingImageElement = document.querySelector(
  ".selling-container .image img"
);

// Fetch the data from the wordpress REST API
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=start-selling")
  .then((response) => {
    // Check if response is OK
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Get the first page data
    const pageData = data[0];
    if (!pageData) {
      throw new Error("No data found for the specified slug");
    }
    // Populate sections and remove skeleton loading classes
    populateAllSections(pageData);
    removeClassFromElements(skeletonElements);
  })
  .catch((error) => console.error(`Error fetching data: ${error}`));

/**
 * Populates all sections of the page with fetched data
 * @param {Object} data - Page data from API
 */
function populateAllSections(data) {
  // Set document title
  document.title = `${
    data.title || "Start Selling on Amazon with Scalezone"
  } | Scalezone`;

  populateHeroSection(data);
  populateSellingSection(data);
}

//#region Hero Section

/**
 * Populates the hero section with data
 * @param {Object} data - Page data
 */
function populateHeroSection(data) {
  const { hero } = data.sections;
  if (!hero) {
    throw new Error("Hero data is missing");
  }

  setHeroContent(hero);
}

/**
 * Sets content for hero section elements
 * @param {Object} data - Hero section data
 */
function setHeroContent(data) {
  setContent(heroTitleElement, data.title);
  setButtonContent(heroSubscribeButton, data.button_text, data.button_link);
  setImageContent(trustedAvatarsImage, data.trusted_image, data.title);
  setContent(trustedBusinessesNumber, data.trusted_number);
}
//#endregion

//#region Selling Section

/**
 * Populates the selling section with data
 * @param {Object} data - Page data
 */
function populateSellingSection(data) {
  const { selling } = data.sections;
  if (!selling) {
    throw new Error("Selling section data is missing");
  }

  setSellingContent(selling);
}

/**
 * Sets content for selling section elements
 * @param {Object} data - Selling section data
 */
function setSellingContent(data) {
  setContent(sellingTitle, data.title);
  setContent(sellingSubtitle, data.subtitle);
  setImageContent(sellingImageElement, data.image, data.title);

  // Highlight "Scalezone" in intro text
  sellingIntroText.innerHTML = data.intro_text.replace(
    /scalezone/gi,
    "<strong>Scalezone</strong>"
  );

  // Set content for each selling paragraph
  sellingTextElements.forEach((element, index) => {
    if (data.paragraphs && data.paragraphs[index]) {
      setContent(element, data.paragraphs[index]);
    }
  });
}
//#endregion

//#region Helper methods

/**
 * Sets text content for an element
 * @param {HTMLElement} element
 * @param {string} content
 */
function setContent(element, content) {
  if (element && content) {
    element.textContent = content;
  }
}

/**
 * Sets button text and link
 * @param {HTMLElement} button
 * @param {string} content
 * @param {string} link
 */
function setButtonContent(button, content, link) {
  if (button && content) {
    button.textContent = content;
    button.href = link || "#";
  }
}

/**
 * Sets image source and alt text
 * @param {HTMLImageElement} imageElement
 * @param {string} imageUrl
 * @param {string} imageAlt
 */
function setImageContent(imageElement, imageUrl, imageAlt = "") {
  if (imageElement && imageUrl) {
    imageElement.src = imageUrl;
    imageElement.alt = imageAlt || "Image";
  }
}

/**
 * Removes a class from a list of elements
 * @param {NodeList} elementArray
 * @param {string} className
 */
function removeClassFromElements(elementArray, className = "skeleton") {
  elementArray.forEach((element) => {
    if (element && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  });
}

//#endregion
