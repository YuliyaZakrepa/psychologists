import { Router } from 'express';
import { celebrate } from 'celebrate';
import { optionalAuthenticate } from '../middleware/authenticate.js';
import { createAppointment } from '../controllers/appointmentsController.js';
import { createAppointmentSchema } from '../validations/appointmentsValidation.js';

const router = Router();

router.post(
  '/appointments',
  optionalAuthenticate,
  celebrate(createAppointmentSchema),
  createAppointment,
);

export default router;
