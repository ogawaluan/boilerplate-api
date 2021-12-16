import Joi from 'joi';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';

export type PaginationObject = PaginationAwareObject;

export interface IQueryFilters {
  sort?: string;
  limit?: number;
  direction?: 'asc' | 'desc';
}

interface IRequest {
  query: SelectQueryBuilder<unknown>;
  filters: IQueryFilters;
  tableName: string;
}

export const paginateIt = async ({
  query,
  filters,
  tableName,
}: IRequest): Promise<PaginationObject> => {
  const { sort = 'createdAt', direction = 'asc', limit = 10 } = filters;

  const parsedDirection = direction.toUpperCase() as 'ASC' | 'DESC';

  return (
    query.addOrderBy(`${tableName}.${sort}`, parsedDirection) as any
  ).paginate(Number(limit));
};

export const paginationJoiObject = Joi.object({
  sort: Joi.string(),
  limit: Joi.number().min(1).max(1000),
  direction: Joi.string().valid('asc', 'desc'),
  page: Joi.number().min(1),
});
