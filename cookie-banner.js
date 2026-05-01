(function () {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");

  if (!banner || !acceptBtn || !declineBtn) return;

  const COOKIE_KEY = "nwtt_cookie_consent";

  function showBanner() {
    banner.classList.add("is-visible");
  }

  function hideBanner() {
    banner.classList.remove("is-visible");
  }

  function setConsent(value) {
    localStorage.setItem(COOKIE_KEY, value);
    hideBanner();
  }

  function getConsent() {
    return localStorage.getItem(COOKIE_KEY);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const savedConsent = getConsent();

    if (!savedConsent) {
      setTimeout(showBanner, 350);
    }
  });

  acceptBtn.addEventListener("click", function () {
    setConsent("accepted");
  });

  declineBtn.addEventListener("click", function () {
    setConsent("declined");
  });
})();