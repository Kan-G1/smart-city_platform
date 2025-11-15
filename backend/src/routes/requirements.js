import { Router } from 'express';
import Requirement from '../models/Requirement.js';

const router = Router();

router.post('/', async (req, res) => {
  const { text, stakeholderRole } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }
  const r = await Requirement.create({ text, stakeholderRole });
  res.json({ ok: true, id: r._id });
});

router.get('/', async (_req, res) => {
  const items = await Requirement.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

export default router;