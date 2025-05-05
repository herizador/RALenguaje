const API_BASE = '/api/';

async function runXQuery(path) {
  const res = await fetch(`${API_BASE}basex/xquery/${path}`);
  return await res.text();
}
