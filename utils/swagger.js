const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Core Banking API',
            version: '1.0.0',
            description: 'Tài liệu hướng dẫn sử dụng hệ thống ngân hàng thu nhỏ',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Local server'
            },
        ],
    },
    apis: ['./docs/*.yaml'], 
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📄 Swagger Docs available at http://localhost:8080/api-docs');
};

module.exports = setupSwagger;