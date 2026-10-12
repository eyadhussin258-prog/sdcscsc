(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const venues = {
    siOmar: { name: "Si Omar Café", config: config.siOmar },
    theMoon: { name: "The Moon Café", config: config.theMoon },
    qouanPlaza: { name: "Qouan Plaza Hotel", config: config.qouanPlaza }
  };
  const venueKey = document.body.dataset.venue;
  const venue = venues[venueKey];
  const quickContact = (venue && venue.config) || config.quickContact;

  if (quickContact) {
    const rail = document.createElement("nav");
    rail.className = "quick-contact-rail";
    rail.setAttribute("aria-label", "التواصل السريع");
    const actions = [
      {
        label: "الموقع على الخريطة",
        href: quickContact.mapUrl,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
        external: true
      },
      {
        label: "اتصل بنا",
        href: quickContact.phone && `tel:${quickContact.phone.replace(/[^\d+]/g, "")}`,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 10.2 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.9 3.2 2 2 0 0 1 3.9 1h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7.8 9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.9 2.6Z"/></svg>'
      },
      {
        label: "واتساب",
        href: quickContact.whatsapp && `https://wa.me/${quickContact.whatsapp.replace(/\D/g, "")}`,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z"/><path d="M8.7 8.1c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4 0 .6a7.4 7.4 0 0 0 2.1 2.1c.3.2.5.2.6 0l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-1.9.5a9.1 9.1 0 0 1-3.4-1.8 10.3 10.3 0 0 1-2.4-3c-.5-1-.6-1.8-.4-2.3.2-.5.5-.7.8-.8Z"/></svg>',
        external: true
      }
    ];

    actions.forEach((action) => {
      if (!action.href) return;
      const link = document.createElement("a");
      link.className = "quick-contact-action";
      link.href = action.href;
      link.setAttribute("aria-label", action.label);
      link.title = action.label;
      link.innerHTML = `${action.icon}<span class="quick-contact-label">${action.label}</span>`;
      if (action.external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      rail.append(link);
    });

    if (rail.childElementCount) document.body.append(rail);
  }

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  document.querySelectorAll(".venue-video-frame video").forEach((video) => {
    const updateVideoOrientation = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const frame = video.closest(".venue-video-frame");
      if (frame) frame.classList.toggle("is-portrait-video", video.videoHeight > video.videoWidth);
    };
    video.addEventListener("loadedmetadata", updateVideoOrientation);
    updateVideoOrientation();
  });

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setBackgroundFromImage(element, path, placeholder, onLoad) {
    if (!element || !path) return;
    const image = new Image();
    image.onload = () => {
      element.style.backgroundImage = `linear-gradient(0deg, rgba(12, 12, 12, .34), transparent 55%), url("${path}")`;
      element.classList.add("has-image");
      if (placeholder) placeholder.remove();
      if (onLoad) onLoad();
    };
    image.src = path;
  }

  const homeHero = document.querySelector(".hero-art");
  if (homeHero) {
    setBackgroundFromImage(homeHero, config.homeHeroImage, homeHero.querySelector(".hero-image-placeholder"));
    document.querySelectorAll("[data-home-gallery]").forEach((tile) => {
      const imagePath = config.homeGallery && config.homeGallery[Number(tile.dataset.homeGallery)];
      setBackgroundFromImage(tile, imagePath, tile.querySelector("span"), () => {
        const filename = tile.querySelector("small");
        if (filename) filename.remove();
      });
    });
    [
      [".place-omar .place-photo", config.siOmar],
      [".place-moon .place-photo", config.theMoon],
      [".place-hotel .place-photo", config.qouanPlaza]
    ].forEach(([selector, venueConfig]) => {
      const cardPhoto = document.querySelector(selector);
      const placeholder = cardPhoto && cardPhoto.querySelector("span");
      setBackgroundFromImage(cardPhoto, venueConfig && venueConfig.images && venueConfig.images.hero, placeholder);
    });
  }

  if (!venue || !venue.config) return;

  document.querySelectorAll("[data-config]").forEach((element) => {
    const key = element.dataset.config;
    if (venue.config[key]) element.textContent = venue.config[key];
  });

  const phoneLink = document.querySelector("[data-phone-link]");
  if (phoneLink && venue.config.phone) {
    phoneLink.href = `tel:${venue.config.phone.replace(/[^\d+]/g, "")}`;
    phoneLink.textContent = `${venue.config.phone} ↗`;
  }

  const mapLink = document.querySelector("[data-map-link]");
  if (mapLink && venue.config.mapUrl) {
    mapLink.href = venue.config.mapUrl;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.textContent = "الموقع على الخريطة";
  }

  const hero = document.querySelector(".venue-hero-image");
  const heroImage = venue.config.images && venue.config.images.hero;
  setBackgroundFromImage(hero, heroImage, hero && hero.querySelector(".image-placeholder"));
  const bookingVisual = document.querySelector(".booking-visual");
  const bookingImage = venue.config.images && venue.config.images.booking;
  setBackgroundFromImage(bookingVisual, bookingImage, bookingVisual && bookingVisual.querySelector(".booking-visual-placeholder"));

  const galleryImages = venue.config.images && venue.config.images.gallery;
  if (Array.isArray(galleryImages)) {
    document.querySelectorAll(".gallery-tile").forEach((tile, index) => {
      const imagePath = galleryImages[index];
      if (!imagePath) return;
      setBackgroundFromImage(tile, imagePath, tile.querySelector("span"), () => {
        const filename = tile.querySelector("small");
        if (filename) filename.remove();
      });
    });
  }

  const form = document.querySelector("[data-booking-form]");
  if (!form) return;
  const dateInputs = form.querySelectorAll('input[type="date"]');
  const localToday = new Date();
  const minimumDate = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, "0")}-${String(localToday.getDate()).padStart(2, "0")}`;
  dateInputs.forEach((input) => { input.min = minimumDate; });
  const arrivalInput = form.elements.namedItem("arrival");
  const departureInput = form.elements.namedItem("departure");
  if (arrivalInput && departureInput) {
    const updateDepartureDate = () => {
      if (!arrivalInput.value) {
        departureInput.min = minimumDate;
        departureInput.setCustomValidity("");
        return;
      }
      const nextDay = new Date(`${arrivalInput.value}T00:00:00`);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayValue = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
      departureInput.min = nextDayValue;
      departureInput.setCustomValidity(departureInput.value && departureInput.value < nextDayValue
        ? "يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول."
        : "");
    };
    arrivalInput.addEventListener("change", updateDepartureDate);
    departureInput.addEventListener("change", updateDepartureDate);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const whatsapp = (venue.config.whatsapp || "").replace(/\D/g, "");
    const notice = form.querySelector(".form-notice");
    if (!whatsapp) {
      notice.textContent = `لم تتمكن من فتح واتساب: أضف رقم ${venue.name} في site-config.js أولًا.`;
      notice.classList.add("is-error");
      return;
    }

    const values = new FormData(form);
    const fields = form.dataset.kind === "hotel"
      ? [
          ["الاسم", values.get("name")],
          ["رقم الهاتف", values.get("phone")],
          ["تاريخ الوصول", values.get("arrival")],
          ["تاريخ المغادرة", values.get("departure")],
          ["عدد النزلاء", values.get("guests")],
          ["عدد الغرف", values.get("rooms")],
          ["نوع الغرفة", values.get("roomType")],
          ["ملاحظات", values.get("notes")]
        ]
      : [
          ["الاسم", values.get("name")],
          ["رقم الهاتف", values.get("phone")],
          ["تاريخ الحجز", values.get("date")],
          ["الوقت", values.get("time")],
          ["عدد الأشخاص", values.get("guests")],
          ["ملاحظات", values.get("notes")]
        ];
    const message = [
      `السلام عليكم، أرغب في ${form.dataset.kind === "hotel" ? "طلب حجز إقامة" : "طلب حجز طاولة"} لدى ${venue.name}.`,
      "",
      ...fields.map(([label, value]) => `${label}: ${value || "لا يوجد"}`),
      "",
      form.dataset.kind === "hotel"
        ? "أعلم أن الطلب غير مؤكد حتى مراجعة التوافر والسعر وتأكيد الإدارة. شكرًا لكم."
        : "برجاء مراجعة الطلب وتأكيد التوافر. شكرًا لكم."
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    notice.textContent = "تم تجهيز رسالة الحجز. أكمل إرسالها من واتساب لتصل إلى المكان.";
    notice.classList.remove("is-error");
  });
})();
