import { Router } from 'express';
import Requirement from '../models/Requirement.js';
import { clusterTexts } from '../utils/nlpClient.js';

const router = Router();

router.get('/', async (_req, res) => {
  const reqs = await Requirement.find().sort({ createdAt: -1 }).lean();
  if (reqs.length === 0) {
    return res.json({ clusters: [], conflicts: [] });
  }

  const texts = reqs.map((r) => r.text ?? '');

  try {
    const result = await clusterTexts(texts);
    const {
      clusters: rawLabels = [],
      k = 0,
      cluster_labels: clusterLabels = [],
      cluster_keywords: clusterKeywords = [],
      cluster_polarity: clusterPolarity = [],
      conflicts = []
    } = result ?? {};

    const grouped = Array.from({ length: k }, (_, cid) => ({
      clusterId: cid,
      label: clusterLabels[cid] ?? `Cluster ${cid}`,
      keywords: clusterKeywords[cid] ?? [],
      polarity: clusterPolarity[cid] ?? 0,
      items: []
    }));

    reqs.forEach((item, idx) => {
      const cid = rawLabels[idx] ?? 0;
      if (!grouped[cid]) {
        grouped[cid] = {
          clusterId: cid,
          label: clusterLabels[cid] ?? `Cluster ${cid}`,
          keywords: clusterKeywords[cid] ?? [],
          polarity: clusterPolarity[cid] ?? 0,
          items: []
        };
      }
      grouped[cid].items.push(item);
    });

    res.json({
      clusters: grouped.filter(Boolean),
      conflicts
    });
  } catch (e) {
    res.json({
      clusters: [{ clusterId: 0, label: 'Cluster 0', keywords: [], polarity: 0, items: reqs }],
      conflicts: []
    });
  }
});

export default router;
