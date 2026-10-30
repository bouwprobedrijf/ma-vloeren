
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

const renovatieForm = document.getElementById("renovatieForm");

const euro = bedrag =>
    new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR"
    }).format(bedrag);

function getAantal(id) {
    const element = document.getElementById(id);
    const waarde = Number(element.value);

    if (!Number.isFinite(waarde) || waarde < 0) {
        return 0;
    }

    return waarde;
}

renovatieForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let subtotaal = 0;
    let regelsHTML = "";
    let aantalWerkzaamheden = 0;

    for (const [id, dienst] of Object.entries(renovatiePrijzen)) {
        const aantal = getAantal(id);

        if (aantal > 0) {
            const bedrag = aantal * dienst.prijs;

            subtotaal += bedrag;
            aantalWerkzaamheden++;

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

    const containerPrijs = Number(
        document.getElementById("container").value
    );

    if (containerPrijs > 0) {
        subtotaal += containerPrijs;
        aantalWerkzaamheden++;

        regelsHTML += `
            <div class="price-row">
                <span>Container voor bouwafval</span>
                <strong>${euro(containerPrijs)}</strong>
            </div>
        `;
    }

    if (aantalWerkzaamheden === 0) {
        alert("Vul minimaal één werkzaamheid in.");
        return;
    }

    const materiaalKeuze = document.getElementById("materiaal").value;

    // Indicatieve materiaaltoeslag van 20% op de werkzaamheden.
    // De containerkosten zijn hiervan uitgesloten.
    if (materiaalKeuze === "inclusief") {
        const werkzaamhedenExclusiefContainer =
            subtotaal - containerPrijs;

        const materiaalToeslag =
            werkzaamhedenExclusiefContainer * 0.20;

        if (materiaalToeslag > 0) {
            subtotaal += materiaalToeslag;

            regelsHTML += `
                <div class="price-row">
                    <span>Indicatieve materiaaltoeslag (20%)</span>
                    <strong>${euro(materiaalToeslag)}</strong>
                </div>
            `;
        }
    }

    // Indicatieve btw-berekening van 21%.
    const btw = subtotaal * 0.21;
    const totaalInclusief = subtotaal + btw;

    document.getElementById("prijsRegels").innerHTML = regelsHTML;

    document.getElementById("totaalEx").textContent =
        euro(subtotaal);

    document.getElementById("btwBedrag").textContent =
        euro(btw);

    document.getElementById("totaalIncl").textContent =
        euro(totaalInclusief);

    const resultaat = document.getElementById("resultaat");

    resultaat.hidden = false;

    resultaat.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

document.getElementById("jaar").textContent =
    new Date().getFullYear();