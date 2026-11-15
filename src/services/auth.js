import crypto from 'crypto';
import { db } from '../db/connectFirebase.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export async function createSession(userId) {
  const sessionRef = db.ref('sessions').push();
  const session = {
    userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + ONE_DAY,
  };

  await sessionRef.set(session);
  return { id: sessionRef.key, ...session };
}

export async function deleteSessionsByUserId(userId) {
  const snapshot = await db
    .ref('sessions')
    .orderByChild('userId')
    .equalTo(userId)
    .get();

  if (!snapshot.exists()) return;

  const updates = {};
  Object.keys(snapshot.val()).forEach((key) => {
    updates[key] = null;
  });

  await db.ref('sessions').update(updates);
}

export function setSessionCookies(res, session) {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
}
