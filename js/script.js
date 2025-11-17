// js/script.js
console.log("Script loaded.");

// -----------------------------
// Fake "events API" (JSON-style)
// -----------------------------
const eventsData = [
  {
    id: 1,
    title: "Academic Event",
    date: "date",
    time: "time",
    location: "location",
    category: "academic",
    description:
      "description"
  },
  {
    id: 2,
    title: "social event",
    date: "date",
    time: "time",
    location: "location",
    category: "social",
    description: "description"
  },
  {
    id: 3,
    title: "sporting event",
    date: "date",
    time: "time",
    location: "location",
    category: "sports",
    description: "description"
  },
  {
    id: 4,
    title: "club event",
    date: "date",
    time: "time",
    location: "location",
    category: "club",
    description: "description"
  }
];

// Pretend to "fetch" events from an API
function loadEventsFromApi() {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(eventsData);
    }, 500);
  });
}

// Keep events in memory once "loaded"
let loadedEvents = [];

// -----------------------------
// DOM Ready
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupHomePage();
  setupDiningPage();
  setupMapPage();
  setupEventsPage();
});

// -----------------------------
// Home page JS
// -----------------------------
function setupHomePage() {
  const homeTestButton = document.getElementById("homeTestButton");
  if (!homeTestButton) return;

  homeTestButton.addEventListener("click", () => {
    alert("JavaScript is working on the Home page!");
  });
}

// -----------------------------
// Dining page JS
// -----------------------------
function setupDiningPage() {
  const menuDisplay = document.getElementById("menuDisplay");
  const diningButtons = document.querySelectorAll(".dining-menu-btn");

  if (!menuDisplay || diningButtons.length === 0) return;

  diningButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const hall = btn.getAttribute("data-hall");
      if (hall === "main") {
        menuDisplay.textContent =
          "Sample Main Dining Hall Menu: Grilled chicken, pasta bar, salad bar, fruit, and dessert.";
      } else if (hall === "cafe") {
        menuDisplay.textContent =
          "Sample Campus Café Menu: Coffee, bagels, breakfast sandwiches, wraps, and smoothies.";
      } else {
        menuDisplay.textContent = "Menu unavailable for this location.";
      }
    });
  });
}

// -----------------------------
// Map page JS
// -----------------------------
function setupMapPage() {
  const locationInfo = document.getElementById("locationInfo");
  const mapLocationButtons = document.querySelectorAll(".map-location-btn");

  if (!locationInfo || mapLocationButtons.length === 0) return;

  mapLocationButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const loc = btn.getAttribute("data-location");
      if (loc === "library") {
        locationInfo.textContent =
          "Placeholder for hours and info.";
      } else if (loc === "gym") {
        locationInfo.textContent =
          "Placeholder for hours and info.";
      } else if (loc === "dining") {
        locationInfo.textContent =
          "Placeholder for hours and info.";
      } else if (loc === "admin") {
        locationInfo.textContent =
          "Placeholder for hours and info.";
      } else {
        locationInfo.textContent = "Location information not available.";
      }
    });
  });
}

// -----------------------------
// Events page JS
// -----------------------------
function setupEventsPage() {
  const eventsList = document.getElementById("eventsList");
  const categoryFilter = document.getElementById("eventCategoryFilter");
  const applyFilterBtn = document.getElementById("applyEventFilter");

  // If we're not on the Events page, bail out.
  if (!eventsList || !categoryFilter || !applyFilterBtn) return;

  // 1. "Fetch" events
  loadEventsFromApi().then((events) => {
    loadedEvents = events;
    renderEvents("all");
  });

  // 2. Wire up filter button
  applyFilterBtn.addEventListener("click", () => {
    const selectedCategory = categoryFilter.value;
    renderEvents(selectedCategory);
  });

  // 3. Render function
  function renderEvents(category) {
    eventsList.innerHTML = ""; // clear current content

    const filteredEvents =
      category === "all"
        ? loadedEvents
        : loadedEvents.filter((event) => event.category === category);

    if (filteredEvents.length === 0) {
      eventsList.innerHTML =
        '<p class="text-muted">No events match this category.</p>';
      return;
    }

    filteredEvents.forEach((event) => {
      const col = document.createElement("div");
      col.className = "col-md-6";

      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">
              <strong>Date:</strong> ${formatDate(event.date)}<br>
              <strong>Time:</strong> ${event.time}<br>
              <strong>Location:</strong> ${event.location}<br>
              <strong>Category:</strong> ${capitalize(event.category)}
            </p>
            <p class="card-text">
              ${event.description}
            </p>
            <button class="btn btn-outline-primary event-details-btn" data-id="${event.id}">
              View Details
            </button>
          </div>
        </div>
      `;

      eventsList.appendChild(col);
    });

    // Wire up detail buttons (simple alert for MVP)
    const detailButtons = eventsList.querySelectorAll(".event-details-btn");
    detailButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const ev = loadedEvents.find((e) => e.id === id);
        if (ev) {
          alert(
            `${ev.title}\n\nDate: ${formatDate(ev.date)}\nTime: ${ev.time}\nLocation: ${ev.location}\n\n${ev.description}`
          );
        }
      });
    });
  }
}

// -----------------------------
// Helper functions
// -----------------------------
function formatDate(dateStr) {
  // dateStr like "2025-10-20"
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}