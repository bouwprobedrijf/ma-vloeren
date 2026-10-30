const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#mainNav");

// Mobiel menu: opent en sluit netjes en sluit na het kiezen van een onderdeel.
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menu openen");
  });
});

// Automatisch huidig jaartal.
document.querySelector("#year").textContent = new Date().getFullYear();

// Toon terug-naar-boven-knop na scrollen.
const backTop = document.querySelector(".back-top");
window.addEventListener("scroll", () => {
  backTop.classList.toggle("visible", window.scrollY > 450);
}, { passive: true });

// Demoformulier. Vul het echte e-mailadres in voordat de website online gaat.
document.querySelector("#quoteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Offerteaanvraag M.A. Vloeren - ${data.get("service")}`);
  const body = encodeURIComponent(
    `Naam: ${data.get("name")}\nE-mail: ${data.get("email")}\nDienst: ${data.get("service")}\n\nProject:\n${data.get("message")}`
  );
  const businessEmail = ""; // Vul hier het zakelijke e-mailadres in.
  const status = document.querySelector("#formStatus");

  if (!businessEmail) {
    status.textContent = "Het formulier is ingevuld. Vul eerst het zakelijke e-mailadres in in script.js om de aanvraag per e-mail te openen.";
    return;
  }
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
});
