const animatedElements = document.querySelectorAll(
  ".hero .caption, .hero .title h1, .hero .text p, .hero .public-btn"
);
const animatedImage = document.querySelector(".hero .img img");
const animatedCircle = document.querySelectorAll(".hero .img .circle");

window.addEventListener("load", () => {
  animatedElements.forEach((element) => {
    addElementVisiblity(element, "animate__zoomInRight");
  });

  addElementVisiblity(animatedImage, "animate__jackInTheBox");
  animatedCircle.forEach((circle) => {
    addElementVisiblity(circle, "animated-circle");
  });
});

function addElementVisiblity(element, className = "active") {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

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
