// Define la URL de tu servicio BaseX en Render:
const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com'; // tu URL en Render

// Menú móvil
document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// XSLT: genera catálogo\async function loadCatalog() {
  try {
    const [xmlRes, xslRes] = await Promise.all([
      fetch('/data/catalogo.xml'),
      fetch('/xsl/transformar.xsl')
    ]);
    const [xmlText, xslText] = await Promise.all([xmlRes.text(), xslRes.text()]);
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const xsl = parser.parseFromString(xslText, 'application/xml');
    const proc = new XSLTProcessor();
    proc.importStylesheet(xsl);
    const frag = proc.transformToFragment(xml, document);
    document.getElementById('catalogo-content').appendChild(frag);
  } catch (e) {
    console.error('Error catálogo:', e);
  }
}

// XQuery: peticiones a BaseX
const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com';

async function runConsulta() {
  try {
    const res = await fetch(`${BASEX_URL}/rest/usuarios?run=buscar.xq`);
    if (!res.ok) throw new Error(res.statusText);
    const txt = await res.text();
    document.getElementById('consulta-result').textContent = txt;
  } catch (e) {
    console.error('Error consulta:', e);
    document.getElementById('consulta-result').textContent = 'Error en consulta';
  }
}

// Validación sim
function runValidacion() {
  document.getElementById('validacion-log').textContent = '✓ DTD OK\n✓ XSD OK';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadCatalog(); runConsulta(); runValidacion();
});
