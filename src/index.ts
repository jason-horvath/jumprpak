import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth';
import searchRouter from '_routes/search';

const { APP_FRONTEND_URL, APP_PORT, CORS_CREDENTIALS, CORS_METHODS, CORS_SUCCESS_STATUS } = process.env;
dotenv.config();
const port = APP_PORT ?? 3000;
const app = express();

const corsOptions = {
  origin: APP_FRONTEND_URL,
  methods: CORS_METHODS,
  credentials: Boolean(Number(CORS_CREDENTIALS)),
  optionsSuccessStatus: Number(CORS_SUCCESS_STATUS),
};

app.use(cors(corsOptions));

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/search', searchRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
