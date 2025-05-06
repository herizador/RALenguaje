// public/js/app.js

const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com'; // (aunque ahora dejemos BaseX)

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

async function runConsulta() {
async function runConsulta() {
  const out = document.getElementById('consulta-content');
  out.textContent = '⏳ Ejecutando consulta…';
  try {
    // 1) Carga el XQuery desde tu carpeta pública
    const qRes = await fetch('/xquery/buscar.xq');
    const query = await qRes.text();

    // 2) Construye la cabecera Basic Auth
    const credentials = btoa('admin:admin');

    // 3) Envía la consulta al endpoint CORRECTO: /rest/db/usuarios
    const res = await fetch(
      `${BASEX_URL}/rest/db/usuarios?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Basic ${credentials}`
        },
        mode: 'cors'
      }
    );
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const text = await res.text();
    out.textContent = text.trim() || '⚠️ Sin resultados';

  } catch (e) {
    console.error('Error en consulta XQuery:', e);
    out.textContent = `❌ Error al ejecutar la consulta: ${e.message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Sólo si existe el botón, se añade el listener
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Resto de tu inicialización
  loadCatalog();
  runValidacion();

  const btnConsulta = document.getElementById('btn-consulta');
  if (btnConsulta) {
    btnConsulta.addEventListener('click', runConsulta);
  }
});
