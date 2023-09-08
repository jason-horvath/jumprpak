import mailTransport from '_config/email';
import SESTransport from 'nodemailer/lib/ses-transport';
import verifyAccountTpl, { verifyAccountTplData } from './templates/verifyAccountTpl';
import passwordResetTpl, { passwordResetTplData } from './templates/passwordResetTpl';

export async function sendPasswordResetEmail(to: string, data: passwordResetTplData): Promise<SESTransport.SentMessageInfo> {
  const { APP_NAME, AWS_MAIL_FROM_ADDRESS } = process.env;
  const email = await mailTransport.sendMail({
    from: AWS_MAIL_FROM_ADDRESS,
    to: to,
    subject: `Reset Password Request From ${APP_NAME}`,
    html: passwordResetTpl(data),
  });

  return email;
}

export async function sendVerifyAccountEmail(to: string, data: verifyAccountTplData): Promise<SESTransport.SentMessageInfo> {
  const { APP_NAME, AWS_MAIL_FROM_ADDRESS } = process.env;
  const email = await mailTransport.sendMail({
    from: AWS_MAIL_FROM_ADDRESS,
    to: to,
    subject: `Welcome to ${APP_NAME}!`,
    html: verifyAccountTpl(data),
  });

  return email;
}
