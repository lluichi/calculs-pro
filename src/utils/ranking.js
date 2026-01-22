// Gestió del ranking global amb API

const API_BASE = '/api/rankings';

// Mapejat de nivells
const NIVELL_MAP = {
  facil: 'Fàcil',
  mig: 'Mig',
  dificil: 'Difícil',
  expert: 'Expert'
};

const NIVELL_MAP_INVERS = {
  'Fàcil': 'facil',
  'Mig': 'mig',
  'Difícil': 'dificil',
  'Expert': 'expert'
};

/**
 * Obté el ranking d'un nivell des de l'API
 * @param {string} nivell - facil, mig, dificil, expert
 * @returns {Promise<Array>}
 */
export async function obtenirRanking(nivell) {
  try {
    const nivellApi = NIVELL_MAP[nivell] || nivell;
    const response = await fetch(`${API_BASE}?nivell=${encodeURIComponent(nivellApi)}`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Convertir format API a format intern
    return (data.rankings || []).map(entry => ({
      id: entry.id,
      nom: entry.nom,
      puntuacio: entry.puntuacio,
      nivell: NIVELL_MAP_INVERS[entry.nivell] || entry.nivell,
      config: {
        tipus: entry.tipus,
        xifres1: entry.xifres1,
        xifres2: entry.xifres2,
        teDecimals: entry.decimals > 0,
        numDecimals: entry.decimals,
        numOperacions: entry.total
      },
      resultat: {
        correctes: entry.correctes,
        total: entry.total
      },
      temps: entry.temps,
      data: entry.data
    }));
  } catch (error) {
    console.error('Error obtenint ranking:', error);
    return [];
  }
}

/**
 * Obté tots els rankings
 * @returns {Promise<Object>} { facil: [], mig: [], dificil: [], expert: [] }
 */
export async function obtenirTotsRankings() {
  try {
    // Fer les 4 crides en paral·lel
    const [facil, mig, dificil, expert] = await Promise.all([
      obtenirRanking('facil'),
      obtenirRanking('mig'),
      obtenirRanking('dificil'),
      obtenirRanking('expert')
    ]);

    return { facil, mig, dificil, expert };
  } catch (error) {
    console.error('Error obtenint tots els rankings:', error);
    return { facil: [], mig: [], dificil: [], expert: [] };
  }
}

/**
 * Guarda una entrada al ranking global
 * @param {Object} entry - Entrada del ranking
 * @returns {Promise<Object>} { posicio, esNou }
 */
export async function guardarRanking(entry) {
  try {
    const nivellApi = NIVELL_MAP[entry.nivell] || entry.nivell;

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: entry.nom,
        puntuacio: entry.puntuacio,
        nivell: nivellApi,
        tipus: entry.config?.tipus || 'sumes',
        correctes: entry.resultat?.correctes || 0,
        total: entry.resultat?.total || 0,
        temps: entry.temps || 0,
        xifres1: entry.config?.xifres1,
        xifres2: entry.config?.xifres2,
        decimals: entry.config?.teDecimals ? entry.config?.numDecimals : 0
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.details || data.error || `Error HTTP: ${response.status}`;
      throw new Error(errorMsg);
    }

    return {
      posicio: data.posicio || 1,
      esNou: true,
      id: data.id
    };
  } catch (error) {
    console.error('Error guardant ranking:', error);
    throw error; // Re-llançar per permetre gestió a nivell de UI
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
