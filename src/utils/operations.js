// Generació d'operacions matemàtiques

// Quadrats perfectes per a les arrels quadrades
const QUADRATS_PERFECTES = [
  1, 4, 9, 16, 25, 36, 49, 64, 81, 100,
  121, 144, 169, 196, 225, 256, 289, 324, 361, 400,
  441, 484, 529, 576, 625, 676, 729, 784, 841, 900,
  961, 1024, 1089, 1156, 1225, 1296, 1369, 1444, 1521, 1600,
  1681, 1764, 1849, 1936, 2025, 2116, 2209, 2304, 2401, 2500,
  2601, 2704, 2809, 2916, 3025, 3136, 3249, 3364, 3481, 3600,
  3721, 3844, 3969, 4096, 4225, 4356, 4489, 4624, 4761, 4900,
  5041, 5184, 5329, 5476, 5625, 5776, 5929, 6084, 6241, 6400,
  6561, 6724, 6889, 7056, 7225, 7396, 7569, 7744, 7921, 8100,
  8281, 8464, 8649, 8836, 9025, 9216, 9409, 9604, 9801, 10000
];

/**
 * Genera un número aleatori amb les xifres i decimals especificats
 * @param {number} xifres - Nombre de xifres (1-5)
 * @param {number} decimals - Nombre de decimals (0-3)
 * @returns {number}
 */
export function generarNumero(xifres, decimals = 0) {
  const min = Math.pow(10, xifres - 1);
  const max = Math.pow(10, xifres) - 1;

  let numero = Math.floor(Math.random() * (max - min + 1)) + min;

  if (decimals > 0) {
    const partDecimal = Math.random().toFixed(decimals).substring(2);
    numero = parseFloat(numero + '.' + partDecimal);
  }

  return numero;
}

/**
 * Genera una operació de suma
 */
function generarSuma(xifres1, xifres2, decimals) {
  const operand1 = generarNumero(xifres1, decimals);
  const operand2 = generarNumero(xifres2, decimals);
  const resultat = operand1 + operand2;

  return {
    operand1,
    operand2,
    operador: '+',
    resultat: decimals > 0 ? parseFloat(resultat.toFixed(decimals)) : resultat,
    decimalsResultat: decimals
  };
}

/**
 * Genera una operació de resta (resultat mai negatiu)
 */
function generarResta(xifres1, xifres2, decimals) {
  const num1 = generarNumero(xifres1, decimals);
  const num2 = generarNumero(xifres2, decimals);

  // Assegurar que el resultat no sigui negatiu
  const operand1 = Math.max(num1, num2);
  const operand2 = Math.min(num1, num2);
  const resultat = operand1 - operand2;

  return {
    operand1,
    operand2,
    operador: '-',
    resultat: decimals > 0 ? parseFloat(resultat.toFixed(decimals)) : resultat,
    decimalsResultat: decimals
  };
}

/**
 * Genera una operació de multiplicació
 */
function generarMultiplicacio(xifres1, xifres2, decimals) {
  const operand1 = generarNumero(xifres1, decimals);
  const operand2 = generarNumero(xifres2, decimals);
  const resultat = operand1 * operand2;

  // Per multiplicacions amb decimals, el resultat pot tenir més decimals
  const decimalsResultat = decimals * 2;

  return {
    operand1,
    operand2,
    operador: '×',
    resultat: decimals > 0 ? parseFloat(resultat.toFixed(decimalsResultat)) : resultat,
    decimalsResultat: decimals > 0 ? decimalsResultat : 0
  };
}

/**
 * Genera una operació de divisió exacta (sense residu)
 * @param {number} xifres1 - Xifres del quocient
 * @param {number} xifres2 - Xifres del divisor
 * @param {number} decimalsResultat - Decimals al resultat (1-5)
 */
function generarDivisio(xifres1, xifres2, decimalsResultat) {
  const divisor = generarNumero(xifres2, 0); // Divisor sempre enter
  const quocient = generarNumero(xifres1, decimalsResultat);
  const dividend = divisor * quocient;

  return {
    operand1: decimalsResultat > 0 ? parseFloat(dividend.toFixed(decimalsResultat)) : dividend,
    operand2: divisor,
    operador: '÷',
    resultat: quocient,
    decimalsResultat
  };
}

/**
 * Obté els quadrats perfectes disponibles per un nombre de xifres
 * @param {number} xifres - Xifres del radicand
 * @returns {Array} Array de quadrats perfectes
 */
export function obtenirQuadratsPerfectes(xifres) {
  const min = xifres === 1 ? 1 : Math.pow(10, xifres - 1);
  const max = Math.pow(10, xifres) - 1;
  return QUADRATS_PERFECTES.filter(n => n >= min && n <= max);
}

/**
 * Genera una operació d'arrel quadrada (només quadrats perfectes)
 * @param {number} xifres - Xifres del radicand
 * @param {Array} usats - Array de radicands ja usats (per evitar repeticions)
 */
