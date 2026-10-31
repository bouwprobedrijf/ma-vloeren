document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. PRIJZEN EXCLUSIEF BTW
  // ==========================================

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

  // labour = alleen arbeidskosten
  // materials = inclusief materiaal
  const PRICE_MODE = "labour";

  // WhatsApp-nummer: landcode 31, zonder + of eerste 0.
  const whatsappNumber = "31685886252";


  // ==========================================
  // 2. HTML-ELEMENTEN
  // ==========================================

  const form = document.getElementById("paintForm");
  const totalPrice = document.getElementById("totalPrice");
  const resultNote = document.getElementById("resultNote");
  const resetButton = document.getElementById("resetForm");
  const currentYear = document.getElementById("currentYear");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  // Beide WhatsApp-knoppen selecteren.
  const whatsappQuotes = document.querySelectorAll(
    "#whatsappQuote, .whatsappQuote"
  );

  // Berekende prijs bewaren.
  let calculatedTotal = null;
  let calculatedDetails = [];


  // ==========================================
  // 3. JAARTAL IN DE FOOTER
  // ==========================================

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // ==========================================
  // 4. MOBIEL MENU
  // ==========================================

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }


  // ==========================================
  // 5. CONTROLEER DE CALCULATOR
  // ==========================================

  if (!form || !totalPrice) {
    console.error(
      "Schilderwerkcalculator: formulier of resultaatveld niet gevonden."
    );
    return;
  }


  // ==========================================
  // 6. EUROBEDRAGEN WEERGEVEN
  // ==========================================

  const euro = amount => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };


  // ==========================================
  // 7. TOTAALPRIJS BEREKENEN
  // ==========================================

  form.addEventListener("submit", event => {
    event.preventDefault();

    let total = 0;
    let hasWork = false;

    const details = [];

    for (const [id, tariff] of Object.entries(PRICES)) {
      const field = document.getElementById(id);

      if (!field) {
        continue;
      }

      const rawValue = field.value.trim();

      // Lege velden tellen als nul.
      const quantity = rawValue === ""
        ? 0
        : Number(rawValue);

      // Ongeldige invoer controleren.
      if (!Number.isFinite(quantity) || quantity < 0) {
        totalPrice.textContent = "Controleer de invoer";

        if (resultNote) {
          resultNote.textContent =
            "Vul geldige aantallen in.";
        }

        calculatedTotal = null;
        calculatedDetails = [];

        field.focus();
        return;
      }

      if (quantity > 0) {
        hasWork = true;

        const unitPrice = tariff[PRICE_MODE];
        const subtotal = quantity * unitPrice;

        total += subtotal;

        const label = form.querySelector(
          `label[for="${id}"]`
        );

        details.push({
          name: label
            ? label.textContent.trim()
            : id,
          quantity: quantity
        });
      }
    }

    // Geen werkzaamheden ingevuld.
    if (!hasWork) {
      calculatedTotal = null;
      calculatedDetails = [];

      totalPrice.textContent = "Nog niet berekend";

      if (resultNote) {
        resultNote.textContent =
          "Vul minstens één werkzaamheid in om de totaalprijs te berekenen.";
      }

      return;
    }

    // Berekening bewaren voor WhatsApp.
    calculatedTotal = total;
    calculatedDetails = details;

    // Alleen de totaalprijs tonen.
    totalPrice.textContent = euro(total);

    if (resultNote) {
      resultNote.textContent =
        "Indicatieve totaalprijs excl. btw. De definitieve prijs volgt na beoordeling van de werkzaamheden.";
    }

    // Naar het prijsresultaat scrollen.
    document.querySelector(".result-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });


  // ==========================================
  // 8. WHATSAPP-OFFERTES
  // ==========================================

  whatsappQuotes.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      // Eerst moet een prijs berekend zijn.
      if (calculatedTotal === null) {
        alert(
          "Bereken eerst de totaalprijs voordat je een offerte aanvraagt."
        );

        form.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        return;
      }

      // Controle van het WhatsApp-nummer.
      if (
        !/^\d+$/.test(whatsappNumber) ||
        whatsappNumber.length < 10
      ) {
        alert(
          "Controleer het WhatsApp-nummer in schilderwerk.js."
        );

        return;
      }

      // Werkzaamheden toevoegen aan het bericht.
      const werkzaamheden = calculatedDetails
        .map(item => {
          return `- ${item.name}: ${item.quantity}`;
        })
        .join("\n");

      // WhatsApp-bericht samenstellen.
      const message =
`Hallo, ik wil graag een offerte aanvragen voor schilderwerk.

Mijn ingevulde werkzaamheden:
${werkzaamheden}

Totale prijsindicatie excl. btw: ${euro(calculatedTotal)}

Ik ontvang graag meer informatie over de definitieve offerte.

Bedankt!`;

      // WhatsApp-link maken.
      const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

      // WhatsApp openen.
      window.location.href = whatsappURL;
    });
  });


  // ==========================================
  // 9. FORMULIER OPNIEUW INVULLEN
  // ==========================================

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      calculatedTotal = null;
      calculatedDetails = [];

      setTimeout(() => {
        totalPrice.textContent = "Nog niet berekend";

        if (resultNote) {
          resultNote.textContent =
            "De prijs wordt berekend op basis van uw invoer.";
        }
      }, 0);
    });
  }

});