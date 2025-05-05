(: Productos con stock < 100 :)
for $p in doc("data/catalogo.xml")/catalogo/producto
where $p/stock < 100
return 
  <item>
    <id>{ $p/@id }</id>
    <nombre>{ $p/nombre }</nombre>
    <stock>{ $p/stock }</stock>
  </item>

