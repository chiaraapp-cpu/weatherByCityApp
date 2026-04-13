// ============================================================
//  utils.js — Funzioni di utilità condivise
//  Contiene helper riutilizzabili da api.js, ui.js e app.js
// ============================================================


// ============================================================
//  TABELLA CODICI WMO → descrizione + icona emoji
//  Spostata qui da api.js: è una mappatura di dati,
//  non logica di business, quindi appartiene a utils.
// ============================================================

const WEATHER_DESCRIPTIONS = {
  0:  { text: "Cielo sereno",              icon: "☀️"  },
  1:  { text: "Prevalentemente sereno",    icon: "🌤️"  },
  2:  { text: "Parzialmente nuvoloso",     icon: "⛅"  },
  3:  { text: "Coperto",                   icon: "☁️"  },
  45: { text: "Nebbia",                    icon: "🌫️"  },
  48: { text: "Nebbia con brina",          icon: "🌫️"  },
  51: { text: "Pioggerella leggera",       icon: "🌦️"  },
  53: { text: "Pioggerella moderata",      icon: "🌦️"  },
  55: { text: "Pioggerella intensa",       icon: "🌧️"  },
  61: { text: "Pioggia leggera",           icon: "🌧️"  },
  63: { text: "Pioggia moderata",          icon: "🌧️"  },
  65: { text: "Pioggia intensa",           icon: "🌧️"  },
  71: { text: "Neve leggera",              icon: "🌨️"  },
  73: { text: "Neve moderata",             icon: "❄️"  },
  75: { text: "Neve intensa",              icon: "❄️"  },
  80: { text: "Rovesci leggeri",           icon: "🌦️"  },
  81: { text: "Rovesci moderati",          icon: "🌧️"  },
  82: { text: "Rovesci intensi",           icon: "⛈️"  },
  95: { text: "Temporale",                 icon: "⛈️"  },
  96: { text: "Temporale con grandine",    icon: "⛈️"  },
  99: { text: "Temporale con grandine intensa", icon: "⛈️" },
};


/**
 * Restituisce la descrizione testuale e l'icona emoji
 * corrispondenti a un codice meteo WMO.
 *
 * @param {number} code - Codice WMO restituito dall'API Open-Meteo
 * @returns {{ text: string, icon: string }} Oggetto con descrizione e icona
 *
 * @example
 * getWeatherInfo(2);
 * // { text: "Parzialmente nuvoloso", icon: "⛅" }
 */
function getWeatherInfo(code) {
  return WEATHER_DESCRIPTIONS[code] ?? { text: "Condizioni non disponibili", icon: "🌡️" };
}


/**
 * Converte una temperatura da Celsius a Fahrenheit.
 *
 * @param {number} celsius - Temperatura in gradi Celsius
 * @returns {number} Temperatura in gradi Fahrenheit, arrotondata a un decimale
 *
 * @example
 * celsiusToFahrenheit(22.4); // 72.3
 */
function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9 / 5 + 32) * 10) / 10;
}


/**
 * Formatta una data nel formato leggibile italiano
 * (es. "lunedì 13 aprile 2026, 15:30").
 *
 * @param {Date} [date=new Date()] - La data da formattare (default: adesso)
 * @returns {string} Data formattata in italiano
 *
 * @example
 * formatDate(); // "lunedì 13 aprile 2026, 15:30"
 */
function formatDate(date = new Date()) {
  return date.toLocaleString("it-IT", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
  });
}


/**
 * Capitalizza la prima lettera di una stringa.
 *
 * @param {string} str - La stringa da capitalizzare
 * @returns {string} La stringa con la prima lettera maiuscola
 *
 * @example
 * capitalize("roma"); // "Roma"
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}