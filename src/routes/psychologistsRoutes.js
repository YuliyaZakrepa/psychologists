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

const router = Router();
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
