document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. TARIEVEN EXCLUSIEF BTW
    // ==========================================

    const renovatiePrijzen = {
        laminaat: {
            naam: "Laminaat verwijderen",
            prijs: 7,
            eenheid: "m²"
        },

        pvc: {
            naam: "Gelijmde PVC-vloer verwijderen",
            prijs: 15,
            eenheid: "m²"
        },

        vloer: {
            naam: "Vloertegels verwijderen",
            prijs: 20,
            eenheid: "m²"
        },

        wandtegels: {
            naam: "Wandtegels verwijderen",
            prijs: 22.5,
            eenheid: "m²"
        },

        plinten: {
            naam: "Plinten verwijderen",
            prijs: 3,
            eenheid: "m"
        },

        behang: {
            naam: "Behang verwijderen",
            prijs: 7.5,
            eenheid: "m²"
        },

        sloopwand: {
            naam: "Niet-dragende muur slopen",
            prijs: 32.5,
            eenheid: "m²"
        },

        keuken: {
            naam: "Oude keuken verwijderen",
            prijs: 425,
            eenheid: "stuk"
        },

        badkamer: {
            naam: "Oude badkamer verwijderen",
            prijs: 1000,
            eenheid: "stuk"
        }
    };


    // ==========================================
    // 2. WHATSAPP-INSTELLINGEN
    // ==========================================

    // Nummer met landcode 31.
    // Geen + en geen eerste nul.
    const WHATSAPP_NUMBER = "31685886252";


    // ==========================================
    // 3. HTML-ELEMENTEN
    // ==========================================

    const renovatieForm = document.getElementById("renovatieForm");

    const resultaat = document.getElementById("resultaat");
    const prijsRegels = document.getElementById("prijsRegels");

    const totaalEx = document.getElementById("totaalEx");
    const btwBedrag = document.getElementById("btwBedrag");
    const totaalIncl = document.getElementById("totaalIncl");

    const containerField = document.getElementById("container");
    const materiaalField = document.getElementById("materiaal");
    const opmerkingenField = document.getElementById("opmerkingen");

    const jaar = document.getElementById("jaar");

    if (jaar) {
        jaar.textContent = new Date().getFullYear();
    }

    if (!renovatieForm) {
        console.error("Renovatiecalculator: formulier niet gevonden.");
        return;
    }


    // ==========================================
    // 4. BEREKENDE GEGEVENS BEWAREN
    // ==========================================

    let berekendePrijs = null;
    let berekendeWerkzaamheden = [];
    let berekendeContainer = 0;
    let berekendeMateriaalKeuze = "arbeid";
    let berekendeOpmerkingen = "";


    // ==========================================
    // 5. BEDRAGEN FORMATTEREN
    // ==========================================

    const euro = bedrag => {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(bedrag);
    };


    // ==========================================
    // 6. AANTALLEN CONTROLEREN
    // ==========================================

    function getAantal(id) {
        const element = document.getElementById(id);

        if (!element || element.value.trim() === "") {
            return 0;
        }

        const waarde = Number(element.value);

        if (
            !Number.isFinite(waarde) ||
            waarde < 0
        ) {
            return null;
        }

        return waarde;
    }


    // ==========================================
    // 7. PRIJS BEREKENEN
    // ==========================================

    renovatieForm.addEventListener("submit", event => {
        event.preventDefault();

        // Oude berekening ongeldig maken.
        berekendePrijs = null;
        berekendeWerkzaamheden = [];

        let subtotaal = 0;
        let aantalWerkzaamheden = 0;

        let regelsHTML = "";
        const werkzaamheden = [];

        // Werkzaamheden doorlopen.
        for (const [id, dienst] of Object.entries(renovatiePrijzen)) {

            const aantal = getAantal(id);
            const veld = document.getElementById(id);

            if (aantal === null) {
                alert("Controleer het ingevulde aantal bij: " + dienst.naam);

                if (veld) {
                    veld.focus();
                }

                return;
            }

            if (aantal > 0) {

                const bedrag = aantal * dienst.prijs;

                subtotaal += bedrag;
                aantalWerkzaamheden++;

                werkzaamheden.push({
                    naam: dienst.naam,
                    aantal: aantal,
                    eenheid: dienst.eenheid,
                    bedrag: bedrag
                });

                regelsHTML += `
                    <div class="price-row">
                        <span>
                            ${dienst.naam}<br>
                            ${aantal} ${dienst.eenheid} × ${euro(dienst.prijs)}
                        </span>
                        <strong>${euro(bedrag)}</strong>
                    </div>
                `;
            }
        }


        // ==========================================
        // 8. CONTAINERKOSTEN
        // ==========================================

        const containerPrijs = Number(containerField.value);

        if (
            !Number.isFinite(containerPrijs) ||
            containerPrijs < 0
        ) {
            alert("Selecteer een geldige container.");
            return;
        }

        if (containerPrijs > 0) {

            subtotaal += containerPrijs;
            aantalWerkzaamheden++;

            werkzaamheden.push({
                naam: "Container voor bouwafval",
                aantal: 1,
                eenheid: "stuk",
                bedrag: containerPrijs
            });

            regelsHTML += `
                <div class="price-row">
                    <span>Container voor bouwafval</span>
                    <strong>${euro(containerPrijs)}</strong>
                </div>
            `;
        }


        // ==========================================
        // 9. CONTROLEREN OF ER WERK IS GESELECTEERD
        // ==========================================

        if (aantalWerkzaamheden === 0) {

            alert("Vul minimaal één werkzaamheid in of selecteer een container.");

            resultaat.hidden = true;

            return;
        }


        // ==========================================
        // 10. MATERIAALTOESLAG
        // ==========================================

        const materiaalKeuze = materiaalField.value;

        if (
            materiaalKeuze !== "arbeid" &&
            materiaalKeuze !== "inclusief"
        ) {
            alert("Selecteer een geldige materiaalkeuze.");
            return;
        }

        let materiaalToeslag = 0;

        if (materiaalKeuze === "inclusief") {

            // Containerkosten worden niet meegenomen.
            const werkzaamhedenExclusiefContainer =
                subtotaal - containerPrijs;

            materiaalToeslag =
                werkzaamhedenExclusiefContainer * 0.20;

            if (materiaalToeslag > 0) {

                subtotaal += materiaalToeslag;

                werkzaamheden.push({
                    naam: "Indicatieve materiaaltoeslag (20%)",
                    aantal: 1,
                    eenheid: "bedrag",
                    bedrag: materiaalToeslag
                });

                regelsHTML += `
                    <div class="price-row">
                        <span>Indicatieve materiaaltoeslag (20%)</span>
                        <strong>${euro(materiaalToeslag)}</strong>
                    </div>
                `;
            }
        }


        // ==========================================
        // 11. BTW EN TOTAALPRIJS
        // ==========================================

        // Behoudt de oorspronkelijke berekening van 21% btw.
        const btw = subtotaal * 0.21;
        const totaalInclusief = subtotaal + btw;


        // ==========================================
        // 12. RESULTATEN TONEN
        // ==========================================

        prijsRegels.innerHTML = regelsHTML;

        totaalEx.textContent = euro(subtotaal);
        btwBedrag.textContent = euro(btw);
        totaalIncl.textContent = euro(totaalInclusief);

        resultaat.hidden = false;


        // ==========================================
        // 13. BEREKENING BEWAREN VOOR WHATSAPP
        // ==========================================

        berekendePrijs = {
            exclusiefBtw: subtotaal,
            btw: btw,
            inclusiefBtw: totaalInclusief
        };

        berekendeWerkzaamheden = werkzaamheden;

        berekendeContainer = containerPrijs;
        berekendeMateriaalKeuze = materiaalKeuze;

        berekendeOpmerkingen = opmerkingenField
            ? opmerkingenField.value.trim()
            : "";


        // Naar het resultaat scrollen.
        resultaat.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });


    // ==========================================
    // 14. WHATSAPP-KNOP TOEVOEGEN
    // ==========================================

    const whatsappButton = document.querySelector(
        "#resultaat .quote-button"
    );

    if (whatsappButton) {

        // Gebruik WhatsApp in plaats van de contactpagina.
        whatsappButton.href = "#";
        whatsappButton.textContent = "Offerte aanvragen via WhatsApp";

        whatsappButton.addEventListener("click", event => {

            event.preventDefault();

            // Eerst de calculator uitvoeren.
            if (!berekendePrijs) {

                alert(
                    "Bereken eerst de renovatieprijs voordat je een offerte aanvraagt."
                );

                renovatieForm.scrollIntoView({
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
                    "Controleer het WhatsApp-nummer in renovatie.js."
                );

                return;
            }


            // Geselecteerde werkzaamheden in tekst omzetten.
            const werkzaamhedenTekst = berekendeWerkzaamheden
                .map(item => {

                    if (item.eenheid === "bedrag") {
                        return `- ${item.naam}: ${euro(item.bedrag)}`;
                    }

                    return (
                        `- ${item.naam}: ` +
                        `${item.aantal} ${item.eenheid} — ` +
                        `${euro(item.bedrag)}`
                    );
                })
                .join("\n");


            // Materiaalkeuze vertalen.
            const materiaalTekst =
                berekendeMateriaalKeuze === "inclusief"
                    ? "Arbeid en materialen"
                    : "Alleen arbeid";


            // Aanvullende informatie.
            const opmerkingenTekst = berekendeOpmerkingen
                ? berekendeOpmerkingen
                : "Geen aanvullende informatie opgegeven.";


            // ==========================================
            // 15. WHATSAPP-BERICHT
            // ==========================================

            const bericht =
`Hallo, ik wil graag een offerte aanvragen voor renovatiewerkzaamheden.

Mijn gekozen werkzaamheden:
${werkzaamhedenTekst}

Materiaalkeuze: ${materiaalTekst}

Containerkosten: ${euro(berekendeContainer)}

Totaal exclusief btw: ${euro(berekendePrijs.exclusiefBtw)}
Btw (21%, indicatief): ${euro(berekendePrijs.btw)}
Totaal inclusief btw: ${euro(berekendePrijs.inclusiefBtw)}

Aanvullende informatie:
${opmerkingenTekst}

Graag ontvang ik een offerte voor mijn renovatieproject.

Bedankt!`;


            // WhatsApp-link maken.
            const whatsappURL =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(bericht);


            // WhatsApp openen.
            window.location.href = whatsappURL;
        });
    }

});