const LogProvider = require("./LogProvider");
require('dotenv').config();

class MongooseProvider {
    constructor(DB_CONNECTION_STRING) {
        if (DB_CONNECTION_STRING == null) throw new Error("DB_CONNECTION_STRING needs to be set in .env file");
        this.mongoose = require("mongoose");
        this.config = require("../config/mongodb").dbConfig;
        this.DB_CONNECTION_STRING = DB_CONNECTION_STRING;
    }

    connect() {
        this.mongoose.connect(this.DB_CONNECTION_STRING, this.config);
        this.mongoose.Promise = global.Promise;
        this.mongoose.connection.on("connected", () => {
            LogProvider.log("Connected to Mongo Cluster (" + this.mongoose.connection.host + ")")
        });
    }
}

module.exports = MongooseProvider;