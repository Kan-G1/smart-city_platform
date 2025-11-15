import { Router } from 'express';
import Requirement from '../models/Requirement.js';

const router = Router();

router.get('/', async (_req, res) => {
  const reqs = await Requirement.find().limit(6).lean();
  const lines = [
    'graph TD',
    '  G[Goal: Improve Stakeholder Engagement]',
    ...reqs.map(
      (r, i) => `  G --> R${i}["${(r.text || '').replace(/"/g, "'").slice(0, 40)}"]`
    )
  ];
  const mermaid = lines.join('\n');
  res.json({ mermaid, diagram: mermaid });
});

export default router;
