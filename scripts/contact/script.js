document.addEventListener("DOMContentLoaded", function () {
  // Form elements
  const form = document.querySelector("form");
  const serviceModal = document.getElementById("servicesModal");
  const serviceCheckboxes = document.querySelectorAll(".service-checkbox");
  const confirmBtn = document.getElementById("confirmServices");
  const serviceError = document.querySelector(
    ".services-section .error-message"
  );

  // Initialize Bootstrap modal
  const modal = new bootstrap.Modal(serviceModal);

  // Track selected services
  let selectedServices = [];

  // Open modal when "Choose Services" is clicked
  document
    .querySelector('[data-bs-toggle="modal"]')
    .addEventListener("click", function (e) {
      e.preventDefault();
      modal.show();
    });

  // Handle checkbox changes
  serviceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        selectedServices.push(this.value);
      } else {
        selectedServices = selectedServices.filter(
          (service) => service !== this.value
        );
      }
      validateServices();
    });
  });

  // Validate services selection
  function validateServices() {
    const isValid = selectedServices.length > 0;
    if (isValid) {
      serviceError.classList.add("d-none");
    } else {
      serviceError.classList.remove("d-none");
    }
    return isValid;
  }

  // Confirm selection and close modal
  confirmBtn.addEventListener("click", function () {
    if (validateServices()) {
      modal.hide();
    }
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    // e.preventDefault();
    let isValid = true;

    // Validate all form fields
    const requiredFields = [
      { id: "form6Example1", message: "First name is required" },
      { id: "form6Example2", message: "Last name is required" },
      {
        id: "form6Example5",
        message: "Email is required",
        validate: validateEmail,
      },
      { id: "form6Example3", message: "Company name is required" },
      {
        id: "form6Example6",
        message: "Phone number is required",
        validate: validatePhone,
      },
      { id: "form6Example7", message: "Message is required" },
    ];

    requiredFields.forEach((field) => {
      const element = document.getElementById(field.id);
      const errorElement = element.nextElementSibling;

      if (!element.value.trim()) {
        showError(element, field.message);
        isValid = false;
      } else if (field.validate && !field.validate(element.value)) {
        showError(element, field.message.replace("required", "valid"));
        isValid = false;
      } else {
        clearError(element);
      }
    });

    // Validate services
    if (selectedServices.length === 0) {
      serviceError.classList.remove("d-none");
      modal.show();
      isValid = false;
    }

    // Validate URL if provided
    const urlField = document.getElementById("form6Example4");
    if (urlField.value.trim() && !validateUrl(urlField.value)) {
      showError(urlField, "Please enter a valid URL");
      isValid = false;
    }

    if (isValid) {
      // Form is valid - prepare data and submit
      const formData = {
        firstName: document.getElementById("form6Example1").value,
        lastName: document.getElementById("form6Example2").value,
        email: document.getElementById("form6Example5").value,
        company: document.getElementById("form6Example3").value,
        phone: document.getElementById("form6Example6").value,
        message: document.getElementById("form6Example7").value,
        url: document.getElementById("form6Example4").value,
        services: selectedServices,
        contactMethod: document.querySelector(
          'input[name="contactMethod"]:checked'
        ).value,
        smsOptIn: document.querySelector('input[name="smsOptIn"]:checked')
          .value,
      };

      // Here you would typically send the data to your server
    }
  });

  // Helper functions
  function showError(element, message) {
    element.classList.add("is-invalid");
    let errorElement = element.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("invalid-feedback")) {
      errorElement = document.createElement("div");
      errorElement.className = "invalid-feedback";
      element.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function clearError(element) {
    element.classList.remove("is-invalid");
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains("invalid-feedback")) {
      errorElement.remove();
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\d\s+()-]{8,20}$/;
    return re.test(phone);
  }

  function validateUrl(url) {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }
});
