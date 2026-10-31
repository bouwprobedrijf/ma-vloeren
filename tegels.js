
const projectCards = [...document.querySelectorAll(".project-card")];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeButton = document.getElementById("lightboxClose");
const previousButton = document.getElementById("previousImage");
const nextButton = document.getElementById("nextImage");

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;

    const card = projectCards[currentIndex];
    const image = card.querySelector("img");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxCaption.textContent =
        card.dataset.title || image.alt || "Tegelproject";

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % projectCards.length;
    openLightbox(currentIndex);
}

function showPreviousImage() {
    currentIndex =
        (currentIndex - 1 + projectCards.length) % projectCards.length;

    openLightbox(currentIndex);
}

projectCards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();
        openLightbox(index);
    });
});

closeButton.addEventListener("click", closeLightbox);
nextButton.addEventListener("click", showNextImage);
previousButton.addEventListener("click", showPreviousImage);

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

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