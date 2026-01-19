import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ConfigPanel from './components/ConfigPanel';
import GameArea from './components/GameArea';
import Counters from './components/Counters';
import ResultModal from './components/ResultModal';
import RankingModal from './components/RankingModal';
import HelpModal from './components/HelpModal';
import { generarOperacions, corregirOperacions } from './utils/operations';
import { calcularNivell, calcularPuntuacio } from './utils/scoring';
import { guardarRanking, crearEntradaRanking } from './utils/ranking';

// Configuració per defecte
const CONFIG_DEFAULT = {
  tipus: 'sumes',
  xifres1: 1,
  xifres2: 1,
  teDecimals: false,
  numDecimals: 1,
  numOperacions: 10
};

// Clau per localStorage
const CONFIG_STORAGE_KEY = 'calculs-pro-config';

// Carregar configuració guardada
function carregarConfigGuardada() {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validar que té totes les propietats necessàries
      if (parsed.tipus && parsed.xifres1 && parsed.numOperacions) {
        return { ...CONFIG_DEFAULT, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Error carregant configuració guardada:', e);
  }
  return CONFIG_DEFAULT;
}

// Guardar configuració
function guardarConfig(config) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Error guardant configuració:', e);
  }
}

// Estats de l'aplicació
const AppState = {
  INICIAL: 'inicial',
  JUGANT: 'jugant',
  REVISAT: 'revisat',
  CONFIGURANT: 'configurant'
};

