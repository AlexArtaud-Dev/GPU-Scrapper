const LogProvider = require("../providers/LogProvider");
module.exports = {
    runSpecificScrape (context) {
        switch (context) {
            case "topachat":
                const TopachatScrapProvider = require("../providers/ScraperProviders/TopachatScrapProvider");
                const topachatScrapProvider = new TopachatScrapProvider();
                topachatScrapProvider.checkIfIsProcessing().then((isProcessing) => {
                    if (!isProcessing) {
                        topachatScrapProvider.run();
                    }
                });
                break;
            default:
                LogProvider.log("No context provided");
                break;
        }
    },
    runAllScrapes () {
        const TopachatScrapProvider = require("../providers/ScraperProviders/TopachatScrapProvider");
        const topachatScrapProvider = new TopachatScrapProvider();
        topachatScrapProvider.checkIfIsProcessing().then((isProcessing) => {
            if (!isProcessing) topachatScrapProvider.run();
        });
    }
}