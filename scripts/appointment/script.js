// Select elements
const skeletonElements = document.querySelectorAll(".skeleton");

// Form fields and display elements
const formElement = document.getElementById("appointmentForm");
const formTitle = document.getElementById("form-title");
const firstNameField = document.getElementById("first-name-field");
const lastNameField = document.getElementById("last-name-field");
const emailField = document.getElementById("email-field");
const phoneField = document.getElementById("phone-field");
const serviceField = document.getElementById("service-field");
const dateField = document.getElementById("date-field");
const timeField = document.getElementById("time-field");
const messageField = document.getElementById("message-field");

const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayPhone = document.getElementById("displayPhone");
const displayService = document.getElementById("displayService");
const displayDate = document.getElementById("displayDate");
const displayTime = document.getElementById("displayTime");
const displayMessage = document.getElementById("displayMessage");

const successMessage = document.querySelector("#messages .success");
const unsuccessMessage = document.querySelector("#messages .unsuccess");

const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element

//#region Get Data
// Fetch appointment page data from API
fetch("https://scalezone.ae/cms/wp-json/wp/v2/pages?slug=appointment")
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
    populateFormSection(data[0]);
    // Remove skeleton loading effect
    skeletonElements.forEach((element) => {
      removeClass(element);
    });

    handleLoading(bodyEle, loadingPage);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

//#region Form section

/**
 * Populate form section with fetched data
 * @param {Object} data
 */
function populateFormSection(data) {
  document.title = data.title
    ? data.title
    : "Book an Appointment | Expert Amazon Seller Services - Scalezone";

  const { title, fields } = data.form;
  if (!title || !fields) {
    console.warn("Missing title or fields in the fetched data");
    return;
  }
  setFormContent(title, fields);
}

/**
 * Set form title and fields
 * @param {string} title
 * @param {Object} fields
 */
function setFormContent(title, fields) {
  setContentToElement(formTitle, title.trim());
  setFieldsContent(fields);
}

/**
 * Set content for each form field
 * @param {Object} fields
 */
function setFieldsContent(fields) {
  if (!fields) {
    console.warn("No fields data available");
    return;
  }
  setNormalField(firstNameField, fields.first_name);
  setNormalField(lastNameField, fields.last_name);
  setNormalField(emailField, fields.email);
  setNormalField(phoneField, fields.phone);
  setNormalField(messageField, fields.additional_notes, false);
  setServicesField(serviceField, fields.inquiry_type);
  setDataField(dateField, fields.preferred_date);
  setTimeField(timeField, fields.preferred_time, false);
  // set service field last to ensure all options are loaded before setting the default value
}

/**
 * Set up a normal input field (text, email, phone, etc.)
 * @param {HTMLElement} element
 * @param {Object} field
 * @param {boolean} isRequired
 */
function setNormalField(element, field, isRequired = true) {
  const { label, placeholder, not_valid_text } = field;
  const labelElement = element.querySelector("label");
  const inputElement = element.querySelector("input, textarea");
  const invalidElement = element.querySelector(".invalid-feedback");

  // Set label with required indicator
  if (isRequired) {
    labelElement.innerHTML = `${label.trim()} <span class="text-danger">*</span>`;
  } else {
    setContentToElement(labelElement, label);
  }

  // Set placeholder and add validation listeners
  if (inputElement) {
    inputElement.placeholder = placeholder.trim() || "";

    // Add specific validation for phone and email fields
    if (inputElement.id != "firstName" && inputElement.id != "lastName") {
      const displayElement = document.getElementById(
        `display${capitalize(inputElement?.id || "")}`
      );

      if (inputElement.id === "phone") {
        inputElement.addEventListener("input", () => {
          validatePhoneNumber(inputElement);
        });
        inputElement.addEventListener("blur", () => {
          requiredInputValidation(inputElement);
          validatePhoneNumber(inputElement);
        });
      }

      if (inputElement.id === "email") {
        inputElement.addEventListener("input", () => {
          validateEmail(inputElement);
        });
        inputElement.addEventListener("blur", () => {
          validateEmail(inputElement);
        });
      }

      // Update display element on input
      inputElement.addEventListener("input", () => {
        setDisplayElement(inputElement, displayElement);
      });
    } else {
      // For name fields, update display name
      inputElement.addEventListener("input", () => {
        setDisplayName(displayName);
      });
      inputElement.addEventListener("blur", () => {
        requiredInputValidation(inputElement);
      });
    }
  }

  // Set invalid feedback text
  if (invalidElement) {
    setContentToElement(invalidElement, not_valid_text.trim());
  }
}

/**
 * Set up date field with min value and display update
 * @param {HTMLElement} element
 * @param {Object} field
 * @param {boolean} isRequired
 */
function setDataField(element, field, isRequired = true) {
  const { label } = field;
  const labelElement = element.querySelector("label");
  const inputElement = element.querySelector("input");
  const today = new Date();

  // Set label
  if (isRequired) {
    labelElement.innerHTML = `${label.trim()} <span class="text-danger">*</span>`;
  } else {
    setContentToElement(labelElement, label.trim());
  }

  // Set min date and default value
  inputElement.min = today.toISOString().split("T")[0];
  inputElement.value = today.toISOString().split("T")[0];
  setDisplayElement(inputElement, displayDate);

  // Update display on input and validate on blur
  inputElement.addEventListener("input", () => {
    setDisplayElement(inputElement, displayDate);
  });
  inputElement.addEventListener("blur", () => {
    requiredInputValidation(inputElement);
  });
}

