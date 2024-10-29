const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Catflix API',
            version: '1.0.0',
            description: 'API documentation for CatFlix, an app featuring movies with cats!'
        },
        tags: [
          {
            name: 'Movies',
            description: 'Operations related to movies',
          },
          {
            name: 'Cats',
            description: 'Operations related to cats',
          },
          {
            name: 'Users',
            description: 'Operations related to users',
          },
        ],
      },
      servers: [
        {
          url: 'http://localhost:8080',
        },
        {
          url: 'https://catflix-99a985e6fffa.herokuapp.com',
        },
      ],
    apis: ['./*.js'],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
