// const leftAnimationEle = document.querySelector(".left-animate");
// const rightAnimationEle = document.querySelector(".right-animate");

// Select element
const mainElement = document.querySelector("main");
// Get slug from URL (e.g. services/servicel?slug=start-selling)
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Fetch service data using slug
fetch(`https://scalezone.ae/cms/wp-json/wp/v2/service?slug=${slug}`)
  .then((response) => {
    if (!response.ok) {
      // Handle network errors
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  })
  .then((data) => {
    // Get first service object from response
    const service = data[0];
    if (!service) {
      // Handle missing service
      throw new Error(`${slug} service page not found`);
    }
    // Populate all sections with service data
    populateAllSections(service);
  });

/**
 * Populates all sections of the blog page
 * @param {Object} data - Blog data
 */
function populateAllSections(data) {
  document.title = data.title;

  // Add hero section
  mainElement.append(
    populateHeroSection(data),
    populateContactSection(data),
    populateFaqsSection(data)
  );
}

//#region Hero section
function populateHeroSection(data) {
  const { hero } = data.sections;
  if (!hero) {
    console.warn("Hero's data is missing");
    return;
  }

  const sectionELement = createElement("section", ["hero", "overflow-hidden"]);
  const containerElement = createElement("div", [
    "research-container",
    "cw",
    "d-flex",
    "flex-column-reverse",
    "flex-lg-row",
    "gap-5",
    "p-4",
  ]);
  const text = createHeroContent(hero.title, hero.description);
  const image = createHeroImage(hero.image, hero.title);

  containerElement.append(text, image);
  sectionELement.appendChild(containerElement);
  animationOnLoad(text, image);
  return sectionELement;
}

function createHeroImage(imgSrc, title) {
  if (!imgSrc) {
    console.log("Image source is missing");
    return;
  }

  const imageELement = createElement("div", [
    "img",
    "animate__animated",
    "w-lg-50",
    "w-100",
  ]);
  const image = createElement("img");
  setImageElement(image, imgSrc, title);

  imageELement.appendChild(image);
  return imageELement;
}

function createHeroContent(title, description) {
  if (!title || !description) {
    console.log("Title and Desciption are missing");
    return;
  }

  const textContainer = createElement("div", [
    "text-side",
    "animate__animated",
    "d-flex",
    "flex-column",
    "gap-5",
    "justify-content-center",
    "w-lg-50",
    "w-100",
    "text-lg-start",
    "text-center",
  ]);
  const titleBox = createElement("div", ["title"]);
  const titleElement = createElement("h2", [], "", title);
  const textBox = createElement("div", ["description"]);
  const textList = setContentText(description);

  textList.forEach((element) => {
    textBox.appendChild(element);
  });
  titleBox.appendChild(titleElement);

  textContainer.append(titleBox, textBox);
  return textContainer;
}
//#endregion

//#region Contact section
function populateContactSection(data) {
  const { contact } = data.sections;
  if (!contact) {
    console.log("Contact data is missing");
    return;
  }

  const sectionELement = createElement("section", ["product-research"]);
  const messageElement = createElement(
    "div",
    ["messages", "position-fixed"],
    "messages"
  );
  const success = createElement("div", [
    "success",
    "position-absolute",
    "d-flex",
    "gap-3",
    "align-items-center",
  ]);
  const successLogo = createElement("div", ["logo"]);
  const successLogoImg = createElement("img");
  setImageElement(
    successLogoImg,
    "/assets/appointment/success.webp",
    "Success icon"
  );
  const successTextCont = createElement("div", ["success-text"]);
  const successTitle = createElement("h3", ["caption"]);
  const successText = createElement("p");
  const unsuccess = createElement("div", [
    "unsuccess",
    "position-absolute",
    "d-flex",
    "gap-3",
    "align-items-center",
  ]);
  const unsuccessLogo = createElement("div", ["logo"]);
  const unsuccessLogoImg = createElement("img");
  setImageElement(
    unsuccessLogoImg,
    "/assets/appointment/unsauccess.webp",
    "Unsuccess icon"
  );
  const unsuccessTextCont = createElement("div", ["unsuccess-text"]);
  const unsuccessTitle = createElement("h3", ["caption"], "", "Error");
  const unsuccessText = createElement(
    "p",
    [],
    "",
    "Could not send your request. Try again later."
  );

  successLogo.appendChild(successLogoImg);
  successTextCont.append(successTitle, successText);
  success.append(successLogo, successTextCont);

  unsuccessLogo.appendChild(unsuccessLogoImg);
  unsuccessTextCont.append(unsuccessTitle, unsuccessText);
  unsuccess.append(unsuccessLogo, unsuccessTextCont);

  messageElement.append(success, unsuccess);

  const containerElement = createElement("div", [
    "hero-container",
    "cw",
    "d-flex",
    "flex-column",
    "flex-lg-row-reverse",
    "gap-5",
    "p-4",
  ]);
  const text = createContactContent(contact.form, success, unsuccess);
  const image = createContactImage(contact.image, contact.form.content.title);

  containerElement.append(text, image);
  sectionELement.append(containerElement, messageElement);
  animationOnScroll(text, "animate__lightSpeedInRight");
  animationOnScroll(image, "animate__lightSpeedInLeft");
  return sectionELement;
}

function createContactImage(imgSrc, title) {
  if (!imgSrc) {
    console.log("Image source is missing");
    return;
  }

  const imageELement = createElement("div", [
    "img",
    "right-side-animated",
    "animate__animated",
    "w-lg-50",
    "w-100",
  ]);
  const image = createElement("img");
  setImageElement(image, imgSrc, title);

  imageELement.appendChild(image);
  return imageELement;
}

function createContactContent(data, success, unsuccess) {
  const { content, form } = data;
  if (!form || !content) {
    console.log("Content or Form data is missing");
    return;
  }

  const textContainer = createElement("div", [
    "getstarted-form",
    "left-side-animated",
    "animate__animated",
    "d-flex",
    "align-items-center",
    "w-lg-50",
    "w-100",
  ]);
  const formContainer = createElement("div", ["text-side"]);
  const top = createElement("div", ["top", "text-lg-start", "text-center"]);
  const bottom = createElement("div", ["bottom"]);
  const bottomMask = createElement("div", [
    "mask",
    "d-flex",
    "align-items-center",
    "h-100",
  ]);
  const titleBox = createElement("div", ["title"]);
  const titleElement = createElement("h2", [], "", content.title);
  const textBox = createElement("div", ["description"]);
  const textList = setContentText(content.description);
  const formELement = createForm(form);

  submitForm(formELement, unsuccess, success, content.title);

  textList.forEach((element) => {
    textBox.appendChild(element);
  });
  titleBox.appendChild(titleElement);
  top.append(titleBox, textBox);

  bottom.append(bottomMask);
  bottomMask.appendChild(formELement);

  formContainer.append(top, bottom);
  textContainer.appendChild(formContainer);
  return textContainer;
}

// Creates and returns a form DOM element based on the provided form configuration object.
/**
 * Creates a dynamic HTML form element based on the provided form configuration object.
 *
 * The form includes fields for first name, last name, email, company name, phone number,
 * business model selection, budget selection, and a submit button with a loading spinner.
 * Each input is constructed using helper functions such as `createInput`, `createSelect`, and `createElement`.
 *
 * @param {Object} form - The configuration object for the form fields.
 *
 * @returns {HTMLElement|undefined} The constructed form element, or undefined if the form configuration is missing.
 */
function createForm(form) {
  if (!form) {
    console.warn("Form data is missing!");
    return;
  }

  // Create the form element
  const formElement = createElement("form");

  // First and last name row
  const firstLastNameCont = createElement("div", ["row"]);
  const firstNameBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const lastNameBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const firstNameInput = createInput(
    form.first_name.label,
    "text",
    "form6Example1",
    "form-control",
    "first_name",
    form.first_name.placeholder,
    form.first_name.invalid_text
  );
  const lastNameInput = createInput(
    form.last_name.label,
    "text",
    "form6Example2",
    "form-control",
    "last_name",
    form.last_name.placeholder,
    form.last_name.invalid_text
  );

  // Email and company row
  const emailCompanyCont = createElement("div", ["row"]);
  const emailBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const companyBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const emailInput = createInput(
    form.email.label,
    "email",
    "form6Example5",
    "form-control",
    "email",
    form.email.placeholder,
    form.email.invalid_text
  );
  const companyInput = createInput(
    form.company_name.label,
    "text",
    "form6Example3",
    "form-control",
    "company",
    form.company_name.placeholder,
    form.company_name.invalid_text
  );

  // Phone number input
  const phoneNumber = createInput(
    form.phone_number.label,
    "tel",
    "form6Example6",
    "form-control",
    "phone_number",
    form.phone_number.placeholder,
    form.phone_number.not_valid_text
  );

  // Business model select
  const businessModel = createSelect(
    form.business_model.label,
    "form6Example7",
    "form-control",
    "business_model",
    form.business_model.business_models
  );

  // Budget select
  const budget = createSelect(
    form.budget.label,
    "form6Example8",
    "form-control",
    "budget",
    form.budget.budget_list
  );

  // Submit button with spinner
  const submitButton = createElement(
    "button",
    ["btn", "btn-primary", "btn-rounded", "btn-block"],
    "submit",
    "",
    "submit"
  );
  const submitText = createElement("div", ["text"], "", "Get Started Now");
  const spinnerCont = createElement("div", ["spinner", "close"]);
  for (let i = 0; i < 3; i++) {
    spinnerCont.appendChild(createElement("span", ["bar"]));
  }

  // Assemble form structure
  firstNameBox.appendChild(firstNameInput);
  lastNameBox.appendChild(lastNameInput);
  firstLastNameCont.append(firstNameBox, lastNameBox);
  emailBox.appendChild(emailInput);
  companyBox.appendChild(companyInput);
  emailCompanyCont.append(emailBox, companyBox);
  submitButton.append(submitText, spinnerCont);

  formElement.append(
    firstLastNameCont,
    emailCompanyCont,
    phoneNumber,
    businessModel,
    budget,
    submitButton
  );
  return formElement;
}

/**
 * Creates a dynamic HTML form element based on the provided form configuration object.
 *
 * The form includes fields for first name, last name, email, company name, phone number,
 * business model selection, budget selection, and a submit button with a loading spinner.
 * Each input is constructed using helper functions such as `createInput`, `createSelect`, and `createElement`.
 *
 * @param {Object} form - The configuration object for the form fields.
 *
 * @returns {HTMLElement|undefined} The constructed form element, or undefined if the form configuration is missing.
 */
function createForm(form) {
  if (!form) {
    console.warn("Form data is missing!");
    return;
  }

  // Create the form element
  const formElement = createElement("form");

  // First and last name row
  const firstLastNameCont = createElement("div", ["row"]);
  const firstNameBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const lastNameBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const firstNameInput = createInput(
    form.first_name.label,
    "text",
    "form6Example1",
    "form-control",
    "first_name",
    form.first_name.placeholder,
    form.first_name.invalid_text
  );
  const lastNameInput = createInput(
    form.last_name.label,
    "text",
    "form6Example2",
    "form-control",
    "last_name",
    form.last_name.placeholder,
    form.last_name.invalid_text
  );

  // Email and company row
  const emailCompanyCont = createElement("div", ["row"]);
  const emailBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const companyBox = createElement("div", ["col-12", "col-md-6", "mb-1"]);
  const emailInput = createInput(
    form.email.label,
    "email",
    "form6Example5",
    "form-control",
    "email",
    form.email.placeholder,
    form.email.invalid_text
  );
  const companyInput = createInput(
    form.company_name.label,
    "text",
    "form6Example3",
    "form-control",
    "company",
    form.company_name.placeholder,
    form.company_name.invalid_text
  );

  // Phone number input
  const phoneNumber = createInput(
    form.phone_number.label,
    "tel",
    "form6Example6",
    "form-control",
    "phone_number",
    form.phone_number.placeholder,
    form.phone_number.not_valid_text
  );

  // Business model select
  const businessModel = createSelect(
    form.business_model.label,
    "form6Example7",
    "form-control",
    "business_model",
    form.business_model.business_models
  );

  // Budget select
  const budget = createSelect(
    form.budget.label,
    "form6Example8",
    "form-control",
    "budget",
    form.budget.budget_list
  );

  // Submit button with spinner
  const submitButton = createElement(
    "button",
    ["btn", "btn-primary", "btn-rounded", "btn-block"],
    "submit",
    "",
    "submit"
  );
  const submitText = createElement("div", ["text"], "", "Get Started Now");
  const spinnerCont = createElement("div", ["spinner", "close"]);
  for (let i = 0; i < 3; i++) {
    spinnerCont.appendChild(createElement("span", ["bar"]));
  }

  // Assemble form structure
  firstNameBox.appendChild(firstNameInput);
  lastNameBox.appendChild(lastNameInput);
  firstLastNameCont.append(firstNameBox, lastNameBox);
  emailBox.appendChild(emailInput);
  companyBox.appendChild(companyInput);
  emailCompanyCont.append(emailBox, companyBox);
  submitButton.append(submitText, spinnerCont);

  formElement.append(
    firstLastNameCont,
    emailCompanyCont,
    phoneNumber,
    businessModel,
    budget,
    submitButton
  );
  return formElement;
}

// Handle form submission
function submitForm(form, unsuccess, success, title) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let hasError = false;
    // select all inputs
    const inputs = form.querySelectorAll("input");
    const selectElements = form.querySelectorAll("select");

    // check if the inputs are not empty
    for (const input of inputs) {
      if (input.name != "company") {
        if (requiredInputValidation(input)) {
          hasError = true;
        }
      }
    }

    if (hasError) return;

    // Show loader
    addClassToElement(form.querySelector("#submit .text"), "close");
    removeClass(form.querySelector("#submit .spinner"), "close");

    // disable the submit button
    addClassToElement(form.querySelector("#submit"), "disabled");

    // Make the Post data
    let formData = {
      service: title,
    };

    // Collect form data
    inputs.forEach((e) => {
      addValueToObj(e, formData);
    });

    selectElements.forEach((e) => {
      addValueToObj(e, formData);
    });

    // Send data to API
    fetch("https://scalezone.ae/cms/wp-json/service/v1/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        addClassToElement(form.querySelector("#submit .spinner"), "close");
        removeClass(form.querySelector("#submit .text"), "close");
        removeClass(form.querySelector("#submit"), "disabled");

        if (!response.ok) {
          showElementForTime(unsuccess, 1500);
          throw new Error("Something went wrong.");
        }
        return response.json();
      })
      .then((data) => {
        // Show success message
        const title = success.querySelector(".caption");
        const message = success.querySelector("p");
        setContentToElement(title, data.status);
        setContentToElement(message, data.message);
        showElementForTime(success, 1500);

        // Reset form and info box
        form.reset();
      })
      .catch((error) => console.error("Error fetching data:", error));
  });
}
//#endregion

