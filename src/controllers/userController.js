export async function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(200).json({ status: 200, data: null });
  }

  const { id, name, email } = req.user;

  res.status(200).json({
    status: 200,
    message: 'Successfully got current user!',
    data: { id, name, email },
  });
}
