import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import authRoutes from './routes/authRoutes.js';
import psychologistRoutes from './routes/psychologistsRoutes.js';
import favoritesRouter from './routes/favoritesRouter.js';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(authRoutes);
app.use(psychologistRoutes);
app.use(favoritesRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