//#region FAQs section
/**
 * Populates the FAQs section of the page with questions and images.
 * @param {Object} data - The service data object containing FAQ section info.
 * @returns {HTMLElement|undefined} The constructed FAQ section element.
 */
function populateFaqsSection(data) {
  const { faqs } = data.sections;
  if (!data) {
    console.warn("FAQs data is missing!");
    return;
  }

  // Create the main FAQ section element
  const section = createElement("section", ["faq", "my-5", "overflow-hidden"]);
  // Create and append the section title
  const title = createElement(
    "h2",
    ["secondary-heading", "mx-auto", "text-center", "mb-5"],
    "",
    faqs.title
  );
  // Create the FAQ container for layout
  const faqContainer = createElement("div", [
    "faq-container",
    "container",
    "mx-auto",
    "row",
    "align-items-center",
    "justify-content-center",
    "justify-self-center",
    "gx-5",
  ]);

  // Create the FAQ image (responsive)
  const image = createFaqImage(
    faqs.desktop_image,
    faqs.mobile_image,
    faqs.title
  );

  // Create the FAQ accordion with questions
  const text = createFaqAccordion(faqs.questions);

  // Add scroll animations to image and text
  animationOnScroll(image, "animate__lightSpeedInLeft");
  animationOnScroll(text, "animate__lightSpeedInRight");

  // Append image and accordion to the container, then to the section
  faqContainer.append(image, text);
  section.append(title, faqContainer);
  return section;
}

