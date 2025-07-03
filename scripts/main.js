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
