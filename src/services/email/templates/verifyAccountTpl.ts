import headerTpl, { headerTplData } from './common/headerTpl';
import footerTpl, { footerTplData } from './common/footerTpl';

export type verifyAccountTplData = {
  firstname: string;
  lastname: string;
  verifyToken: string;
} & headerTplData &
  footerTplData;

export default function verifyAccountTpl(data: verifyAccountTplData) {
  const { APP_NAME, APP_FRONTEND_URL } = process.env;
  const { firstname, verifyToken } = data;
  const header = headerTpl(data);
  const footer = footerTpl(data);

  return `
    ${header}
    <h1>Welcome to ${APP_NAME}, ${firstname}</h1>
    <p>Thank you for signing up, your account has been created! But before you can log in, you will have to verify your account.</p>
    <a style="background-color: #0099FF: 10px; display: block; margin: 0 auto;" href="${APP_FRONTEND_URL}/auth/verify/account/${verifyToken}">Verify Account</a>
    ${footer}
  `;
}
