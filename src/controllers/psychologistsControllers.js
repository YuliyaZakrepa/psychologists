import { db } from '../db/connectFirebase.js';
import createHttpError from 'http-errors';
import { applyFilter, paginate } from '../utils/psychologistFilters.js';

const PER_PAGE = 3;

export async function getAllPsychologists(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const filter = req.query.filter;
  const snapshot = await db.ref('psychologists').get();

  const all = Object.entries(snapshot.val() ?? {})
    .filter(([, value]) => value)
    .map(([id, value]) => ({ id, ...value }));

  const favorites = req.user?.favorites ?? {};

  const { items, ...pagination } = paginate(
    applyFilter(all, filter),
    page,
    PER_PAGE,
  );

  const data = items.map((p) => ({
    ...p,
    isFavorite: Boolean(favorites[p.id]),
  }));

  res.status(200).json({ status: 200, data, pagination });
}

export async function getPsychologistsById(req, res) {
  const { id } = req.params;
  const snapshot = await db.ref(`psychologists/${id}`).get();

  if (!snapshot.exists()) {
    throw createHttpError(404, 'Psychologist not found');
  }

  const psychologist = { id: snapshot.key, ...snapshot.val() };
  const favorites = req.user?.favorites ?? {};

  res.status(200).json({
    status: 200,
    data: { ...psychologist, isFavorite: Boolean(favorites[psychologist.id]) },
  });
}
