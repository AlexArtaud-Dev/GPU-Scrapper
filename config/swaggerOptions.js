const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Gpu Scrapping API",
            contact : {
                name: "Undefined"
            },
            version: "Alpha 1.0.0",
            servers: ["https://localhost:3000"]
        },
        basePath: "/api",
        paths : {},
        securityDefinitions: {
            Bearer: {
                in: "header",
                name: "Authorization",
                description: "This token is needed to use all the features of the API",
                required: true,
                type: "apiKey",
            }
        },
        tags: [
            {
                name: "User"
            }
        ],
    },
    apis: ["app.js", './routes/*.js']
};
module.exports = swaggerOptions;