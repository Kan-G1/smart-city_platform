import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? ''
});

const unwrap = (response) => response?.data ?? response;

export const submitRequirement = (text, stakeholderRole) =>
  client.post('/api/requirements', { text, stakeholderRole });

export const getClusters = async () => unwrap(await client.get('/api/clusters'));

export const getPrioritization = async () => unwrap(await client.get('/api/prioritize'));

export const getVisualModel = async () => unwrap(await client.get('/api/visual-model'));

export const getRequirements = async () => unwrap(await client.get('/api/requirements'));
