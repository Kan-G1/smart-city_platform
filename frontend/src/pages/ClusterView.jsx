import { useEffect, useState } from 'react';
import { getClusters } from '../api/api';

const ClusterView = () => {
  const [clusters, setClusters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getClusters();
        if (!isMounted) return;
        const list = Array.isArray(data?.clusters) ? data.clusters : Array.isArray(data) ? data : [];
        setClusters(list);
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load clusters.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <header style={{ marginBottom: '1rem' }}>
        <h2>Emerging requirement clusters</h2>
        <p style={{ color: '#4b5563' }}>Fetched directly from the clustering service.</p>
      </header>
      {isLoading && <p>Loading clusters...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!isLoading && !error && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {clusters.length === 0 && <p>No clusters available yet.</p>}
          {clusters.map((cluster, index) => {
            const name = cluster.name ?? cluster.label ?? `Cluster ${index + 1}`;
            const summary = cluster.description ?? cluster.summary ?? 'No description provided.';
            const items = cluster.requirements ?? cluster.items ?? cluster.members ?? [];

            return (
              <article
                key={cluster.id ?? name ?? index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '1rem',
                  background: '#fff',
                  display: 'grid',
                  gap: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0 }}>{name}</h3>
                  {cluster.score && (
                    <span style={{ color: '#475569', fontSize: '0.9rem' }}>Score: {cluster.score}</span>
                  )}
                </div>
                <p style={{ margin: 0, color: '#4b5563' }}>{summary}</p>
                {Array.isArray(items) && items.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151' }}>
                    {items.map((item) => (
                      <li key={item.id ?? item.title ?? item}>
                        {item.title ?? item.name ?? item}
                        {item.priority && <span style={{ color: '#6b7280' }}> - {item.priority}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ClusterView;



