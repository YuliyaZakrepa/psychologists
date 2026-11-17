import { Joi, Segments } from 'celebrate';

export const createAppointmentSchema = {
  [Segments.BODY]: Joi.object({
    psychologistId: Joi.string().required(),
    name: Joi.string().trim().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone must look like +380XXXXXXXXX',
      }),
    time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):(00|30)$/)
      .required()
      .messages({ 'string.pattern.base': 'Time must be HH:00 or HH:30' }),
    email: Joi.string().trim().email().required(),
    comment: Joi.string().trim().max(500).allow('').default(''),
  }),
};
