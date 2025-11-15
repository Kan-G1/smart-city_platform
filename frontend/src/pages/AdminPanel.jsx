import { useEffect, useMemo, useState } from 'react';
import { getRequirements, getClusters } from '../api/api';

const Stat = ({ label, value, accent }) => (
  <div
    style={{
      borderRadius: 12,
      padding: '1rem',
      background: accent ?? '#fff',
      color: '#0f172a',
      boxShadow: accent ? 'none' : 'inset 0 0 0 1px #e2e8f0'
    }}
  >
    <div style={{ fontSize: '0.85rem', color: '#475569' }}>{label}</div>
    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</div>
  </div>
);

const AdminPanel = () => {
  const [requirements, setRequirements] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [reqs, cls] = await Promise.all([getRequirements(), getClusters()]);
        const reqList = Array.isArray(reqs?.items) ? reqs.items : Array.isArray(reqs) ? reqs : [];
        const clusterList = Array.isArray(cls?.clusters) ? cls.clusters : Array.isArray(cls) ? cls : [];
        setRequirements(reqList);
        setClusters(clusterList);
      } catch (err) {
        setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load admin snapshot.');
      }
    };
    load();
  }, []);

  const stats = useMemo(
    () => ({
      activeClusters: clusters.length,
      backlog: requirements.length,
      highPriority: requirements.filter((item) => (item.priority ?? '').toLowerCase() === 'high').length
    }),
    [clusters.length, requirements]
  );

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h2>Admin overview</h2>
        <p style={{ color: '#4b5563' }}>High level snapshot for facilitators and program managers.</p>
      </header>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <Stat label="Active clusters" value={stats.activeClusters} />
        <Stat label="Backlog" value={stats.backlog} />
        <Stat label="High priority" value={stats.highPriority} />
      </div>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      <div>
        <h3>Latest requirements</h3>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151' }}>
          {requirements.map((item) => (
            <li key={item.id ?? item.title ?? item.text} style={{ marginBottom: '0.5rem' }}>
              <strong>{item.title ?? item.text ?? 'Untitled requirement'}</strong> -{' '}
              {item.stakeholder ?? item.role ?? 'Unknown stakeholder'} - {item.priority ?? 'Unprioritized'}
            </li>
          ))}
          {requirements.length === 0 && <li>No submissions yet.</li>}
        </ol>
      </div>
    </section>
  );
};

export default AdminPanel;

