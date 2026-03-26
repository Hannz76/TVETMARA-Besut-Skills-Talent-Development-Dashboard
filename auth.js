import { Router } from 'express';
import { authenticateUser, getPublicLoginUsers } from './auth.model.js';

const router = Router();

router.get('/users', async (_req, res) => {
  try {
    const users = await getPublicLoginUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan kata laluan diperlukan.' });
  }

  try {
    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Email atau kata laluan tidak sah.' });
    }

    return res.json({
      message: 'Login berjaya.',
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
