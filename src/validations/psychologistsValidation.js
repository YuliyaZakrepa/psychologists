import { Joi, Segments } from 'celebrate';
const FILTERS = [
  'show_all',
  'a_to_z',
  'z_to_a',
  'less_than_100',
  'greater_than_100',
  'popular',
  'not_popular',
];
export const getPsychologistsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    filter: Joi.string().valid(...FILTERS),
  }),
};

const firebaseKeyValidator = (value, helpers) => {
  return /[.#$[\]/]/.test(value) ? helpers.message('Invalid id format') : value;
};

export const getPsychologistByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().required().custom(firebaseKeyValidator),
  }),
};
