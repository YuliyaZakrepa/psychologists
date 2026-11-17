import createHttpError from 'http-errors';
import { db } from '../db/connectFirebase.js';

export async function createAppointment(req, res) {
  const { psychologistId, name, phone, time, email, comment } = req.body;

  const psychologistSnap = await db
    .ref(`psychologists/${psychologistId}`)
    .get();
  if (!psychologistSnap.exists()) {
    throw createHttpError(404, 'Psychologist not found');
  }

  const ref = db.ref('appointments').push();

  const appointment = {
    psychologistId,
    userId: req.user?.id ?? null,
    name,
    phone,
    time,
    email,
    comment,
    createdAt: Date.now(),
  };

  await ref.set(appointment);

  res.status(201).json({
    status: 201,
    message: 'Appointment created',
    data: { id: ref.key, ...appointment },
  });
}
