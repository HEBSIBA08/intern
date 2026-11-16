const INTERNSHIPS_DATA = [
  {
    id: "int-01",
    title: "Frontend Web Intern",
    company: "PixelCraft Studio",
    domain: "Frontend",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹15,000 / mo",
    description: "Build accessible UI components using semantic HTML, modern CSS, and vanilla JS."
  },
  {
    id: "int-02",
    title: "Backend API Intern",
    company: "CloudScale Systems",
    domain: "Backend",
    location: "Bengaluru (Hybrid)",
    duration: "6 Months",
    stipend: "₹20,000 / mo",
    description: "Assist in designing RESTful endpoints, writing unit tests, and optimizing SQL queries."
  },
  {
    id: "int-03",
    title: "Product Design Intern",
    company: "FlowState Labs",
    domain: "Design",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹12,000 / mo",
    description: "Create wireframes, interactive prototypes, and WCAG-compliant design tokens."
  },
  {
    id: "int-04",
    title: "Data Analyst Intern",
    company: "MetricPulse",
    domain: "Data",
    location: "Chennai (On-site)",
    duration: "4 Months",
    stipend: "₹18,000 / mo",
    description: "Clean product telemetry datasets and build weekly retention dashboards."
  },
  {
    id: "int-05",
    title: "UI Engineering Intern",
    company: "NovaCommerce",
    domain: "Frontend",
    location: "Mumbai (Hybrid)",
    duration: "3 Months",
    stipend: "₹16,000 / mo",
    description: "Improve checkout page responsiveness and core web vitals across mobile devices."
  },
  {
    id: "int-06",
    title: "Junior Data Science Intern",
    company: "InsightGrid",
    domain: "Data",
    location: "Remote",
    duration: "6 Months",
    stipend: "₹22,000 / mo",
    description: "Support exploratory analysis and A/B test evaluation for user onboarding flows."
  }
];

// DOM References
const searchInput = document.getElementById("search-input");
const domainSelect = document.getElementById("domain-select");
const resetBtn = document.getElementById("reset-btn");
const emptyResetBtn = document.getElementById("empty-reset-btn");
const simulateErrorBtn = document.getElementById("simulate-error-btn");
const retryBtn = document.getElementById("retry-btn");
const filterForm = document.getElementById("filter-form");

const gridEl = document.getElementById("internship-grid");
const emptyStateEl = document.getElementById("empty-state");
const errorStateEl = document.getElementById("error-state");
const errorMessageEl = document.getElementById("error-message");
const resultsCountEl = document.getElementById("results-count");

let allInternships = [];

// Initialize Board
function loadInternships(simulateError = false) {
  hideStates();

  try {
    if (simulateError) {
      throw new Error("Simulated network failure while loading internship records.");
    }

    if (!Array.isArray(INTERNSHIPS_DATA)) {
      throw new Error("Invalid data format received.");
    }

    allInternships = INTERNSHIPS_DATA;
    applyFilters();
  } catch (err) {
    showError(err.message);
  }
}

// Filter & Render Pipeline
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedDomain = domainSelect.value;

  const filtered = allInternships.filter((item) => {
    const matchesDomain =
      selectedDomain === "all" || item.domain.toLowerCase() === selectedDomain.toLowerCase();

    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    return matchesDomain && matchesQuery;
  });

  renderCards(filtered);
}

// DOM Rendering
function renderCards(items) {
  hideStates();
  gridEl.innerHTML = "";

  resultsCountEl.textContent = `Showing ${items.length} ${
    items.length === 1 ? "internship" : "internships"
  }`;

  if (items.length === 0) {
    emptyStateEl.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card";
    article.setAttribute("tabindex", "0");
    article.setAttribute("aria-label", `${item.title} at ${item.company}`);

    article.innerHTML = `
      <div>
        <div class="card-header">
          <div>
            <h2 class="card-title">${escapeHTML(item.title)}</h2>
            <p class="card-company">${escapeHTML(item.company)}</p>
          </div>
          <span class="badge">${escapeHTML(item.domain)}</span>
        </div>

        <ul class="card-meta">
          <li><strong>Location:</strong> ${escapeHTML(item.location)}</li>
          <li><strong>Duration:</strong> ${escapeHTML(item.duration)}</li>
        </ul>

        <p class="card-desc">${escapeHTML(item.description)}</p>
      </div>

      <div class="card-footer">
        <span class="stipend">${escapeHTML(item.stipend)}</span>
        <a href="#apply-${encodeURIComponent(item.id)}" class="btn-apply" aria-label="Apply for ${escapeHTML(item.title)} at ${escapeHTML(item.company)}">
          Apply Now
        </a>
      </div>
    `;

    fragment.appendChild(article);
  });

  gridEl.appendChild(fragment);
}

function hideStates() {
  emptyStateEl.hidden = true;
  errorStateEl.hidden = true;
}

function showError(message) {
  gridEl.innerHTML = "";
  emptyStateEl.hidden = true;
  resultsCountEl.textContent = "0 internships loaded";
  errorMessageEl.textContent = message;
  errorStateEl.hidden = false;
}

function resetFilters() {
  searchInput.value = "";
  domainSelect.value = "all";
  applyFilters();
  searchInput.focus();
}

// Prevent XSS when rendering data
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Event Listeners
filterForm.addEventListener("submit", (e) => e.preventDefault());
searchInput.addEventListener("input", applyFilters);
domainSelect.addEventListener("change", applyFilters);
resetBtn.addEventListener("click", resetFilters);
emptyResetBtn.addEventListener("click", resetFilters);
simulateErrorBtn.addEventListener("click", () => loadInternships(true));
retryBtn.addEventListener("click", () => loadInternships(false));

// Start
loadInternships();