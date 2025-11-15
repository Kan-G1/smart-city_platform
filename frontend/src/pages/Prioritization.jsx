import { useEffect, useMemo, useState } from 'react';
import { getPrioritization } from '../api/api';

const categories = [
  { key: 'must', label: 'Must Have', color: '#dc2626' },
  { key: 'should', label: 'Should Have', color: '#ea580c' },
  { key: 'could', label: 'Could Have', color: '#16a34a' },
  { key: 'wont', label: "Won't Have", color: '#475569' }
];

const Prioritization = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const payload = await getPrioritization();
        if (!isMounted) return;
        setData(payload ?? {});
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load prioritization data.');
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

  const grouped = useMemo(() => {
    if (Array.isArray(data)) {
      return data.reduce(
        (acc, item) => {
          const bucket = (item.moscow ?? item.category ?? '').toLowerCase();
          if (acc[bucket]) {
            acc[bucket].push(item);
          } else {
            acc.could.push(item);
          }
          return acc;
        },
        { must: [], should: [], could: [], wont: [] }
      );
    }

    return {
      must: data.must ?? [],
      should: data.should ?? [],
      could: data.could ?? [],
      wont: data.wont ?? data['wont-have'] ?? []
    };
  }, [data]);

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <header>
        <h2>Prioritization board</h2>
        <p style={{ color: '#4b5563' }}>MoSCoW model reflecting the latest backlog grooming session.</p>
      </header>
      {isLoading && <p>Loading prioritization data...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!isLoading && !error && (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
          }}
        >
          {categories.map((category) => (
            <article
              key={category.key}
              style={{
                borderRadius: 12,
                border: `1px solid ${category.color}`,
                padding: '1rem',
                background: '#fff',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{category.label}</h3>
                <small style={{ color: '#6b7280' }}>{grouped[category.key]?.length ?? 0} items</small>
              </div>
              <div style={{ display: 'grid', gap: '0.6rem', flexGrow: 1 }}>
                {(grouped[category.key] ?? []).length === 0 && (
                  <p style={{ color: '#94a3b8', margin: 0 }}>No items in this lane.</p>
                )}
                {(grouped[category.key] ?? []).map((item) => (
                  <div
                    key={item.id ?? item.title ?? item.name}
                    style={{
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      padding: '0.65rem'
                    }}
                  >
                    <strong>{item.title ?? item.name ?? 'Untitled requirement'}</strong>
                    <p style={{ margin: '0.35rem 0 0', color: '#475569' }}>
                      {item.description ?? item.summary ?? 'No context provided.'}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Prioritization;
