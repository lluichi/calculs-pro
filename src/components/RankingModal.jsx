import { useState, useEffect } from 'react';
import { obtenirTotsRankings, esborrarEntrada } from '../utils/ranking';
import { formatarTemps, getNomTipus } from '../utils/scoring';

const NIVELLS = [
  { key: 'facil', emoji: '🟢', text: 'Fàcil' },
  { key: 'mig', emoji: '🟡', text: 'Mig' },
  { key: 'dificil', emoji: '🟠', text: 'Difícil' },
  { key: 'expert', emoji: '🔴', text: 'Expert' }
];

function RankingEntry({ entry, posicio, onEsborrar }) {
  const medalles = ['🥇', '🥈', '🥉'];
  const medalla = posicio <= 3 ? medalles[posicio - 1] : null;

  const formatData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Posició */}
        <div className="w-8 flex-shrink-0 text-center">
          {medalla ? (
            <span className="text-xl">{medalla}</span>
          ) : (
            <span className="text-gray-500 font-medium">{posicio}.</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-gray-800 truncate">
              {entry.nom}
            </span>
            <span className="text-lg font-bold text-blue-600">
              {entry.puntuacio.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getNomTipus(entry.config.tipus)} |{' '}
            {entry.config.tipus === 'arrels'
              ? `${entry.config.xifres1} xifres`
              : `${entry.config.xifres1}×${entry.config.xifres2} xifres`
            }
            {entry.config.teDecimals && ` | ${entry.config.numDecimals} dec.`}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {entry.resultat.correctes}/{entry.resultat.total} |{' '}
            {formatarTemps(entry.temps)} |{' '}
            {formatData(entry.data)}
          </div>
        </div>

        {/* Botó esborrar */}
        <button
          onClick={() => onEsborrar(entry)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Esborrar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function RankingModal({ onTancar, nivellInicial = 'facil' }) {
  const [nivellActiu, setNivellActiu] = useState(nivellInicial);
  const [rankings, setRankings] = useState({});

  // Carregar rankings
  useEffect(() => {
    setRankings(obtenirTotsRankings());
  }, []);

  const handleEsborrar = (entry) => {
    if (window.confirm(`Vols esborrar la puntuació de ${entry.nom}?`)) {
      esborrarEntrada(entry.nivell, entry.id);
      setRankings(obtenirTotsRankings());
    }
  };

  const rankingActual = rankings[nivellActiu] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Capçalera */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏆</span> Ranking
          </h2>
        </div>

        {/* Pestanyes de nivell */}
        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="flex">
            {NIVELLS.map(nivell => (
              <button
                key={nivell.key}
                onClick={() => setNivellActiu(nivell.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  nivellActiu === nivell.key
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{nivell.emoji}</span>
                <span className="hidden sm:inline">{nivell.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Llista de ranking */}
        <div className="flex-1 overflow-auto p-4">
          {rankingActual.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📊</div>
              <p>Encara no hi ha puntuacions</p>
              <p className="text-sm mt-1">en el nivell {NIVELLS.find(n => n.key === nivellActiu)?.text}</p>
            </div>
          ) : (
            <div>
              {rankingActual.map((entry, index) => (
                <RankingEntry
                  key={entry.id}
                  entry={entry}
                  posicio={index + 1}
                  onEsborrar={handleEsborrar}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botó tancar */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <button
            onClick={onTancar}
            className="w-full px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Tancar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RankingModal;
