const BaseScrapProvider = require("./BaseScrapProvider");
const links = require("../../config/scraper/topachat/links");
const {GPU} = require("../../database/models/models");

class TopachatScrapProvider extends BaseScrapProvider {
    constructor() {
        super("topachat");
    }

    run() {
        this.checkIfIsProcessing();
        this.deleteAll();
        this.startProcessing();
        console.log("Scrapping Topachat : " + Object.keys(links).length + " links");
        const puppeteer = require("puppeteer");
        puppeteer.launch({ headless: true, args: ["--no-sandbox"] }).then(async browser => {
            const page = await browser.newPage();
            const failedLinks = [];
            for (const key in links) {
                try {
                    await this.scrap(links[key], page);
                    this.scrappedNumber++;
                }catch (e) {
                    failedLinks.push(links[key]);
                    console.log(e.message);
                }
            }
            await browser.close();
            if (this.scrappedNumber === Object.keys(links).length) {
                console.log(" -> Success");
            }else {
                console.log(" -> Failed (" + this.scrappedNumber + "/" + Object.keys(links).length + ")");
                console.log(" -> Failed links : ");
                for (const failedLink of failedLinks) {
                    console.log(" -> " + failedLink.name + " : " + failedLink.url);
                }
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
                website: this.webSite,
                ref: name,
                name: item.name,
                price: parseInt(item.price.replace("€", "")),
                availability: item.availability,
                url: item.url,
            });
            await gpu.save();
        }
    }


}

module.exports = TopachatScrapProvider;