// js/script.js
console.log("Script loaded.");

// -----------------------------
// Fake "events API" (JSON-style)
// -----------------------------
const eventsData = [
  {
    id: 1,
    title: "Welcome Week Kickoff",
    date: "2025-08-20",
    time: "6:00 PM",
    location: "Bowl",
    category: "Social",
    description:
      "Join new and returning students for games, food trucks, and live music in the Bowl!"
  },
  {
    id: 2,
    title: "Business School Info Session",
    date: "2025-09-05",
    time: "3:00 PM",
    location: "Else School of Management",
    category: "academic",
    description: "Learn about majors, internships, and career opportunities in business."
  },
  {
    id: 3,
    title: "Millsaps vs. Birmingham-Southern",
    date: "2025-10-12",
    time: "1:00 PM",
    location: "harper Davis Field",
    category: "sports",
    description: "Come cheer on the majors in this conference matchhup!"
  },
  {
    id: 4,
    title: "Campus Club Fair",
    date: "2025-08-28",
    time: "12:00 PM",
    location: "Legget",
    category: "club",
    description: "Meet student organizations and firnd your place on campus."
  }
];

// Simulated async API fetch
function loadEventsFromApi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(eventsData), 500);
  });
}

let loadedEvents = [];

// ---------------------------------------------------------
// DOM Ready → Initialize Pages
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupHomePage();
  setupDiningPage();
  setupMapPage();
  setupEventsPage();
});

// ---------------------------------------------------------
// HOME PAGE — WEATHER API INTEGRATION
// ---------------------------------------------------------
function setupHomePage() {
  const weatherButton = document.getElementById("weatherButton");
  const weatherBox = document.getElementById("weatherBox");

  if (!weatherButton || !weatherBox) return;

 weatherButton.addEventListener("click", () => {
  fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=32.2988&longitude=-90.1848&current_weather=true&temperature_unit=fahrenheit"
  )
    .then((response) => response.json())
    .then((data) => {
      const w = data.current_weather;

      weatherBox.innerHTML = `
        <strong>Current Weather:</strong><br>
        Temperature: ${w.temperature}°F<br>
        Windspeed: ${w.windspeed} mph<br>
        Conditions: ${w.weathercode}
      `;
    })
    .catch(() => {
      weatherBox.textContent = "Unable to load weather data.";
    });
});
}




// ---------------------------------------------------------
// DINING PAGE — MENU PREVIEW
// ---------------------------------------------------------
function setupDiningPage() {
  const menuDisplay = document.getElementById("menuDisplay");
  const buttons = document.querySelectorAll(".dining-menu-btn");

  if (!menuDisplay || buttons.length === 0) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const hall = btn.dataset.hall;

      const menus = {
        main: "Today's Caf Menu: Grilled chicken, pasta bar, salad bar, fruit, and dessert.",
        cafe: "Eco Grounds Menu: Lattes, cold brew, pastries, wraps, smoothies."
      };

      menuDisplay.textContent = menus[hall] || "Menu unavailable.";
      menuDisplay.classList.add("fade-in");
    });
  });
}

// -----------------------------
// Map page JS
// -----------------------------
function setupMapPage() {
  const locationInfo = document.getElementById("locationInfo");
  const mapLocationButtons = document.querySelectorAll(".map-location-btn");

  // If we're not on the Map page, bail out.
  if (!locationInfo || mapLocationButtons.length === 0) return;

  // Text descriptions for the alert box
  const locationDescriptions = {
    library:
      "Millsaps Library: Open 7:30 AM – 10 PM (Mon–Thu), 7:30 AM – 5 PM (Fri). Study rooms, printing, and research help.",
    gym:
      "Aquatic & Fitness Center: Open 6 AM – 9 PM. Includes weight room, cardio machines, basketball courts, and pool.",
    dining:
      "The Caf (Leggett Dining Hall): Main campus dining spot serving breakfast, lunch, and dinner.",
    admin:
      "Academic Complex / Admin: Admissions, Registrar, Academic Advising, and administrative offices."
  };

  // Button click behavior: just update the info box
  mapLocationButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const loc = btn.getAttribute("data-location");
      locationInfo.textContent =
        locationDescriptions[loc] || "Location information not available.";
      locationInfo.classList.add("fade-in");
    });
  });

  // -----------------------------
  // Interactive map (no markers)
  // -----------------------------
  const campusMapContainer = document.getElementById("campusMap");

  if (campusMapContainer && typeof L !== "undefined") {
    // Center on Millsaps College area
    const map = L.map("campusMap").setView([32.323800, -90.179016], 17);

    // Base map tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
  }
}

// ---------------------------------------------------------
// EVENTS PAGE — DYNAMIC RENDERING + FILTERING
// ---------------------------------------------------------
function setupEventsPage() {
  const eventsList = document.getElementById("eventsList");
  const filter = document.getElementById("eventCategoryFilter");
  const filterBtn = document.getElementById("applyEventFilter");

  if (!eventsList || !filter || !filterBtn) return;

  // Load events once
  loadEventsFromApi().then((events) => {
    loadedEvents = events;
    renderEvents("all");
  });

  filterBtn.addEventListener("click", () => {
    renderEvents(filter.value);
  });

  function renderEvents(category) {
    eventsList.innerHTML = "";

    const filtered =
      category === "all"
        ? loadedEvents
        : loadedEvents.filter((e) => e.category === category);

    if (filtered.length === 0) {
      eventsList.innerHTML = `<p class="text-muted">No events match this category.</p>`;
      return;
    }

    filtered.forEach((event) => {
      const div = document.createElement("div");
      div.className = "col-md-6 fade-in";

      div.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">
              <strong>Date:</strong> ${formatDate(event.date)}<br>
              <strong>Time:</strong> ${event.time}<br>
              <strong>Location:</strong> ${event.location}<br>
              <strong>Category:</strong> ${capitalize(event.category)}
            </p>
            <p>${event.description}</p>
            <button class="btn btn-outline-primary event-details-btn" data-id="${event.id}">
              View Details
            </button>
          </div>
        </div>
      `;

      eventsList.appendChild(div);
    });

    // Details
    const detailButtons = document.querySelectorAll(".event-details-btn");
    detailButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const ev = loadedEvents.find((e) => e.id === id);

        alert(
          `${ev.title}\n\nDate: ${formatDate(ev.date)}\nTime: ${ev.time}\nLocation: ${ev.location}\n\n${ev.description}`
        );
      });
    });
  }
}

// ---------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------
function formatDate(str) {
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleDateString("en-US");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}