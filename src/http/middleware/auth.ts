import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '_http/response';
import { getErroredRules } from '_services/validation';
import { getUserWithPasswordCheck } from '_services/data/account';
import { jwtDecode, verifyAccessTokenFromRequest, verifyRefreshToken } from '_services/data/auth';
import {
  emailRule,
  requiredRule,
  passwordRule,
  passwordConfirmRule,
  passwordResetTokenLengthRule,
  verifyTokenLengthRule,
} from '_services/validation/rules';
import {
  emailExistsRule,
  emailNotExistsRule,
  passwordResetTokenNotFoundRule,
  verifyAccountTokenNotFoundRule,
} from '_services/validation/rules.promise';
import { accessLogEvent } from '_services/data/log';
import { RuleResults } from '_services/validation/validation.types';
import { UserRecord } from '_models/Account/account.schema';
import { AccessEventTypeKeys } from '_models/Log/access.types';
import { AppRequest } from '_http/request/request.types';

export async function authenticateLogin(req: AppRequest, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { email, password } = req.body;
  let accessEventKey: AccessEventTypeKeys = 'user_login_attempt';

  try {
    const [user, passwordMatch]: [UserRecord, boolean] = await getUserWithPasswordCheck(email, password);
    const userFound: boolean = Object.keys(user).length > 0;
    req.user = { id: user?.id ?? null };

    if (userFound && !passwordMatch) {
      accessEventKey = 'user_login_failed';
    }

    if (userFound && passwordMatch) {
      accessEventKey = 'user_login_success';
    }

    await accessLogEvent(accessEventKey, req);

    if (accessEventKey !== 'user_login_success') {
      res.status(401);
      response.setStatus(res.statusCode).setMessageFromKey(accessEventKey);

      return res.json(response.getBody());
    }

    next();
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setServerErrors(error.message);
    return res.json(response.getBody());
  }
}

export async function validAccessToken(req: AppRequest, res: Response, next: NextFunction) {
  const response = new ApiResponse();

  try {
    const paylod = verifyAccessTokenFromRequest(req);
    req.user = paylod.user;

    next();
  } catch (error: any) {
    res.status(401);

    response.setStatus(res.statusCode).setMessage(error.message).setServerErrors(error);

    return res.json(response.getBody());
  }
}

export async function validPasswordReset(req: Request, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { password, password_confirm, reset_token } = req.body;

  try {
    const validation: RuleResults = new Map([
      ['password', [passwordRule(password, 'Password')]],
      ['password_confirm', [passwordConfirmRule(password_confirm, 'Password', { password })]],
      [
        'reset_token',
        [
          await passwordResetTokenNotFoundRule(reset_token, 'Password reset token'),
          passwordResetTokenLengthRule(reset_token, 'Password reset token'),
        ],
      ],
    ]);

    const validationErrors = getErroredRules(validation);

    if (validationErrors.size > 0) {
      const accessEventKey = 'invalid_password_reset_attempt';
      await accessLogEvent(accessEventKey, req);

      res.status(400);

      response.setStatus(res.statusCode).setMessageFromKey(accessEventKey).setValidationErrors(validationErrors);

      return res.json(response.getBody());
    }

    next();
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function resetTokenExists(req: Request, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { reset_token } = req.params;

  try {
    const validation: RuleResults = new Map([
      [
        'reset_token',
        [
          await passwordResetTokenNotFoundRule(reset_token, 'Password reset token'),
          passwordResetTokenLengthRule(reset_token, 'Password reset token'),
        ],
      ],
    ]);

    const validationErrors = getErroredRules(validation);

    if (validationErrors.size > 0) {
      const accessEventKey = 'invalid_password_reset_token';
      await accessLogEvent(accessEventKey, req);

      res.status(400);

      response.setStatus(res.statusCode).setMessageFromKey(accessEventKey).setValidationErrors(validationErrors);

      return res.json(response.getBody());
    }

    next();
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function validPasswordResetRequest(req: Request, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { email } = req.body;

  try {
    const validation: RuleResults = new Map([['email', [await emailNotExistsRule(email, 'Email Address')]]]);

    const validationErrors = getErroredRules(validation);

    if (validationErrors.size > 0) {
      res.status(400);
      let accessEventKey: AccessEventTypeKeys = 'invalid_password_reset_request';
      response.setStatus(res.statusCode).setMessageFromKey(accessEventKey).setValidationErrors(validationErrors);
      await accessLogEvent(accessEventKey, req);

      return res.json(response.getBody());
    }

    next();
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function validRefreshTokenRequest(req: AppRequest, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { refreshToken } = req.body;
  try {
    const payload = await verifyRefreshToken(refreshToken);
    const { user } = payload;

    req.user = user;
    next();
  } catch (error: any) {
    const payload = jwtDecode(refreshToken);
    req.user = payload?.user ?? { id: null };
    await accessLogEvent('user_jwt_refresh_invalid', req);

    res.status(401);
    response.setStatus(res.statusCode).setMessage(error.message).setServerErrors(error);

    return res.json(response.getBody());
  }
}

export async function validRegistration(req: Request, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { firstname, lastname, email, password, password_confirm } = req.body;

  try {
    const validation: RuleResults = new Map([
      ['firstname', [requiredRule(firstname, 'First Name')]],
      ['lastname', [requiredRule(lastname, 'Last Name')]],
      ['email', [await emailExistsRule(email, `Email Address: ${email}`), emailRule(email, 'Email Address')]],
      ['password', [passwordRule(password, 'Password')]],
      ['password_confirm', [passwordConfirmRule(password_confirm, 'Password', { password })]],
    ]);

    const validationErrors = getErroredRules(validation);

    if (validationErrors.size > 0) {
      res.status(400);

      response.setStatus(res.statusCode).setMessageFromKey('invalid_register_input').setValidationErrors(validationErrors);

      return res.json(response.getBody());
    }

    next();
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}

export async function validVerifyToken(req: Request, res: Response, next: NextFunction) {
  const response = new ApiResponse();
  const { verify_token } = req.body;
  try {
    const validation: RuleResults = new Map([
      [
        'token',
        [await verifyAccountTokenNotFoundRule(verify_token, 'Verify account token'), verifyTokenLengthRule(verify_token, 'Verify account token')],
      ],
    ]);

    const validationErrors = getErroredRules(validation);

    if (validationErrors.size > 0) {
      res.status(400);
      let accessEventKey: AccessEventTypeKeys = 'invalid_verify_account_token';
      response.setStatus(res.statusCode).setMessageFromKey(accessEventKey).setValidationErrors(validationErrors);
      await accessLogEvent(accessEventKey, req);

      return res.json(response.getBody());
    }

    next();
  } catch (error: any) {
    res.status(500);
    response.setStatus(res.statusCode).setServerErrors(error.message);

    return res.json(response.getBody());
  }
}
