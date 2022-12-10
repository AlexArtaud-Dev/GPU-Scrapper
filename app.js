const RouteProvider = require("./providers/RouteProvider");
const MongooseProvider = require("./providers/MongooseProvider");
const {runSpecificScrape, runAllScrapes} = require("./jobs/scrapeDaemon");
const serverKeyPath = "./SSL_Cert/server.key";
const serverCertPath = "./SSL_Cert/server.cert";
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
const openInBrowser = true;


try{
    const database = new MongooseProvider(DB_CONNECTION_STRING);
    const server = new RouteProvider(3000, openInBrowser, serverKeyPath, serverCertPath);
    database.connect();
    server.loadRoutes();
    server.startsServer();
}catch (e) {
    console.clear();
    console.log("----------------------------------------------------------")
    console.log("Error: " + e.message);
    console.log("----------------------------------------------------------")
}

setTimeout(() => {
    setInterval(() => {
        try {
            runAllScrapes();
        }catch (e) {
            console.log(e.message);
        }
    }, 1800000);
}, 5000)



