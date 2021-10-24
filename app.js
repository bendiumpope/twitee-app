import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitizer from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cors from 'cors';
import HttpError from './utils/http-error';
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, Please try again in an hour!'
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitizer());

app.use(xss());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use(cors());


app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter);



app.all('*', (req, res, next) => {
    const error = new HttpError(`Cant find ${req.originalUrl} on this server!`, 404);
    
    throw error;
});

app.use((error, req, res, next) => {

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || "An unknown error occured",
  });
});

export default app;