/**
 * Creates a responsive FAQ image element using <picture> for desktop and mobile.
 * @param {string} desktopImg - URL for the desktop image.
 * @param {string} mobileImage - URL for the mobile image.
 * @param {string} title - Alt text for the image.
 * @returns {HTMLElement} The constructed image element.
 */
function createFaqImage(desktopImg, mobileImage, title) {
  const imageElement = createElement("div", [
    "image-side",
    "animate__animated",
    "left-side-animated",
    "col-8",
    "col-md-6",
  ]);
  const picture = createElement("picture");
  const source = createElement("source");
  source.srcset = mobileImage;
  source.setAttribute("media", "(max-width: 768px)");
  const img = createElement("img");
  setImageElement(img, desktopImg, title);

  picture.append(source, img);
  imageElement.appendChild(picture);
  return imageElement;
}

/**
 * Creates an accordion element containing FAQ questions.
 * @param {Array} questions - Array of question objects.
 * @returns {HTMLElement|undefined} The constructed accordion element.
 */
function createFaqAccordion(questions) {
  if (!questions) {
    console.warn("Questions data is missing!");
    return;
  }

  // Container for the accordion and its questions
  const questionsContainer = createElement("div", [
    "text-side",
    "animate__animated",
    "right-side-animated",
    "col-9",
    "col-md-6",
  ]);
  // Accordion wrapper
  const accordionContainer = createElement(
    "div",
    ["accordion"],
    "accordionPanelsStayOpenExample"
  );

  // Populate the accordion with questions
  createQuestions(questions, accordionContainer);

  questionsContainer.appendChild(accordionContainer);
  return questionsContainer;
}

