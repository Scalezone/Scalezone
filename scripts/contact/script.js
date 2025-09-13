// Select Elements
const leftElement = document.querySelector(".left-side-animate");
const rightElement = document.querySelector(".right-side-animate");

// Get references to all required DOM elements for the contact form and UI
const image = document.getElementById("hero-image");
const formElement = document.getElementById("form");
const heroTitle = document.getElementById("title");
const heroDescription = document.getElementById("description");
const formTitle = document.getElementById("form-title");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const emailElement = document.getElementById("email");
const companyName = document.getElementById("company-name");
const phoneElement = document.getElementById("phone-number");
const message = document.getElementById("message");
const storeURL = document.getElementById("store-url");
const servicesTitle = document.getElementById("select-service-title");
const leftSideServices = document.getElementById("left-services");
const rightSideServices = document.getElementById("right-services");
const prefContactTitle = document.getElementById("preferred-contact-title");
const phoneMethod = document.getElementById("phone-call");
const emailMethod = document.getElementById("email-method");
const smsTitle = document.getElementById("sms-title");
const smsAgree = document.getElementById("sms-agree");
const smsUnagree = document.getElementById("sms-unagree");
const successMessage = document.querySelector("#messages .success");
const unsuccessMessage = document.querySelector("#messages .unsuccess");
const serviceModal = document.getElementById("servicesModal");
const confirmServices = document.getElementById("confirmServices");

const skeletonElements = document.querySelectorAll(".skeleton");

//#region Events

// Initialize Bootstrap modal for services selection
const modal = new bootstrap.Modal(serviceModal);

// Hide modal when services are confirmed
confirmServices.addEventListener("click", () => {
  modal.hide();
});
//#endregion

//#region Get
// Fetch contact page data from API and populate sections
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=contact")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  })
  .then((data) => {
    if (!data[0]) {
      throw new Error("No data found");
    }
    populateAllSections(data[0]);

    skeletonElements.forEach((e) => {
      removeClass(e, "skeleton");
    });
    addClass(leftElement, "animate__bounceInLeft");
    addClass(rightElement, "animate__bounceInRight");
  })
  .catch((error) =>
    console.error("There was a problem with the fetch operation:", error)
  );

// Populate all sections of the page with fetched data
function populateAllSections(data) {
  setImageToElement(image, data.image, data.contact_side.title);

  populateContactSide(data);
}

// Populate contact side section
function populateContactSide(data) {
  if (!data.contact_side) {
    console.warn("Contact data is missing!");
    return;
  }

  setContentToElement(heroTitle, data.contact_side.title);
  setContentToElement(heroDescription, data.contact_side.description);

  populateForm(data);
}

// Populate form fields and options
function populateForm(data) {
  const { form } = data.contact_side;
  if (!form) {
    console.warn("Form data is missing!");
    return;
  }

  setContentToElement(formTitle, form.title);

  setField(firstName, form.first_name);
  setField(lastName, form.last_name);
  setField(emailElement, form.email);
  setField(companyName, form.company_name);
  setField(phoneElement, form.phone_number);
  setField(message, form.message);
  setField(storeURL, form.store_url);

  setContentToElement(servicesTitle, form.select_services.title);
  // Add service checkboxes to left and right columns
  for (let i = 0; i < form.select_services.services.length; i++) {
    if (i % 2 === 0) {
      leftSideServices.appendChild(
        createServicesInputs(form.select_services.services[i])
      );
    } else {
      rightSideServices.insertBefore(
        createServicesInputs(form.select_services.services[i]),
        rightSideServices.firstChild
      );
    }
  }

  setContentToElement(prefContactTitle, form.contact_method.title);
  setMethodsInputs(phoneMethod, form.contact_method.label_one);
  setMethodsInputs(emailMethod, form.contact_method.label_two);

  setContentToElement(smsTitle, form.sms_messages.title);
  setMethodsInputs(smsAgree, form.sms_messages.label_one);
  setMethodsInputs(smsUnagree, form.sms_messages.label_two);
}

// Set up individual form field with label, placeholder, and validation
function setField(fieldElement, fieldData) {
  if (!fieldElement || !fieldData) {
    console.warn("Element or Data is missing!");
    return;
  }

  const label = fieldElement.querySelector("label");
  const input = fieldElement.querySelector("input, textarea");
  const invalid = fieldElement.querySelector(".invalid-feedback");

  setContentToElement(label, fieldData.label);
  input.placeholder = fieldData.placeholder;
  if (invalid) {
    setContentToElement(invalid, fieldData.invalid_text);
  }

  // Add validation event listeners based on input type
  if (input.name === "phone") {
    input.addEventListener("blur", () => {
      requiredInputValidation(input);
      validatePhoneNumber(input);
    });
  } else if (input.name === "email") {
    input.addEventListener("blur", () => {
      requiredInputValidation(input);
      validateEmail(input);
    });
  } else if (input.name === "first_name" || input.name === "last_name") {
    input.addEventListener("blur", () => {
      requiredInputValidation(input);
    });
  }
}

