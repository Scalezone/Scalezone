const loadingPage = document.querySelector(".loading"); // Loading page element
const bodyEle = document.body; // Body element
const formElement = document.querySelector("#form"); // Contact form element
const successMessage = document.querySelector("#messages .success");
const unsuccessMessage = document.querySelector("#messages .unsuccess");

window.addEventListener("load", () => {
  handleLoading();
});

//#region Validations
function setValidationsOnInputs() {
  const inputs = formElement.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.name === "phone") {
        requiredInputValidation(input);
        validatePhoneNumber(input);
      }

      if (input.name === "email") {
        validateEmail(input);
      }

      if (input.name === "fullname") {
        requiredInputValidation(input);
      }

      if (input.name === "whatsapp") {
        const phoneNumber = libphonenumber.parsePhoneNumberFromString(
          input.value,
          "EG"
        );

        if (phoneNumber.isValid()) {
          input.value = phoneNumber.formatInternational();
          removeClass(input, "is-invalid");
        } else {
          addClass(input, "is-invalid");
        }
      }
    });
  });
}

setValidationsOnInputs();
//#endregion

//#region Post
// Handle form submission
formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  let hasError = false;
  // select all inputs
  const inputs = formElement.querySelectorAll("input");

  // Validate required inputs
  for (const input of inputs) {
    if (input.type != "radio") {
      if (input.name != "nickname" && input.name != "whatsapp")
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
    if (e.name !== "whatsapp") {
      addValueToObj(e, formData);
    }
  });

  const whatsappInput = formElement.querySelector("input[name='whatsapp']");
  const phoneInput = formElement.querySelector("input[name='phone']");

  console.log(whatsappInput.value, phoneInput);
  formData["whatsapp"] =
    whatsappInput.value !== "" ? whatsappInput.value : phoneInput.value;

  console.log(formData);

  // Send data to API
  fetch(
    "https://script.google.com/macros/s/AKfycbzZl0Uc1PLdCE7pVyPF0alL0tPCH0DSGBXoeaxraVSqdiuff5RJ1YEOS_s4wI7wJqLf/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  )
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

//#region Helper functions
/**
 * Add input value to object
 * @param {HTMLElement} input
 * @param {Object} obj
 */
function addValueToObj(input, obj) {
  obj[input.name] = input.value.trim();
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

//#region Handle Loadin page on fetching
function handleLoading() {
  removeElementVisiblity(bodyEle, "load");
  addElementVisiblity(loadingPage, "close");
}
//#endregion
