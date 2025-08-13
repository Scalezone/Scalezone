// Select hero section elements for animation
const heroCaptionElements = document.querySelectorAll(
  ".hero .caption, .hero .title h1, .hero .text p, .hero .public-btn"
);
const heroCircleElements = document.querySelectorAll(".hero .img .circle");

// Select service and feature cards
const serviceMainCards = document.querySelectorAll(".main-card");
const featuresCardsContainer = document.querySelector(".features .cards");
const featuresProgressCardsTop = document.querySelectorAll(".progress-card.up");
const featuresProgressCardsBottom = document.querySelectorAll(
  ".progress-card.down"
);

// Animate sections and cards on scroll
window.addEventListener("scroll", function () {
  serviceMainCards.forEach((card) => {
    animateElementOnVisibility(
      card,
      "animate__jackInTheBox",
      isElementVisible(card, 10)
    );
  });

  featuresProgressCardsBottom.forEach((card) => {
    animateElementOnVisibility(
      card,
      "animate__bounceInRight",
      isElementVisible(featuresCardsContainer, 100)
    );
  });

  featuresProgressCardsTop.forEach((card) => {
    animateElementOnVisibility(
      card,
      "animate__rollIn",
      isElementVisible(featuresCardsContainer, 100)
    );
  });
});

// Fetch data from WordPress REST API and populate homepage sections
//#region Element Selectors
// General facts elements
const expElements = document.querySelectorAll(".exp h3");
const teamElements = document.querySelectorAll(".team h3");
const accountElements = document.querySelectorAll(".account h3");
const feedbackElements = document.querySelectorAll(".feedback h3");

// Hero section elements
const heroImg = document.querySelector(".hero-container .img img");
const heroCaption = document.querySelector(
  ".hero-container .content .title .caption"
);
const heroTitle = document.querySelector(".hero-container .content .title h1");
const heroText = document.querySelector(".hero-container .content .text p");
const heroButtons = document.querySelectorAll(
  ".hero-container .text .public-btn"
);

// Mission section elements
const missionTitle = document.querySelector(
  ".mission-container .content .title h2"
);
const missionParagraphs = document.querySelectorAll(
  ".mission-container .content .text-box p"
);
const missionButton = document.querySelector(
  ".mission-container .content .public-btn"
);
const missionVideoDesktopSource = document.querySelector(
  ".mission-container .video .video-desktop source"
);
const missionVideoMobileSource = document.querySelector(
  ".mission-container .video .video-mobile source"
);
const missionVideoDesktop = document.querySelector(
  ".mission-container .video .video-desktop"
);
const missionVideoMobile = document.querySelector(
  ".mission-container .video .video-mobile"
);

// Vision section elements
const visionImg = document.querySelector(".vision-container .images img");
const visionTitle = document.querySelector(
  ".vision-container .content .title h2"
);
const visionParagraphs = document.querySelectorAll(
  ".vision-container .content .text-box p"
);

// "What makes us different" section elements
const differentTitle = document.querySelector(
  ".features-container .content .title h2"
);
const differentTextBox = document.querySelector(
  ".features-container .content .text-box"
);

// Testimonials section elements
const testimonialsTitle = document.querySelector(
  ".testimonials-container .title h2"
);
const testimonialsSubtitle = document.querySelector(
  ".testimonials-container .title .caption"
);
const testimonialsFeedbacksContainer = document.querySelector(
  ".testimonials-container .card-wrapper"
);
//#endregion

