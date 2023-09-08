import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PasswordResetToken, User, VerifyAccountToken } from '_models';
import { DeleteResult, InsertData, FindOneResult, InsertResult, UpdateResult } from '_models/model.types';
import { NewUserData, UserRecord, VerifyAccountTokenRecord } from '_models/Account/account.schema';
import { objectToInsertData } from '_utility/conversion';
import { createPasswordToken, hashPassword } from '_utility/hash';
import { ResultSetHeader } from 'mysql2';

export async function createNewUser(data: NewUserData): Promise<InsertResult | Error> {
  const userModel = new User();
  const { password } = data;

  data.password = await hashPassword(password);
  const insertData: InsertData = objectToInsertData(data);

  return await userModel.insert(insertData);
}

export async function createPasswordResetToken(email: string): Promise<{ userId: number; resetToken: string; tokenResult: ResultSetHeader }> {
  const userModel = new User();
  const userRecord: UserRecord | Error = await userModel.findByEmail(email);

  if (userRecord instanceof Error) {
    throw userRecord;
  }

  if (Object.keys(userRecord).length === 0) {
    throw new Error('User record not found, which is required to create a password reset token.');
  }

  const passwordTokenModel = new PasswordResetToken();
  const user_id = userRecord.id ?? 0;
  const deletPriorTokenResult: DeleteResult | Error = await passwordTokenModel.deleteWhere('user_id', user_id);

  if (deletPriorTokenResult instanceof Error) {
    throw deletPriorTokenResult;
  }

  const passwordResetToken = createPasswordToken();
  const resetTokenData: InsertData = objectToInsertData({
    user_id,
    reset_token: passwordResetToken,
  });

  const insertTokenResult = await passwordTokenModel.insert(resetTokenData);

  if (insertTokenResult instanceof Error) {
    throw insertTokenResult;
  }

  return {
    userId: user_id,
    resetToken: passwordResetToken,
    tokenResult: insertTokenResult,
  };
}

export async function createVerifyAccountToken(userId: number): Promise<[string, InsertResult | Error]> {
  const { VERFIY_ACCOUNT_TOKEN_LENGTH } = process.env;
  const token = crypto.randomBytes(Number(VERFIY_ACCOUNT_TOKEN_LENGTH)).toString('hex');
  const tokenModel = new VerifyAccountToken();

  const tokenData: InsertData = objectToInsertData({
    user_id: userId,
    verify_token: token,
  });
  const tokenInsert = await tokenModel.insert(tokenData);
  return [token, tokenInsert];
}

export async function getUserByEmail(email: string): Promise<UserRecord> {
  const userRecord: UserRecord | Error = await new User().findByEmail(email);

  if (userRecord instanceof Error) {
    throw userRecord;
  }

  return userRecord;
}

export async function getUserWithPasswordCheck(email: string, password: string): Promise<[UserRecord, boolean]> {
  const user: UserRecord | Error = await new User().findActiveByEmail(email);

  if (user instanceof Error) {
    throw user;
  }
  const hashedPassword = user?.password ?? '';
  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  return [user, passwordMatch];
}

export async function getUserById(id: number): Promise<UserRecord> {
  const userRecord: FindOneResult | Error = await new User().findById(id);

  if (userRecord instanceof Error) {
    throw userRecord;
  }

  return userRecord as UserRecord;
}

export async function activateUserAccount(token: string): Promise<{ userId: number; userUpdate: ResultSetHeader; tokenDelete: ResultSetHeader }> {
  const tokenModel = new VerifyAccountToken();
  const tokenRow: FindOneResult | Error = await tokenModel.findFirstByField('verify_token', token);

  if (tokenRow instanceof Error) {
    throw tokenRow;
  }

  const { user_id } = tokenRow as VerifyAccountTokenRecord;
  const userModel = new User();
  const userRow: FindOneResult | Error = await userModel.findById(user_id);

  if (userRow instanceof Error) {
    throw userRow;
  }

  if (userRow.length === 0) {
    throw new Error('User not found after finding verify token.');
  }
  const userUpdate = await userModel.activate(user_id);

  if (userUpdate instanceof Error) {
    throw userUpdate;
  }

  const tokenDelete = await tokenModel.deleteById(tokenRow.id);

  if (tokenDelete instanceof Error) {
    throw tokenDelete;
  }

  return {
    userId: user_id,
    userUpdate: userUpdate,
    tokenDelete: tokenDelete,
  };
}

export async function userPasswordReset(reset_token: string, password: string): Promise<{ userId: number; updateResult: UpdateResult }> {
  const passwordResetModel = new PasswordResetToken();
  const tokenRecord: FindOneResult | Error = await passwordResetModel.findbyActiveToken(reset_token);

  if (tokenRecord instanceof Error) {
    throw tokenRecord;
  }

  const { user_id } = tokenRecord;
  const deleteTokenResult: DeleteResult | Error = await passwordResetModel.deleteById(tokenRecord.id);

  if (deleteTokenResult instanceof Error) {
    throw deleteTokenResult;
  }

  const newPassword = await hashPassword(password);

  const updatePasswordResult: UpdateResult | Error = await new User().updateFieldById(user_id, 'password', newPassword);

  if (updatePasswordResult instanceof Error) {
    throw updatePasswordResult;
  }

  return {
    userId: user_id,
    updateResult: updatePasswordResult,
  };
}
