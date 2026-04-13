getWeatherByCity
Documentazione tecnica

1. Panoramica del progetto
getWeatherByCity è una funzione JavaScript asincrona che recupera le condizioni meteorologiche correnti a partire dal nome di una città. L'app si rivolge a sviluppatori principianti e utilizza esclusivamente API web native, senza dipendenze esterne.
Il flusso si articola in due fasi:
•	Geocoding: il nome della città viene convertito in coordinate geografiche (latitudine e longitudine) tramite l'API Geocoding di Open-Meteo.
•	Meteo: le coordinate vengono usate per richiedere i dati atmosferici correnti all'API Forecast di Open-Meteo.
La funzione restituisce un oggetto JSON con città, temperatura in gradi Celsius e descrizione testuale delle condizioni.

2. Istruzioni di installazione
Il progetto non richiede l'installazione di librerie esterne. Le uniche dipendenze sono native:
•	fetch API — disponibile in tutti i browser moderni e in Node.js v18+
•	async/await — sintassi ES2017, supportata nativamente

Struttura delle cartelle
weather-app/
  index.html
  js/
    api.js       ← file principale
    api.test.js  ← casi di test

Avvio con VS Code + Live Server
1.	Apri la cartella del progetto in VS Code.
2.	Installa l'estensione "Live Server" di Ritwick Dey.
3.	Clicca "Go Live" in basso a destra nella status bar.
4.	Il browser si apre automaticamente su index.html.

3. Guida all’utilizzo
Includi api.js in index.html prima di qualsiasi altro script che la utilizzi:
<script src="js/api.js"></script>

Chiama la funzione passando il nome della città come stringa:
getWeatherByCity("Milano")
  .then(result => console.log(result))
  .catch(error => console.error(error.message));

In alternativa, con la sintassi async/await all’interno di una funzione asincrona:
const dati = await getWeatherByCity("Tokyo");
console.log(dati.temperature); // es. 28.3

4. Output di esempio
Chiamata riuscita per la città di Roma:
{
  city: "Rome, IT",
  temperature: 22.4,
  description: "Parzialmente nuvoloso"
}

Errore per città non trovata:
Errore: Città "Paperopoli" non trovata. Controlla il nome e riprova.

Errore per input vuoto:
Errore: Il nome della città non può essere vuoto.

5. Funzionalità
•	Ricerca per nome: accetta qualsiasi nome di città, anche con caratteri speciali (es. München, São Paulo).
•	Geocoding automatico: converte il nome in coordinate senza configurazione manuale.
•	Temperatura in °C: dato real-time dalla stazione più vicina alla città.
•	Descrizione atmosferica: traduzione dei codici WMO in italiano (20+ condizioni coperte).
•	Zero dipendenze: funziona con il solo runtime del browser o Node.js v18+.
•	Rilevamento timezone automatico: i dati sono sempre aggiornati al fuso orario locale della città.

6. Gestione degli errori
La funzione gestisce tre categorie di errore, ognuna con un messaggio specifico:

Tipo di errore	Messaggio restituito
Input vuoto o solo spazi	"Il nome della città non può essere vuoto."
Città non nel database	"Città X non trovata. Controlla il nome e riprova."
Errore HTTP API Geocoding	"Errore API Geocoding (HTTP 4xx/5xx)"
Errore HTTP API Meteo	"Errore API Meteo (HTTP 4xx/5xx)"
Nessuna connessione di rete	"Impossibile raggiungere l'API. Controlla la connessione."

Tutti gli errori vengono propagati tramite throw new Error(), quindi possono essere catturati con .catch() o con un blocco try/catch.

7. Informazioni API
L’app utilizza due endpoint pubblici e gratuiti di Open-Meteo, senza chiave di autenticazione.

API	Geocoding API
Endpoint	geocoding-api.open-meteo.com/v1/search
Metodo	GET
Parametri usati	name, count=1, language=it
Risposta	Array results[] con name, country, latitude, longitude

API	Forecast API
Endpoint	api.open-meteo.com/v1/forecast
Metodo	GET
Parametri usati	latitude, longitude, current, timezone=auto
Risposta	Oggetto current con temperature_2m e weathercode

Documentazione completa: open-meteo.com/en/docs

8. Miglioramenti futuri
•	Interfaccia grafica: aggiungere un campo input HTML e un pulsante per permettere ricerche interattive senza aprire la console.
•	Previsioni a 7 giorni: estendere la chiamata all’API Forecast con il parametro daily per mostrare le previsioni settimanali.
•	Unità configurabile: aggiungere un parametro opzionale per scegliere tra °C e °F.
•	Icone meteo: mappare i codici WMO a icone SVG per una visualizzazione più immediata.
•	Cache locale: salvare l’ultimo risultato in localStorage per evitare chiamate ripetute alla stessa città.
•	Test automatizzati con Jest: migrare api.test.js a un framework di test professionale per CI/CD.
•	Supporto geolocalizzazione: usare l’API del browser navigator.geolocation per rilevare automaticamente la posizione dell’utente.

Generato automaticamente — Open-Meteo è gratuito e open source
