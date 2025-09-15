// Select elements for left and right animations
const leftElement = document.querySelector(".left-animate");
const rightElement = document.querySelector(".right-animate");
const blogCards = document.querySelectorAll(".blog-card");
const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element

// Hero section elements
const heroImage = document.querySelector(".hero .img img");
const heroTitle = document.querySelector(".hero .title h1");
const heroSubtitle = document.querySelector(".hero .title h3");
const heroDescription = document.querySelector(".hero .text p");

// Blogs section elements
const blogsTitle = document.querySelector(".blogs .title h2");
const blogCardsContainer = document.querySelector(".blogs .cards-box");

//#region Onload Animation
// Add animation classes to left and right elements on window load
window.addEventListener("load", () => {
  addClass(leftElement, "animate__rotateInDownLeft");
  addClass(rightElement, "animate__rotateInDownRight");
});
//#endregion

// Fetch blogs page data from API
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=blogs")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  })
  .then((data) => {
    const blogsPage = data[0];
    if (!blogsPage) {
      throw new Error("Blogs page not found");
    }
    populateAllSections(blogsPage);

    handleLoading(bodyEle, loadingPage);
  })
  .catch((error) => console.error("Error fetching blogs page:", error));

// Populate all sections of the page with fetched data
function populateAllSections(data) {
  document.title = data.title;
  populateHeroSection(data);
  populateBlogsSection(data);
}

//#region Hero section
// Populate hero section with data
function populateHeroSection(data) {
  const { hero } = data.sections;
  if (!hero) {
    console.warn("Hero section data is missing");
    return;
  }
  setImageElement(heroImage, hero.image.trim(), hero.content.title.trim());
  setHeroContent(hero);
}

// Set hero section content
function setHeroContent(data) {
  const { content } = data;
  if (!content) {
    console.warn("Hero's content data is missing");
    return;
  }
  setContentToElement(heroTitle, content.title.trim());
  setContentToElement(heroSubtitle, content.subtitle.trim());
  setContentToElement(heroDescription, content.description.trim());
}
//#endregion

//#region Blogs section
// Populate blogs section with data
function populateBlogsSection(data) {
  const { blogs } = data.sections;
  if (!blogs) {
    console.warn("Blogs section data is missing");
    return;
  }
  setContentToElement(blogsTitle, blogs.title);
  setBlogsCards(blogs);
}

// Create and append blog cards to container
function setBlogsCards(data) {
  const { blogs_data } = data;
  if (!blogs_data || blogs_data.length === 0) {
    console.warn("Blogs section data is missing or not array");
    return;
  }
  blogs_data.forEach((blog) => {
    blogCardsContainer.appendChild(
      createBlogElement(
        blog.slug,
        blog.image,
        blog.title,
        blog.publish_date,
        blog.intro
      )
    );
  });
}

/**
 * Creates a blog card element with an image, title, and link.
 * @param {string} imgSrc - Source URL for the blog thumbnail image.
 * @param {string} titleText - Text to display as the blog title.
 * @param {string} blogLink - URL to the blog page or blog itself.
 * @return {Element} - The created blog card element.
 * @description
 * This function constructs a blog card element that includes an image, title, and a button to
 */
function createBlogElement(slug, imgSrc, titleText, date, description) {
  // Create the blog card element structure
  const cardContainer = createElement("div", [
    "show-card",
    "blog-card",
    "d-flex",
    "flex-column",
    "gap-4",
    "animate__animated",
  ]);
  // Append image container
  cardContainer.appendChild(
    createBlogImgContainer(imgSrc.trim(), titleText.trim())
  );
  // Append content container
  cardContainer.appendChild(
    createBlogContent(slug, titleText, date, description)
  );
  // Add scroll animation
  animationOnScroll(cardContainer, "animate__jello");
  // Return the complete blog card element
  return cardContainer;
}

// Create blog image container
function createBlogImgContainer(imgLink, title) {
  const imgContainer = createElement("div", ["img"]);
  const imgElement = createElement("img");
  setImageElement(imgElement, imgLink, title);
  imgContainer.appendChild(imgElement);
  return imgContainer;
}

// Create blog content container
function createBlogContent(slug, title, date, description) {
  const blogLink = `blogs/blog.html?slug=${slug.trim()}`;
  const textContainer = createElement("div", [
    "text-bx",
    "d-flex",
    "flex-column",
    "gap-3",
  ]);
  const dateElement = createElement("p", [], "", date.trim());
  const titleBox = createElement("a", ["text-decoration-none"]);
  titleBox.setAttribute("href", blogLink);
  const titleELement = createElement("h2", [], "", title.trim());
  const descriptionElement = createElement(
    "p",
    [],
    "",
    `${description.intro_title.trim()} ${description.intro_descritpion}`
  );
  const button = createElement(
    "a",
    [
      "public-btn",
      "text-decoration-none",
      "position-relative",
      "overflow-hidden",
      "z-1",
    ],
    "",
    "Read More"
  );
  button.setAttribute("href", blogLink);
  titleBox.appendChild(titleELement);
  textContainer.append(dateElement, titleBox, descriptionElement, button);
  return textContainer;
}
//#endregion

//#region Scroll Animation
// Add animation class to element when it becomes visible on scroll
function animationOnScroll(element, animateClass) {
  window.addEventListener("scroll", () => {
    animateElementOnVisibility(
      element,
      animateClass,
      isElementVisible(element, 25)
    );
  });
}
//#endregion

//#region Helper Methods
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
    addClass(element, className);
  }
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

/**
 * remove a class from an element if already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function removeClass(element, className = "active") {
  if (!element) return;
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

/**
 * add a class from an element if already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function addClass(element, className = "active") {
  if (!element) return;
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}
//#endregion

//#region Handle Loadin page on fetching
function handleLoading() {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");
}
//#endregion
