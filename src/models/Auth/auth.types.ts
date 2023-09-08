export type JwtPayload = {
  user?: JwtPayloadUser;
}

export type JwtPayloadUser = {
  id: number
}

export type JwtTokenSet = [accessToken: string, refreshToken: string]
