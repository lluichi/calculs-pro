import { getNomTipus } from '../utils/scoring';

function Header({ config, nivell, onMenuClick, onGenerarClick, onAjudaClick }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      {/* Versió Desktop */}
      <div className="hidden sm:flex items-center justify-between px-4 py-3">
        {/* Esquerra: Menú i títol */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Obrir configuració"
          >
            <span className="text-xl">☰</span>
          </button>
          <span className="text-2xl">🧮</span>
          <h1 className="text-lg font-semibold text-gray-800">
            Càlculs: {getNomTipus(config.tipus)}
          </h1>
        </div>

        {/* Centre: Dificultat */}
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-lg">{nivell.emoji}</span>
          <span className="text-sm font-medium text-gray-700">{nivell.text}</span>
        </div>

        {/* Dreta: Botons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerarClick}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Generar
          </button>
          <button
            onClick={onAjudaClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Ajuda"
          >
            <span className="text-xl">?</span>
          </button>
        </div>
      </div>

      {/* Versió Mobile */}
      <div className="sm:hidden">
        {/* Primera fila */}
        <div className="flex items-center justify-between px-3 py-2">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Obrir configuració"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧮</span>
            <span className="font-semibold text-gray-800">
              {getNomTipus(config.tipus)}
            </span>
          </div>
          <button
            onClick={onAjudaClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Ajuda"
          >
            <span className="text-xl">?</span>
          </button>
        </div>

        {/* Segona fila */}
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <span>{nivell.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{nivell.text}</span>
          </div>
          <button
            onClick={onGenerarClick}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Generar
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
