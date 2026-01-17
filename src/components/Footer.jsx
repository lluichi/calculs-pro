function Footer({ onReiniciar, onAjuda, onRanking, mostrarReiniciar }) {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4">
      <div className="flex items-center justify-center gap-4">
        {mostrarReiniciar && (
          <button
            onClick={onReiniciar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>🔄</span>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              Reiniciar
            </span>
          </button>
        )}

        <button
          onClick={onAjuda}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span>❓</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            Com jugar
          </span>
        </button>

        <button
          onClick={onRanking}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span>🏆</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            Ranking
          </span>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
