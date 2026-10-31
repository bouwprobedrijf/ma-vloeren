document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. TARIEVEN — EXCLUSIEF BTW
    // ==========================================

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


    // ==========================================
    // 2. WHATSAPP-INSTELLINGEN
    // ==========================================

    // Gebruik je eigen nummer met landcode 31.
    // Geen plusteken en geen eerste nul.
    const WHATSAPP_NUMBER = "31685886252";


    // ==========================================
    // 3. ALGEMENE HTML-ELEMENTEN
    // ==========================================

    const currentYear = document.getElementById("currentYear");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

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
    // 5. CALCULATOR
    // ==========================================

    const form = document.getElementById("stukadoorForm");

    // Op de pagina met alle stukadoorsdiensten
    // bestaat geen calculatorformulier.
    if (!form) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("dienst") || "glad";

    const service = RATES[requestedService]
        ? requestedService
        : "glad";

    const selectedRate = RATES[service];


    // ==========================================
    // 6. HTML-ELEMENTEN VAN DE CALCULATOR
    // ==========================================

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

    const resultPanel = document.getElementById("resultPanel");

    // De WhatsApp-knop in de resultaatkaart.
    const whatsappButton = document.querySelector(".result-panel .secondary-button");


    // ==========================================
    // 7. GEGEVENS BEWAREN
    // ==========================================

    let calculatedTotal = null;
    let calculatedDetails = null;


    // ==========================================
    // 8. DIENST WEERGEVEN
    // ==========================================

    if (title) {
        title.textContent = selectedRate.title;
    }

    if (pageIntro) {
        pageIntro.textContent =
            "Bereken de totale prijs voor " +
            selectedRate.title.toLowerCase() +
            ". De prijs per meter wordt niet getoond.";
    }

    const isRepair = selectedRate.unit === "hours";

    if (areaField) {
        areaField.classList.toggle("hidden", isRepair);
    }

    if (hoursField) {
        hoursField.classList.toggle("hidden", !isRepair);
    }

    if (materialsField) {
        materialsField.classList.toggle("hidden", isRepair);
    }

    if (area) {
        area.required = !isRepair;
    }

    if (hours) {
        hours.required = isRepair;
    }

    if (materials) {
        materials.required = !isRepair;
    }


    // ==========================================
    // 9. EUROBEDRAGEN FORMATTEREN
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
    // 10. TOTAALPRIJS BEREKENEN
    // ==========================================

    form.addEventListener("submit", event => {
        event.preventDefault();

        let total = 0;

        // Oude berekening ongeldig maken totdat
        // de nieuwe berekening is voltooid.
        calculatedTotal = null;
        calculatedDetails = null;

        if (isRepair) {

            const numberOfHours = Number(hours.value);

            if (
                hours.value.trim() === "" ||
                !Number.isFinite(numberOfHours) ||
                numberOfHours <= 0 ||
                numberOfHours > 1000
            ) {
                totalPrice.textContent = "Vul het aantal uren in";

                if (resultNote) {
                    resultNote.textContent =
                        "Vul een geldig aantal uren in.";
                }

                hours.focus();
                return;
            }

            total = numberOfHours * selectedRate.labor;

            calculatedDetails = {
                service: selectedRate.title,
                quantity: numberOfHours,
                unit: "uur",
                execution: "Arbeid",
                total: total
            };

        } else {

            const squareMeters = Number(area.value);

            if (
                area.value.trim() === "" ||
                !Number.isFinite(squareMeters) ||
                squareMeters <= 0 ||
                squareMeters > 10000
            ) {
                totalPrice.textContent = "Vul de oppervlakte in";

                if (resultNote) {
                    resultNote.textContent =
                        "Vul een geldige oppervlakte in.";
                }

                area.focus();
                return;
            }

            const execution = materials.value;
            const rate = selectedRate[execution];

            if (typeof rate !== "number") {
                totalPrice.textContent =
                    "Kies een geldige uitvoering";

                if (resultNote) {
                    resultNote.textContent =
                        "Selecteer alleen arbeid of arbeid inclusief materiaal.";
                }

                materials.focus();
                return;
            }

            total = squareMeters * rate;

            calculatedDetails = {
                service: selectedRate.title,
                quantity: squareMeters,
                unit: "m²",
                execution: execution === "labor"
                    ? "Alleen arbeid"
                    : "Arbeid inclusief materiaal",
                total: total
            };
        }


        // Berekening opslaan.
        calculatedTotal = total;
        calculatedDetails.total = total;


        // Alleen de totaalprijs tonen.
        totalPrice.textContent = euro(total);

        if (resultNote) {
            resultNote.textContent =
                "Prijsindicatie exclusief btw. De definitieve prijs volgt na beoordeling van de werkzaamheden.";
        }

        // Naar de resultaatkaart scrollen.
        if (resultPanel) {
            resultPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });


    // ==========================================
    // 11. WHATSAPP-KNOP INSTELLEN
    // ==========================================

    if (whatsappButton) {

        // Linktekst aanpassen.
        whatsappButton.href = "#";
        whatsappButton.removeAttribute("target");

        // De knop werkt pas na een berekening.
        whatsappButton.addEventListener("click", event => {
            event.preventDefault();

            if (
                calculatedTotal === null ||
                calculatedDetails === null
            ) {
                alert(
                    "Bereken eerst de totaalprijs voordat je een offerte aanvraagt."
                );

                form.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                return;
            }


            // WhatsApp-nummer controleren.
            if (
                !/^\d+$/.test(WHATSAPP_NUMBER) ||
                WHATSAPP_NUMBER.length < 10
            ) {
                alert(
                    "Controleer het WhatsApp-nummer in stukadoor.js."
                );

                return;
            }


            // De gekozen werkzaamheden beschrijven.
            let quantityText;

            if (calculatedDetails.unit === "m²") {
                quantityText =
                    calculatedDetails.quantity + " m²";
            } else {
                quantityText =
                    calculatedDetails.quantity + " uur";
            }


            // Bericht samenstellen.
            const message =
`Hallo, ik wil graag een offerte aanvragen voor stukadoorswerk.

Werkzaamheid: ${calculatedDetails.service}
Hoeveelheid: ${quantityText}
Uitvoering: ${calculatedDetails.execution}

Totale prijsindicatie exclusief btw: ${euro(calculatedDetails.total)}

Graag ontvang ik een offerte voor deze werkzaamheden.

Bedankt!`;


            // WhatsApp-link maken.
            const whatsappURL =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(message);


            // WhatsApp openen.
            window.location.href = whatsappURL;
        });
    }

});