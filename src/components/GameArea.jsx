import { formatarNumero } from '../utils/operations';

function OperationRow({ operacio, onChange, disabled, inputRef }) {
  // Determinar classes segons estat
  const getInputClasses = () => {
    const base = 'w-24 sm:w-32 px-3 py-2 text-center font-mono text-lg border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors';

    if (disabled) {
      switch (operacio.estat) {
        case 'correcte':
          return `${base} bg-green-50 border-green-500 text-green-700`;
        case 'incorrecte':
          return `${base} bg-red-50 border-red-500 text-red-700`;
        default:
          return `${base} bg-gray-50 border-gray-300 text-gray-500`;
      }
    }

    return `${base} bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200`;
  };

  // Renderitzar l'operació segons el tipus
  const renderOperacio = () => {
    const { operand1, operand2, operador, decimalsResultat } = operacio;

    if (operador === '√') {
      return (
        <span className="font-mono text-lg sm:text-xl text-gray-800">
          √{formatarNumero(operand1, 0)}
        </span>
      );
    }

    return (
      <span className="font-mono text-lg sm:text-xl text-gray-800">
        {formatarNumero(operand1, decimalsResultat)}{' '}
        <span className="text-blue-600">{operador}</span>{' '}
        {formatarNumero(operand2, decimalsResultat)}
      </span>
    );
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 py-2">
      {/* Número d'ordre */}
      <span className="w-8 text-right text-gray-500 font-medium">
        {operacio.id})
      </span>

      {/* Operació */}
      <div className="flex-1 flex items-center justify-end sm:justify-start gap-2">
        {renderOperacio()}
        <span className="text-gray-500">=</span>
      </div>

      {/* Input de resposta */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={operacio.respostaUsuari}
          onChange={(e) => onChange(operacio.id, e.target.value)}
          disabled={disabled}
          className={getInputClasses()}
          aria-label={`Resposta per l'operació ${operacio.id}`}
          autoComplete="off"
        />
        {disabled && operacio.estat === 'correcte' && (
          <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-green-500">
            ✓
          </span>
        )}
        {disabled && operacio.estat === 'incorrecte' && (
          <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-red-500">
            ✗
          </span>
        )}
      </div>

      {/* Mostrar resposta correcta si és incorrecte */}
      {disabled && operacio.estat === 'incorrecte' && (
        <span className="text-sm text-gray-500 hidden sm:inline">
          ({formatarNumero(operacio.resultat, operacio.decimalsResultat)})
        </span>
      )}
    </div>
  );
}

function GameArea({ operacions, onRespostaChange, onRevisar, disabled, primerInputRef, avis }) {
  // Comprovar si hi ha almenys una resposta
  const hiHaRespostes = operacions.some(op => op.respostaUsuari.trim() !== '');

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Avís si hi ha limitacions */}
      {avis && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <span className="text-amber-500 flex-shrink-0">⚠️</span>
          <p className="text-sm text-amber-700">{avis.missatge}</p>
        </div>
      )}

      {/* Llista d'operacions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="space-y-1 sm:space-y-2">
          {operacions.map((op, index) => (
            <OperationRow
              key={op.id}
              operacio={op}
              onChange={onRespostaChange}
              disabled={disabled}
              inputRef={index === 0 ? primerInputRef : null}
            />
          ))}
        </div>
      </div>

      {/* Botó de revisar */}
      {!disabled && (
        <div className="text-center">
          <button
            onClick={onRevisar}
            disabled={!hiHaRespostes}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <span>📝</span>
            <span>Revisar</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default GameArea;
