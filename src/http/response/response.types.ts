import { AccessMessage } from '_http/http.types';
import { SingleResource, MultiResource, JwtTokenSetResource } from './resource.types';

export type ResponseData = SingleResource | MultiResource | JwtTokenSetResource;

export type ResponseErrors = {
  validation?: ValidationErrors;
  server?: Object | string;
};

export type ValidationErrors = {
  count: number;
  fields: Object;
};

export type ResponseMeta =
  | {
      resource?: string;
      rows?: number;
      page?: number;
    }
  | SearchMeta;

export type SearchMeta = {
  current_page?: number;
  from?: number;
  last_page?: number;
  per_page?: number;
  to?: number;
  total?: number;
};

export type ApiResponseBody = {
  status: number;
  message: AccessMessage;
  data: SingleResource | MultiResource;
  errors?: ResponseErrors;
  meta?: ResponseMeta;
};
