const {Scraping, GPU} = require("../../database/models/models");
const LogProvider = require("../LogProvider");

class BaseScrapProvider {
    constructor(website) {
        this.webSite = website;
        this.scrappedNumber = 0;
    }

    run() {
        throw new Error("Method not implemented.");
    }

    scrap() {
        throw new Error("Method not implemented.");
    }

    async startProcessing() {
        const scraping = await Scraping.findOne({website: this.webSite});
        scraping.processing = true;
        scraping.updatedAt = Date.now();
        await scraping.save();
    }

    async stopProcessing() {
        const scraping = await Scraping.findOne({website: this.webSite});
        scraping.processing = false;
        scraping.updatedAt = Date.now();
        await scraping.save();
    }

    deleteAll() {
        GPU.deleteMany({website: this.webSite}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    async createProcessingInfoIfNoExist() {
        const scraping = await Scraping.findOne({website: this.webSite});
        if (!scraping) {
            const scraping = new Scraping({
                website: this.webSite,
                processing: false,
            });
            await scraping.save();
        }
    }

    async checkIfIsProcessing() {
        await this.createProcessingInfoIfNoExist();
        const scraping = await Scraping.findOne({website: this.webSite});
        if (scraping.processing) {
            const now = new Date();
            const updatedAt = new Date(scraping.updatedAt);
            const diff = now.getTime() - updatedAt.getTime();
            const diffMinutes = Math.round(diff / 60000);
            if (diffMinutes > 30) {
                scraping.processing = false;
                await scraping.save();
                return false;
            }else {
                const webSiteName = this.webSite.charAt(0).toUpperCase() + this.webSite.slice(1);
                LogProvider.log(`${webSiteName} is already processing`);
                return true;
            }
        }
    }

}

module.exports = BaseScrapProvider;