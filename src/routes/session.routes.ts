import { Router } from 'express';
import Joi from 'joi';
import multer from 'multer';

import { multerConfig } from '../config/upload';
import { sessionController } from '../controllers';
import { validateRouteData } from '../middlewares';

const sessionRoutes = Router();
const upload = multer(multerConfig);

sessionRoutes.post(
  '/login',
  validateRouteData({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  sessionController.login
);

sessionRoutes.post(
  '/login-facebook',
  validateRouteData({
    body: Joi.object({
      facebookId: Joi.string().required(),
      name: Joi.string(),
      email: Joi.string().email(),
      facebookImage: Joi.string(),
    }),
  }),
  sessionController.facebookLogin
);

sessionRoutes.post(
  '/login-google',
  validateRouteData({
    body: Joi.object({
      googleId: Joi.string().required(),
      name: Joi.string(),
      email: Joi.string().email(),
      googleImage: Joi.string(),
    }),
  }),
  sessionController.googleLogin
);

sessionRoutes.post(
  '/login-apple',
  validateRouteData({
    body: Joi.object({
      appleToken: Joi.string().required(),
      name: Joi.string(),
      email: Joi.string().email(),
    }),
  }),
  sessionController.appleLogin
);

sessionRoutes.post(
  '/forgot-password',
  validateRouteData({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),
  sessionController.sendForgotPassword
);

sessionRoutes.post(
  '/register',
  upload.single('image'),
  validateRouteData({
    body: Joi.object({
      name: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  sessionController.register
);

export default sessionRoutes;
