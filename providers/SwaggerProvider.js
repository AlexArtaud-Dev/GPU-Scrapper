const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = require("../config/swaggerOptions");
const swaggerUI = require("swagger-ui-express");


class SwaggerProvider {
    constructor(expressApp) {
        const swaggerDocs = swaggerJsDoc(swaggerOptions);
        expressApp.use("/v1/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
    }
}

module.exports = SwaggerProvider;