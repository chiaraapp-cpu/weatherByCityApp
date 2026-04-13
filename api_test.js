// ============================================================
//  api.test.js — Casi di test per getWeatherByCity()
//  Come usarlo: incolla api.js e poi questo file in console,
//  oppure aggiungilo in index.html dopo api.js
// ============================================================

// --- Mini framework di test ---------------------------------
// Una versione semplificata di strumenti come Jest,
// che stampa i risultati in modo leggibile in console

let passed = 0;
let failed = 0;

async function test(description, testFn) {
  try {
    await testFn();
    console.log(`  ✅ ${description}`);
    passed++;
  } catch (error) {
    console.error(`  ❌ ${description}`);
    console.error(`     → ${error.message}`);
    failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected)
        throw new Error(`Atteso: ${expected}, Ricevuto: ${actual}`);
    },
    toBeTypeOf(type) {
      if (typeof actual !== type)
        throw new Error(`Atteso tipo: ${type}, Ricevuto: ${typeof actual}`);
    },
    toContain(substring) {
      if (!String(actual).toLowerCase().includes(String(substring).toLowerCase()))
        throw new Error(`"${actual}" non contiene "${substring}"`);
    },
    toBeGreaterThan(min) {
      if (actual <= min)
        throw new Error(`${actual} non è maggiore di ${min}`);
    },
    toBeLessThan(max) {
      if (actual >= max)
        throw new Error(`${actual} non è minore di ${max}`);
    },
    toBeDefined() {
      if (actual === undefined || actual === null)
        throw new Error(`Il valore è undefined o null`);
    },
  };
}

// ============================================================
//  SUITE DI TEST
// ============================================================

async function runTests() {
  console.group("🧪 Test di getWeatherByCity()");
  console.log("─".repeat(50));

  // --- Gruppo 1: Input non validi ----------------------------
  console.group("📋 Gruppo 1 — Validazione input");

  await test("stringa vuota lancia un errore", async () => {
    try {
      await getWeatherByCity("");
      throw new Error("Avrebbe dovuto lanciare un errore");
    } catch (e) {
      expect(e.message).toContain("vuoto");
    }
  });

  await test("stringa di soli spazi lancia un errore", async () => {
    try {
      await getWeatherByCity("   ");
      throw new Error("Avrebbe dovuto lanciare un errore");
    } catch (e) {
      expect(e.message).toContain("vuoto");
    }
  });

  await test("città inesistente lancia un errore", async () => {
    try {
      await getWeatherByCity("Paperopoli123xyz");
      throw new Error("Avrebbe dovuto lanciare un errore");
    } catch (e) {
      expect(e.message).toContain("non trovata");
    }
  });

  console.groupEnd();

  // --- Gruppo 2: Struttura risposta -------------------------
  console.group("📋 Gruppo 2 — Struttura dell'oggetto restituito");

  await test("risposta contiene la proprietà 'city'", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.city).toBeDefined();
  });

  await test("risposta contiene la proprietà 'temperature'", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.temperature).toBeDefined();
  });

  await test("risposta contiene la proprietà 'description'", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.description).toBeDefined();
  });

  console.groupEnd();

  // --- Gruppo 3: Tipi dei dati ------------------------------
  console.group("📋 Gruppo 3 — Tipo dei valori restituiti");

  await test("'city' è una stringa", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.city).toBeTypeOf("string");
  });

  await test("'temperature' è un numero", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.temperature).toBeTypeOf("number");
  });

  await test("'description' è una stringa", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.description).toBeTypeOf("string");
  });

  console.groupEnd();

  // --- Gruppo 4: Valori plausibili --------------------------
  console.group("📋 Gruppo 4 — Plausibilità dei valori");

  await test("temperatura tra -60°C e +60°C", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.temperature).toBeGreaterThan(-60);
    expect(result.temperature).toBeLessThan(60);
  });

  await test("'city' contiene il nome della città cercata", async () => {
    const result = await getWeatherByCity("Milano");
    expect(result.city).toContain("Milan");
  });

  await test("'description' non è una stringa vuota", async () => {
    const result = await getWeatherByCity("Roma");
    expect(result.description.length).toBeGreaterThan(0);
  });

  console.groupEnd();

  // --- Gruppo 5: Città internazionali -----------------------
  console.group("📋 Gruppo 5 — Città internazionali");

  await test("funziona con 'New York'", async () => {
    const result = await getWeatherByCity("New York");
    expect(result.temperature).toBeTypeOf("number");
  });

  await test("funziona con 'Tokyo'", async () => {
    const result = await getWeatherByCity("Tokyo");
    expect(result.temperature).toBeTypeOf("number");
  });

  await test("funziona con caratteri accentati: 'München'", async () => {
    const result = await getWeatherByCity("München");
    expect(result.temperature).toBeTypeOf("number");
  });

  console.groupEnd();

  // --- Riepilogo -------------------------------------------
  console.log("─".repeat(50));
  const total = passed + failed;
  console.log(`📊 Risultato: ${passed}/${total} test superati`);
  if (failed > 0) {
    console.warn(`⚠️  ${failed} test falliti — controlla i messaggi sopra`);
  } else {
    console.log("🎉 Tutti i test sono passati!");
  }
  console.groupEnd();
}

// Avvia i test
runTests();