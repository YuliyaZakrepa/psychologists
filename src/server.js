import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import './db/connectFirebase.js';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(logger());
app.use(express.json());
app.use(cors());

app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is runnin on ${PORT}`);
});
