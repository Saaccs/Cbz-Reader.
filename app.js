const folderInput = document.getElementById("folderInput");
const fileInput = document.getElementById("fileInput");
const library = document.getElementById("library");
const statusText = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const libraryView = document.getElementById("libraryView");
const readerView = document.getElementById("readerView");
const backBtn = document.getElementById("backBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const modeBtn = document.getElementById("modeBtn");
const pdfBtn = document.getElementById("pdfBtn");
const pageInfo = document.getElementById("pageInfo");
const pageImage = document.getElementById("pageImage");
const readerTitle = document.getElementById("readerTitle");
const cascadeView = document.getElementById("cascadeView");
const readerPage = document.querySelector(".readerPage");

const modal = document.getElementById("modal");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalTags = document.getElementById("modalTags");
const closeModalBtn = document.getElementById("closeModalBtn");
const readBtn = document.getElementById("readBtn");

let mangas = [];
let selectedManga = null;
let currentManga = null;
let currentPage = 0;
let currentPageUrl = null;
let readerMode = "paged";
let cascadeLoaded = false;

folderInput.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files);
  const cbzFiles = files.filter(file => file.name.toLowerCase().endsWith(".cbz"));

  mangas = [];
  library.innerHTML = "";
  statusText.textContent = `Procesando ${cbzFiles.length} archivos CBZ...`;

  for (const file of cbzFiles) {
    const manga = await processCBZ(file);
    if (manga) mangas.push(manga);
  }

  renderLibrary();
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];

  if (!file || !file.name.toLowerCase().endsWith(".cbz")) return;

  const manga = await processCBZ(file);

  if (manga) {
    mangas.push(manga);
    renderLibrary();
  }
});

searchInput.addEventListener("input", renderLibrary);

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderLibrary();
});

async function processCBZ(file) {
  try {
    const buffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);

    const imageFiles = Object.keys(zip.files)
      .filter(name => /\.(webp|jpg|jpeg|png)$/i.test(name))
      .sort();

    if (imageFiles.length === 0) return null;

    const comicInfo = await readComicInfo(zip);

    const title = comicInfo.title || file.name.replace(/\.cbz$/i, "");
    const author = comicInfo.author || "Unknown";
    const tags = parseTags(comicInfo.genre);

    const coverName =
      imageFiles.find(name => /(^|\/)000\.(webp|jpg|jpeg|png)$/i.test(name)) ||
      imageFiles[0];

    const coverBlob = await zip.files[coverName].async("blob");
    const coverUrl = URL.createObjectURL(coverBlob);

    return {
      file,
      zip,
      title,
      author,
      tags,
      genre: comicInfo.genre || "",
      images: imageFiles,
      coverUrl
    };

  } catch (error) {
    console.error("Error leyendo CBZ:", file.name, error);
    return null;
  }
}

async function readComicInfo(zip) {
  const result = { title: "", author: "", genre: "" };

  const comicInfoName = Object.keys(zip.files).find(name =>
    name.toLowerCase().endsWith("comicinfo.xml")
  );

  if (!comicInfoName) return result;

  try {
    const xmlText = await zip.files[comicInfoName].async("text");
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    result.title = getXmlText(xml, "Title");
    result.author = getXmlText(xml, "Writer") || getXmlText(xml, "Artist");
    result.genre = getXmlText(xml, "Genre");

  } catch (error) {
    console.warn("No se pudo leer ComicInfo.xml", error);
  }

  return result;
}

function getXmlText(xml, tag) {
  const node = xml.querySelector(tag);
  return node ? node.textContent.trim() : "";
}

function parseTags(text) {
  if (!text) return [];

  return text
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);
}

function renderLibrary() {
  library.innerHTML = "";

  const query = normalize(searchInput.value);

  const filtered = mangas.filter(manga => {
    if (!query) return true;

    const title = normalize(manga.title);
    const author = normalize(manga.author);
    const tags = normalize(manga.tags.join(" "));

    return (
      title.includes(query) ||
      author.includes(query) ||
      tags.includes(query)
    );
  });

  for (const manga of filtered) {
    renderCard(manga);
  }

  statusText.textContent = `Obras mostradas: ${filtered.length} / ${mangas.length}`;
}

