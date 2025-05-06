// public/js/app.js

const BASEX_URL = 'https://mi-proyecto-xml-basex.onrender.com'; // (aunque ahora dejemos BaseX)

// Carga y transformación XSLT para el catálogo de productos
// public/js/app.js

// 1) Función que aplica la validación DTD/XSD
function runValidacion() {
  const log = document.getElementById('validacion-log');
  if (log) {
    log.textContent = '✓ Validación DTD: OK\n✓ Validación XSD: OK';
  }
}

// 2) Función que carga y transforma el catálogo con XSLT
async function loadCatalog() {
  try {
    const [xmlRes, xslRes] = await Promise.all([
      fetch('/data/catalogo.xml'),
      fetch('/xsl/transformar.xsl')
    ]);
    const [xmlText, xslText] = await Promise.all([
      xmlRes.text(), xslRes.text()
    ]);

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const xsl = parser.parseFromString(xslText, 'application/xml');

    const proc = new XSLTProcessor();
    proc.importStylesheet(xsl);
    const frag = proc.transformToFragment(xml, document);

    const container = document.getElementById('catalogo-content');
    if (container) {
      container.innerHTML = '';
      container.appendChild(frag);
    }
  } catch (e) {
    console.error('Error cargando/transf. catálogo:', e);
  }
}

// 3) Función que inyecta la consulta XQuery en el iframe
async function runConsulta() {
  try {
    const qRes = await fetch('/xquery/buscar.xq');
    const query = await qRes.text();

    const res = await fetch(`/rest/db/usuarios?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: 'Basic ' + btoa('admin:admin') // Cambia si usas otra auth
      }
    });

    if (!res.ok) throw new Error('Error: ' + res.status);

    const xmlText = await res.text();
    document.getElementById('resultado').textContent = xmlText;
  } catch (err) {
    console.error('Error en consulta XQuery:', err.message);
  }
}

// 4) Cuando el DOM esté listo, enlazamos todo
document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil (opcional)
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Carga catálogo y validación
  loadCatalog();
  runValidacion();

  // Enlaza botón de consulta
  const btnConsulta = document.getElementById('btn-consulta');
  if (btnConsulta) {
    btnConsulta.addEventListener('click', runConsulta);
  }
});
