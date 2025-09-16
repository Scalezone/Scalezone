// Get references to DOM elements
const bodyELement = document.body;
const headerElement = document.querySelector("header");
// Create a main element for blog content
const mainElement = createElement("main");
const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element

// Insert main element after header
bodyELement.insertBefore(mainElement, headerElement.nextSibling);

// Get slug from URL (e.g. blogs/blogl?slug=start-selling)
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Fetch blog data using slug
fetch(`https://scalezone.ae/cms/wp-json/wp/v2/blog?slug=${slug}`)
  .then((response) => {
    if (!response.ok) {
      // Handle network errors
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  })
  .then((data) => {
    // Get first blog object from response
    const blog = data[0];
    if (!blog) {
      // Handle missing blog
      throw new Error(`${slug} blog page not found`);
    }
    // Populate all sections with blog data
    populateAllSections(blog);

    handleLoading(bodyEle, loadingPage);
  });

/**
 * Populates all sections of the blog page
 * @param {Object} data - Blog data
 */
function populateAllSections(data) {
  document.title = data.title + " - Scalzone";
  setMetaTags(data.title, data.intro.intro_descritpion);
  const { content } = data;

  // Add hero section
  mainElement.append(populateHeroSection(data));

  // Add each content section
  for (let i = 0; i < content.length; i++) {
    if (content[i].title === "") {
      continue; // Skip empty sections
    }
    if (i === 2) {
      // Special handling for third section
      mainElement.appendChild(populateThirdSection(content[i]));
    } else {
      mainElement.appendChild(populatePublicSections(content[i]));
    }
  }
  // Add public sections for main data
  populatePublicSections(data);
}

//#region SEO
function setMetaTags(title, desription) {
  let metaDescription = document.querySelector("meta[name='description']");
  if (!metaDescription) {
    metaDescription = createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", desription);

  let ogTitle = document.querySelector("meta[property='og:title']");
  if (!ogTitle) {
    ogTitle = createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", title);
}
//#endregion

//#region Hero section

/**
 * Creates the hero section for the blog
 * @param {Object} data - Blog data
 * @returns {HTMLElement}
 */
function populateHeroSection(data) {
  const sectionElement = createElement("section", ["hero", "public-sec"]);
  const containerElement = createElement("div", [
    "hero-container",
    "blog-w",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "position-relative",
  ]);

  const title = createHeroTitle(data.title, data.publish_date);
  const image = createHeroImage(data.image, data.title);
  const content = createHeroContent(data.intro);
  const line = createElement("div", ["line", "position-absolute"]);

  containerElement.append(title, image, content, line);
  sectionElement.appendChild(containerElement);
  return sectionElement;
}

/**
 * Creates the hero title element
 * @param {string} title
 * @param {string} date
 * @returns {HTMLElement}
 */
function createHeroTitle(title, date) {
  const titleContainer = createElement("div", ["title"]);
  const titleElement = createElement("h1", [], "", title);
  const dateElement = createElement("p", [], "", date);

  titleContainer.append(titleElement, dateElement);
  return titleContainer;
}

/**
 * Creates the hero image element
 * @param {string} imgSrc
 * @param {string} title
 * @returns {HTMLElement}
 */
function createHeroImage(imgSrc, title) {
  const imageContainer = createElement("div", ["img"]);
  const image = createElement("img");

  setImageElement(image, imgSrc, title);

  imageContainer.appendChild(image);
  return imageContainer;
}

/**
 * Creates the hero content element
 * @param {Object} intro
 * @returns {HTMLElement}
 */
function createHeroContent(intro) {
  if (!intro) {
    console.warn("Intro data is missing");
    return;
  }

  const contentContainer = createElement("div", ["content", "mt-5"]);
  const title = createElement("p", [], "", intro.intro_title);
  const content = setContentText(intro.intro_descritpion);

  contentContainer.appendChild(title);
  content.forEach((element) => {
    contentContainer.appendChild(element.cloneNode(true));
  });
  return contentContainer;
}
//#endregion

//#region Rest of sections

/**
 * Populates a public section with blog data
 * @param {Object} data
 * @returns {HTMLElement}
 */
function populatePublicSections(data) {
  const section = createElement("section", ["public-sec"]);
  const container = createElement("div", [
    "blog-w",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "position-relative",
    "gap-4",
  ]);
  const titleBox = createElement("div", ["title"]);
  const title = createElement("h2", [], "", data.title);
  const textBox = createElement("div", ["text-bx"]);
  const line = createElement("div", ["line", "position-absolute"]);
  let firstContentList = [];
  let secondContentList = [];

  titleBox.appendChild(title);

  // Add first text content
  if (data.first_text) {
    firstContentList = setContentText(data.first_text);

    firstContentList.forEach((element) => {
      textBox.appendChild(element);
    });
  }

  // Add second text content
  if (data.second_text) {
    secondContentList = setContentText(data.second_text);

    secondContentList.forEach((element) => {
      textBox.appendChild(element);
    });
  }

  container.append(titleBox, textBox, line);
  section.appendChild(container);
  return section;
}

/**
 * Populates the third section with steps
 * @param {Object} data
 * @returns {HTMLElement}
 */
function populateThirdSection(data) {
  const section = createElement("section", ["public-sec"]);
  const container = createElement("div", [
    "blog-w",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "position-relative",
    "gap-4",
  ]);
  const titleBox = createElement("div", ["title"]);
  const title = createElement("h2", [], "", data.title);
  const stepsContainer = createElement("div", [
    "steps-bx",
    "d-flex",
    "flex-column",
    "gap-3",
  ]);
  // List of step objects
  const stepsList = [
    data.first_text,
    data.second_text,
    data.third_text,
    data.fourth_text,
    data.fifth_text,
  ];

  // Add each step
  for (let i = 0; i < stepsList.length; i++) {
    if (stepsList[i].title != "") {
      const step = createElement("div", ["step"]);
      const title = createElement(
        "h3",
        ["caption"],
        "",
        `${i + 1}. ${stepsList[i].title.trim()}`
      );
      const content = createElement("div", ["content"]);
      const contentList = setContentText(stepsList[i].text);

      contentList.forEach((element) => {
        content.appendChild(element);
      });

      step.append(title, content);
      stepsContainer.appendChild(step);
    }
  }

  const line = createElement("div", ["line", "position-absolute"]);

  titleBox.appendChild(title);

  container.append(titleBox, stepsContainer, line);
  section.appendChild(container);
  return section;
}
//#endregion

//#region Helper Methods

/**
 * Splits text into paragraphs or lists and returns DOM elements
 * @param {string} text
 * @returns {HTMLElement[]}
 */
function setContentText(text) {
  if (!text) {
    console.warn("Content is missing");
    return;
  }

  const contentList = text.split("\r\n");
  const domList = [];

  for (let i = 0; i < contentList.length; i++) {
    if (contentList[i].includes("|")) {
      domList.push(setContentList(contentList[i]));
    }
    if (contentList[i].includes("<")) {
      domList.push(setLinks(contentList[i]));
    } else {
      domList.push(createElement("p", [], "", contentList[i]));
    }
  }

  return domList;
}

function setLinks(text) {
  if (!text.includes("<")) {
    console.warn("Text not includes links!");
    return;
  }

  const list = text.split("<");
  const textElement = createElement("p");

  for (let i = 0; i < list.length; i++) {
    if (list[i].includes(">")) {
      const linkList = list[i].split(">");

      for (let j = 0; j < linkList.length; j++) {
        if (linkList[j].includes(",")) {
          const link = linkList[j].split(",");
          if (link.length === 2) {
            const linkElement = createElement("a", [], "", `${link[1].trim()}`);
            linkElement.href = link[0];
            linkElement.target = "_blank";
            textElement.appendChild(linkElement);
          }
        } else {
          const text = createElement("span", [], "", ` ${linkList[j].trim()} `);
          textElement.appendChild(text);
        }
      }
    } else {
      const text = createElement("span", [], "", list[i].trim() + " ");
      textElement.appendChild(text);
    }
  }

  return textElement;
}

/**
 * Converts a pipe-separated string into a list element
 * @param {string} text
 * @returns {HTMLElement}
 */
function setContentList(text) {
  if (!text.includes("|")) {
    console.warn("Text is not list");
    return;
  }

  const listContent = text.split(" | ");
  const listElement = createElement("ul");

  listContent.forEach((element) => {
    listElement.appendChild(
      createElement("li", [], "", element).cloneNode(true)
    );
  });

  return listElement;
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

/**
 * Sets text content to an element
 * @param {HTMLElement} element
 * @param {string} content
 */
function setContentToElement(element, content) {
  if (element && content) {
    element.textContent = content.trim();
  }
}
//#endregion

//#region Handle Loadin page on fetching
function handleLoading() {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");
}
//#endregion
