document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-navbar", "components/navbar.html");
  await loadComponent("site-footer", "components/footer.html");

  initMobileNav();
  initFaq();
  initWeb3Forms();
});

async function loadComponent(targetId, filePath) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => faq.classList.remove("active"));

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

function isValidEmail(email) {
  const emailRegex = /^(?!\.)(?!.*\.\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

function hasTooManyRepeatedDigits(phone) {
  return /(\d)\1{4,}/.test(phone);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  const digitCount = cleaned.replace(/\D/g, "").length;

  if (digitCount < 8 || digitCount > 15) return false;
  if (hasTooManyRepeatedDigits(cleaned)) return false;

  // Allows + at the start, then digits/spaces/brackets/hyphens in original input
  const phoneRegex = /^\+?[0-9()\-\s]+$/;
  return phoneRegex.test(phone);
}

function validateForm(form) {
  const fullName = form.querySelector('[name="full_name"]')?.value.trim();
  const email = form.querySelector('[name="email"]')?.value.trim();
  const phone = form.querySelector('[name="phone"]')?.value.trim();
  const enquiryType = form.querySelector('[name="enquiry_type"]')?.value.trim();
  const message = form.querySelector('[name="message"]')?.value.trim();
  const botcheck = form.querySelector('[name="botcheck"]');

  if (!fullName || !email || !phone || !enquiryType || !message) {
    return "Please complete all required fields.";
  }

  if (fullName.length < 2) {
    return "Please enter your full name.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!isValidPhone(phone)) {
    return "Please enter a valid phone number.";
  }

  if (botcheck && botcheck.checked) {
    return "Spam protection triggered.";
  }

  if (message.length < 10) {
    return "Please add a little more detail to your message.";
  }

  return null;
}

function initWeb3Forms() {
  const forms = document.querySelectorAll("form[data-web3form]");

  forms.forEach((form) => {
    const statusEl = form.querySelector(".form-status") || document.getElementById(form.id === "heroEnquiryForm" ? "heroFormStatus" : "bottomFormStatus");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!statusEl) return;

      const validationError = validateForm(form);

      if (validationError) {
        statusEl.textContent = validationError;
        statusEl.style.color = "#b42318";
        return;
      }

      statusEl.textContent = "Sending your enquiry...";
      statusEl.style.color = "#0a0a90";

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      try {
        const formData = new FormData(form);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          statusEl.textContent = "Thank you. Your enquiry has been sent successfully.";
          statusEl.style.color = "#157347";
          form.reset();
        } else {
          statusEl.textContent = result.message || "Something went wrong. Please try again.";
          statusEl.style.color = "#b42318";
        }
      } catch (error) {
        statusEl.textContent = "There was a problem sending your enquiry. Please try again.";
        statusEl.style.color = "#b42318";
        console.error(error);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });
}