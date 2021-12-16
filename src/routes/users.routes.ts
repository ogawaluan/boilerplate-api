import { Router } from 'express';
import Joi from 'joi';
import multer from 'multer';

import { multerConfig } from '../config/upload';
import { usersController } from '../controllers';
import { paginationHelper } from '../helpers';
import {
  ensureUserHasAdminRole,
  ensureSameUserOrHasAdminRole,
  validateRouteData,
} from '../middlewares';

const upload = multer(multerConfig);

const usersRoutes = Router();

usersRoutes.get('/me', usersController.showLoggedUser);

usersRoutes.get(
  '/',
  ensureUserHasAdminRole,
  validateRouteData({
    query: paginationHelper.paginationJoiObject,
  }),
  usersController.index
);

usersRoutes.put(
  '/:userId',
  upload.single('image'),
  ensureSameUserOrHasAdminRole,
  validateRouteData({
    params: Joi.object({
      userId: Joi.string().uuid().required(),
    }),
    body: Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().min(6),
    }),
  }),
  usersController.update
);

usersRoutes.delete(
  '/:userId',
  ensureSameUserOrHasAdminRole,
  validateRouteData({
    params: Joi.object({
      userId: Joi.string().uuid().required(),
    }),
  }),
  usersController.delete
);

usersRoutes.post(
  '/validate-credentials',
  validateRouteData({
    body: Joi.object({
      email: Joi.string().email(),
    }),
  }),
  usersController.validateCredentials
);

export default usersRoutes;
