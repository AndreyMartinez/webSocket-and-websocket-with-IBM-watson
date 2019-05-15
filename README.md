
# Desplegando el proyecto  Perichat Watson



1. __Tecnologias__: 
     * Node
     


2. __Repositorio__: 
     * https://periferiaitgrouptfs.visualstudio.com/AMWAY/_git/AmwayWebAdministrator

3.  __Descargando las dependencias del proyecto__:  
~~~~
npm install
~~~~


4.  __Correr el proyecto__:  
~~~~
npm start 
~~~~

5. __Ir al navegador correr en puerto__: localhost:3000

6. __Desplegar temporalmente__:

~~~~
docker exec -ti amwayWildfly bash

/opt/jboss/wildfly/welcome-content

mv static /opt/jboss/wildfly/welcome-content
mv asset-manifest.json /opt/jboss/wildfly/welcome-content
mv index.html /opt/jboss/wildfly/welcome-content
mv precache-manifest.e87f7c696513108f45439bfc9cda68c1.js /opt/jboss/wildfly/welcome-content
mv service-worker.js /opt/jboss/wildfly/welcome-content
~~~~

