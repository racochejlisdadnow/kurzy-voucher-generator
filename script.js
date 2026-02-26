const sizeMap = {
  a5: {
    width: "210mm",
    height: "148mm",
    ratio: "210 / 148",
    page: "A5 landscape",
    scale: "0.72",
  },
  postcard: {
    width: "150mm",
    height: "100mm",
    ratio: "150 / 100",
    page: "150mm 100mm",
    scale: "0.55",
  },
};

const nameInput = document.getElementById("nameInput");
const jubileeInput = document.getElementById("jubileeInput");
const printBtn = document.querySelector(".print-btn");
const sizeButtons = document.querySelectorAll(".size-switch button");
const printStyle = document.getElementById("print-style");
const qrButtons = document.querySelectorAll(".qr-buttons button");
const qrOutput = document.querySelector("[data-qr-output]");
const qrImage = qrOutput?.querySelector("img");

const qrTargets = {
  "qr-1": {
    label: "QR 1",
    url: "http://kurzyproborce.cz/courses/detail-1/",
  },
  "qr-2": {
    label: "QR 2",
    url: "http://kurzyproborce.cz/courses/detail-2/",
  },
  "qr-3": {
    label: "QR 3",
    url: "http://kurzyproborce.cz/courses/detail-3/",
  },
};

const qrBaseUrl = "https://api.qrserver.com/v1/create-qr-code/";

const updateField = (field, value) => {
  document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => {
    node.textContent = value || node.textContent;
  });
};

const applySize = (key) => {
  const size = sizeMap[key];
  if (!size) return;

  document.documentElement.style.setProperty("--cert-width", size.width);
  document.documentElement.style.setProperty("--cert-height", size.height);
  document.documentElement.style.setProperty("--cert-ratio", size.ratio);
  document.documentElement.style.setProperty("--cert-scale", size.scale);
  printStyle.textContent = `@page { size: ${size.page}; margin: 0; }`;
  document.body.dataset.size = key;

  sizeButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.size === key);
  });
};

nameInput.addEventListener("input", (event) => {
  updateField("name", event.target.value.trim() || "jméno");
});

jubileeInput.addEventListener("input", (event) => {
  updateField("jubilee", event.target.value.trim() || "významné jubileum");
});

sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => applySize(btn.dataset.size));
});

printBtn.addEventListener("click", () => window.print());

qrButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    qrButtons.forEach((item) => item.classList.remove("is-active"));
    btn.classList.add("is-active");
    const key = btn.dataset.qr;
    const target = qrTargets[key];
    if (!qrImage || !target) {
      if (qrOutput) qrOutput.textContent = target?.label || "QR";
      return;
    }
    const qrUrl = `${qrBaseUrl}?size=220x220&margin=10&format=svg&data=${encodeURIComponent(
      target.url,
    )}`;
    qrImage.src = qrUrl;
    qrImage.alt = target.label;
  });
});

applySize("a5");

if (qrButtons.length) {
  let active = document.querySelector(".qr-buttons .is-active");
  if (!active) {
    active = qrButtons[0];
    active?.classList.add("is-active");
  }
  active?.click();
}