function App() {
  // Estat de la configuració (carrega de localStorage si existeix)
  const [config, setConfig] = useState(carregarConfigGuardada);

  // Estat del joc
  const [appState, setAppState] = useState(AppState.INICIAL);
  const [operacions, setOperacions] = useState([]);
  const [temps, setTemps] = useState(0);
  const [tempsActiu, setTempsActiu] = useState(false);
  const [resultat, setResultat] = useState(null);
  const [avis, setAvis] = useState(null);

  // Modals
  const [configObert, setConfigObert] = useState(false);
  const [rankingObert, setRankingObert] = useState(false);
  const [ajudaOberta, setAjudaOberta] = useState(false);
  const [resultatObert, setResultatObert] = useState(false);

  // Referència al primer input
  const primerInputRef = useRef(null);

  // Calcular nivell actual
  const nivell = calcularNivell(config);

  // Timer
  useEffect(() => {
    let interval = null;
    if (tempsActiu) {
      interval = setInterval(() => {
        setTemps(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tempsActiu]);

  // Guardar configuració a localStorage quan canvia
  useEffect(() => {
    guardarConfig(config);
  }, [config]);

  // Generar noves operacions
  const handleGenerar = useCallback(() => {
    const { operacions: novesOperacions, avis: nouAvis } = generarOperacions(config);
    setOperacions(novesOperacions);
    setAvis(nouAvis);
    setTemps(0);
    setTempsActiu(false);
    setAppState(AppState.JUGANT);
    setResultat(null);

    // Focus al primer input
    setTimeout(() => {
      if (primerInputRef.current) {
        primerInputRef.current.focus();
      }
    }, 100);
  }, [config]);

  // Actualitzar resposta d'una operació
  const handleRespostaChange = useCallback((id, valor) => {
    setOperacions(ops =>
      ops.map(op =>
        op.id === id ? { ...op, respostaUsuari: valor } : op
      )
    );

    // Iniciar cronòmetre si és la primera resposta
    if (!tempsActiu && valor.length > 0) {
      setTempsActiu(true);
    }
  }, [tempsActiu]);

  // Revisar respostes
  const handleRevisar = useCallback(() => {
    // Aturar cronòmetre
    setTempsActiu(false);

    // Corregir operacions
    const { operacionsCorregides, correctes, total } = corregirOperacions(operacions);
    setOperacions(operacionsCorregides);

    // Calcular puntuació
    const puntuacio = calcularPuntuacio(
      { correctes, total },
      config,
      temps
    );

    setResultat({
      correctes,
      total,
      puntuacio,
      temps,
      nivell: nivell.nivell
    });

    setAppState(AppState.REVISAT);
    setResultatObert(true);
  }, [operacions, config, temps, nivell]);

  // Reiniciar joc
  const handleReiniciar = useCallback(() => {
    setOperacions([]);
    setAvis(null);
    setTemps(0);
    setTempsActiu(false);
    setAppState(AppState.INICIAL);
    setResultat(null);
  }, []);

  // Guardar al ranking (ara és async)
  const handleGuardarRanking = useCallback(async (nom) => {
    if (!resultat || !nom.trim()) return null;

    const entrada = crearEntradaRanking({
      nom: nom.trim(),
      puntuacio: resultat.puntuacio,
      nivell: resultat.nivell,
      config,
      resultat: {
        correctes: resultat.correctes,
        total: resultat.total
      },
      temps: resultat.temps
    });

    const { posicio } = await guardarRanking(entrada);
    return posicio;
  }, [resultat, config]);

  // Aplicar nova configuració (només guardar, sense generar)
  const handleAplicarConfig = useCallback((novaConfig) => {
    setConfig(novaConfig);
    setConfigObert(false);

    // Si estem jugant, reiniciar
    if (appState === AppState.JUGANT || appState === AppState.REVISAT) {
      setOperacions([]);
      setAvis(null);
      setTemps(0);
      setTempsActiu(false);
      setAppState(AppState.INICIAL);
      setResultat(null);
    }
  }, [appState]);

  // Aplicar configuració i generar operacions immediatament
  const handleGenerarDesdeConfig = useCallback((novaConfig) => {
    setConfig(novaConfig);
    setConfigObert(false);

    // Generar operacions amb la nova configuració
    const { operacions: novesOperacions, avis: nouAvis } = generarOperacions(novaConfig);
    setOperacions(novesOperacions);
    setAvis(nouAvis);
    setTemps(0);
    setTempsActiu(false);
    setAppState(AppState.JUGANT);
    setResultat(null);

    // Focus al primer input
    setTimeout(() => {
      if (primerInputRef.current) {
        primerInputRef.current.focus();
      }
    }, 100);
  }, []);

  // Comptar correctes actuals
  const correctesActuals = operacions.filter(op => op.estat === 'correcte').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEF0]">
      {/* Capçalera */}
      <Header
        config={config}
        nivell={nivell}
        onMenuClick={() => setConfigObert(true)}
        onGenerarClick={handleGenerar}
        onAjudaClick={() => setAjudaOberta(true)}
      />

      {/* Comptadors */}
      {appState !== AppState.INICIAL && (
        <Counters
          correctes={correctesActuals}
          total={operacions.length}
          temps={temps}
          mostrarCorrects={appState === AppState.REVISAT}
        />
      )}

      {/* Zona de joc */}
      <main className="flex-1 overflow-auto">
        {appState === AppState.INICIAL ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🧮</div>
              <p className="text-lg mb-4">Prem "Generar" per començar!</p>
              <p className="text-sm">
                O configura el joc amb el botó del menú (☰)
              </p>
            </div>
          </div>
        ) : (
          <GameArea
            operacions={operacions}
            onRespostaChange={handleRespostaChange}
            onRevisar={handleRevisar}
            disabled={appState === AppState.REVISAT}
            primerInputRef={primerInputRef}
            avis={avis}
          />
        )}
      </main>

      {/* Peu de pàgina */}
      <Footer
        onReiniciar={handleReiniciar}
        onAjuda={() => setAjudaOberta(true)}
        onRanking={() => setRankingObert(true)}
        mostrarReiniciar={appState !== AppState.INICIAL}
      />

      {/* Modals */}
      {configObert && (
        <ConfigPanel
          config={config}
          onAplicar={handleAplicarConfig}
          onCancelar={() => setConfigObert(false)}
          onGenerar={handleGenerarDesdeConfig}
        />
      )}

      {rankingObert && (
        <RankingModal
          onTancar={() => setRankingObert(false)}
          nivellInicial={nivell.nivell}
        />
      )}

      {ajudaOberta && (
        <HelpModal
          onTancar={() => setAjudaOberta(false)}
        />
      )}

      {resultatObert && resultat && (
        <ResultModal
          resultat={resultat}
          nivell={nivell}
          config={config}
          onGuardar={handleGuardarRanking}
          onTancar={() => setResultatObert(false)}
          onVeureRanking={() => {
            setResultatObert(false);
            setRankingObert(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
