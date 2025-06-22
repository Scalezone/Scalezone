// Set minimum date to today
const today = new Date().toISOString().split("T")[0];
document.getElementById("date").setAttribute("min", today);

// Time slot selection
const timeSlots = document.querySelectorAll(".time-slot");
const selectedTimeInput = document.getElementById("selectedTime");

timeSlots.forEach((slot) => {
  slot.addEventListener("click", function () {
    timeSlots.forEach((s) => s.classList.remove("selected"));
    this.classList.add("selected");
    selectedTimeInput.value = this.dataset.time;
    updateDisplayTime();
  });
});

// Real-time updates for service info card
function updateDisplayName() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const displayName = document.getElementById("displayName");

  if (firstName || lastName) {
    displayName.textContent = `${firstName} ${lastName}`.trim();
    displayName.style.color = "#0d6efd";
  } else {
    displayName.textContent = "Not provided";
    displayName.style.color = "#6c757d";
  }
}

function updateDisplayEmail() {
  const email = document.getElementById("email").value.trim();
  const displayEmail = document.getElementById("displayEmail");

  if (email) {
    displayEmail.textContent = email;
    displayEmail.style.color = "#0d6efd";
  } else {
    displayEmail.textContent = "Not provided";
    displayEmail.style.color = "#6c757d";
  }
}

function updateDisplayPhone() {
  const phone = document.getElementById("phone").value.trim();
  const displayPhone = document.getElementById("displayPhone");

  if (phone) {
    displayPhone.textContent = phone;
    displayPhone.style.color = "#0d6efd";
  } else {
    displayPhone.textContent = "Not provided";
    displayPhone.style.color = "#6c757d";
  }
}

function updateDisplayService() {
  const inquiryType = document.getElementById("inquiryType");
  const displayService = document.getElementById("displayService");

  if (inquiryType.value) {
    displayService.textContent =
      inquiryType.options[inquiryType.selectedIndex].text;
    displayService.style.color = "#0d6efd";
  } else {
    displayService.textContent = "Not selected";
    displayService.style.color = "#6c757d";
  }
}

function updateDisplayDate() {
  const date = document.getElementById("date").value;
  const displayDate = document.getElementById("displayDate");

  if (date) {
    const dateObj = new Date(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    displayDate.textContent = dateObj.toLocaleDateString("en-US", options);
    displayDate.style.color = "#0d6efd";
  } else {
    displayDate.textContent = "Not selected";
    displayDate.style.color = "#6c757d";
  }
}

function updateDisplayTime() {
  const selectedTime = document.getElementById("selectedTime").value;
  const displayTime = document.getElementById("displayTime");

  if (selectedTime) {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = selectedTime.split(":");
    const hour12 = ((parseInt(hours) + 11) % 12) + 1;
    const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
    displayTime.textContent = `${hour12}:${minutes} ${ampm}`;
    displayTime.style.color = "#0d6efd";
  } else {
    displayTime.textContent = "Not selected";
    displayTime.style.color = "#6c757d";
  }
}

// Add event listeners for real-time updates
document
  .getElementById("firstName")
  .addEventListener("input", updateDisplayName);
document
  .getElementById("lastName")
  .addEventListener("input", updateDisplayName);
document.getElementById("email").addEventListener("input", updateDisplayEmail);
document.getElementById("phone").addEventListener("input", updateDisplayPhone);
document
  .getElementById("inquiryType")
  .addEventListener("change", updateDisplayService);
document.getElementById("date").addEventListener("change", updateDisplayDate);

// Form validation and submission
document
  .getElementById("appointmentForm")
  .addEventListener("submit", function (e) {
    const form = this;
    let isValid = true;

    // Check required fields including inquiry type
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "inquiryType",
    ];
    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else if (!field.checkValidity()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (isValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>Booking...';
      submitBtn.disabled = true;

      setTimeout(() => {
        document.getElementById("successMessage").classList.remove("d-none");
        document
          .getElementById("successMessage")
          .scrollIntoView({ behavior: "smooth", block: "center" });

        // Reset form after 5 seconds
        setTimeout(() => {
          form.reset();
          form.classList.remove("was-validated");
          timeSlots.forEach((s) => s.classList.remove("selected"));
          selectedTimeInput.value = "";
          // Remove all validation classes
          requiredFields.forEach((fieldId) => {
            document.getElementById(fieldId).classList.remove("is-invalid");
          });

          // Reset display information
          document.getElementById("displayName").textContent = "Not provided";
          document.getElementById("displayName").style.color = "#6c757d";
          document.getElementById("displayEmail").textContent = "Not provided";
          document.getElementById("displayEmail").style.color = "#6c757d";
          document.getElementById("displayPhone").textContent = "Not provided";
          document.getElementById("displayPhone").style.color = "#6c757d";
          document.getElementById("displayService").textContent =
            "Not selected";
          document.getElementById("displayService").style.color = "#6c757d";
          document.getElementById("displayDate").textContent = "Not selected";
          document.getElementById("displayDate").style.color = "#6c757d";
          document.getElementById("displayTime").textContent = "Not selected";
          document.getElementById("displayTime").style.color = "#6c757d";

          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          document.getElementById("successMessage").classList.add("d-none");
        }, 5000);
      }, 1500);
    }
  });

// Phone number formatting
document.getElementById("phone").addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");
  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
  this.value = value;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Handle focus and blur events for better validation UX
document.querySelectorAll("input, select").forEach((input) => {
  // Remove validation errors when user starts typing or selecting
  input.addEventListener("input", function () {
    this.classList.remove("is-invalid");
  });

  input.addEventListener("change", function () {
    this.classList.remove("is-invalid");
  });

  // Show validation errors only when user leaves empty required fields
  input.addEventListener("blur", function () {
    if (this.hasAttribute("required") && !this.value.trim()) {
      this.classList.add("is-invalid");
    } else if (this.checkValidity()) {
      this.classList.remove("is-invalid");
    } else if (this.value.trim()) {
      // Only show invalid for non-empty fields that fail validation
      this.classList.add("is-invalid");
    }
  });

  // Remove invalid state when field gets focus
  input.addEventListener("focus", function () {
    this.classList.remove("is-invalid");
  });
});
