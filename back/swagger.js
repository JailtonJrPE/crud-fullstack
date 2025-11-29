var swaggerJsDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API CRUD com Express",
      version: "1.0.0",
      description: "Documentação da API do seu CRUD",
    },

    // 🔒 AUTENTICAÇÃO GLOBAL COM JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // 🔒 APLICAR EM TODAS AS ROTAS AUTOMATICAMENTE
    security: [
      {
        bearerAuth: [],
      },
    ],

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
