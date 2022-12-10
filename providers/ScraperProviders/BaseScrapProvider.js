
class BaseScrapProvider {
    constructor() {
        this.scrappedNumber = 0;
    }

    run() {
        throw new Error("Method not implemented.");
    }

    scrap() {
        throw new Error("Method not implemented.");
    }
}

module.exports = BaseScrapProvider;