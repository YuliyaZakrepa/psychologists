import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import authRoutes from './routes/authRoutes.js';
import psychologistRoutes from './routes/psychologistsRoutes.js';
import { errors } from 'celebrate';
import './db/connectFirebase.js';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(logger);
app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(psychologistRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
