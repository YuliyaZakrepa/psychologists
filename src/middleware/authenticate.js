import createHttpError from 'http-errors';
import { db } from '../db/connectFirebase.js';

export async function resolveUser(cookies) {
  const { sessionId, accessToken } = cookies;
  if (!sessionId || !accessToken) return null;

  const sessionSnap = await db.ref(`sessions/${sessionId}`).get();
  if (!sessionSnap.exists()) return null;

  const session = sessionSnap.val();
  if (session.accessToken !== accessToken) return null;
  if (session.accessTokenValidUntil < Date.now()) return null;

  const userSnap = await db.ref(`users/${session.userId}`).get();
  if (!userSnap.exists()) return null;

  const userData = userSnap.val();
  delete userData.password;

  return { id: userSnap.key, ...userData };
}

export async function authenticate(req, res, next) {
  const user = await resolveUser(req.cookies);
  if (!user) throw createHttpError(401, 'Unauthorized');
  req.user = user;
  next();
}

export async function optionalAuthenticate(req, res, next) {
  req.user = await resolveUser(req.cookies);
  next();
}
