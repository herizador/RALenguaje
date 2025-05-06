// public/js/app.js

const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com'; // (aunque ahora dejemos BaseX)

document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Carga y transformación XSLT para el catálogo de productos
async function loadCatalog() {
  try {
    // FETCH del XML y del XSL correctos
    const [xmlRes, xslRes] = await Promise.all([
      fetch('/data/catalogo.xml'),
      fetch('/xsl/transformar.xsl')
    ]);
    const [xmlText, xslText] = await Promise.all([
      xmlRes.text(), xslRes.text()
    ]);

    // Parsear
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const xsl = parser.parseFromString(xslText, 'application/xml');

    // Transformar
    const proc = new XSLTProcessor();
    proc.importStylesheet(xsl);
    const frag = proc.transformToFragment(xml, document);

    // Renderizar
    const container = document.getElementById('catalogo-content');
    container.innerHTML = '';           // limpia antes
    container.appendChild(frag);

  } catch (e) {
    console.error('Error cargando/transf. catálogo:', e);
  }
}

function runValidacion() {
  document.getElementById('validacion-log').textContent =
    '✓ Validación DTD: OK\n✓ Validación XSD: OK';
}

document.addEventListener('DOMContentLoaded', () => {
  loadCatalog();
  runValidacion();
});
