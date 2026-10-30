
document.addEventListener("DOMContentLoaded", () => {
  // Interne tarieven: niet tonen aan de klant.
  // Alle tarieven zijn exclusief btw.
  const PRICES = {
    klikPVC: 10,
    visgraat: 18,
    egaliseren: 4,
    plinten: 2,
    oudeVloer: 10
  };

  const form = document.getElementById("floorForm");
  const totalPrice = document.getElementById("totalPrice");
  const resultNote = document.getElementById("resultNote");
  const resultPanel = document.getElementById("resultPanel");

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

      // Verwijder de oude waarde als de optie uitgaat.
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

  // Berekening.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const area = Number($("area")?.value) || 0;
    const floorType = $("floorType")?.value;

    // Controleer de hoofdoppervlakte.
    if (area <= 0) {
      alert("Vul een geldige oppervlakte in.");
      $("area")?.focus();
      return;
    }

    // Basisprijs van de gekozen vloer.
    let total = 0;

    if (floorType === "klik-pvc") {
      total += area * PRICES.klikPVC;
    } else if (floorType === "visgraat") {
      total += area * PRICES.visgraat;
    } else {
      alert("Kies een geldig vloertype.");
      $("floorType")?.focus();
      return;
    }

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
    }

    // Ondervloer egaliseren.
    if ($("levelFloor").checked) {
      const levelArea = Number($("levelFloorArea").value) || 0;

      if (levelArea <= 0 || levelArea > area) {
        alert(
          "Vul een geldige oppervlakte in voor het egaliseren."
        );
        $("levelFloorArea").focus();
        return;
      }

      total += levelArea * PRICES.egaliseren;
    }

    // Plinten plaatsen.
    if ($("skirting").checked) {
      const skirtingMeters =
        Number($("skirtingMeters").value) || 0;

      if (skirtingMeters <= 0) {
        alert("Vul het aantal strekkende meters plinten in.");
        $("skirtingMeters").focus();
        return;
      }

      total += skirtingMeters * PRICES.plinten;
    }

    // Toon alleen de totaalprijs.
    totalPrice.textContent = formatEuro(total);

    if (resultNote) {
      resultNote.textContent =
        "Prijsindicatie exclusief btw. De definitieve prijs wordt bevestigd in de offerte.";
    }

    // Scroll automatisch naar de berekende prijs.
    resultPanel.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  // Jaar in de footer.
  const currentYear = $("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
