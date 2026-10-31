const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
);

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");

const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const image = item.dataset.image;
    const title = item.dataset.title;

    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
}

function showNext() {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(nextIndex);
}

function showPrevious() {
    const previousIndex =
        (currentIndex - 1 + galleryItems.length) % galleryItems.length;

    openLightbox(previousIndex);
}

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        openLightbox(index);
    });
});

closeButton.addEventListener("click", closeLightbox);
nextButton.addEventListener("click", showNext);
prevButton.addEventListener("click", showPrevious);

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNext();
    }

    if (event.key === "ArrowLeft") {
        showPrevious();
    }
});