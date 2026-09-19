document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");

navToggle.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navList.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Shared modal (video embeds + photo lightbox)
const modal = document.getElementById("videoModal");
const modalFrame = document.getElementById("videoModalFrame");
const modalClose = document.getElementById("videoModalClose");

function openModal(html) {
  modalFrame.innerHTML = html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function openVideo(videoId) {
  openModal(`<iframe
      src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1"
      title="Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`);
}

function openPhoto(src, alt) {
  openModal(`<img src="${src}" alt="${alt}" class="lightbox-img">`);
}

function closeVideo() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalFrame.innerHTML = "";
}

document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.dataset.external) {
      window.open(card.dataset.external, "_blank", "noopener");
    } else {
      openVideo(card.dataset.video);
    }
  });
});

document.querySelectorAll(".photo-grid img").forEach((img) => {
  img.addEventListener("click", () => openPhoto(img.src, img.alt));
});

// Fotogalerie erst nach Klick einblenden
const photoToggle = document.getElementById("photoToggle");
const photoGrid = document.getElementById("photoGrid");

if (photoToggle && photoGrid) {
  photoToggle.addEventListener("click", () => {
    const isHidden = photoGrid.hasAttribute("hidden");
    if (isHidden) {
      photoGrid.removeAttribute("hidden");
      photoToggle.textContent = "Fotos ausblenden";
    } else {
      photoGrid.setAttribute("hidden", "");
      photoToggle.textContent = "Fotos anzeigen";
    }
  });
}

modalClose.addEventListener("click", closeVideo);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeVideo();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideo();
});

// Kontaktformular: Status nach Redirect von contact.php anzeigen
const formParams = new URLSearchParams(window.location.search);
const formSuccess = document.getElementById("formSuccess");
const formError = document.getElementById("formError");

if (formParams.has("sent") && formSuccess) {
  formSuccess.hidden = false;
  document.getElementById("contactForm").reset();
} else if (formParams.has("error") && formError) {
  formError.hidden = false;
}

if (formParams.has("sent") || formParams.has("error")) {
  const url = new URL(window.location.href);
  url.searchParams.delete("sent");
  url.searchParams.delete("error");
  window.history.replaceState({}, "", url.pathname + url.hash);
}
