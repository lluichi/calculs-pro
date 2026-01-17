// Gestió del ranking amb LocalStorage

const RANKING_KEYS = {
  facil: 'calculs_ranking_facil',
  mig: 'calculs_ranking_mig',
  dificil: 'calculs_ranking_dificil',
  expert: 'calculs_ranking_expert'
};

const MAX_ENTRIES_PER_NIVELL = 100;

/**
 * Genera un ID únic
 * @returns {string}
 */
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Obté el ranking d'un nivell
 * @param {string} nivell - facil, mig, dificil, expert
 * @returns {Array}
 */
export function obtenirRanking(nivell) {
  try {
    const key = RANKING_KEYS[nivell];
    if (!key) return [];

    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error llegint ranking:', error);
    return [];
  }
}

/**
 * Obté tots els rankings
 * @returns {Object} { facil: [], mig: [], dificil: [], expert: [] }
 */
export function obtenirTotsRankings() {
  return {
    facil: obtenirRanking('facil'),
    mig: obtenirRanking('mig'),
    dificil: obtenirRanking('dificil'),
    expert: obtenirRanking('expert')
  };
}

/**
 * Guarda una entrada al ranking
 * @param {Object} entry - Entrada del ranking
 * @returns {Object} { posicio, esNou }
 */
export function guardarRanking(entry) {
  console.log('guardarRanking cridat amb:', entry);
  try {
    const key = RANKING_KEYS[entry.nivell];
    console.log('Clau localStorage:', key);
    if (!key) {
      throw new Error(`Nivell no vàlid: ${entry.nivell}`);
    }

    // Afegir ID i data si no existeixen
    const entryCompleta = {
      ...entry,
      id: entry.id || generarId(),
      data: entry.data || new Date().toISOString()
    };

    let ranking = obtenirRanking(entry.nivell);

    // Afegir la nova entrada
    ranking.push(entryCompleta);

    // Ordenar per puntuació (descendent)
    ranking.sort((a, b) => b.puntuacio - a.puntuacio);

    // Limitar a MAX_ENTRIES_PER_NIVELL
    ranking = ranking.slice(0, MAX_ENTRIES_PER_NIVELL);

    // Guardar
    localStorage.setItem(key, JSON.stringify(ranking));
    console.log('Ranking guardat a localStorage:', key, ranking);

    // Trobar la posició de la nova entrada
    const posicio = ranking.findIndex(r => r.id === entryCompleta.id) + 1;
    console.log('Posició calculada:', posicio);

    return {
      posicio,
      esNou: posicio <= MAX_ENTRIES_PER_NIVELL,
      id: entryCompleta.id
    };
  } catch (error) {
    console.error('Error guardant ranking:', error);
    return { posicio: -1, esNou: false, id: null };
  }
}

/**
 * Esborra una entrada del ranking
 * @param {string} nivell - Nivell de l'entrada
 * @param {string} id - ID de l'entrada
 * @returns {boolean}
 */
export function esborrarEntrada(nivell, id) {
  try {
    const key = RANKING_KEYS[nivell];
    if (!key) return false;

    let ranking = obtenirRanking(nivell);
    ranking = ranking.filter(r => r.id !== id);

    localStorage.setItem(key, JSON.stringify(ranking));
    return true;
  } catch (error) {
    console.error('Error esborrant entrada:', error);
    return false;
  }
}

/**
 * Esborra tot el ranking d'un nivell
 * @param {string} nivell - Nivell a esborrar
 * @returns {boolean}
 */
export function esborrarRankingNivell(nivell) {
  try {
    const key = RANKING_KEYS[nivell];
    if (!key) return false;

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error esborrant ranking:', error);
    return false;
  }
}

/**
 * Esborra tots els rankings
 * @returns {boolean}
 */
export function esborrarTotsRankings() {
  try {
    Object.values(RANKING_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error esborrant rankings:', error);
    return false;
  }
}

/**
 * Crea un objecte d'entrada de ranking
 * @param {Object} params
 * @returns {Object}
 */
export function crearEntradaRanking({
  nom,
  puntuacio,
  nivell,
  config,
  resultat,
  temps
}) {
  return {
    id: generarId(),
    nom,
    puntuacio,
    nivell,
    config: {
      tipus: config.tipus,
      xifres1: config.xifres1,
      xifres2: config.xifres2,
      teDecimals: config.teDecimals,
      numDecimals: config.numDecimals,
      numOperacions: config.numOperacions
    },
    resultat: {
      correctes: resultat.correctes,
      total: resultat.total
    },
    temps,
    data: new Date().toISOString()
  };
}
