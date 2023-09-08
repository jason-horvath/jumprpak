import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JwtRefreshToken } from '_models';
import { JwtPayload, JwtTokenSet } from '_models/Auth/auth.types';
import { JwtTokenSetResource } from '_http/response/resource.types';
import { DeleteResult, FindOneResult, InsertData, InsertDataKey, InsertDataValue, InsertResult } from '_models/model.types';

export async function createAndStoreJwtTokens(userId: number): Promise<JwtTokenSetResource> {
  const [accessToken, refreshToken] = createJwtTokens(userId);
  
  const tokenInsertData: InsertData = new Map<InsertDataKey, InsertDataValue>([
    ['user_id', userId],
    ['refresh_token', refreshToken]
  ]);

  const refreshTokenModel = new JwtRefreshToken();
  const deleteRefreshResult: DeleteResult | Error = await refreshTokenModel.deleteWhere('user_id', userId);

  if(deleteRefreshResult instanceof Error) {
    throw deleteRefreshResult;
  }

  const refreshInsertResult: InsertResult | Error = await refreshTokenModel.insert(tokenInsertData);

  if (refreshInsertResult instanceof Error) {
    throw refreshInsertResult;
  }

  return { 
    accessToken,
    refreshToken
  }
}

export function createJwtTokens(userId: number): JwtTokenSet {
  const payload = createJwtPayload(userId);

  const accessToken: string = jwt.sign(payload, getJwtAccessSecret(), { expiresIn: getJwtAccessExpiry() });
  const refreshToken: string = jwt.sign(payload, getJwtRefreshSecret(), { expiresIn: getJwtRefreshExpiry() });

  return [accessToken, refreshToken]
}

export function createJwtPayload(userId: number): JwtPayload {

  return {
    user: {
      id: userId
    }
  }
}

export async function getStoredRefreshToken(refreshToken: string): Promise<FindOneResult> {
  const storedRefreshToken = await new JwtRefreshToken().findActiveByField('refresh_token', refreshToken ?? '');

  if(storedRefreshToken instanceof Error) {
    throw storedRefreshToken;
  }

  return storedRefreshToken;
}

export function verifyAccessToken(accessToken: string): JwtPayload {
  const payload: string | jwt.JwtPayload = jwt.verify(accessToken, getJwtAccessSecret());

  if((typeof payload === 'string') || !('user' in payload)) {
    throw new Error('Access token payload is invalid type with missing require properties.');
  }

  return createJwtPayload(payload.user.id);
}

export function verifyAccessTokenFromRequest(req: Request): JwtPayload {
  const token = req.headers.authorization?.split(' ')[1] ?? '';

  return verifyAccessToken(token);
}

export async function verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
  const storedRefreshToken = await getStoredRefreshToken(refreshToken);
  const refreshTokenFound = Object.keys(storedRefreshToken).length > 0;

  if (!refreshTokenFound) {
    throw new Error('Refresh token does not exist, or is invalid.');
  }

  const payload: string | jwt.JwtPayload = jwt.verify(refreshToken, getJwtRefreshSecret());

  if ((typeof payload === 'string') || !('user' in payload) ) {
    throw new Error('Refresh token payload was returned as a string when it should be a JwtPayload.');
  }

  return createJwtPayload(payload.user.id);
}

export function jwtDecode(token: string) {
  const payload: string | jwt.JwtPayload | null = jwt.decode(token);
  console.log(payload);
  return payload as JwtPayload;
}

export function getJwtAccessExpiry(): string {
  const expiry = process.env.JWT_ACCESS_TOKEN_EXPIRY ?? '';

  if (expiry === '') {
    throw new Error('JWT Access expiry is not set. It must be set in the environment.');
  }

  return expiry;
}

export function getJwtRefreshExpiry(): string {
  const expiry = process.env.JWT_REFRESH_TOKEN_EXPIRY ?? '';

  if (expiry === '') {
    throw new Error('JWT Refresh expiry is not set. It must be set in the environment.');
  }

  return expiry;
}

export function getJwtAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET ?? '';
 
  if (secret === '') {
    throw new Error('JWT Access is not set. It must be set in the environment.');
  }

  return secret;
}

export function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_TOKEN_SECRET ?? '';

  if (secret === '') {
    throw new Error('JWT Refresh secret is not set. It must be set in the environment.');
  }

  return secret;
}
