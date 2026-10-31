
// ========================================
// STUKADOORWERK - FOTO GALERIJ
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const projectCards = [
        ...document.querySelectorAll(".project-card")
    ];

    if (projectCards.length === 0) {
        return;
    }

    // Maak de lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Foto sluiten">
            &times;
        </button>

        <button class="lightbox-arrow previous" aria-label="Vorige foto">
            &#10094;
        </button>

        <img class="lightbox-image" src="" alt="Stukadoorproject">

        <button class="lightbox-arrow next" aria-label="Volgende foto">
            &#10095;
        </button>

        <div class="lightbox-caption"></div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".previous");
    const nextButton = lightbox.querySelector(".next");

    let currentIndex = 0;

    // Open een foto
    function openLightbox(index) {
        currentIndex = index;

        const card = projectCards[currentIndex];
        const image = card.querySelector("img");

        if (!image) {
            return;
        }

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        const title = card.querySelector("h3");

        caption.textContent = title
            ? title.textContent
            : image.alt;

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // Sluit de foto
    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Volgende foto
    function showNextImage() {
        currentIndex =
            (currentIndex + 1) % projectCards.length;

        openLightbox(currentIndex);
    }

    // Vorige foto
    function showPreviousImage() {
        currentIndex =
            (currentIndex - 1 + projectCards.length)
            % projectCards.length;

        openLightbox(currentIndex);
    }

    // Klik op een projectfoto
    projectCards.forEach((card, index) => {
        card.addEventListener("click", (event) => {
            event.preventDefault();
            openLightbox(index);
        });
    });

    // Knoppen
    closeButton.addEventListener("click", closeLightbox);
    nextButton.addEventListener("click", showNextImage);
    previousButton.addEventListener("click", showPreviousImage);

    // Klik naast de foto om te sluiten
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Toetsenbordbediening
    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }
    });
});
