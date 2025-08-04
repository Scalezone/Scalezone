const heroTitle = document.querySelector("#hero .primary-heading");
const heroCaption = document.querySelector("#hero .caption");
const videosTitle = document.querySelector(".videos-container .title h2");
const videosContainer = document.querySelector(".cards-box");

const skeletonElements = document.querySelectorAll(".skeleton");

// This script fetches and displays video content from a WordPress site using the REST API.
fetch("http://localhost/scalezone/wp-json/wp/v2/pages?slug=videos-page-content")
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    if (data.length > 0) {
      renderVideosPage(data[0]);

      // Remove skeleton classes from elements after content is loaded
      skeletonElements.forEach((element) => {
        removeClass(element, "skeleton");
      });

      console.log(data[0]);
    } else {
      return Promise.reject("No data found for the specified slug.");
    }
  })
  .catch((error) => console.error(error));

// Function to render the videos page content
function renderVideosPage(data) {
  document.title = `${data.title} | Scalezone`;
  // Change the content of hero section and videos title
  changeContent(heroTitle, data.hero_title);
  changeContent(heroCaption, data.hero_caption);
  changeContent(videosTitle, data.videos_title);

  addCardsToContainer(data.videos_data);
}

/**
 * Fetches video data from the WordPress REST API and populates the videos container.
 * @returns {Promise<void>} - A promise that resolves when the videos are loaded.
 * @description
 * This function retrieves video data from the WordPress REST API and dynamically creates video cards
 */
function addCardsToContainer(videos) {
  if (videos && videos.length > 0) {
    videos.forEach((video) => {
      const imgURl = video.image || "assets/videos/soon.webp";
      videosContainer.appendChild(
        createVideoElement(imgURl, video.title, video.youtube_link)
      );
    });
  } else {
    // If no videos are found, display a message or handle the empty state
    noVideosMessage();
  }
}

function noVideosMessage() {
  const noVideosMessage = document.createElement("p");
  noVideosMessage.textContent = "No videos available at the moment.";
  noVideosMessage.classList.add("not-found", "text-center", "mb-5");
  videosContainer.appendChild(noVideosMessage);
}

/**
 * Creates a video card element with an image, title, and link.
 * @param {string} imgSrc - Source URL for the video thumbnail image.
 * @param {string} titleText - Text to display as the video title.
 * @param {string} videoLink - URL to the video page or video itself.
 * @return {Element} - The created video card element.
 * @description
 * This function constructs a video card element that includes an image, title, and a button to
 */
function createVideoElement(imgSrc, titleText, videoLink) {
  // Create the video card element structure
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "show-card",
    "video-card",
    "d-flex",
    "flex-column",
    "gap-4"
  );

  // Append elements to their respective containers
  cardContainer.appendChild(createVideoImgContainer(imgSrc, titleText));
  cardContainer.appendChild(createVideoTitleContainer(titleText, videoLink));

  // Return the complete video card element
  return cardContainer;
}

/**
 * Creates an image element for the video thumbnail.
 * @param {string} imgSrc - Source URL for the video thumbnail image.
 * @param {string} titleText - Text to display as the alt attribute for the image.
 * @return {Element} - The created image container element.
 */
function createVideoImgContainer(imgSrc, titleText) {
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

// <picture>
//   <source srcset="/scalezone/wp-content/webp-express/webp-images/uploads/2025/08/01.png.webp" type="image/webp">
//   <source srcset="/scalezone/wp-content/uploads/2025/08/01.png" type="image/png">
//   <img src="/scalezone/wp-content/uploads/2025/08/01.png" alt="Podcast Thumbnail" loading="lazy" width="368" height="205">
// </picture>

/**
 * Creates a text container for the video title and watch button.
 * @param {string} titleText - Text to display as the video title.
 * @param {string} videoLink - URL to the video page or video itself.
 * @return {Element} - The created text container element.
 */
function createVideoTitleContainer(titleText, videoLink) {
  // Create the text container and its elements
  const textContainer = document.createElement("div");
  textContainer.classList.add("text-bx", "d-flex", "flex-column", "gap-3");

  textContainer.appendChild(createVideoTitle(titleText, videoLink));
  textContainer.appendChild(createWatchButton(videoLink));

  return textContainer;
}

/**
 * Creates a title element for the video.
 * @param {string} titleText - Text to display as the video title.
 * @param {string} videoLink - URL to the video page or video itself.
 */
function createVideoTitle(titleText, videoLink) {
  // Create the title elements
  const titleLink = document.createElement("a");
  titleLink.classList.add("text-decoration-none");
  titleLink.target = "_blank";
  titleLink.href = videoLink || "#";

  const titleElement = document.createElement("h2");
  titleElement.textContent = titleText;

  titleLink.appendChild(titleElement);

  return titleLink;
}

/**
 * Creates a watch button element for the video.
 * @param {string} videoLink - URL to the video page or video itself.
 */
function createWatchButton(videoLink) {
  const watchButton = document.createElement("a");
  watchButton.classList.add(
    "public-btn",
    "text-decoration-none",
    "position-relative",
    "overflow-hidden",
    "z-1"
  );
  watchButton.target = "_blank";
  watchButton.href = videoLink || "#";
  watchButton.textContent = "Show Video";

  return watchButton;
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
