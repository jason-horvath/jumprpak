import headerTpl, { headerTplData } from './common/headerTpl';
import footerTpl, { footerTplData } from './common/footerTpl';

export type passwordResetTplData = {
  email: string;
  resetToken: string;
} & headerTplData &
  footerTplData;

export default function passwordResetTpl(data: passwordResetTplData) {
  const { APP_NAME, APP_FRONTEND_URL } = process.env;
  const { email, resetToken } = data;
  const header = headerTpl(data);
  const footer = footerTpl(data);

  return `
    ${header}
    <h1>Reset your password ${APP_NAME}</h1>
    <p>A request was made to reset your password for this email address: ${email}.</p> <p>If this request was not made by you, please contact support as soon as possible</p>
    <p>Otherwise, here is a link to <a style="background-color: #0099FF: 10px; display: block; margin: 0 auto;" href="${APP_FRONTEND_URL}/auth/password/reset/${resetToken}">Reset Your Password</a></p>
    ${footer}
  `;
}
