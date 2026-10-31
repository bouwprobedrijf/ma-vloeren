
document.addEventListener("DOMContentLoaded", () => {
  // Interne tarieven: niet tonen aan de klant.
  // Alle tarieven zijn exclusief btw.
  const PRICES = {
    klikPVC: 10,
    visgraat: 18,
    laminaat: 7,
    egaliseren: 4,
    plinten: 2,
    oudeVloer: 10
  };

  const form = document.getElementById("floorForm");
  const totalPrice = document.getElementById("totalPrice");
  const resultNote = document.getElementById("resultNote");
  const resultPanel = document.getElementById("resultPanel");
  const whatsappQuote = document.getElementById("whatsappQuote");

  if (!form || !totalPrice || !resultPanel) {
    console.error("Vloerencalculator: controleer de HTML-elementen.");
    return;
  }

  const $ = (id) => document.getElementById(id);

  // Opties openen en sluiten.
  const extraOptions = [
    {
      checkbox: "removeOld",
      fields: "removeOldFields",
      input: "removeOldArea"
    },
    {
      checkbox: "levelFloor",
      fields: "levelFloorFields",
      input: "levelFloorArea"
    },
    {
      checkbox: "skirting",
      fields: "skirtingFields",
      input: "skirtingMeters"
    }
  ];

  extraOptions.forEach(({ checkbox, fields, input }) => {
    const check = $(checkbox);
    const section = $(fields);
    const field = $(input);

    if (!check || !section || !field) return;

    check.addEventListener("change", () => {
      section.hidden = !check.checked;

      if (!check.checked) {
        field.value = "";
        field.removeAttribute("required");
      } else {
        field.setAttribute("required", "required");
        field.focus();
      }
    });
  });

  // Euro-opmaak.
  const formatEuro = (amount) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR"
    }).format(amount);

  // Bewaar de laatste berekende prijs en de ingevulde gegevens.
  let calculatedQuote = null;

  // Berekening.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const area = Number($("area")?.value) || 0;
    const floorType = $("floorType")?.value;

    if (area <= 0 || area > 10000) {
      alert("Vul een geldige oppervlakte in.");
      $("area")?.focus();
      return;
    }

    const floorPrices = {
      "klik-pvc": PRICES.klikPVC,
      "visgraat": PRICES.visgraat,
      "laminaat": PRICES.laminaat
    };

    if (!Object.prototype.hasOwnProperty.call(floorPrices, floorType)) {
      alert("Kies een geldig vloertype.");
      $("floorType")?.focus();
      return;
    }

    // Basisprijs van de gekozen vloer.
    let total = area * floorPrices[floorType];

    const details = [];

    details.push(
      "Soort vloer: " +
      {
        "klik-pvc": "Klik PVC",
        "visgraat": "Visgraat",
        "laminaat": "Laminaat"
      }[floorType]
    );

    details.push("Oppervlakte: " + area + " m²");

    // Oude vloer verwijderen.
    if ($("removeOld").checked) {
      const oldArea = Number($("removeOldArea").value) || 0;

      if (oldArea <= 0 || oldArea > area) {
        alert(
          "Vul een geldige oppervlakte in voor het verwijderen van de oude vloer."
        );
        $("removeOldArea").focus();
        return;
      }

      total += oldArea * PRICES.oudeVloer;
      details.push("Oude vloer verwijderen: " + oldArea + " m²");
    }

    // Ondervloer egaliseren.
    if ($("levelFloor").checked) {
      const levelArea = Number($("levelFloorArea").value) || 0;

      if (levelArea <= 0 || levelArea > area) {
        alert("Vul een geldige oppervlakte in voor het egaliseren.");
        $("levelFloorArea").focus();
        return;
      }

      total += levelArea * PRICES.egaliseren;
      details.push("Ondervloer egaliseren: " + levelArea + " m²");
    }

    // Plinten plaatsen.
    if ($("skirting").checked) {
      const skirtingMeters = Number($("skirtingMeters").value) || 0;

      if (skirtingMeters <= 0) {
        alert("Vul het aantal strekkende meters plinten in.");
        $("skirtingMeters").focus();
        return;
      }

      total += skirtingMeters * PRICES.plinten;
      details.push("Plinten plaatsen: " + skirtingMeters + " meter");
    }

    // Bewaar de berekening voor WhatsApp.
    calculatedQuote = {
      total,
      details,
      area,
      floorType
    };

    // Toon alleen de totaalprijs.
    totalPrice.textContent = formatEuro(total);

    if (resultNote) {
      resultNote.textContent =
        "Prijsindicatie exclusief btw. De definitieve prijs wordt bevestigd in de offerte.";
    }

    resultPanel.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  // Offerte aanvragen via WhatsApp.
  if (whatsappQuote) {
    whatsappQuote.addEventListener("click", (event) => {
      event.preventDefault();

      if (!calculatedQuote) {
        alert("Vul eerst uw keuzes in en bereken de totale prijs.");
        form.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        return;
      }

      const message = [
        "Hallo M.A. Vloeren,",
        "",
        "Ik wil graag een offerte aanvragen.",
        "",
        ...calculatedQuote.details,
        "",
        "Totale prijsindicatie exclusief btw: " +
          formatEuro(calculatedQuote.total),
        "",
        "Kunt u hiervoor een offerte maken?"
      ].join("\n");

      // Vervang dit door uw eigen nummer:
      // Nederlandse landcode 31, zonder de eerste 0.
      const whatsappNumber = "31685886252";

      const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  // Jaar in de footer.
  const currentYear = $("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});