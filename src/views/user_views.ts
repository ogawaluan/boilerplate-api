import { userResizes } from '../helpers/storage/constants';
import User from '../models/User';
import { getUrlImages } from '../utils';
import { RolesConstants } from '../utils/constants';

export interface IUserView {
  id: string;
  name?: string;
  email?: string;
  role?: RolesConstants;
  images?: {
    large: string;
    original: string;
  } | null;
  facebookId?: string;
  facebookImage?: string;
  googleId?: string;
  googleImage?: string;
  appleId?: string;
  createdAt: Date;
}

interface IUserRelations {
  withRole?: boolean;
}

export const renderOne = (
  user: User,
  { withRole }: IUserRelations = {}
): IUserView => ({
  id: user.id,
  name: user.name,
  email: user.email,
  images: getUrlImages(userResizes, user.image),
  role: withRole ? user.role.name : undefined,
  facebookId: user.facebookId,
  facebookImage: user.facebookImage,
  googleId: user.googleId,
  googleImage: user.googleImage,
  appleId: user.appleId,
  createdAt: user.createdAt,
});

export const renderMany = (
  users: User[],
  relations?: IUserRelations
): IUserView[] => {
  return users.map(user => renderOne(user, relations));
};