/**
 * Set up time field with available time slots
 * @param {HTMLElement} element
 * @param {Object} field
 * @param {boolean} isRequired
 */
function setTimeField(element, field, isRequired = true) {
  const { label, times } = field;
  const labelElement = element.querySelector("label");
  const timeContainer = element.querySelector("#timeSlots");
  const inputElement = element.querySelector("input");

  // Set label
  if (isRequired) {
    labelElement.innerHTML = `${label.trim()} <span class="text-danger">*</span>`;
  } else {
    setContentToElement(labelElement, label.trim());
  }

  // If no times available, show message
  if (times.length === 0) {
    setContentToElement(timeContainer, "No available time slots");
    addClass(timeContainer);
    return;
  }

  // Create time slot elements
  times.filter(Boolean).forEach((time) => {
    const timeElement = createTimeElement(time);
    timeContainer.appendChild(timeElement);

    // Add click event to select time slot
    timeElement.addEventListener("click", () => {
      // Remove selected class from all time slots
      const allTimeSlots = timeContainer.querySelectorAll(".time-slot");
      allTimeSlots.forEach((slot) => removeClass(slot, "selected"));

      // Add selected class to the selected time slot
      const selectedSlot = timeElement.querySelector(".time-slot");
      addClass(selectedSlot, "selected");

      // Set the selected time to the hidden input field
      inputElement.value = time;
      setDisplayElement(inputElement, displayTime);
    });
  });
}

function setServicesField(element, field) {
  const { label, services, invalid } = field;
  if (!label || !services || !Array.isArray(services) || !invalid) {
    console.warn("Label or Services Or invalid data is missing!");
    return;
  }

  const labelElement = element.querySelector("label");
  const selectElement = element.querySelector("select");
  const invalidElement = element.querySelector(".invalid-feedback");

  setContentToElement(labelElement, label);
  setContentToElement(invalidElement, invalid);

  services.forEach((service) => {
    const option = createElement("option", [], "", service.title);
    option.value = service.title;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("blur", () => {
    requiredInputValidation(selectElement);
  });

  selectElement.addEventListener("input", () => {
    setDisplayElement(selectElement, displayService);
  });
}

/**
 * Create a time slot element
 * @param {string} time
 * @returns {HTMLElement}
 */
function createTimeElement(time) {
  const timeContainer = createElement("div", ["col-4"]);
  const timeButton = createElement(
    "div",
    ["time-slot", "btn", "btn-outline-secondary", "w-100"],
    "",
    time
  );
  timeContainer.appendChild(timeButton);
  return timeContainer;
}
//#endregion

//#endregion

//#region Post Form Data
// Handle form submission
formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  let hasError = false;
  // select all inputs
  const inputs = formElement.querySelectorAll("input");
  const selectElement = formElement.querySelector("select");
  const message = formElement.querySelector("textarea");

  // check if the inputs are not empty
  for (const input of inputs) {
    if (input.id != "selectedTime") {
      if (requiredInputValidation(input)) {
        hasError = true;
      }
    }
  }

  if (requiredInputValidation(selectElement)) {
    hasError = true;
  }

  if (hasError) return;

  // Show loader
  addClass(formElement.querySelector("#submit .text"), "close");
  removeClass(formElement.querySelector("#submit .spinner"), "close");

  // disable the submit button
  addClass(formElement.querySelector("#submit"), "disabled");

  // Make the Post data
  let formData = {};

  // Collect form data
  inputs.forEach((e) => {
    addValueToObj(e, formData);
  });
  addValueToObj(selectElement, formData);
  addValueToObj(message, formData);

  // Send data to API
  fetch("https://scalezone.ae/cms/wp-json/appointment/v1/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => {
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
      resetInfoBox();
      formElement.reset();
    })
    .catch((error) => console.error("Error fetching data:", error));
});
//#endregion

//#region Helper Methods

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
 * Set display element content and color
 * @param {HTMLElement} input
 * @param {HTMLElement} displayElement
 */
function setDisplayElement(input, displayElement) {
  if (input.value && displayElement) {
    setContentToElement(displayElement, input.value);
    displayElement.style.color = "#f36c3d";
  } else if (displayElement) {
    setContentToElement(displayElement, "Not provided");
    displayElement.style.color = "#6c757d";
  }
}

/**
 * Set display name from first and last name fields
 * @param {HTMLElement} displayNameElement
 */
function setDisplayName(displayNameElement) {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  if (firstName || lastName) {
    setContentToElement(displayNameElement, `${firstName} ${lastName}`);
    displayNameElement.style.color = "#f36c3d";
  } else {
    setContentToElement(displayNameElement, "Not provided");
    displayNameElement.style.color = "#6c757d";
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
 * Reset info box display elements
 */
function resetInfoBox() {
  setDisplayDefault(displayName, "Not Provided");
  setDisplayDefault(displayEmail, "Not Provided");
  setDisplayDefault(displayPhone, "Not Provided");
  setDisplayDefault(displayService, "Not Provided");
  setDisplayDefault(displayDate, "Not Provided");
  setDisplayDefault(displayTime, "Not Provided");
}

/**
 * Set default display text and color
 * @param {HTMLElement} element
 * @param {string} text
 */
function setDisplayDefault(element, text) {
  if (!element) return;
  element.textContent = text;
  element.style.color = "#6c757d";
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
 * remove a class from an element if already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function removeClass(element, className = "skeleton") {
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
function addClass(element, className = "danger") {
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
