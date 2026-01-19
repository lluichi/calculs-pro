// API per gestionar els rankings globals
// GET: Obtenir rankings per nivell
// POST: Afegir nou ranking

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Gestionar preflight CORS
export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

// GET /api/rankings?nivell=Fàcil
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const nivell = url.searchParams.get('nivell');

  try {
    let query;
    let params = [];

    if (nivell) {
      // Rankings per un nivell específic (top 100)
      query = `
        SELECT id, nom, puntuacio, nivell, tipus, correctes, total, temps, xifres1, xifres2, decimals, data
        FROM rankings
        WHERE nivell = ?
        ORDER BY puntuacio DESC
        LIMIT 100
      `;
      params = [nivell];
    } else {
      // Tots els rankings agrupats per nivell (top 100 de cada)
      query = `
        SELECT id, nom, puntuacio, nivell, tipus, correctes, total, temps, xifres1, xifres2, decimals, data
        FROM rankings
        WHERE (nivell, puntuacio, id) IN (
          SELECT nivell, puntuacio, id FROM rankings r2
          WHERE r2.nivell = rankings.nivell
          ORDER BY puntuacio DESC
          LIMIT 100
        )
        ORDER BY nivell, puntuacio DESC
      `;
    }

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({ rankings: results }), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error obtenint rankings:', error);
    return new Response(JSON.stringify({ error: 'Error obtenint rankings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}

// POST /api/rankings
export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const body = await request.json();
    const { nom, puntuacio, nivell, tipus, correctes, total, temps, xifres1, xifres2, decimals } = body;

    // Validació bàsica
    if (!nom || typeof puntuacio !== 'number' || !nivell || !tipus) {
      return new Response(JSON.stringify({ error: 'Dades incompletes' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    // Validar nivell
    const nivellsValids = ['Fàcil', 'Mig', 'Difícil', 'Expert'];
    if (!nivellsValids.includes(nivell)) {
      return new Response(JSON.stringify({ error: 'Nivell no vàlid' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    // Inserir nou ranking
    const result = await env.DB.prepare(`
      INSERT INTO rankings (nom, puntuacio, nivell, tipus, correctes, total, temps, xifres1, xifres2, decimals)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      nom.substring(0, 50), // Limitar nom a 50 caràcters
      Math.floor(puntuacio),
      nivell,
      tipus,
      correctes || 0,
      total || 0,
      temps || 0,
      xifres1 || null,
      xifres2 || null,
      decimals || 0
    ).run();

    // Obtenir la posició del nou ranking
    const { results: posicioResult } = await env.DB.prepare(`
      SELECT COUNT(*) + 1 as posicio
      FROM rankings
      WHERE nivell = ? AND puntuacio > ?
    `).bind(nivell, Math.floor(puntuacio)).all();

    const posicio = posicioResult[0]?.posicio || 1;

    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id,
      posicio
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error guardant ranking:', error);
    return new Response(JSON.stringify({ error: 'Error guardant ranking' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}
