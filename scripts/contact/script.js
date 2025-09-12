const leftElement = document.querySelector(".left-side-animate");
const rightElement = document.querySelector(".right-side-animate");

//#region Animation Onload

// AnimationOnLoad(leftElement, "animate__bounceInLeft");
// AnimationOnLoad(rightElement, "animate__bounceInRight");

function AnimationOnLoad(element, className) {
  window.addEventListener("load", () => {
    addClass(element, className);
  });
}
//#endregion

//#region Helper Methds
/**
 * Add input value to object
 * @param {HTMLElement} input
 * @param {Object} obj
 */
function addValueToObj(input, obj) {
  obj[input.name] = input.value.trim();
}

/**
 * Validate required input
 * @param {HTMLElement} input
 * @returns {boolean} true if invalid
 */
function requiredInputValidation(input) {
  if (input.value === "") {
    addClass(input, "is-invalid");
    return true;
  } else {
    removeClass(input, "is-invalid");
    return false;
  }
}

/**
 * Validate phone number using libphonenumber
 * @param {HTMLElement} input
 */
function validatePhoneNumber(input) {
  try {
    if (typeof libphonenumber === "undefined") {
      /* fallback validation */
    }
    const phoneNumber = libphonenumber.parsePhoneNumberFromString(
      input.value,
      "EG"
    );
    if (phoneNumber && phoneNumber.isValid()) {
      input.value = phoneNumber.formatInternational();
      removeClass(input, "is-invalid");
    } else {
      addClass(input, "is-invalid");
    }
  } catch (error) {
    addClass(input, "is-invalid");
  }
}

/**
 * Validate email format
 * @param {HTMLElement} email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value === "" || !regex.test(email.value)) {
    addClass(email, "is-invalid");
  } else {
    removeClass(email, "is-invalid");
  }
}

/**
 * Capitalize first letter of string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Show element for a specified time then hide
 * @param {HTMLElement} element
 * @param {number} specifiedTime
 * @param {string} showingClass
 */
function showElementForTime(element, specifiedTime, showingClass = "active") {
  if (!element) return;
  addClass(element, showingClass);
  setTimeout(() => {
    removeClass(element, showingClass);
  }, specifiedTime);
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

/**
 * Adds a class to an element if not already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function addClass(element, className = "active") {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

/**
 * Adds a class to an element if not already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function removeClass(element, className = "active") {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}
//#endregion
