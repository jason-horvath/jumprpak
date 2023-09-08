import { Router } from 'express';
import {
  login,
  passwordReset,
  passwordResetExists,
  passwordResetRequest,
  register,
  tokenRefresh,
  verifyAccount,
  testAuth,
} from '_http/controllers/auth';
import {
  authenticateLogin,
  resetTokenExists,
  validAccessToken,
  validPasswordReset,
  validPasswordResetRequest,
  validRefreshTokenRequest,
  validRegistration,
  validVerifyToken,
} from '_http/middleware/auth';

const authRouter = Router();

authRouter.post('/login', authenticateLogin, login);
authRouter.post('/register', validRegistration, register);
authRouter.post('/token/refresh', validRefreshTokenRequest, tokenRefresh);
authRouter.post('/password/reset', validPasswordReset, passwordReset);
authRouter.head('/password/reset/:reset_token', resetTokenExists, passwordResetExists);
authRouter.post('/password/reset/request', validPasswordResetRequest, passwordResetRequest);
authRouter.post('/verify/account', validVerifyToken, verifyAccount);
authRouter.get('/testauth', validAccessToken, testAuth);
export default authRouter;