function generarArrel(xifres, usats = []) {
  const candidats = obtenirQuadratsPerfectes(xifres);

  if (candidats.length === 0) {
    // Si no hi ha candidats, usar el primer quadrat perfecte disponible
    const radicand = QUADRATS_PERFECTES[0];
    return {
      operand1: radicand,
      operand2: null,
      operador: '√',
      resultat: Math.sqrt(radicand),
      decimalsResultat: 0
    };
  }

  // Filtrar els que ja s'han usat
  const disponibles = candidats.filter(n => !usats.includes(n));

  // Si tots s'han usat, permetre repeticions
  const seleccio = disponibles.length > 0 ? disponibles : candidats;
  const radicand = seleccio[Math.floor(Math.random() * seleccio.length)];

  return {
    operand1: radicand,
    operand2: null,
    operador: '√',
    resultat: Math.sqrt(radicand),
    decimalsResultat: 0
  };
}

/**
 * Obté el màxim d'operacions úniques possibles per arrels quadrades
 * @param {number} xifres - Xifres del radicand
 * @returns {number}
 */
export function getMaxOperacionsArrels(xifres) {
  return obtenirQuadratsPerfectes(xifres).length;
}

/**
 * Genera un array d'operacions segons la configuració
 * @param {Object} config - Configuració de les operacions
 * @returns {Object} { operacions, avis }
 */
export function generarOperacions(config) {
  const {
    tipus,
    xifres1,
    xifres2,
    teDecimals,
    numDecimals,
    numOperacions
  } = config;

  const operacions = [];
  const decimals = teDecimals ? numDecimals : 0;
  let avis = null;

  // Per arrels, controlar els usats per evitar repeticions
  const arrelUsats = [];

  // Comprovar si hi ha prou operacions úniques per arrels
  if (tipus === 'arrels') {
    const maxUniques = getMaxOperacionsArrels(xifres1);
    if (numOperacions > maxUniques) {
      avis = {
        tipus: 'limit_arrels',
        missatge: `Amb ${xifres1} xifra${xifres1 > 1 ? 'es' : ''} només hi ha ${maxUniques} arrels quadrades possibles. Algunes es repetiran.`,
        maxUniques
      };
    }
  }

  for (let i = 0; i < numOperacions; i++) {
    let operacio;

    switch (tipus) {
      case 'sumes':
        operacio = generarSuma(xifres1, xifres2, decimals);
        break;
      case 'restes':
        operacio = generarResta(xifres1, xifres2, decimals);
        break;
      case 'multiplicacions':
        operacio = generarMultiplicacio(xifres1, xifres2, decimals);
        break;
      case 'divisions':
        operacio = generarDivisio(xifres1, xifres2, decimals);
        break;
      case 'arrels':
        operacio = generarArrel(xifres1, arrelUsats);
        arrelUsats.push(operacio.operand1);
        break;
      default:
        operacio = generarSuma(xifres1, xifres2, decimals);
    }

    operacions.push({
      id: i + 1,
      ...operacio,
      respostaUsuari: '',
      estat: 'pendent' // pendent, correcte, incorrecte
    });
  }

  return { operacions, avis };
}

/**
 * Compara la resposta de l'usuari amb la resposta correcta
 * @param {string|number} respostaUsuari - Resposta de l'usuari
 * @param {number} respostaCorrecta - Resposta correcta
 * @param {number} decimals - Nombre de decimals per a la tolerància
 * @returns {Object} { valid, correcte, valor }
 */
export function validarResposta(respostaUsuari, respostaCorrecta, decimals = 0) {
  // Netejar la resposta (acceptar punt i coma com a separador decimal)
  const valorNet = String(respostaUsuari).trim().replace(',', '.');

  // Resposta buida
  if (valorNet === '') {
    return { valid: false, correcte: false, tipus: 'buit', valor: null };
  }

  // Comprovar si és un número vàlid
  const numero = parseFloat(valorNet);
  if (isNaN(numero)) {
    return { valid: false, correcte: false, tipus: 'invalid', valor: null };
  }

  // Tolerància per evitar errors de punt flotant
  const tolerancia = Math.pow(10, -(decimals + 2));
  const esCorrecte = Math.abs(numero - respostaCorrecta) < tolerancia;

  return { valid: true, correcte: esCorrecte, tipus: 'valid', valor: numero };
}

/**
 * Corregeix totes les operacions i retorna el resultat
 * @param {Array} operacions - Array d'operacions amb respostes
 * @returns {Object} { operacionsCorregides, correctes, total }
 */
export function corregirOperacions(operacions) {
  let correctes = 0;

  const operacionsCorregides = operacions.map(op => {
    const validacio = validarResposta(
      op.respostaUsuari,
      op.resultat,
      op.decimalsResultat
    );

    let estat;
    if (!validacio.valid) {
      estat = 'incorrecte';
    } else if (validacio.correcte) {
      estat = 'correcte';
      correctes++;
    } else {
      estat = 'incorrecte';
    }

    return {
      ...op,
      estat,
      valorValidat: validacio.valor
    };
  });

  return {
    operacionsCorregides,
    correctes,
    total: operacions.length
  };
}

/**
 * Formata un número per mostrar-lo
 * @param {number} num - Número a formatar
 * @param {number} decimals - Decimals a mostrar
 * @returns {string}
 */
export function formatarNumero(num, decimals = 0) {
  if (decimals > 0) {
    return num.toFixed(decimals);
  }
  return String(num);
}
