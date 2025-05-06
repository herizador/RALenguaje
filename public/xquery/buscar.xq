(: Ejemplo: listar todos los usuarios :)
for $u in doc("catalogo.xml")/catalogo/producto
return
  <item>
    <id>{ $u/@id }</id>
    <nombre>{ $u/nombre/text() }</nombre>
    <stock>{ $u/stock/text() }</stock>
  </item>