/**
 * Creates question elements for FAQ or trusted section
 * @param {Object} data
 * @param {HTMLElement} parentElement
 */
function createQuestions(data, parentElement) {
  if (!data || !Array.isArray(data)) {
    console.warn("Questions data is missing or not an array");
    return;
  }
  data.forEach((question, index) => {
    parentElement.appendChild(createQuestionElement(question, index));
  });
}

/**
 * Creates a single question element
 * @param {Object} data
 * @param {number} index
 * @returns {HTMLElement}
 */
function createQuestionElement(data, index) {
  const questionsContainer = createElement("div", ["accordion-item"]);
  const questionTitle = createQuestionTitle(data, index);
  const questionAnswers = createQuestionAnswers(data, index);

  questionsContainer.appendChild(questionTitle);
  questionsContainer.appendChild(questionAnswers);

  return questionsContainer;
}

/**
 * Creates question title element
 * @param {Object} data
 * @param {number} index
 * @returns {HTMLElement}
 */
function createQuestionTitle(data, index) {
  const questionTitle = createElement(
    "h3",
    ["accordion-header"],
    `panelsStayOpen-heading-${index}`
  );

  const button = createElement(
    "button",
    ["accordion-button", "collapsed"],
    "",
    data.title
  );
  button.type = "button";
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#panelsStayOpen-collapse-${index}`);
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", `panelsStayOpen-collapse-${index}`);

  questionTitle.appendChild(button);

  return questionTitle;
}

