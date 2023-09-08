import { Request, Response } from 'express';
import { ApiResponse } from '_http/response';
import { sendPasswordResetEmail, sendVerifyAccountEmail } from '_services/email/ses';
import {
  activateUserAccount,
  createNewUser,
  createPasswordResetToken,
  createVerifyAccountToken,
  getUserById,
  userPasswordReset,
} from '_services/data/account';
import { InsertResult } from '_models/model.types';
import { UserRecord } from '_models/Account/account.schema';
import { JwtTokenSetResource, SingleResource, UserResource } from '_http/response/resource.types';
import { AppRequest, HttpUser } from '_http/request/request.types';
import { createAndStoreJwtTokens } from '_services/data/auth';
import { accessLogEvent } from '_services/data/log';
import { AccessEventTypeKeys } from '_models/Log/access.types';

export async function login(req: AppRequest, res: Response) {
  const response = new ApiResponse();
  try {
    const userId: number | null = req?.user?.id ?? null;

    if (typeof userId !== 'number') {
      throw new Error('JWT Token can not be created for login without a valid user ID');
    }

    const tokenData: JwtTokenSetResource = await createAndStoreJwtTokens(userId);
    const accessEventKey = 'user_jwt_set_issued';
    response.setMessageFromKey(accessEventKey).setData(tokenData);
    await accessLogEvent(accessEventKey, req);

    return res.json(response.getBody());
  } catch (error: any) {
    res.status(500);
    console.error(error);

    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function passwordReset(req: AppRequest, res: Response) {
  const response = new ApiResponse();
  const { password, reset_token } = req.body;

  try {
    const passwordResetResult = await userPasswordReset(reset_token, password);

    if (!req.user) {
      const httpUser: HttpUser = { id: passwordResetResult.userId };
      req.user = httpUser;
    }

    const accessEventKey: AccessEventTypeKeys = 'password_reset_success';
    response.setMessageFromKey(accessEventKey).setData(passwordResetResult);
    await accessLogEvent(accessEventKey, req);

    return res.json(response.getBody());
  } catch (error) {
    res.status(500);
    const accessEventKey: AccessEventTypeKeys = 'password_reset_failure';
    response.setStatus(res.statusCode).setMessageFromKey(accessEventKey).setServerErrors(JSON.stringify(error));
    await accessLogEvent(accessEventKey, req);

    return res.json(response.getBody());
  }
}

export async function passwordResetExists(req: AppRequest, res: Response) {
  const respone = new ApiResponse();
  try {
    return res.json(respone.getBody());
  } catch (error: any) {
    res.status(500);
    console.error(error);

    respone.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(respone.getBody());
  }
}

export async function passwordResetRequest(req: AppRequest, res: Response) {
  const response = new ApiResponse();
  const { email } = req.body;

  try {
    const { userId, resetToken, tokenResult } = await createPasswordResetToken(email);

    if (!req.user) {
      const httpUser: HttpUser = { id: userId };
      req.user = httpUser;
    }

    const accessEventKey: AccessEventTypeKeys = 'password_reset_token_created';
    response.setMessageFromKey(accessEventKey).setData({ userId, tokenResult });
    await accessLogEvent(accessEventKey, req);

    const emailData = { title: `Reset your Password on ${process.env.APP_NAME}`, email, resetToken };
    await sendPasswordResetEmail(email, emailData);

    return res.json(response.getBody());
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setMessage(error.message).setServerErrors(JSON.stringify(error));

    return res.json(response.getBody());
  }
}

export async function register(req: AppRequest, res: Response) {
  const { password_confirm, ...userData } = req.body;
  const response = new ApiResponse();
  try {
    const newUserInsert: InsertResult | Error = await createNewUser(userData);

    if (newUserInsert instanceof Error) {
      res.status(500);
      response.setServerErrors(newUserInsert);

      throw newUserInsert;
    }

    const userId: number = newUserInsert.insertId;
    const [verifyToken, verifyTokenInsert]: [string, InsertResult | Error] = await createVerifyAccountToken(userId);
    const httpUser: HttpUser = { id: userId };

    if (!req.user) {
      req.user = httpUser;
    }

    if (verifyTokenInsert instanceof Error) {
      res.status(500);
      response.setServerErrors(verifyTokenInsert);

      throw verifyTokenInsert;
    }

    const accessEventKey = 'user_account_created';
    const userAccount: UserRecord = await getUserById(userId);
    const { firstname, lastname, email } = userAccount;
    const responseData: UserResource = {
      firstname,
      lastname,
      email,
    };

    response.setMessageFromKey(accessEventKey).setData(responseData);
    await accessLogEvent(accessEventKey, req);

    const emailData = { title: `Welcome to ${process.env.APP_NAME}`, firstname, lastname, email, verifyToken };
    await sendVerifyAccountEmail(email, emailData);

    return res.json(response.getBody());
  } catch (error) {
    response.setStatus(res.statusCode).setServerErrors(error);

    return res.json(response.getBody());
  }
}

export async function tokenRefresh(req: AppRequest, res: Response) {
  const response = new ApiResponse();
  try {
    const userId: number | null = req?.user?.id ?? null;

    if (typeof userId !== 'number') {
      throw new Error('JWT Token can not be created for refresh without a valid user ID');
    }

    const tokenData: JwtTokenSetResource = await createAndStoreJwtTokens(userId);
    const accessEventKey = 'user_jwt_refresh';
    response.setMessageFromKey(accessEventKey).setData(tokenData);

    await accessLogEvent(accessEventKey, req);

    return res.json(response.getBody());
  } catch (error: any) {
    res.status(500);
    console.error(error);

    response.setStatus(res.statusCode).setMessage('JWT Refresh Failure.').setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function verifyAccount(req: AppRequest, res: Response) {
  const response = new ApiResponse();
  const token = req.body.verify_token;

  try {
    const accountResult = await activateUserAccount(token);

    if (!req.user) {
      const httpUser: HttpUser = { id: accountResult.userId };
      req.user = httpUser;
    }

    const accessEventKey = 'user_account_verified';
    response.setMessageFromKey(accessEventKey).setData(accountResult as SingleResource);
    await accessLogEvent(accessEventKey, req);

    res.json(response.getBody());
  } catch (error: any) {
    res.status(500);
    console.error(error);
    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function testAuth(req: AppRequest, res: Response) {
  return res.json({ test: 'Testing auth' });
}
