import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function hashPassword(value: string): Promise<string> {
  const { BCRYPT_ROUNDS } = process.env;
  const salt = await bcrypt.genSalt(Number(BCRYPT_ROUNDS));
  const hash = await bcrypt.hash(value, salt);
  
  return hash;
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function createVerifyToken(): string {
  const { VERFIY_ACCOUNT_TOKEN_LENGTH } = process.env;

  return createByteLengthToken(Number(VERFIY_ACCOUNT_TOKEN_LENGTH));
}

export function createPasswordToken(): string {
  const { PASSWORD_RESET_TOKEN_LENGTH } = process.env;

  return createByteLengthToken(Number(PASSWORD_RESET_TOKEN_LENGTH));
}

export function createByteLengthToken(byteLength: number): string {
  return crypto.randomBytes(byteLength).toString('hex');
}
