import createHttpError from 'http-errors';
import { db } from '../db/connectFirebase.js';
import { applyFilter, paginate } from '../utils/psychologistFilters.js';

const PER_PAGE = 3;

export async function getFavorites(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const filter = req.query.filter;
  const favSnap = await db.ref(`users/${req.user.id}/favorites`).get();
  let all = [];

  if (favSnap.exists()) {
    const snaps = await Promise.all(
      Object.keys(favSnap.val()).map((id) =>
        db.ref(`psychologists/${id}`).get(),
      ),
    );

    all = snaps
      .filter((s) => s.exists())
      .map((s) => ({ id: s.key, ...s.val() }));
  }
  const { items, ...pagination } = paginate(
    applyFilter(all, filter),
    page,
    PER_PAGE,
  );
  res.status(200).json({ status: 200, data: items, pagination });
}

export async function addFavorite(req, res) {
  const { psychologistId } = req.params;
  const exists = await db.ref(`psychologists/${psychologistId}`).get();
  if (!exists.exists()) {
    throw createHttpError(404, 'Psychologist not found');
  }
  await db.ref(`users/${req.user.id}/favorites/${psychologistId}`).set(true);
  res.status(200).json({ status: 200, message: 'Added to favorites' });
}

export async function removeFavorite(req, res) {
  const { psychologistId } = req.params;
  await db.ref(`users/${req.user.id}/favorites/${psychologistId}`).remove();
  res.status(204).send();
}
