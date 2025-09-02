const bodyELement = document.body;
const headerElement = document.querySelector("header");
const mainElement = createElement("main");

bodyELement.insertBefore(mainElement, headerElement.nextSibling);

// Get slug from URL (e.g. blogs/blogl?slug=start-selling)
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Fetch data from slug
fetch(`https://scalezone.ae/cms/wp-json/wp/v2/blog?slug=${slug}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  })
  .then((data) => {
    const blog = data[0];
    if (!blog) {
      throw new Error(`${slug} blog page not found`);
    }

    populateAllSections(blog);
  });

function populateAllSections(data) {
  document.title = data.title + " - Scalzone";
  const { content } = data;

  mainElement.append(populateHeroSection(data));

  for (let i = 0; i < content.length; i++) {
    if (content[i].title === "") {
      continue;
    }

    if (i === 2) {
    } else {
      mainElement.appendChild(populatePublicSections(content[i]));
    }
  }
  populatePublicSections(data);
}

//#region Hero section
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

function createHeroTitle(title, date) {
  const titleContainer = createElement("div", ["title"]);
  const titleElement = createElement("h1", [], "", title);
  const dateElement = createElement("p", [], "", date);

  titleContainer.append(titleElement, dateElement);
  return titleContainer;
}

function createHeroImage(imgSrc, title) {
  const imageContainer = createElement("div", ["img"]);
  const image = createElement("img");

  setImageElement(image, imgSrc, title);

  imageContainer.appendChild(image);
  return imageContainer;
}

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

  if (data.first_text) {
    firstContentList = setContentText(data.first_text);

    firstContentList.forEach((element) => {
      textBox.appendChild(element);
    });
  }

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
  const line = createElement("div", ["line", "position-absolute"]);

  titleBox.appendChild(title);

  container.append(titleBox, textBox, line);
  section.appendChild(container);
  return section;
}
//#endregion

//#region Helper Methods
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
    } else {
      domList.push(createElement("p", [], "", contentList[i]));
    }
  }

  return domList;
}

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
