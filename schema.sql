-- Taula de rankings globals
CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  puntuacio INTEGER NOT NULL,
  nivell TEXT NOT NULL CHECK(nivell IN ('Fàcil', 'Mig', 'Difícil', 'Expert')),
  tipus TEXT NOT NULL,
  correctes INTEGER NOT NULL,
  total INTEGER NOT NULL,
  temps INTEGER NOT NULL,
  xifres1 INTEGER,
  xifres2 INTEGER,
  decimals INTEGER DEFAULT 0,
  data TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Índexs per optimitzar les consultes
CREATE INDEX IF NOT EXISTS idx_rankings_nivell ON rankings(nivell);
CREATE INDEX IF NOT EXISTS idx_rankings_puntuacio ON rankings(nivell, puntuacio DESC);