function renderCard(manga) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img class="cover" src="${manga.coverUrl}" alt="${escapeHtml(manga.title)}">
    <div class="title">${escapeHtml(manga.title)}</div>
    <div class="author">${escapeHtml(manga.author)}</div>
  `;

  card.addEventListener("click", () => openModal(manga));

  library.appendChild(card);
}

function openModal(manga) {
  selectedManga = manga;

  modalCover.src = manga.coverUrl;
  modalTitle.textContent = manga.title;
  modalAuthor.textContent = `Autor: ${manga.author}`;

  modalTags.innerHTML = "";

  if (manga.tags.length === 0) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = "Sin tags";
    modalTags.appendChild(span);
  } else {
    for (const tag of manga.tags) {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;

      span.addEventListener("click", () => {
        searchInput.value = tag;
        closeModal();
        renderLibrary();
      });

      modalTags.appendChild(span);
    }
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  selectedManga = null;
}

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

readBtn.addEventListener("click", () => {
  if (!selectedManga) return;

  const manga = selectedManga;
  closeModal();
  openReader(manga);
});

async function openReader(manga) {
  currentManga = manga;
  currentPage = 0;
  readerMode = "paged";
  cascadeLoaded = false;

  libraryView.classList.add("hidden");
  readerView.classList.remove("hidden");

  readerTitle.textContent = manga.title;

  readerPage.classList.remove("hidden");
  cascadeView.classList.add("hidden");
  cascadeView.innerHTML = "";

  modeBtn.textContent = "Modo cascada";

  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
  pageInfo.style.display = "inline-block";

  await showPage();
}

async function showPage() {
  if (!currentManga) return;

  if (currentPageUrl) URL.revokeObjectURL(currentPageUrl);

  const imgName = currentManga.images[currentPage];
  const blob = await currentManga.zip.files[imgName].async("blob");

  currentPageUrl = URL.createObjectURL(blob);
  pageImage.src = currentPageUrl;

  pageInfo.textContent = `${currentPage + 1} / ${currentManga.images.length}`;

  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === currentManga.images.length - 1;
}

async function showCascade() {
  cascadeView.innerHTML = "";
  pageInfo.textContent = `${currentManga.images.length} páginas`;

  for (let i = 0; i < currentManga.images.length; i++) {
    const imgName = currentManga.images[i];
    const blob = await currentManga.zip.files[imgName].async("blob");
    const url = URL.createObjectURL(blob);

    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy";

    cascadeView.appendChild(img);
  }

  cascadeLoaded = true;
}

modeBtn.addEventListener("click", async () => {
  if (!currentManga) return;

  if (readerMode === "paged") {
    readerMode = "cascade";

    readerPage.classList.add("hidden");
    cascadeView.classList.remove("hidden");

    prevBtn.style.display = "none";
    nextBtn.style.display = "none";

    modeBtn.textContent = "Modo paginado";

    if (!cascadeLoaded) await showCascade();

  } else {
    readerMode = "paged";

    cascadeView.classList.add("hidden");
    readerPage.classList.remove("hidden");

    prevBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";

    modeBtn.textContent = "Modo cascada";

    await showPage();
  }
});

prevBtn.addEventListener("click", async () => {
  if (currentPage > 0) {
    currentPage--;
    await showPage();
  }
});

nextBtn.addEventListener("click", async () => {
  if (currentPage < currentManga.images.length - 1) {
    currentPage++;
    await showPage();
  }
});

backBtn.addEventListener("click", () => {
  readerView.classList.add("hidden");
  libraryView.classList.remove("hidden");

  if (currentPageUrl) {
    URL.revokeObjectURL(currentPageUrl);
    currentPageUrl = null;
  }
});

pdfBtn.addEventListener("click", async () => {
  if (!currentManga) return;

  pdfBtn.disabled = true;
  pdfBtn.textContent = "Creando PDF...";

  try {
    await downloadPDF(currentManga);
  } catch (error) {
    console.error(error);
    alert("No se pudo crear el PDF.");
  }

  pdfBtn.disabled = false;
  pdfBtn.textContent = "Descargar PDF";
});

async function downloadPDF(manga) {
  const { jsPDF } = window.jspdf;
  let pdf = null;

  for (let i = 0; i < manga.images.length; i++) {
    const imgName = manga.images[i];
    const blob = await manga.zip.files[imgName].async("blob");

    const dataUrl = await blobToDataURL(blob);
    const imgData = await loadImage(dataUrl);

    const width = imgData.naturalWidth;
    const height = imgData.naturalHeight;
    const orientation = width > height ? "landscape" : "portrait";

    if (!pdf) {
      pdf = new jsPDF({ orientation, unit: "px", format: [width, height] });
    } else {
      pdf.addPage([width, height], orientation);
    }

    pdf.addImage(dataUrl, "WEBP", 0, 0, width, height);

    pageInfo.textContent = `PDF: ${i + 1} / ${manga.images.length}`;
  }

  const safeName = manga.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80);

  pdf.save(`${safeName}.pdf`);

  pageInfo.textContent = `${currentPage + 1} / ${currentManga.images.length}`;
}

function blobToDataURL(blob) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

document.addEventListener("keydown", async (event) => {
  if (readerView.classList.contains("hidden")) return;

  if (event.key === "Escape") {
    backBtn.click();
    return;
  }

  if (readerMode !== "paged") return;

  if (event.key === "ArrowRight") nextBtn.click();
  if (event.key === "ArrowLeft") prevBtn.click();
});

function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}