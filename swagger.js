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
      },
      servers: [
        {
          url: 'http://localhost:8080',
        },
        {
          url: 'https://catflix-99a985e6fffa.herokuapp.com',
        },
      ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./*.js'], 
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
