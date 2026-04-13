// ============================================================
//  ui.js — Gestione del DOM e rendering dell'interfaccia
//  Riceve dati già pronti e aggiorna la pagina.
//  Nessuna logica di business o chiamata API qui.
// ============================================================


/**
 * Mostra il messaggio di caricamento e nasconde gli altri stati.
 * Chiamata da app.js non appena l'utente avvia la ricerca.
 */
function showLoading() {
  getEl("loading").classList.remove("hidden");
  getEl("result").classList.add("hidden");
  getEl("error").classList.add("hidden");
}


/**
 * Mostra un messaggio di errore e nasconde gli altri stati.
 *
 * @param {string} message - Il testo dell'errore da mostrare all'utente
 */
function showError(message) {
  getEl("loading").classList.add("hidden");
  getEl("result").classList.add("hidden");

  const errorEl = getEl("error");
  errorEl.classList.remove("hidden");
  getEl("error-message").textContent = message;
}


/**
 * Renderizza i dati meteo nella card dei risultati
 * e nasconde gli stati di caricamento ed errore.
 *
 * @param {{ city: string, temperature: number, description: string }} data
 *   Oggetto restituito da getWeatherByCity()
 * @param {string} [unit="C"] - Unità di temperatura: "C" (Celsius) o "F" (Fahrenheit)
 */
function showResult(data, unit = "C") {
  getEl("loading").classList.add("hidden");
  getEl("error").classList.add("hidden");

  const { icon } = getWeatherInfo(data.weatherCode);
  const temp = unit === "F"
    ? `${celsiusToFahrenheit(data.temperature)}°F`
    : `${data.temperature}°C`;

  getEl("city-name").textContent       = data.city;
  getEl("weather-icon").textContent    = icon;
  getEl("temperature").textContent     = temp;
  getEl("description").textContent     = capitalize(data.description);
  getEl("last-updated").textContent    = `Aggiornato: ${formatDate()}`;

  getEl("result").classList.remove("hidden");
}


/**
 * Reimposta l'interfaccia allo stato iniziale:
 * nasconde risultati ed errori, svuota il campo di ricerca.
 */
function resetUI() {
  getEl("result").classList.add("hidden");
  getEl("error").classList.add("hidden");
  getEl("loading").classList.add("hidden");
  getEl("city-input").value = "";
}


// ── Helper interno ─────────────────────────────────────────
// Scorciatoia per document.getElementById — uso interno a ui.js

/**
 * @param {string} id - L'id dell'elemento HTML
 * @returns {HTMLElement}
 */
function getEl(id) {
  return document.getElementById(id);
}