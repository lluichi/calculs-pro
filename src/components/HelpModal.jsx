function HelpModal({ onTancar }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Capçalera */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>❓</span> Com jugar
          </h2>
        </div>

        {/* Contingut */}
        <div className="p-6 space-y-6">
          {/* Objectiu */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <span>🎯</span> Objectiu
            </h3>
            <p className="text-gray-600">
              Resol el màxim d'operacions matemàtiques correctament
              en el menor temps possible per aconseguir més punts!
            </p>
          </section>

          {/* Passos */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <span>📝</span> Passos
            </h3>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <strong className="text-gray-800">Configura el joc</strong>
                  <span className="text-gray-600"> (botó ☰):</span>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    <li>Escull el tipus d'operació</li>
                    <li>Tria quantes xifres vols als números</li>
                    <li>Decideix si vols decimals</li>
                    <li>Escull quantes operacions vols fer</li>
                  </ul>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <strong className="text-gray-800">Prem "Generar"</strong>
                  <span className="text-gray-600"> per crear les operacions</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <strong className="text-gray-800">Escriu les respostes</strong>
                  <span className="text-gray-600"> als quadres</span>
                  <p className="text-sm text-orange-600 mt-1">
                    ⏱ El temps comença quan escrius la primera resposta!
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <strong className="text-gray-800">Prem "Revisar"</strong>
                  <span className="text-gray-600"> quan hagis acabat</span>
                  <div className="mt-1 text-sm space-y-1">
                    <p className="text-green-600">✓ Verd = resposta correcta</p>
                    <p className="text-red-600">✗ Vermell = resposta incorrecta</p>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                <div>
                  <strong className="text-gray-800">Mira la teva puntuació</strong>
                  <span className="text-gray-600"> i intenta superar-te!</span>
                </div>
              </li>
            </ol>
          </section>

          {/* Puntuació */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <span>🏆</span> Puntuació
            </h3>
            <p className="text-gray-600 mb-2">Guanyes més punts si:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Respons correctament</li>
              <li>Fas operacions més difícils</li>
              <li>Acabes més ràpid</li>
            </ul>
          </section>

          {/* Consell */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-800 flex items-center gap-2 mb-1">
              <span>💡</span> Consell
            </h3>
            <p className="text-sm text-yellow-700">
              Comença amb operacions fàcils i ves augmentant
              la dificultat a mesura que milloris!
            </p>
          </section>
        </div>

        {/* Botó tancar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
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

export default HelpModal;
