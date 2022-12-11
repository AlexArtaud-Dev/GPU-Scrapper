const { routeConfig } = require('../config/routes');
const cors = require('cors');
const https = require('https')
const open = require('open');
const ts = new Date();
const fs = require('fs');
const express = require("express");
const SwaggerProvider = require("./SwaggerProvider");
const LogProvider = require("./LogProvider");

class RouteProvider {
    constructor(port = 3000, openInBrowser = false, serverKeyPath, serverCertPath) {
        this.port = port;
        this.openInBrowser = openInBrowser;
        this.serverKeyPath = serverKeyPath;
        this.serverCertPath = serverCertPath;
        this.app = express();
        this.swagger = new SwaggerProvider(this.app);
        this.app.use(express.json());
        this.app.use(cors({ origin: '*' }));
    }


    loadRoutes(stackTrace = false) {
      let loadedRoutes = 0;
      if (stackTrace) LogProvider.log("Loading routes (" + this.countRoutes() + ")");
        for (const route in routeConfig) {
            if (stackTrace) LogProvider.log("Loading route: " + route + " ...");
            try {
              const {routeUrlPath, filePath} = routeConfig[route];
              const routeFile = require(filePath);
              this.app.use(routeUrlPath, routeFile);
              if (stackTrace) LogProvider.log("Loaded !");
              loadedRoutes++;
            }catch (e) {
              if (stackTrace) LogProvider.log("Failed !");
            }
        }
      if (stackTrace) LogProvider.log(loadedRoutes + " routes loaded !");
      else console.clear();
    }

    startsServer() {
      const port = this.port;
      // run the server using http
        this.app.listen(port, function () {
            LogProvider.log(`App listening on port ${port}! Go to https://localhost:${port}/v1/swagger`)
                if (this.openInBrowser) open(`https://localhost:${port}/v1/swagger`, {app: 'firefox'});
            })

        // https.createServer({
        //   key: fs.readFileSync(this.serverKeyPath),
        //   cert: fs.readFileSync(this.serverCertPath)
        // }, this.app)
        //     .listen(port, function () {
        //       console.log(`${ts.toLocaleString()} - App listening on port ${port}! Go to https://localhost:${port}/v1/swagger`)
        //       if (this.openInBrowser) open(`https://localhost:${port}/v1/swagger`, {app: 'firefox'});
        // })
    }

    countRoutes() {
        return Object.keys(routeConfig).length;
    }
}

module.exports = RouteProvider;