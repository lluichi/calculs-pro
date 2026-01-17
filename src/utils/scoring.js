// Sistema de puntuació i càlcul de dificultat

/**
 * Calcula el nivell de dificultat segons la configuració
 * @param {Object} config - Configuració de les operacions
 * @returns {Object} { emoji, text, nivell, punts }
 */
export function calcularNivell(config) {
  let punts = 0;

  // Punts per tipus d'operació
  const puntsOperacio = {
    sumes: 1,
    restes: 1.5,
    multiplicacions: 2,
    divisions: 3,
    arrels: 2.5
  };
  punts += puntsOperacio[config.tipus] || 1;

  // Punts per xifres (promig de les dues, excepte arrels que només usen xifres1)
  const xifres2Efectiu = config.tipus === 'arrels' ? config.xifres1 : config.xifres2;
  const promigXifres = (config.xifres1 + xifres2Efectiu) / 2;
  punts += (promigXifres - 1) * 1.5; // Cada xifra extra = +1.5

  // Punts per decimals
  if (config.teDecimals) {
    punts += config.numDecimals * 1;
  }

  // Punts per número d'operacions
  if (config.numOperacions >= 30) {
    punts += 1;
  } else if (config.numOperacions >= 20) {
    punts += 0.5;
  }

  // Determinar nivell
  if (punts <= 3) {
    return { emoji: '🟢', text: 'Fàcil', nivell: 'facil', punts };
  }
  if (punts <= 5) {
    return { emoji: '🟡', text: 'Mig', nivell: 'mig', punts };
  }
  if (punts <= 7) {
    return { emoji: '🟠', text: 'Difícil', nivell: 'dificil', punts };
  }
  return { emoji: '🔴', text: 'Expert', nivell: 'expert', punts };
}

/**
 * Calcula la puntuació final
 * @param {Object} resultat - { correctes, total }
 * @param {Object} config - Configuració de les operacions
 * @param {number} tempsSegons - Temps en segons
 * @returns {number} Puntuació final
 */
export function calcularPuntuacio(resultat, config, tempsSegons) {
  // Si no hi ha respostes correctes, puntuació 0
  if (resultat.correctes === 0) {
    return 0;
  }

  // Base: percentatge d'encerts
  const percentatgeEncerts = resultat.correctes / resultat.total;

  // Factor de dificultat per tipus d'operació
  const factorOperacio = {
    sumes: 1.0,
    restes: 1.1,
    multiplicacions: 1.3,
    divisions: 1.5,
    arrels: 1.4
  };

  // Factor per xifres
  const xifres2Efectiu = config.tipus === 'arrels' ? config.xifres1 : config.xifres2;
  const factorXifres = 1 + ((config.xifres1 + xifres2Efectiu - 2) * 0.15);

  // Factor per decimals
  const factorDecimals = config.teDecimals ? (1 + config.numDecimals * 0.1) : 1;

  // Factor per número d'operacions
  const factorOperacions = 1 + (config.numOperacions / 100);

  // Factor de temps (temps base = 30 segons per operació)
  const tempsBase = config.numOperacions * 30;
  const factorTemps = Math.min(2, tempsBase / Math.max(tempsSegons, 1)); // Màxim x2, evitar divisió per 0

  // Puntuació final
  const puntuacio = Math.round(
    percentatgeEncerts *
    (factorOperacio[config.tipus] || 1) *
    factorXifres *
    factorDecimals *
    factorOperacions *
    factorTemps *
    1000
  );

  return puntuacio;
}

/**
 * Formata el temps en format MM:SS
 * @param {number} segons - Temps en segons
 * @returns {string}
 */
export function formatarTemps(segons) {
  const minuts = Math.floor(segons / 60);
  const seg = segons % 60;
  return `${String(minuts).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

/**
 * Obté el nom del tipus d'operació en català
 * @param {string} tipus - Tipus d'operació
 * @returns {string}
 */
export function getNomTipus(tipus) {
  const noms = {
    sumes: 'Sumes',
    restes: 'Restes',
    multiplicacions: 'Multiplicacions',
    divisions: 'Divisions',
    arrels: 'Arrels quadrades'
  };
  return noms[tipus] || tipus;
}
