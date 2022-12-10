const BaseScrapProvider = require("./BaseScrapProvider");
const links = require("../../config/scraper/topachat/links");
const puppeteer = require("puppeteer");
const {GPU, Scraping} = require("../../database/models/models");

class TopachatScrapProvider extends BaseScrapProvider {
    constructor() {
        super();
    }

    run() {
        this.checkIfIsProcessing();
        this.deleteAll();
        this.startProcessing();
        console.log("Scrapping Topachat : " + Object.keys(links).length + " links");
        const puppeteer = require("puppeteer");
        puppeteer.launch({ headless: true }).then(async browser => {
            const page = await browser.newPage();
            for (const key in links) {
                try {
                    await this.scrap(links[key], page);
                    this.scrappedNumber++;
                }catch (e) {
                    console.log(e.message);
                }
            }
            await browser.close();
            if (this.scrappedNumber === Object.keys(links).length) {
                console.log(" -> Success");
            }else {
                console.log(" -> Failed (" + this.scrappedNumber + "/" + Object.keys(links).length + ")");
            }
            this.stopProcessing();
        });
    }

    async scrap(link, puppeteerPage) {
        const { name, url } = link;
        await puppeteerPage.goto(url, {waitUntil: "networkidle2"});
        let items = await puppeteerPage.$$eval('.vue-recycle-scroller__item-view', classes => {
              return classes.map(c => {
                    return {
                        url: c.querySelector('.product-list__product').href,
                        name: c.querySelector('.pl-product__label').innerText,
                        price: c.querySelector('.offer-price__price').innerText,
                        availability: c.querySelector('.offer-stock').innerText,
                    };
              });
        });

        for (const item of items) {
            const gpu = new GPU({
                website: "topachat",
                ref: name,
                name: item.name,
                price: parseInt(item.price.replace("€", "")),
                availability: item.availability,
                url: item.url,
            });
            await gpu.save();
        }
    }

    async startProcessing() {
        const scraping = await Scraping.findOne({website: "topachat"});
        scraping.processing = true;
        await scraping.save();
    }

    async stopProcessing() {
        const scraping = await Scraping.findOne({website: "topachat"});
        scraping.processing = false;
        await scraping.save();
    }

    deleteAll() {
        GPU.deleteMany({website: this.name}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    async createProcessingInfoIfNoExist() {
        const scraping = await Scraping.findOne({website: "topachat"});
        if (!scraping) {
            const scraping = new Scraping({
                website: "topachat",
                processing: false,
            });
            await scraping.save();
        }
    }

    async checkIfIsProcessing() {
        await this.createProcessingInfoIfNoExist();
        const scraping = await Scraping.findOne({website: "topachat"});
        if (scraping.processing) {
            console.log("Topachat is already processing");
            return true;
        }
    }
}

module.exports = TopachatScrapProvider;