/**
 * Creates question answers element
 * @param {Object} data
 * @param {number} index
 * @returns {HTMLElement}
 */
function createQuestionAnswers(data, index) {
  if (!data.answer) {
    console.warn("Answers data is missing");
    return;
  }

  const answersContainer = createElement(
    "div",
    ["accordion-collapse", "collapse"],
    `panelsStayOpen-collapse-${index}`
  );
  answersContainer.setAttribute(
    "aria-labelledby",
    `panelsStayOpen-heading-${index}`
  );
  const answersBody = createElement("div", ["accordion-body"]);

  const answerElement = createElement("p", ["desciption"], "", data.answer);

  answersBody.appendChild(answerElement);
  answersContainer.appendChild(answersBody);
  return answersContainer;
}

//#endregion

//#region Helper methods
function createInput(
  label,
  type,
  id,
  className,
  inputName,
  placeholder,
  invalidText = ""
) {
  const box = createElement("div", ["form-outline", "mb-1"]);
  const labelELement = createElement("label", ["mb-1"], "", label.trim());
  labelELement.setAttribute("for", id);
  const inputElement = createElement("input", [className], id, "", type);
  inputElement.name = inputName;
  inputElement.setAttribute("placeholder", placeholder.trim());
  let invalid = "";
  box.append(labelELement, inputElement);

  if (invalidText != "") {
    invalid = createElement(
      "div",
      ["invalid-feedback"],
      "",
      invalidText.trim()
    );
    box.appendChild(invalid);
  }

  inputElement.addEventListener("blur", () => {
    if (inputName === "phone_number") {
      requiredInputValidation(inputElement);
      validatePhoneNumber(inputElement);
    }

    if (inputName === "email") validateEmail(inputElement);

    if (inputName === "first_name" || inputName === "last_name")
      requiredInputValidation(inputElement);
  });
  return box;
}

function createSelect(label, id, className, inputName, optionListText) {
  const box = createElement("div", ["form-outline", "mb-3"]);
  const labelELement = createElement("label", ["mb-1"], "", label);
  labelELement.setAttribute("for", id);

  const select = createElement("select", [className], id, "");
  select.name = inputName;
  const defOption = createElement("option", [], "", "Please Select");
  defOption.setAttribute("selected", "true");
  defOption.setAttribute("disabled", "true");
  const optionsList = optionListText.split(" | ");

  select.appendChild(defOption);

  for (let i = 0; i < optionsList.length; i++) {
    let option;
    if (optionsList[i].includes("-")) {
      option = createElement("option", [], "", `${optionsList[i].trim()} $`);
      option.value = `${optionsList[i].trim()} $`;
    } else {
      option = createElement("option", [], "", optionsList[i].trim());
      option.value = `${optionsList[i].trim()}`;
    }
    select.appendChild(option);
  }

  box.append(labelELement, select);
  return box;
}

