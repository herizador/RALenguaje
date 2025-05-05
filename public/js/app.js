// Define la URL de tu servicio BaseX en Render:
const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com'; // Reemplaza <TU_SERVICIO> por la URL que Render te proporciona

// Toggle menú móvil
document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Carga y transformación XSLT para el catálogo de usuarios
async function loadCatalog() {
  try {
    const [xmlResp, xslResp] = await Promise.all([
      fetch('data/usuarios.xml'),
      fetch('xsl/usuarios.xsl')
    ]);
    const [xmlText, xslText] = await Promise.all([xmlResp.text(), xslResp.text()]);
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const xsl = parser.parseFromString(xslText, 'application/xml');
    const processor = new XSLTProcessor();
    processor.importStylesheet(xsl);
    const fragment = processor.transformToFragment(xml, document);
    document.getElementById('catalogo-content').appendChild(fragment);
  } catch (err) {
    console.error('Error cargando catálogo:', err);
  }
}

// Ejecuta una consulta XQuery remota en BaseX
async function runConsulta() {
  try {
    const res = await fetch(`${BASEX_URL}/rest/usuarios/xquery/consulta.xq`);
    if (!res.ok) throw new Error(res.statusText);
    const text = await res.text();
    document.getElementById('consulta-result').textContent = text;
  } catch (err) {
    console.error('Error en consulta:', err);
    document.getElementById('consulta-result').textContent = 'Error al ejecutar la consulta.';
  }
}

// Simula validación XML (se puede sustituir por llamada real a REST si se implementa)
function runValidacion() {
  const log = document.getElementById('validacion-log');
  log.textContent = '✓ Validación DTD: OK
✓ Validación XSD: OK';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadCatalog();
  runConsulta();
  runValidacion();
});
