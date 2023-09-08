import { UserRecord } from '_models/Account/account.schema'
;
export type SingleResource = {}

export type MultiResource = Object[];

export type UserResource = SingleResource & Partial<UserRecord>;

export type JwtTokenSetResource = {
  accessToken: string,
  refreshToken: string
}
