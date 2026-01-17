import { useState } from 'react';
import { formatarTemps, getNomTipus } from '../utils/scoring';

function ResultModal({ resultat, nivell, config, onGuardar, onTancar, onVeureRanking }) {
  const [nom, setNom] = useState('');
  const [guardat, setGuardat] = useState(false);
  const [posicio, setPosicio] = useState(null);

  const percentatge = Math.round((resultat.correctes / resultat.total) * 100);

  // Determinar emoji segons percentatge
  const getEmoji = () => {
    if (percentatge >= 90) return '🌟';
    if (percentatge >= 70) return '😊';
    if (percentatge >= 50) return '👍';
    return '💪';
  };

  // Determinar missatge segons percentatge
  const getMissatge = () => {
    if (percentatge === 100) return 'Perfecte!';
    if (percentatge >= 90) return 'Excel·lent!';
    if (percentatge >= 70) return 'Molt bé!';
    if (percentatge >= 50) return 'Bé!';
    return 'Continua practicant!';
  };

  const handleGuardar = () => {
    if (!nom.trim()) return;

    const pos = onGuardar(nom);
    if (pos > 0) {
      setPosicio(pos);
      setGuardat(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Capçalera amb color segons resultat */}
        <div
          className={`px-6 py-8 text-center ${
            percentatge >= 70 ? 'bg-green-500' : percentatge >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
          }`}
        >
          <div className="text-6xl mb-2">{getEmoji()}</div>
          <h2 className="text-2xl font-bold text-white">{getMissatge()}</h2>
        </div>

        {/* Resultats */}
        <div className="p-6 space-y-4">
          {/* Puntuació */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">
              {resultat.puntuacio.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">punts</div>
          </div>

          {/* Estadístiques */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">
                {resultat.correctes}/{resultat.total}
              </div>
              <div className="text-xs text-gray-500">Correctes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-700">
                {percentatge}%
              </div>
              <div className="text-xs text-gray-500">Encerts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600 font-mono">
                {formatarTemps(resultat.temps)}
              </div>
              <div className="text-xs text-gray-500">Temps</div>
            </div>
          </div>

          {/* Info de configuració */}
          <div className="text-center text-sm text-gray-500">
            {getNomTipus(config.tipus)} | {config.xifres1}×{config.xifres2} xifres |{' '}
            {nivell.emoji} {nivell.text}
          </div>

          {/* Guardar al ranking */}
          {!guardat ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 text-center mb-3">
                  Guarda la teva puntuació al ranking!
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="El teu nom..."
                    maxLength={20}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleGuardar()}
                  />
                  <button
                    onClick={handleGuardar}
                    disabled={!nom.trim()}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Botó secundari per sortir sense guardar */}
              <div className="flex gap-3">
                <button
                  onClick={onVeureRanking}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🏆</span>
                  <span>Ranking</span>
                </button>
                <button
                  onClick={onTancar}
                  className="flex-1 px-4 py-2 text-gray-500 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sortir sense guardar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-green-600 font-medium">
                  Guardat! Ets el #{posicio} del ranking {nivell.text}
                </div>
              </div>

              {/* Botons després de guardar */}
              <div className="flex gap-3">
                <button
                  onClick={onVeureRanking}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🏆</span>
                  <span>Veure Ranking</span>
                </button>
                <button
                  onClick={onTancar}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
