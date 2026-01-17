import { formatarTemps } from '../utils/scoring';

function Counters({ correctes, total, temps, mostrarCorrects }) {
  return (
    <div className="bg-blue-50 border-b border-blue-100 py-2 px-4">
      <div className="flex items-center justify-center gap-8 text-sm sm:text-base">
        {/* Comptador de respostes */}
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="font-medium text-gray-700">
            Correctes:{' '}
            <span className={mostrarCorrects ? 'text-green-600' : 'text-gray-500'}>
              {mostrarCorrects ? correctes : '?'}
            </span>
            /{total}
          </span>
        </div>

        {/* Comptador de temps */}
        <div className="flex items-center gap-2">
          <span>⏱</span>
          <span className="font-medium text-gray-700">
            Temps: <span className="font-mono">{formatarTemps(temps)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Counters;
