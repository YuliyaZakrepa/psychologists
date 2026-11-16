import createHttpError from 'http-errors';
import { db } from '../db/connectFirebase.js';
import {
  createSession,
  deleteSessionsByUserId,
  setSessionCookies,
} from '../services/auth.js';
import bcrypt from 'bcrypt';

export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const snapshot = await db
    .ref('users')
    .orderByChild('email')
    .equalTo(email)
    .get();

  if (snapshot.exists()) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserRef = db.ref('users').push();

  await newUserRef.set({
    name,
    email,
    password: hashedPassword,
    createdAt: Date.now(),
  });

  const newSession = await createSession(newUserRef.key);
  setSessionCookies(res, newSession);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      id: newUserRef.key,
      name,
      email,
    },
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const snapshot = await db
    .ref('users')
    .orderByChild('email')
    .equalTo(email)
    .get();

  if (!snapshot.exists()) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const [id, user] = Object.entries(snapshot.val())[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await deleteSessionsByUserId(id);

  const newSession = await createSession(id);
  setSessionCookies(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function logoutUser(req, res) {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await db.ref(`sessions/${sessionId}`).remove();
  }

  const options = { httpOnly: true, secure: true, sameSite: 'none' };

  res.clearCookie('sessionId', options);
  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);

  res.status(204).send();
}

export async function refreshUserSession(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  const sessionRef = db.ref(`sessions/${sessionId}`);
  const snapshot = await sessionRef.get();

  if (!snapshot.exists() || snapshot.val().refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }

  const session = snapshot.val();

  if (session.refreshTokenValidUntil < Date.now()) {
    await sessionRef.remove();
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw createHttpError(401, 'Session token expired');
  }

  await sessionRef.remove();

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Session refreshed',
  });
}
