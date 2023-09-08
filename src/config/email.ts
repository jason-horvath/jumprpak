import { createTransport } from 'nodemailer';

const mailTransport = createTransport({
  host: process.env.AWS_MAIL_REGION ?? '',
  port: Number(process.env.AWS_MAIL_PORT),
  secure: process.env.AWS_MAIL_USER_SECURE === 'true',
  auth: {
    user: process.env.AWS_MAIL_KEY,
    pass: process.env.AWS_MAIL_SECRET
  }  
});

export default mailTransport;
