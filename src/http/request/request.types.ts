import { Request } from 'express';

export interface AppRequest extends Request {
  user?: HttpUser
}

export type HttpUser = {
  id: number | null
}
