class LogProvider {
    static log(message) {
        console.log(new Date().toLocaleString() + " - " + message);
    }
}

module.exports = LogProvider;