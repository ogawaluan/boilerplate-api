import { PaginationObject } from '../helpers/pagination';

export interface IPaginationView {
  previous?: number | null;
  hasPrevious: boolean;
  current: number;
  next?: number | null;
  hasNext: boolean;
  total: number;
  limit: number;
  lastPage?: number | null;
  data: any;
}

export const render = (
  paginatedData: PaginationObject,
  viewRenderer: unknown
): IPaginationView => {
  const {
    prev_page: previous,
    current_page: current,
    next_page: next,
    per_page: limit,
    total,
    last_page: lastPage,
  } = paginatedData;

  return {
    previous,
    hasPrevious: previous !== null,
    current,
    next,
    hasNext: next !== null,
    total,
    limit,
    lastPage,
    data: viewRenderer,
  };
};
