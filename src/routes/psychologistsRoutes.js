import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getPsychologistsSchema,
  getPsychologistByIdSchema,
} from '../validations/psychologistsValidation.js';
import {
  getAllPsychologists,
  getPsychologistsById,
} from '../controllers/psychologistsControllers.js';
import { optionalAuthenticate } from '../middleware/authenticate.js';
const router = Router();
router.use('/psychologists', optionalAuthenticate);
router.get(
  '/psychologists',
  celebrate(getPsychologistsSchema),
  getAllPsychologists,
);
router.get(
  '/psychologists/:id',
  celebrate(getPsychologistByIdSchema),
  getPsychologistsById,
);
export default router;
