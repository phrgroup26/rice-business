let data = [];
let displayedCount = 0;
const batchSize = 20;
let currentFiltered = [];

async function loadData() {
  showSpinner(true);
  const res = await fetch("rice-list.json");
  data = await res.json();
  showSpinner(false);
  currentFiltered = data;
  renderList();
  window.addEventListener("scroll", handleScroll);
}

function renderList(filteredData = null) {
  const list = document.getElementById("list");
  const items = filteredData || currentFiltered;
  const slice = items.slice(displayedCount, displayedCount + batchSize);
  const fragment = document.createDocumentFragment();

  slice.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    const weights = Object.keys(item.weights)
      .filter(k => item.weights[k] !== null)
      .join(", ");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" onclick="showPopup('${item.image}')">
      <h3>${item.name}</h3>
      <p><strong>Category:</strong> ${item.category || "N/A"}</p>
      <p class="weights"><strong>Available Weights:</strong> ${weights || "N/A"}</p>
    `;
    fragment.appendChild(card);
  });
  list.appendChild(fragment);
  displayedCount += slice.length;
}

function handleScroll() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    renderList();
  }
}

function applyFilters() {
  const term = document.getElementById("search").value.toLowerCase();
  const cat = document.getElementById("category").value.toLowerCase();
  currentFiltered = data.filter(item =>
    item.name.toLowerCase().includes(term) &&
    (cat ? item.category.toLowerCase() === cat : true)
  );

  // Reset list and count
  const list = document.getElementById("list");
  list.innerHTML = "";
  displayedCount = 0;

  renderList();
  // Reset scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSpinner(show) {
  document.getElementById("spinner").style.display = show ? "block" : "none";
}

function showPopup(src) {
  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popupImg");
  popupImg.src = src;
  popup.style.display = "flex";
}

// Close popup when clicking outside image
document.getElementById("popup").addEventListener("click", function(e) {
  if (e.target.id === "popup" || e.target.id === "popupImg") {
    document.getElementById("popup").style.display = "none";
  }
});

// Attach filter events
document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("category").addEventListener("change", applyFilters);

// Load data on startup
loadData();
