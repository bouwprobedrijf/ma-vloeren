
document.addEventListener("DOMContentLoaded", () => {

    // Interne tarieven, exclusief btw.
    // De klant ziet alleen de totale prijs.

    const RATES = {
        glad: {
            title: "Wanden – glad stucwerk",
            labor: 12.5,
            included: 21,
            unit: "area"
        },

        behangklaar: {
            title: "Wanden – behangklaar",
            labor: 10,
            included: 16.5,
            unit: "area"
        },

        plafond: {
            title: "Plafond – stucwerk",
            labor: 15,
            included: 26,
            unit: "area"
        },

        spack: {
            title: "Spackspuiten",
            labor: 7.5,
            included: 11.5,
            unit: "area"
        },

        raapwerk: {
            title: "Raapwerk – ongelijke wanden",
            labor: 20,
            included: 30,
            unit: "area"
        },

        reparatie: {
            title: "Scheuren en gaten repareren",
            labor: 50,
            included: null,
            unit: "hours"
        }
    };

    // Footer year
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Mobile menu
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    // Alleen de calculatorpagina heeft een formulier.
    const form = document.getElementById("stukadoorForm");

    if (!form) {
        return;
    }

    // Lees de gekozen dienst uit de URL.
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("dienst") || "glad";

    const service = RATES[requestedService]
        ? requestedService
        : "glad";

    const selectedRate = RATES[service];

    // HTML-elementen
    const title = document.getElementById("selectedServiceTitle");
    const pageIntro = document.getElementById("pageIntro");

    const materialsField = document.getElementById("materialsField");
    const materials = document.getElementById("materials");

    const areaField = document.getElementById("areaField");
    const area = document.getElementById("area");

    const hoursField = document.getElementById("hoursField");
    const hours = document.getElementById("hours");

    const totalPrice = document.getElementById("totalPrice");
    const resultNote = document.getElementById("resultNote");

    // Toon de juiste servicenaam.
    title.textContent = selectedRate.title;

    pageIntro.textContent =
        "Bereken de totale prijs voor " +
        selectedRate.title.toLowerCase() +
        ". De prijs per meter wordt niet getoond.";

    // Reparaties worden op basis van uren berekend.
    const isRepair = selectedRate.unit === "hours";

    areaField.classList.toggle("hidden", isRepair);
    hoursField.classList.toggle("hidden", !isRepair);
    materialsField.classList.toggle("hidden", isRepair);

    area.required = !isRepair;
    hours.required = isRepair;
    materials.required = !isRepair;

    // Formatteer het bedrag als euro.
    const euro = (amount) => {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Bereken de totale prijs.
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let total = 0;

        if (isRepair) {
            const numberOfHours = Number(hours.value);

            if (
                !Number.isFinite(numberOfHours) ||
                numberOfHours <= 0
            ) {
                totalPrice.textContent = "Vul het aantal uren in";
                hours.focus();
                return;
            }

            total = numberOfHours * selectedRate.labor;

        } else {
            const squareMeters = Number(area.value);

            if (
                !Number.isFinite(squareMeters) ||
                squareMeters <= 0
            ) {
                totalPrice.textContent = "Vul de oppervlakte in";
                area.focus();
                return;
            }

            const rate = selectedRate[materials.value];

            if (typeof rate !== "number") {
                totalPrice.textContent = "Kies een geldige uitvoering";
                return;
            }

            total = squareMeters * rate;
        }

        // Toon alleen de totale prijs.
        totalPrice.textContent = euro(total);

        resultNote.textContent = "Prijsindicatie exclusief btw.";

        // Scroll naar de resultaatkaart.
        const resultPanel = document.getElementById("resultPanel");

        if (resultPanel) {
            resultPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

});
