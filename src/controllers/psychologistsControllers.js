import { db } from '../db/connectFirebase.js';

export async function getAllPsychologists(req, res) {
  const snapshot = await db.ref('psychologists').once('value');
  const data = snapshot.val() || [];
  const psychologists = Object.values(data).filter(Boolean);
  res.status(200).json(psychologists);
}