// Create service checkbox input and label
function createServicesInputs(service) {
  const id = service.title.split(" ").join("-").toLowerCase();

  const serviceContainer = createElement("div", ["form-check", "mb-2"]);
  const input = createElement(
    "input",
    ["form-check-input", "service-checkbox"],
    id,
    "",
    "checkbox"
  );
  input.name = "services";
  input.value = service.title;
  const label = createElement("label", ["form-check-label"], "", service.title);
  label.setAttribute("for", id);

  serviceContainer.append(input, label);
  return serviceContainer;
}

// Set up contact method radio/checkbox inputs
function setMethodsInputs(element, data) {
  const input = element.querySelector("input");
  const label = element.querySelector("label");

  input.value = data;
  setContentToElement(label, data);
}
//#endregion

//#region Post

// Handle form submission
formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  let hasError = false;
  // select all inputs
  const inputs = formElement.querySelectorAll("input");
  const message = formElement.querySelector("textarea");
  const services = formElement.querySelectorAll(".service-checkbox");
  let selectedServices = [];

  // Collect selected services
  services.forEach((service) => {
    if (service.checked) {
      selectedServices.push(service.value);
    }
  });

  // Validate required inputs
  for (const input of inputs) {
    if (input.type != "checkbox" && input.type != "radio") {
      if (input.name != "company" && input.name != "store_url")
        if (requiredInputValidation(input)) {
          hasError = true;
        }
    }
  }

  if (hasError) return;

  // Show loader spinner and disable submit button
  addClass(formElement.querySelector("#submit .text"), "close");
  removeClass(formElement.querySelector("#submit .spinner"), "close");
  addClass(formElement.querySelector("#submit"), "disabled");

  // Prepare form data object
  let formData = {};

  // Collect form data from inputs
  inputs.forEach((e) => {
    if (e.name === "first_name" || e.name === "last_name") {
      formData[e.name] = capitalize(e.value.trim());
    } else if (e.type != "checkbox") {
      addValueToObj(e, formData);
    } else if (e.type === "checkbox") {
      formData["services"] = selectedServices;
    }
  });
  addValueToObj(message, formData);

  console.log(formData);

  // Send data to API
  fetch("https://scalezone.ae/cms/wp-json/contact/v1/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      // Hide loader and enable submit button
      addClass(formElement.querySelector("#submit .spinner"), "close");
      removeClass(formElement.querySelector("#submit .text"), "close");
      removeClass(formElement.querySelector("#submit"), "disabled");

      if (!response.ok) {
        showElementForTime(unsuccessMessage, 1500);
        throw new Error("Something went wrong.");
      }
      return response.json();
    })
    .then((data) => {
      // Show success message
      const title = successMessage.querySelector(".caption");
      const message = successMessage.querySelector("p");
      setContentToElement(title, data.status);
      setContentToElement(message, data.message);
      showElementForTime(successMessage, 1500);

      // Reset form and info box
      formElement.reset();
    })
    .catch((error) => console.error("Error fetching data:", error));
});
//#endregion

//#region Helper Methds
/**
 * Sets image src and alt to an element
 * @param {HTMLElement} element
 * @param {string} imageUrl
 * @param {string} imageAlt
 */
function setImageToElement(element, imageUrl, imageAlt = "") {
  if (element && imageUrl) {
    element.src = imageUrl;
    element.alt = imageAlt || "Image";
  }
}
/**
 * Add input value to object
 * @param {HTMLElement} input
 * @param {Object} obj
 */
function addValueToObj(input, obj) {
  if (input.value === "") {
    obj[input.name] = "Not provided";
  } else {
    obj[input.name] = input.value.trim();
  }
}

/**
 * Validate required input
 * @param {HTMLElement} input
 * @returns {boolean} true if invalid
 */
function requiredInputValidation(input) {
  if (input.value === "") {
    addClass(input, "is-invalid");
    input.focus();
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
      input.focus();
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
function createElement(tag, classes = [], id = "", content = "", type = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (id) el.id = id;
  if (content) el.textContent = content;
  if (type) el.type = type;
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
 * Removes a class from an element if present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function removeClass(element, className = "active") {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}
//#endregion
