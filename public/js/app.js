(async ()=>{
  // Carga y transforma el XML con XSLT:
  const [xml, xsl] = await Promise.all([
    fetch('data/catalogo.xml').then(r=>r.text()),
    fetch('xsl/transformar.xsl').then(r=>r.text())
  ]);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml,'application/xml');
  const xslDoc = parser.parseFromString(xsl,'application/xml');
  const proc = new XSLTProcessor();
  proc.importStylesheet(xslDoc);
  document.getElementById('content')
          .appendChild(proc.transformToFragment(xmlDoc, document));

  // Ejemplo de llamada XQuery a BaseX (ajusta la URL después del deploy):
  /*
  const res = await fetch('https://<tu-baseurl>/rest/basex/xquery/buscar.xq');
  const text = await res.text();
  console.log(text);
  */
})();
