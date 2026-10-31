
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent =
        new Date().getFullYear();

    const items = [...document.querySelectorAll(".gallery-item")];
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const counter = document.getElementById("counter");

    let current = 0;

    function showImage(index) {
        current = (index + items.length) % items.length;

        const image = items[current].querySelector("img");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        counter.textContent = `${current + 1} / ${items.length}`;
    }

    function openGallery(index) {
        showImage(index);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeGallery() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    items.forEach((item, index) => {
        item.addEventListener("click", () => openGallery(index));
    });

    document.querySelector(".close")
        .addEventListener("click", closeGallery);

    document.querySelector(".previous")
        .addEventListener("click", () => showImage(current - 1));

    document.querySelector(".next")
        .addEventListener("click", () => showImage(current + 1));

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeGallery();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") closeGallery();
        if (event.key === "ArrowLeft") showImage(current - 1);
        if (event.key === "ArrowRight") showImage(current + 1);
    });
});