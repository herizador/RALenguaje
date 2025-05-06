FROM basex/basexhttp:latest

# Copiamos los datos XML
COPY public/data /opt/basex/data

# Copiamos el web.xml custom con CORS al WEB-INF de BaseX
COPY server/basex/web.xml /srv/basex/webapp/WEB-INF/web.xml

EXPOSE 8984 1984