// Fetch home page data from WordPress REST API
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=home")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.length > 0) {
      populateAllSections(data[0]);
    } else {
      console.error("No data found for the specified slug.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

/**
 * Populate all homepage sections with fetched data
 * @param {Object} data - Home page data object
 */
function populateAllSections(data) {
  populateGeneralFacts(data);
  populateHeroSection(data);
  populateMissionSection(data);
  populateVisionSection(data);
  populateDifferentSection(data);
  populateTestimonialsSection(data);
  // Add more section population functions as needed
}

//#region General Facts Section
/**
 * Populate general facts section
 * @param {Object} data - Home page data object
 */
function populateGeneralFacts(data) {
  const facts = data.acf.general_content.facts;
  setFactsData(facts);
}

/**
 * Set facts data to corresponding elements
 * @param {Object} facts - Facts data object
 */
function setFactsData(facts) {
  if (!facts) {
    console.error("General content data not found.");
    return;
  }

  const factsConfig = [
    { elements: expElements, value: facts.years_experience, suffix: "+" },
    { elements: teamElements, value: facts.team_members, suffix: "+" },
    { elements: accountElements, value: facts.account_managed, suffix: "+" },
    { elements: feedbackElements, value: facts.positive_feedback, suffix: "%" },
  ];

  factsConfig.forEach((fact) => {
    if (fact.elements && fact.value) {
      setFactElements(fact.elements, fact.value, fact.suffix);
    }
  });
}

/**
 * Set text content for fact elements
 * @param {NodeList} elements - Elements to update
 * @param {string|number} value - Value to display
 * @param {string} suffix - Suffix to append
 */
function setFactElements(elements, value, suffix) {
  elements.forEach((el) => {
    el.textContent = `${value}${suffix}`;
  });
}

//#endregion

//#region Hero Sectio
/**
 * Populate hero section with data
 * @param {Object} data - Home page data object
 */
function populateHeroSection(data) {
  const heroData = data.acf.hero;
  const facts = data.acf.general_content.facts;
  setHeroImage(heroData, facts);
  setHeroContent(heroData);
}

/**
 * Set hero image
 * @param {Object} heroData - Hero section data
 * @param {Object} facts - General facts data
 */
function setHeroImage(heroData, facts) {
  const imageData = heroData.image;
  if (imageData && facts) {
    heroImg.src = imageData.hero_image;
  } else {
    console.error("Hero image data not found.");
  }
}

/**
 * Set hero content (caption, title, text, buttons)
 * @param {Object} heroData - Hero section data
 */
function setHeroContent(heroData) {
  const content = heroData.content;
  if (content) {
    heroCaption.textContent = content.hero_caption;
    heroTitle.textContent = content.hero_title;
    heroText.textContent = content.hero_description;
    setTextArrayToElements(content.buttons_text, heroButtons);
    setHrefArrayToElements(content.buttons_link, heroButtons);

    // Add arrow icon to each button
    const arrowIcon = createArrowIcon();
    appendToEach(heroButtons, arrowIcon);
  } else {
    console.error("Hero content data not found.");
  }
}

//#endregion

//#region Mission Section
/**
 * Populate mission section with data
 * @param {Object} data - Home page data object
 */
function populateMissionSection(data) {
  const missionData = data.acf.mission;
  setMissionContent(missionData);
  setMissionVideos(missionData);
}

/**
 * Set mission content (title, paragraphs, button)
 * @param {Object} missionData - Mission section data
 */
function setMissionContent(missionData) {
  const content = missionData.content;
  if (content) {
    missionTitle.textContent = content.mission_title;
    setTextArrayToElements(content.mission_paragraphs, missionParagraphs);
    missionButton.textContent = content.mission_button_text;
  } else {
    console.error("Mission content data not found.");
  }
}

/**
 * Set mission videos (desktop and mobile)
 * @param {Object} missionData - Mission section data
 */
function setMissionVideos(missionData) {
  const video = missionData.video;
  if (video) {
    missionVideoDesktopSource.src = video.mission_desktop_video;
    missionVideoMobileSource.src = video.mission_mobile_video;
    missionVideoDesktop.load();
    missionVideoMobile.load();
  } else {
    console.error("Mission video data not found.");
  }
}

//#endregion

//#region Vision Section
/**
 * Populate vision section with data
 * @param {Object} data - Home page data object
 */
function populateVisionSection(data) {
  const visionData = data.acf.vision;
  setVisionContent(visionData);
  setVisionImage(visionData);
}

/**
 * Set vision content (title, paragraphs)
 * @param {Object} visionData - Vision section data
 */
function setVisionContent(visionData) {
  const content = visionData.content;
  if (content) {
    visionTitle.textContent = content.vision_title;
    setTextArrayToElements(content.vision_text, visionParagraphs);
  } else {
    console.error("Vision content data not found.");
  }
}

/**
 * Set vision image
 * @param {Object} visionData - Vision section data
 */
function setVisionImage(visionData) {
  const image = visionData.image;
  if (image) {
    visionImg.src = image.vision_image;
  } else {
    console.error("Vision image data not found.");
  }
}

//#endregion

//#region "What Makes Us Different" Section
/**
 * Populate "What makes us different" section
 * @param {Object} data - Home page data object
 */
function populateDifferentSection(data) {
  const differentData = data.acf.different;
  setDifferentContent(differentData);
}

/**
 * Set content for "What makes us different" section
 * @param {Object} differentData - Section data
 */
function setDifferentContent(differentData) {
  if (!differentData.title) {
    console.error("Different title data not found.");
  }
  differentTitle.textContent = differentData.title;

  const features = differentData.features;
  if (!features || features.length === 0) {
    console.error("Different features data not found.");
    return;
  }

  features.forEach((feature, idx) => {
    const featureElement = createFeatureElement(feature, idx + 1);
    if (!featureElement) {
      console.error("Feature element creation failed.");
      return;
    }
    differentTextBox.appendChild(featureElement);
  });
}

//#endregion

//#region Testimonials Section
function populateTestimonialsSection(data) {
  const testimonialsData = data.acf.testimonials;
  setTestimonialsContent(testimonialsData);
}

function setTestimonialsContent(testimonialsData) {
  testimonialsTitle.textContent = testimonialsData.title;
  testimonialsSubtitle.textContent = testimonialsData.subtitle;

  testimonialsData.feedbacks.forEach((feedback) => {
    testimonialsFeedbacksContainer.appendChild(createFeedbackElement(feedback));
  });
}
//#endregion

//#region Helper Functions
/**
 * Create an arrow icon element
 * @returns {HTMLElement} - Arrow icon element
 */
function createArrowIcon() {
  const arrowDiv = document.createElement("div");
  arrowDiv.classList.add("arrow");
  const arrowImg = document.createElement("img");
  arrowImg.src = "assets/blogs/arrow.svg";
  arrowImg.alt = "Arrow icon";
  arrowDiv.appendChild(arrowImg);
  return arrowDiv;
}

/**
 * Set array of text values to NodeList of elements
 * @param {Array} textArray - Array of text values
 * @param {NodeList} elements - Elements to update
 */
function setTextArrayToElements(textArray, elements) {
  for (let i = 0; i < textArray.length; i++) {
    if (elements[i]) {
      elements[i].textContent = textArray[i];
    }
  }
}

/**
 * Set array of href values to NodeList of elements
 * @param {Array} hrefArray - Array of href values
 * @param {NodeList} elements - Elements to update
 */
function setHrefArrayToElements(hrefArray, elements) {
  for (let i = 0; i < hrefArray.length; i++) {
    if (elements[i]) {
      elements[i].href = hrefArray[i];
    }
  }
}

/**
 * Append a child node to each element in a NodeList
 * @param {NodeList} parentElements - Elements to append to
 * @param {Node} child - Node to append
 */
function appendToEach(parentElements, child) {
  parentElements.forEach((el) => {
    if (el) {
      el.appendChild(child.cloneNode(true));
    }
  });
}

/**
 * Create a feature element for the "What makes us different" section
 * @param {Object} feature - Feature data
 * @param {number} index - Feature index
 * @returns {HTMLElement} - Feature element
 */
function createFeatureElement(feature, index) {
  if (!feature) {
    console.error("Feature data not found.");
    return null;
  }
  const featureDiv = document.createElement("div");
  featureDiv.classList.add("feature");
  const featureHeading = document.createElement("h3");
  const featureText = document.createElement("p");
  featureHeading.textContent = `${index}. ${feature.title}`;
  featureText.textContent = feature.feature_text;
  featureDiv.appendChild(featureHeading);
  featureDiv.appendChild(featureText);
  return featureDiv;
}

function createFeedbackElement(feedback) {
  if (!feedback) {
    console.error("Feedback data not found.");
    return;
  }
  // container
  const feedbackContainer = ele("div", [
    "rev-card",
    "d-flex",
    "flex-column",
    "gap-4",
    "swiper-slide",
    "align-items-center",
    "justify-content-center",
    "text-center",
    "position-relative",
  ]);

  // stars
  const starsContainer = createStarsContainer(feedback.stars_number || 0);

  // Content
  const contentContainer = ele("div", [
    "content",
    "d-flex",
    "flex-column",
    "gap-2",
    "justify-content-between",
  ]);
  const feedbackTextBox = createFeedbackText(feedback.feedback_text || "");
  const clientNameElement = createClientName(feedback.client_name || "");

  contentContainer.append(feedbackTextBox, clientNameElement);
  feedbackContainer.append(starsContainer, contentContainer);

  return feedbackContainer;
}

function createStarsContainer(starsCount) {
  const starsContainer = ele("div", [
    "stars",
    "d-flex",
    "gap-2",
    "align-items-center",
    "position-relative",
  ]);
  makeMoreElements(
    starsContainer,
    ele("i", ["fa-solid", "fa-star"]),
    starsCount
  );

  return starsContainer;
}

function createFeedbackText(feedbackText) {
  const feedbackTextBox = ele("div", ["rev", "position-relative"]);
  feedbackTextBox.append(
    ele("i", ["fa-solid", "fa-quote-left", "position-absolute"]),
    ele("p", [], feedbackText),
    ele("i", ["fa-solid", "fa-quote-left", "position-absolute"])
  );

  return feedbackTextBox;
}

function createClientName(name) {
  const clientNameElement = ele("div", ["client"]);
  clientNameElement.appendChild(ele("h3", ["caption"], replaceLetters(name)));

  return clientNameElement;
}

function ele(elementType, classList = [], text = "") {
  const element = document.createElement(elementType);
  if (classList.length > 0) element.classList.add(...classList);
  if (text) element.textContent = text;

  return element;
}

function makeMoreElements(parentElement, element, number) {
  for (let i = 0; i < 5; i++) {
    if (i >= number) element.classList.add("close");
    parentElement.appendChild(element.cloneNode(true));
  }
}

/**
 * Replaces all letters in a word except the first two with asterisks
 * @param {string} word - The word to mask
 * @returns {string} - Masked word
 */
function replaceLetters(word) {
  let letters = word.split("");
  let replacedLetters = [];

  for (let i = 0; i < letters.length; i++) {
    if (i < 2) {
      replacedLetters[i] = letters[i];
    } else {
      replacedLetters[i] = "*";
    }
  }

  return replacedLetters.join("");
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
    addAnimationClassToElement(element, animationClass);
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
//#endregion

//#region Onload
// Animate hero section elements on page load
window.addEventListener("load", () => {
  heroCaptionElements.forEach((element) => {
    addAnimationClassToElement(element, "animate__zoomInRight");
  });

  addAnimationClassToElement(heroImg, "animate__jackInTheBox");
  heroCircleElements.forEach((circle) => {
    addAnimationClassToElement(circle, "animated-circle");
  });

  // Swiper carousel initialization
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 10,
    loop: true,
    centerSlide: true,
    fade: true,
    grabCursor: true,
    // autoplay: true,
    speed: 1000,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      800: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
});
//#endregion
