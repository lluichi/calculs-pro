import { useState, useEffect } from 'react';
import { calcularNivell } from '../utils/scoring';

const TIPUS_OPERACIO = [
  { value: 'sumes', label: 'Sumes' },
  { value: 'restes', label: 'Restes' },
  { value: 'multiplicacions', label: 'Multiplicacions' },
  { value: 'divisions', label: 'Divisions' },
  { value: 'arrels', label: 'Arrels quadrades' }
];

const XIFRES_OPTIONS = [1, 2, 3, 4, 5];
const DECIMALS_OPTIONS = [1, 2, 3];
const OPERACIONS_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50];

function ConfigPanel({ config, onAplicar, onCancelar, onGenerar }) {
  const [localConfig, setLocalConfig] = useState(config);
  const nivell = calcularNivell(localConfig);

  // Actualitzar config local quan canvia la prop
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (camp, valor) => {
    setLocalConfig(prev => ({
      ...prev,
      [camp]: valor
    }));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    onAplicar(localConfig);
  };

  const handleGenerar = () => {
    onGenerar(localConfig);
  };

  // Per arrels, només es pot seleccionar xifres1
  const esArrel = localConfig.tipus === 'arrels';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Capçalera */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>⚙️</span> Configuració
          </h2>
        </div>

        {/* Formulari */}
        <form onSubmit={handleGuardar} className="p-6 space-y-6">
          {/* Tipus d'operació */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipus d'operació
            </label>
            <select
              value={localConfig.tipus}
              onChange={(e) => handleChange('tipus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TIPUS_OPERACIO.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {/* Xifres màximes primer número */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xifres màximes {esArrel ? 'del radicand' : 'del primer número'}
            </label>
            <select
              value={localConfig.xifres1}
              onChange={(e) => handleChange('xifres1', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {XIFRES_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Xifres màximes segon número (no per arrels) */}
          {!esArrel && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xifres màximes del segon número
              </label>
              <select
                value={localConfig.xifres2}
                onChange={(e) => handleChange('xifres2', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {XIFRES_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          {/* Decimals */}
          {!esArrel && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Decimals
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="decimals"
                    checked={!localConfig.teDecimals}
                    onChange={() => handleChange('teDecimals', false)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="text-gray-700">No</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="decimals"
                    checked={localConfig.teDecimals}
                    onChange={() => handleChange('teDecimals', true)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="text-gray-700">Sí, amb</span>
                  <select
                    value={localConfig.numDecimals}
                    onChange={(e) => handleChange('numDecimals', Number(e.target.value))}
                    disabled={!localConfig.teDecimals}
                    className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {DECIMALS_OPTIONS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-gray-700">decimals</span>
                </label>
              </div>
            </div>
          )}

          {/* Número d'operacions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número d'operacions
            </label>
            <select
              value={localConfig.numOperacions}
              onChange={(e) => handleChange('numOperacions', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {OPERACIONS_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Indicador de nivell */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nivell:</span>
              <span className="flex items-center gap-2 text-lg font-semibold">
                <span>{nivell.emoji}</span>
                <span className="text-gray-800">{nivell.text}</span>
              </span>
            </div>
          </div>

          {/* Botons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-blue-500 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleGenerar}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfigPanel;
