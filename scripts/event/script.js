// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrYmHaRRB_Lrw3s59I5q1tizyEkO9XB_k",
  authDomain: "expo-form-a3015.firebaseapp.com",
  projectId: "expo-form-a3015",
  storageBucket: "expo-form-a3015.firebasestorage.app",
  messagingSenderId: "445904485449",
  appId: "1:445904485449:web:3fe2f2b2a0c0221dde1398",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
const db = getFirestore(app);

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
      if (input.name === "Phone") {
        requiredInputValidation(input);
        validatePhoneNumber(input);
      }

      if (input.name === "Email") {
        validateEmail(input);
      }

      if (input.name === "Full Name") {
        requiredInputValidation(input);
      }
    });
  });
}

setValidationsOnInputs();
//#endregion

//#region Post
// Handle form submission
formElement.addEventListener("submit", async (e) => {
  e.preventDefault();

  let hasError = false;
  // select all inputs
  const inputs = formElement.querySelectorAll("input");

  // Validate required inputs
  for (const input of inputs) {
    if (input.type != "radio") {
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
  let formData = {
    Date: new Date().toLocaleString("en-EG", {
      timeZone: "Asia/Dubai",
    }),
  };

  // Collect form data from inputs
  inputs.forEach((e) => {
    if (e.type === "radio") {
      if (e.checked) {
        addValueToObj(e, formData);
      }
    } else {
      addValueToObj(e, formData);
    }
  });

  // Send data to Firebase
  try {
    // Send data to n8n webhook
    await fetch(
      "https://n8n-main-instance-production-22bf.up.railway.app/webhook/618f47be-d732-411b-b406-9ae0bd0725a7",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": "Expo_Event_2025",
        },
        body: JSON.stringify(formData),
      }
    );

    // Save to Firebase Firestore
    const docRef = await addDoc(collection(db, "registrations"), formData);

    // Hide loader and enable submit button
    addClass(formElement.querySelector("#submit .spinner"), "close");
    removeClass(formElement.querySelector("#submit .text"), "close");
    removeClass(formElement.querySelector("#submit"), "disabled");

    // Show success message
    const title = successMessage.querySelector(".caption");
    const message = successMessage.querySelector("p");
    setContentToElement(title, "Success");
    setContentToElement(message, "Registration submitted successfully!");
    showElementForTime(successMessage, 1500);

    // Reset form and info box
    formElement.reset();
  } catch (error) {
    console.error("Error adding document: ", error);

    addClass(formElement.querySelector("#submit .spinner"), "close");
    removeClass(formElement.querySelector("#submit .text"), "close");
    removeClass(formElement.querySelector("#submit"), "disabled");

    showElementForTime(unsuccessMessage, 1500);
  }
});
//#endregion

//#region Helper functions
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
 * Add input value to object
 * @param {HTMLElement} input
 * @param {Object} obj
 */
function addValueToObj(input, obj) {
  obj[input.name] = input.value !== "" ? input.value.trim() : "Not Specified";
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
    email.focus();
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
