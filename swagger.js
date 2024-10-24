const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CatFlix API',
      version: '1.0.0',
      description: 'API documentation for CatFlix, an app featuring movies with cats!',
    },
    servers: [
      {
        url: 'http://localhost:8080', // Local development
      },
      {
        url: 'https://catflix-99a985e6fffa.herokuapp.com', // Heroku deployment
      },
    ],
  },
  apis: ['./index.js'],
};