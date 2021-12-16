import 'reflect-metadata';

import cors from 'cors';
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { pagination } from 'typeorm-pagination';
import 'express-async-errors';

import { NODE_ENV, SWAGGER } from './config/env';
import { uploadsFolder } from './config/upload';
import {
  clientErrorHandler,
  errorHandler,
  requestLimiter,
} from './middlewares';
import routes from './routes';
import { swaggerSetup, UserLanguage } from './utils';

class App {
  public readonly express: Application;

  constructor() {
    this.express = express();

    this.middlewares();
    this.setupServerResponsesLanguagePicker();
    this.setupSwagger();
    this.routes();
  }

  private middlewares = (): void => {
    this.express.disable('x-powered-by');
    this.express.use(express.json());
    this.express.use(cors({ origin: '*' }));
    this.express.use(pagination);
    this.express.use(requestLimiter);
  };

  private setupServerResponsesLanguagePicker = (): void => {
    this.express.use((request, _, next) => {
      UserLanguage.setLanguage(request.headers);
      next();
    });
  };

  private setupSwagger = (): void => {
    if (NODE_ENV !== 'production' || SWAGGER) {
      this.express.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSetup)
      );
    }
  };

  private routes = (): void => {
    this.express.use('/files', express.static(uploadsFolder));
    this.express.use(routes);
    this.express.use(errorHandler);
    this.express.use(clientErrorHandler);
  };
}

export default App;
