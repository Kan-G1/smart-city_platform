import { Router } from 'express';
import Requirement from '../models/Requirement.js';

const router = Router();

function score(req, clusterSize = 1) {
  const roleWeights = { citizen: 1, govt: 1.2, admin: 1.1, other: 1 };
  return 0.6 * Math.min(clusterSize / 10, 1) + 0.4 * (roleWeights[req.stakeholderRole] || 1);
}

function labelFromScore(s) {
  if (s >= 0.75) return 'must';
  if (s >= 0.55) return 'should';
  if (s >= 0.35) return 'could';
  return 'wont';
}

router.get('/', async (_req, res) => {
  const reqs = await Requirement.find().lean();
  const counts = reqs.reduce((map, r) => {
    map[r.text] = (map[r.text] || 0) + 1;
    return map;
  }, {});
  const buckets = { must: [], should: [], could: [], wont: [] };

  reqs.forEach((r) => {
    const s = score(r, counts[r.text] || 1);
    buckets[labelFromScore(s)].push({ ...r, score: Number(s.toFixed(2)) });
  });

  res.json(buckets);
});

export default router;