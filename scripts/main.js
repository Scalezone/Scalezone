// Select hero section elements for animation
const heroCaptionElements = document.querySelectorAll(
  ".hero .caption, .hero .title h1, .hero .text p, .hero .public-btn"
);
const heroImage = document.querySelector(".hero .img img");
const heroCircleElements = document.querySelectorAll(".hero .img .circle");

// Select mission and vision section elements
const missionSectionContent = document.querySelector(".mission .content");
const missionSectionImages = document.querySelector(".mission .images");
const visionSectionContent = document.querySelector(".vision .content");
const visionSectionImages = document.querySelector(".vision .images");

// Select service and feature cards
const serviceMainCards = document.querySelectorAll(".main-card");
const featuresCardsContainer = document.querySelector(".features .cards");
const featuresProgressCardsTop = document.querySelectorAll(".progress-card.up");
const featuresProgressCardsBottom = document.querySelectorAll(
  ".progress-card.down"
);

// Animate hero section elements on page load
window.addEventListener("load", () => {
  heroCaptionElements.forEach((element) => {
    addAnimationClassToElement(element, "animate__zoomInRight");
  });

  addAnimationClassToElement(heroImage, "animate__jackInTheBox");
  heroCircleElements.forEach((circle) => {
    addAnimationClassToElement(circle, "animated-circle");
  });
});

// Animate sections and cards on scroll
window.addEventListener("scroll", function () {
  animateElementOnVisibility(
    missionSectionContent,
    "animate__lightSpeedInLeft",
    isElementVisible(missionSectionContent, 25)
  );

  animateElementOnVisibility(
    missionSectionImages,
    "animate__lightSpeedInRight",
    isElementVisible(missionSectionImages, 25)
  );

  animateElementOnVisibility(
    visionSectionContent,
    "animate__lightSpeedInRight",
    isElementVisible(visionSectionContent, 25)
  );

  animateElementOnVisibility(
    visionSectionImages,
    "animate__lightSpeedInLeft",
    isElementVisible(visionSectionImages, 25)
  );

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

// Swiper carousel initialization
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  centerSlide: true,
  fade: true,
  grabCursor: true,
  autoplay: true,
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
    780: {
      slidesPerView: 2,
    },
    950: {
      slidesPerView: 3,
    },
  },
});

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
