import { useEffect, useState } from 'react';
import Mermaid from 'react-mermaid2';
import { getVisualModel } from '../api/api';

const fallbackDiagram = `graph TD
  Goal[Improve Urban Resilience]
  Goal -->|Identify| Hazard[Hazard Monitoring]
  Goal -->|Optimize| Mobility[Smart Mobility]
  Hazard --> Sensor[Deploy sensors]
  Hazard --> Alerts[Real-time alerts]
  Mobility --> Data[Integrate data sources]
  Mobility --> Policy[Update policies]`;

const Visualization = () => {
  const [diagram, setDiagram] = useState(fallbackDiagram);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const payload = await getVisualModel();
        if (!isMounted) return;
        const nextDiagram = payload?.diagram ?? payload?.model ?? fallbackDiagram;
        setDiagram(nextDiagram);
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load visual model.');
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
    <section style={{ display: 'grid', gap: '1rem' }}>
      <header>
        <h2>KAOS diagram</h2>
        <p style={{ color: '#4b5563' }}>This view renders the backend-provided Mermaid definition.</p>
      </header>
      {isLoading && <p>Loading visualization...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!isLoading && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid #e5e7eb' }}>
          <Mermaid chart={diagram} />
        </div>
      )}
    </section>
  );
};

export default Visualization;
