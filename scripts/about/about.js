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

// Fetch the current version from wordpress REST API
const skeletonElements = document.querySelectorAll(".skeleton");

const heroTitleElement = document.querySelector("#hero .primary-heading");
const heroSubtitleElement = document.querySelector("#hero .caption");

const trustedSectionImage = document.querySelector(
  "#company-overview .image-side img"
);
const trustedTitleElement = document.querySelector(
  "#company-overview .text-side .secondary-heading"
);
const trustedSubtitleElement = document.querySelector(
  "#company-overview .text-side .third-heading"
);
const trustedQuestionsContainer = document.querySelector(
  "#accordionPanelsStayOpenExample"
);

const stepsSubtitleElement = document.querySelector(
  ".how-you-success-cont .text-side .caption"
);
const stepsTitleElement = document.querySelector(
  ".how-you-success-cont .text-side .secondary-heading"
);
const stepsDescriptionElement = document.querySelector(
  ".how-you-success-cont .text-side .description"
);
const stepsListElement = document.querySelector(
  ".how-you-success-cont .text-side ul"
);
const stepsButton = document.querySelector(
  ".how-you-success-cont .text-side .public-btn"
);
const stepsCardELements = document.querySelectorAll(
  ".how-you-success-cont .cards-side .card"
);

fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=about")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  })
  .then((data) => {
    const aboutPage = data[0];
    if (!aboutPage) {
      throw new Error("About page not found");
    }

    populateAllSections(aboutPage);
    removeClassFromElements(skeletonElements);
  })
  .catch((error) => console.error("Error fetching about page:", error));

function populateAllSections(data) {
  populateHeroSection(data);
  populateTrustedSection(data);
  populateStepsSection(data);
}

//#region Hero section
function populateHeroSection(data) {
  const { title, subtitle } = data.sections.hero;
  if (!title && !subtitle) {
    console.warn("Hero section data is missing title or subtitle");
    return;
  }

  setContentToElement(heroTitleElement, title);
  setContentToElement(heroSubtitleElement, subtitle);
}
//#endregion

//#region About company section
function populateTrustedSection(data) {
  const { about } = data.sections;

  if (!about) {
    console.warn("About section data is missing");
    return;
  }

  setTrustedSectionContent(about);
}

function setTrustedSectionContent(data) {
  setImageToElement(trustedSectionImage, data.image, data.title);
  setContentToElement(trustedTitleElement, data.title);
  setContentToElement(trustedSubtitleElement, data.subtitle);
  createTrustedQuestions(data);
}

function createTrustedQuestions(data) {
  if (!data.questions || !Array.isArray(data.questions)) {
    console.warn("Questions data is missing or not an array");
    return;
  }

  data.questions.forEach((question, index) => {
    trustedQuestionsContainer.appendChild(
      createQuestionElement(question, index)
    );
  });
}

function createQuestionElement(data, index) {
  const questionsContainer = createElement("div", ["accordion-item"]);
  const questionTitle = createQuestionTitle(data, index);
  const questionAnswers = createQuestionAnswers(data, index);

  questionsContainer.appendChild(questionTitle);
  questionsContainer.appendChild(questionAnswers);

  return questionsContainer;
}

function createQuestionTitle(data, index) {
  const questionTitle = createElement(
    "h3",
    ["accordion-header"],
    `panelsStayOpen-heading-${index}`
  );

  const button = createElement(
    "button",
    ["accordion-button", "collapsed"],
    "",
    data.title
  );
  button.type = "button";
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#panelsStayOpen-collapse-${index}`);
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", `panelsStayOpen-collapse-${index}`);

  questionTitle.appendChild(button);

  return questionTitle;
}

function createQuestionAnswers(data, index) {
  if (!data.answers) {
    console.warn("Answers data is missing");
    return;
  }

  const answersContainer = createElement(
    "div",
    ["accordion-collapse", "collapse"],
    `panelsStayOpen-collapse-${index}`
  );
  answersContainer.setAttribute(
    "aria-labelledby",
    `panelsStayOpen-heading-${index}`
  );
  const answersBody = createElement("div", [
    "accordion-body",
    "d-flex",
    "flex-column",
    "gap-3",
  ]);

  data.answers.forEach((answer) => {
    if (answer !== "") {
      const answerElement = createAnswerElement(answer, "scalezone");
      answersBody.appendChild(answerElement);
    }
  });

  answersContainer.appendChild(answersBody);
  return answersContainer;
}

function createAnswerElement(answer, replaceWord = "") {
  if (answer) {
    let answerElement = createElement("p");
    const regex = new RegExp(`${replaceWord}`, "gi");

    if (answer.includes("|")) {
      answerElement = createElement("ul", ["ps-3", "m-0", "fw-bold"]);
      answerList = answer.split("|").map((item) => item.trim());

      for (let i = 0; i < answerList.length; i++) {
        const item = createElement("li");
        item.innerHTML = answerList[i].replace(
          regex,
          `<strong>${replaceWord}</strong>`
        );
        answerElement.appendChild(item);
      }

      return answerElement;
    }

    answerElement.innerHTML = answer.replace(
      regex,
      `<strong>${replaceWord}</strong>`
    );
    return answerElement;
  }
}
//#endregion

//#region HOW WE BUILD YOUR SUCCESS SECTION
function populateStepsSection(data) {
  const { steps } = data.sections;
  if (!steps) {
    console.warn("Steps section data is missing");
    return;
  }

  setStepsContent(steps);
}

function setStepsContent(data) {
  setContentToElement(stepsTitleElement, data.title);
  setContentToElement(stepsSubtitleElement, data.subtitle);
  setContentToElement(stepsDescriptionElement, data.description);
  createStepsElements(data.steps_list);
  setButtons(stepsButton, data.button_text, data.button_link);
}

function createStepsElements(steps) {
  if (!steps) {
    console.warn("Steps data is missing");
    return;
  }

  const stepsList = steps.split("|").map((step) => step.trim());

  stepsList.forEach((step) => {
    stepsListElement.appendChild(createStepsElement(step));
  });
}

function createStepsElement(step) {
  const stepElement = createElement("li", [
    "d-flex",
    "align-items-center",
    "gap-4",
    "justify-content-center",
    "justify-content-lg-start",
  ]);
  const logoBox = createElement("div", ["logo"]);
  const logoImage = createElement("img");
  const stepText = createElement("p", [], "", step);

  setImageToElement(logoImage, "assets/about us/check.svg", step);
  logoBox.appendChild(logoImage);
  stepElement.appendChild(logoBox);
  stepElement.appendChild(stepText);

  return stepElement;
}
//#endregion

//#region Helper methods
/**
 * Create an element with optional classes and text content
 * @param {string} tag
 * @param {Array} classes
 * @param {string} content
 * @returns {HTMLElement}
 */
function createElement(tag, classes = [], id = "", content = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (id) el.id = id;
  if (content) el.textContent = content;
  return el;
}

function setContentToElement(element, content) {
  if (element && content) {
    element.textContent = content;
  }
}

function setImageToElement(element, imageUrl, imageAlt = "") {
  if (element && imageUrl) {
    element.src = imageUrl;
    element.alt = imageAlt || "Image";
  }
}

function setButtons(button, text, href = "") {
  if (!button && !text) {
    console.warn("Button or text is missing");
    return;
  }

  button.textContent = text;
  button.href = href || "#";
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
