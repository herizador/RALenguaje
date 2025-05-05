<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/catalogo">
    <html><body>
      <h1>Catálogo</h1>
      <ul>
        <xsl:for-each select="producto">
          <li>
            <xsl:value-of select="nombre"/> —
            <xsl:value-of select="precio"/> 
            <xsl:value-of select="precio/@moneda"/>
          </li>
        </xsl:for-each>
      </ul>
    </body></html>
  </xsl:template>
</xsl:stylesheet>
