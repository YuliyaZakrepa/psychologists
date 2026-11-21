import { Router } from 'express';
import { optionalAuthenticate } from '../middleware/authenticate.js';
import { getCurrentUser } from '../controllers/userController.js';

const router = Router();

router.get('/users/current', optionalAuthenticate, getCurrentUser);

export default router;
