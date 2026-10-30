document.addEventListener("DOMContentLoaded", () => {
  // Tarieven uit de aangeleverde prijstabel, exclusief btw.
  // Per rij: arbeid / inclusief materiaal.
  const PRICES = {
    walls:       { labour: 6,  materials: 10 },
    ceiling:     { labour: 7,  materials: 12 },
    darkWalls:   { labour: 7,  materials: 12 },
    preparation: { labour: 2,  materials: 3 },
    plamuren:    { labour: 5,  materials: 7 },
    doors:       { labour: 40, materials: 80 },
    radiators:   { labour: 35, materials: 45 },
    woodwork:    { labour: 5,  materials: 8 }
  };

  // "labour" = alleen werk; "materials" = inclusief materiaal.
  // Verander dit naar "materials" als je inclusief materiaal wilt rekenen.
  const PRICE_MODE = "labour";

  const form = document.getElementById("paintForm");
  const totalPrice = document.getElementById("totalPrice");
  const resultNote = document.getElementById("resultNote");
  const resetButton = document.getElementById("resetForm");
  const currentYear = document.getElementById("currentYear");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (!form || !totalPrice) {
    console.error("Schilderwerkcalculator: formulier of resultaatveld niet gevonden.");
    return;
  }

  const euro = amount => new Intl.NumberFormat("nl-NL", {
    style: "currency", currency: "EUR", maximumFractionDigits: 2
  }).format(amount);

  form.addEventListener("submit", event => {
    event.preventDefault();
    let total = 0;
    let hasWork = false;

    for (const [id, tariff] of Object.entries(PRICES)) {
      const field = document.getElementById(id);
      if (!field) continue;
      const quantity = Number(field.value) || 0;

      if (quantity < 0) {
        totalPrice.textContent = "Controleer de ingevulde aantallen";
        if (resultNote) resultNote.textContent = "";
        field.focus();
        return;
      }
      if (quantity > 0) {
        hasWork = true;
        total += quantity * tariff[PRICE_MODE];
      }
    }

    if (!hasWork) {
      totalPrice.textContent = "Vul werkzaamheden in";
      if (resultNote) resultNote.textContent = "Vul minstens één aantal in om de totaalprijs te berekenen.";
      return;
    }

    // Alleen de totaalprijs tonen; geen tarieven of deeltotalen aan de klant tonen.
    totalPrice.textContent = euro(total);
    if (resultNote) {
      resultNote.textContent = "Indicatieve totaalprijs excl. btw. De definitieve prijs volgt na beoordeling van de werkzaamheden.";
    }
    document.querySelector(".result-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      setTimeout(() => {
        totalPrice.textContent = "Nog niet berekend";
        if (resultNote) resultNote.textContent = "De prijs wordt berekend op basis van uw invoer.";
      }, 0);
    });
  }
});
