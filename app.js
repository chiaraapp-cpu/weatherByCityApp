// ============================================================
//  app.js — Entry point dell'applicazione
//  Collega l'interfaccia (ui.js) alla logica API (api.js).
//  Gestisce eventi utente, stato e preferenze.
// ============================================================


// ── Stato dell'applicazione ────────────────────────────────
// Variabili che tracciano la sessione corrente

/** Unità di temperatura selezionata dall'utente: "C" o "F" */
let currentUnit = "C";

/** Ultima ricerca eseguita con successo */
let lastCity = "";


// ── Inizializzazione ───────────────────────────────────────
// Eseguita una sola volta quando la pagina è pronta

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadPreferences();
});


/**
 * Registra tutti i listener sugli elementi interattivi della pagina.
 * Centralizzare i listener qui rende facile aggiungerne di nuovi.
 */
function setupEventListeners() {

  // Pulsante "Cerca"
  document.getElementById("search-btn").addEventListener("click", handleSearch);

  // Tasto Invio nel campo di testo
  document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Toggle °C / °F
  document.getElementById("unit-toggle").addEventListener("change", handleUnitToggle);

  // Pulsante "Reimposta"
  document.getElementById("reset-btn").addEventListener("click", handleReset);
}


// ── Handler degli eventi ───────────────────────────────────

/**
 * Gestisce la ricerca meteo avviata dall'utente.
 * Legge il campo input, chiama l'API e aggiorna l'UI.
 */
async function handleSearch() {
  const cityName = document.getElementById("city-input").value;

  // Validazione minima lato UI (la funzione API la ripete internamente)
  if (!cityName.trim()) {
    showError("Inserisci il nome di una città.");
    return;
  }

  showLoading();

  try {
    const data = await getWeatherByCity(cityName);
    lastCity = cityName.trim();
    showResult(data, currentUnit);
  } catch (error) {
    showError(error.message);
  }
}


/**
 * Gestisce il cambio di unità di temperatura (°C ↔ °F).
 * Se c'è già un risultato visualizzato, lo aggiorna senza
 * fare una nuova chiamata API (i dati sono in cache).
 */
async function handleUnitToggle(e) {
  currentUnit = e.target.checked ? "F" : "C";
  savePreferences();

  // Aggiorna la visualizzazione se c'è una città già cercata
  if (lastCity) {
    try {
      const data = await getWeatherByCity(lastCity);
      showResult(data, currentUnit);
    } catch (error) {
      showError(error.message);
    }
  }
}


/**
 * Reimposta l'interfaccia allo stato iniziale.
 */
function handleReset() {
  lastCity = "";
  resetUI();
}


// ── Preferenze utente ──────────────────────────────────────
// Salva e ripristina le scelte dell'utente tra una sessione e l'altra

/**
 * Salva le preferenze correnti (es. unità di misura) in localStorage.
 */
function savePreferences() {
  try {
    localStorage.setItem("weatherApp_unit", currentUnit);
  } catch {
    // localStorage potrebbe non essere disponibile in alcuni contesti
    console.warn("Impossibile salvare le preferenze.");
  }
}


/**
 * Carica le preferenze salvate in precedenza e le applica all'UI.
 */
function loadPreferences() {
  try {
    const savedUnit = localStorage.getItem("weatherApp_unit");
    if (savedUnit === "F") {
      currentUnit = "F";
      document.getElementById("unit-toggle").checked = true;
    }
  } catch {
    console.warn("Impossibile caricare le preferenze.");
  }
}