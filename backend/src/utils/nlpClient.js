import axios from 'axios';

export async function clusterTexts(texts) {
  const base = process.env.NLP_SERVICE_URL || 'http://localhost:5001';
  if (!base) {
    return { clusters: [] };
  }
  try {
    const { data } = await axios.post(`${base}/cluster`, { data: texts });
    return data;
  } catch (error) {
    return { clusters: [] };
  }
}
