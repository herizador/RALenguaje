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

async function runConsulta() {
  const frame = document.getElementById('consulta-frame');
  // Carga la consulta XQuery
  const qRes = await fetch('/xquery/buscar.xq');
  const query = await qRes.text();
  // Monta la URL escapando el query
  const url = `/rest/db/usuarios?query=${encodeURIComponent(query)}`;
  frame.src = url;      // el navegador carga el contenido sin CORS
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
