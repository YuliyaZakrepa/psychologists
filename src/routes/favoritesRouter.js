import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js';

const router = Router();

router.use('/favorites', authenticate);
router.get('/favorites', getFavorites);
router.post('/favorites/:psychologistId', addFavorite);
router.delete('/favorites/:psychologistId', removeFavorite);

export default router;
