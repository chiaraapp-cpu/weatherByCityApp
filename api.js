// ============================================================
//  api.js — Recupera i dati meteo di una città
//  Versione migliorata con best practice applicate
// ============================================================


// ============================================================
//  COSTANTI E CONFIGURAZIONE
// ============================================================

/** Timeout massimo per ogni chiamata API (in millisecondi) */
const API_TIMEOUT_MS = 5000;

/** Cache in memoria per evitare chiamate ripetute alla stessa città */
const weatherCache = new Map();


// ============================================================
//  TABELLA CODICI WMO  →  descrizione leggibile
//  (spostata qui da utils.js per semplicità — in un progetto
//   strutturato andrebbe in js/utils.js)
// ============================================================

const WEATHER_DESCRIPTIONS = {
  0:  "Cielo sereno",
  1:  "Prevalentemente sereno",
  2:  "Parzialmente nuvoloso",
  3:  "Coperto",
  45: "Nebbia",
  48: "Nebbia con brina",
  51: "Pioggerella leggera",
  53: "Pioggerella moderata",
  55: "Pioggerella intensa",
  61: "Pioggia leggera",
  63: "Pioggia moderata",
  65: "Pioggia intensa",
  71: "Neve leggera",
  73: "Neve moderata",
  75: "Neve intensa",
  80: "Rovesci leggeri",
  81: "Rovesci moderati",
  82: "Rovesci intensi",
  95: "Temporale",
  96: "Temporale con grandine",
  99: "Temporale con grandine intensa",
};


// ============================================================
//  FUNZIONE DI SUPPORTO: fetchJSON
//  Centralizza la logica di fetch per evitare duplicazioni.
//  Gestisce timeout, errori HTTP ed errori di rete.
// ============================================================

/**
 * Esegue una richiesta GET verso un URL e restituisce il JSON parsed.
 * Applica un timeout automatico di API_TIMEOUT_MS millisecondi.
 *
 * @param {string} url - L'URL da chiamare
 * @param {string} label - Etichetta descrittiva usata nei messaggi di errore (es. "Geocoding")
 * @returns {Promise<object>} Il corpo della risposta come oggetto JavaScript
 * @throws {Error} In caso di timeout, errore HTTP o problema di rete
 */
async function fetchJSON(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    // fetch() non lancia errori per risposte 4xx/5xx: controlliamo manualmente
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }

    return await response.json();

  } catch (err) {
    // Se l'errore è quello che abbiamo appena lanciato noi (HTTP), lo rilanciamo
    // così com'è per preservare il messaggio preciso
    if (err.message.startsWith("Errore HTTP")) {
      throw new Error(`Errore API ${label} (${err.message})`);
    }

    // AbortError significa che è scattato il timeout
    if (err.name === "AbortError") {
      throw new Error(`Timeout: l'API ${label} non ha risposto entro ${API_TIMEOUT_MS / 1000} secondi.`);
    }

    // Qualsiasi altro errore è un problema di rete (DNS, connessione assente, ecc.)
    throw new Error(`Impossibile raggiungere l'API ${label}. Controlla la connessione. Dettaglio: ${err.message}`);

  } finally {
    // Pulizia: annulliamo il timer anche se la richiesta è andata a buon fine
    clearTimeout(timeout);
  }
}


// ============================================================
//  FUNZIONE PRINCIPALE: getWeatherByCity
// ============================================================

/**
 * Recupera le condizioni meteorologiche correnti per una città.
 * Utilizza una cache in memoria per evitare chiamate ripetute
 * alla stessa città nella stessa sessione.
 *
 * @param {string} cityName - Il nome della città (es. "Roma", "Tokyo", "München")
 * @returns {Promise<{city: string, temperature: number, description: string}>}
 *   Oggetto con il nome completo della città, la temperatura in °C
 *   e la descrizione testuale delle condizioni atmosferiche
 * @throws {Error} Se cityName è vuoto, la città non esiste,
 *   o si verificano errori di rete o timeout
 *
 * @example
 * const dati = await getWeatherByCity("Milano");
 * console.log(dati);
 * // { city: "Milan, IT", temperature: 18.5, description: "Parzialmente nuvoloso" }
 */
async function getWeatherByCity(cityName) {

  // --- Validazione input ----------------------------------------
  if (!cityName || cityName.trim() === "") {
    throw new Error("Il nome della città non può essere vuoto.");
  }

  const normalizedName = cityName.trim();

  // --- Cache ----------------------------------------------------
  // Se abbiamo già i dati per questa città, li restituiamo subito
  if (weatherCache.has(normalizedName)) {
    console.log(`[Cache] Dati per "${normalizedName}" recuperati dalla cache.`);
    return weatherCache.get(normalizedName);
  }

  // --- FASE 1: Geocoding ----------------------------------------
  // Convertiamo il nome della città in coordinate (latitudine, longitudine)

  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(normalizedName)}` +
    `&count=1` +
    `&language=it`;

  const geoData = await fetchJSON(geoUrl, "Geocoding");

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Città "${normalizedName}" non trovata. Controlla il nome e riprova.`);
  }

  const { name, country, latitude, longitude } = geoData.results[0];

  // --- FASE 2: Dati meteo ---------------------------------------
  // Usiamo latitudine e longitudine per ottenere le condizioni attuali

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,weathercode` +
    `&timezone=auto`;

  const weatherData = await fetchJSON(weatherUrl, "Meteo");

  const temperature = weatherData.current.temperature_2m;
  const weatherCode = weatherData.current.weathercode;
  const description = WEATHER_DESCRIPTIONS[weatherCode] ?? "Condizioni non disponibili";

  // --- Risultato ------------------------------------------------
  const result = {
    city:        `${name}, ${country}`,
    temperature,
    description,
  };

  // Salviamo in cache prima di restituire
  weatherCache.set(normalizedName, result);

  return result;
}


// ============================================================
//  ESEMPIO D'USO
// ============================================================

getWeatherByCity("Roma")
  .then((result) => {
    console.log("Dati meteo ricevuti:");
    console.log(result);
    // Output atteso:
    // { city: "Rome, IT", temperature: 22.4, description: "Parzialmente nuvoloso" }
  })
  .catch((error) => {
    console.error("Errore:", error.message);
  });