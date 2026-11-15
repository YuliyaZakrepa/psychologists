import { db } from '../db/connectFirebase.js';
import createHttpError from 'http-errors';

export async function getAllPsychologists(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const perPage = 3;
  const filter = req.query.filter || 'show_all';

  const snapshot = await db.ref('psychologists').get();

  let all = Object.entries(snapshot.val() ?? {})
    .filter(([, value]) => value)
    .map(([id, value]) => ({ id, ...value }));

  switch (filter) {
    case 'a_to_z':
      all.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'z_to_a':
      all.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'less_than_10':
      all = all.filter((p) => p.price_per_hour < 10);
      break;
    case 'greater_than_10':
      all = all.filter((p) => p.price_per_hour >= 10);
      break;
    case 'popular':
      all.sort((a, b) => b.rating - a.rating);
      break;
    case 'not_popular':
      all.sort((a, b) => a.rating - b.rating);
      break;
    case 'show_all':
    default:
      break;
  }

  const totalItems = all.length;
  const start = (page - 1) * perPage;
  const totalPages = Math.ceil(totalItems / perPage);
  const psychologists = all.slice(start, start + perPage);

  res
    .status(200)
    .json({ page, perPage, totalItems, totalPages, psychologists });
}

export async function getPsychologistsById(req, res) {
  const { id } = req.params;
  const snapshot = await db.ref(`psychologists/${id}`).get();

  if (!snapshot.exists()) {
    throw createHttpError(404, 'Psychologist not found');
  }

  res.status(200).json({ id, ...snapshot.val() });
}
