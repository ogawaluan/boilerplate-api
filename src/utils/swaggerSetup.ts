import swaggerJsdoc, { OAS3Definition } from 'swagger-jsdoc';
import { JsonObject } from 'swagger-ui-express';

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Boilerplate API',
    description:
      'Boilerplate for Node.js projects using Express.js with TypeScript and TypeORM',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local',
    },
    {
      url: 'https://boilerplate-api.herokuapp.com',
      description: 'Heroku',
    },
  ],
};

const openapiSpecification: JsonObject = swaggerJsdoc({
  swaggerDefinition,
  apis: ['./src/docs/*.docs.ts', './src/docs/**/*.docs.ts'],
});

export default openapiSpecification;