/**
 * Add input value to object
 * @param {HTMLElement} input
 * @param {Object} obj
 */
function addValueToObj(input, obj) {
  if (input.name === "first_name" || input.name === "last_name") {
    obj[input.name] =
      input.value.substring(0, 1).toUpperCase().trim() +
      input.value.substring(1).trim();
  } else {
    obj[input.name] = input.value.trim();
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
      return false;
    } else {
      addClassToElement(input, "is-invalid");
      return true;
    }
  } catch (error) {
    addClassToElement(input, "is-invalid");
  }
}

/**
 * Validate required input
 * @param {HTMLElement} input
 * @returns {boolean} true if invalid
 */
function requiredInputValidation(input) {
  if (input.value === "") {
    addClassToElement(input, "is-invalid");
    return true;
  } else {
    removeClass(input, "is-invalid");
    return false;
  }
}

/**
 * Validate email format
 * @param {HTMLElement} email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value === "" || !regex.test(email.value)) {
    addClassToElement(email, "is-invalid");
    return false;
  } else {
    removeClass(email, "is-invalid");
    return true;
  }
}

/**
 * Splits text into paragraphs or lists and returns DOM elements
 * @param {string} text
 * @returns {HTMLElement[]}
 */
function setContentText(text) {
  if (!text) {
    console.warn("Content is missing");
    return;
  }

  const contentList = text.split("\r\n");
  const domList = [];

  for (let i = 0; i < contentList.length; i++) {
    if (contentList[i].includes("|")) {
      domList.push(setContentList(contentList[i]));
    } else {
      domList.push(createElement("p", [], "", contentList[i]));
    }
  }

  return domList;
}

/**
 * Converts a pipe-separated string into a list element
 * @param {string} text
 * @returns {HTMLElement}
 */
function setContentList(text) {
  if (!text.includes("|")) {
    console.warn("Text is not list");
    return;
  }

  const listContent = text.split(" | ");
  const listElement = createElement("ul");

  listContent.forEach((element) => {
    listElement.appendChild(
      createElement("li", [], "", element).cloneNode(true)
    );
  });

  return listElement;
}

/**
 * Create an element with optional classes and text content
 * @param {string} tag
 * @param {Array} classes
 * @param {string} content
 * @returns {HTMLElement}
 */
function createElement(
  tag,
  classes = [],
  id = "",
  content = "",
  inputType = ""
) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (id) el.id = id;
  if (content) el.textContent = content;
  if (inputType) el.type = inputType;
  return el;
}

/**
 * Sets image src and alt to an element
 * @param {HTMLElement} element
 * @param {string} imageUrl
 * @param {string} imageAlt
 */
function setImageElement(element, imageUrl, imageAlt = "") {
  if (element && imageUrl) {
    element.src = imageUrl;
    element.alt = imageAlt || "Image";
  }
}

/**
 * Adds a class to an element if not already present
 * @param {Element} element - DOM element
 * @param {string} className
 */
function addClassToElement(element, className = "active") {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
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
 * Show element for a specified time then hide
 * @param {HTMLElement} element
 * @param {number} specifiedTime
 * @param {string} showingClass
 */
function showElementForTime(element, specifiedTime, showingClass = "active") {
  if (!element) return;
  addClassToElement(element, showingClass);
  setTimeout(() => {
    removeClass(element, showingClass);
  }, specifiedTime);
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
 * Sets image src and alt to an element
 * @param {HTMLElement} element
 * @param {string} imageUrl
 * @param {string} imageAlt
 */
function setImageElement(element, imageUrl, imageAlt = "") {
  if (element && imageUrl) {
    element.src = imageUrl;
    element.alt = imageAlt || "Image";
  }
}
//#endregion

//#region Animation
// Animate hero section elements on page load
function animationOnLoad(left, right) {
  addClassToElement(left, "animate__jackInTheBox");
  addClassToElement(right, "animate__jackInTheBox");
}

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
    addElementVisiblity(element, animationClass);
  }
}

// Add animation class to element when it becomes visible on scroll
function animationOnScroll(element, animateClass) {
  window.addEventListener("scroll", () => {
    animateElementOnVisibility(
      element,
      animateClass,
      isElementVisible(element, 25)
    );
  });
}
//#endregion
