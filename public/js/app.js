// Reemplaza con tu URL real de Render para BaseX:
const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com';

// Ejemplo: ejecutar XQuery remoto
async function runXQuery(path) {
  const res = await fetch(`${BASEX_URL}/rest/basex/xquery/${path}`);
  if (!res.ok) throw new Error('Error en XQuery: ' + res.status);
  return await res.text();
}

// Uso:
runXQuery('buscar.xq')
  .then(txt => console.log(txt))
  .catch(err => console.error(err));
