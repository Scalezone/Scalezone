// Select elements
const skeletonElements = document.querySelectorAll(".skeleton");

const heroTitle = document.querySelector("#hero .primary-heading");
const heroCaption = document.querySelector("#hero .caption");
const podcastsTitle = document.querySelector(".podcasts-container .title h2");
const podcastsContainer = document.querySelector(".cards-box");
const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element

// This script fetches and displays podcasts content from a WordPress site using the REST API.
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=podcasts")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  })
  .then((data) => {
    if (!data && data.length === 0) {
      throw new Error("No data found for the specified slug.");
    }

    renderPodcastsPage(data[0]);

    // Remove skeleton classes from elements after content is loaded
    skeletonElements.forEach((element) => {
      removeClass(element, "skeleton");
    });

    handleLoading(bodyEle, loadingPage);
  })
  .catch((error) => console.error(`Error: ${error}`));

// Function to render the podcasts page content
function renderPodcastsPage(data) {
  document.title = `${data.title} | Scalezone`;

  // Change the content of hero section and videos title
  populateHeroSection(data);
  populatePodcastsSection(data);
}

//#region Hero Section
function populateHeroSection(data) {
  const heroData = data.sections.hero;

  changeContent(heroTitle, heroData.title);
  changeContent(heroCaption, heroData.subtitle);
}
//#endregion

//#region Podcasts Section
function populatePodcastsSection(data) {
  const podcastData = data.sections.podcasts;

  console.log(podcastData);
  changeContent(podcastsTitle, podcastData.title);
  addCardsToContainer(podcastData.podcasts_list);
}

/**
 * Fetches podcast data from the WordPress REST API and populates the podcasts container.
 * @returns {Promise<void>} - A promise that resolves when the podcasts are loaded.
 * @description
 * This function retrieves podcast data from the WordPress REST API and dynamically creates podcast cards
 */
function addCardsToContainer(podcasts) {
  if (podcasts && podcasts.length > 0) {
    podcasts.forEach((podcast) => {
      const imgURl = podcast.image || "assets/podcasts/soon.webp";
      podcastsContainer.appendChild(
        createPodcastElement(
          imgURl,
          podcast.title,
          podcast.youtube_link,
          podcast.button_text
        )
      );
    });
  } else {
    // If no podcasts are found, display a message or handle the empty state
    noPodcastMessage();
  }
}

function noPodcastMessage() {
  const noPodcastMessage = document.createElement("p");
  noPodcastMessage.textContent = "No podcasts available at the moment.";
  noPodcastMessage.classList.add("not-found", "text-center", "mb-5");
  podcastsContainer.appendChild(noPodcastMessage);
}

/**
 * Creates a podcast card element with an image, title, and link.
 * @param {string} imgSrc - Source URL for the podcast thumbnail image.
 * @param {string} titleText - Text to display as the podcast title.
 * @param {string} podcastLink - URL to the podcast page or podcast itself.
 * @return {Element} - The created podcast card element.
 * @description
 * This function constructs a podcast card element that includes an image, title, and a button to
 */
function createPodcastElement(imgSrc, titleText, podcastLink, buttonText) {
  // Create the video card element structure
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "show-card",
    "podcast-card",
    "d-flex",
    "flex-column",
    "gap-4"
  );

  // Append elements to their respective containers
  cardContainer.appendChild(createPodcastImgContainer(imgSrc, titleText));
  cardContainer.appendChild(
    createPodcastTitleContainer(titleText, podcastLink, buttonText)
  );

  // Return the complete podcast card element
  return cardContainer;
}

/**
 * Creates an image element for the podcast thumbnail.
 * @param {string} imgSrc - Source URL for the podcast thumbnail image.
 * @param {string} titleText - Text to display as the alt attribute for the image.
 * @return {Element} - The created image container element.
 */
function createPodcastImgContainer(imgSrc, titleText) {
  // Create the image container and image element
  const imgContainer = document.createElement("div");

  const pictureElement = document.createElement("picture");
  const sourceWebp = document.createElement("source");
  if (imgSrc.endsWith(".webp")) {
    sourceWebp.srcset = imgSrc;
  } else {
    sourceWebp.srcset = `${imgSrc.replace(
      "/wp-content/",
      "/wp-content/webp-express/webp-images/"
    )}.webp`;
  }
  sourceWebp.type = "image/webp";

  const sourcePng = document.createElement("source");
  sourcePng.srcset = imgSrc;
  sourcePng.type = "image/png";

  imgContainer.classList.add("img");
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = titleText;
  img.loading = "lazy";

  imgContainer.appendChild(pictureElement);
  pictureElement.appendChild(sourceWebp);
  pictureElement.appendChild(sourcePng);
  pictureElement.appendChild(img);
  return imgContainer;
}

/**
 * Creates a text container for the podcast title and watch button.
 * @param {string} titleText - Text to display as the podcast title.
 * @param {string} podcastLink - URL to the podcast page or podcast itself.
 * @return {Element} - The created text container element.
 */
function createPodcastTitleContainer(titleText, podcastLink, buttonText) {
  // Create the text container and its elements
  const textContainer = document.createElement("div");
  textContainer.classList.add("text-bx", "d-flex", "flex-column", "gap-3");

  textContainer.appendChild(createPodcastTitle(titleText, podcastLink));
  textContainer.appendChild(createWatchButton(podcastLink, buttonText));

  return textContainer;
}

/**
 * Creates a title element for the podcast.
 * @param {string} titleText - Text to display as the podcast title.
 * @param {string} podcastLink - URL to the podcast page or podcast itself.
 */
function createPodcastTitle(titleText, podcastLink) {
  // Create the title elements
  const titleLink = document.createElement("a");
  titleLink.classList.add("text-decoration-none");
  titleLink.target = "_blank";
  titleLink.href = podcastLink || "#";

  const titleElement = document.createElement("h2");
  titleElement.textContent = titleText;

  titleLink.appendChild(titleElement);

  return titleLink;
}

/**
 * Creates a watch button element for the podcast.
 * @param {string} podcastLink - URL to the podcast page or podcast itself.
 */
function createWatchButton(podcastLink, buttonText) {
  const watchButton = document.createElement("a");
  watchButton.classList.add(
    "public-btn",
    "text-decoration-none",
    "position-relative",
    "overflow-hidden",
    "z-1"
  );
  watchButton.target = "_blank";
  watchButton.href = podcastLink || "#";
  watchButton.textContent = buttonText || "Show Video";

  return watchButton;
}
//#endregion

//#region Helper Methods
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
 * remove a class from an element if already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function removeClass(element, className = "skeleton") {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}
//#endregion

//#region Handle Loadin page on fetching
function handleLoading() {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");
}
//#endregion
