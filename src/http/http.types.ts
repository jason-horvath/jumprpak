import { AccessEventTypeKeys } from '_models/Log/access.types';

export type AccessMessage = string;

export type AccessMessageKeys = AccessEventTypeKeys;

export type AccessMessages = Map<AccessMessageKeys, AccessMessage>;
