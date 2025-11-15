import PropTypes from 'prop-types';
import RequirementCard from './RequirementCard';

const ClusterCard = ({ cluster }) => (
  <article
    style={{
      border: '1px solid #d1d5db',
      borderRadius: 12,
      padding: '1rem',
      background: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}
  >
    <header style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ margin: 0 }}>{cluster.label}</h3>
        <small style={{ color: '#6b7280' }}>{cluster.id}</small>
      </div>
      <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
        <div>Impact: {(cluster.impactScore * 100).toFixed(0)}%</div>
        <div>Feasibility: {(cluster.feasibilityScore * 100).toFixed(0)}%</div>
      </div>
    </header>
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {cluster.requirements.map((requirement) => (
        <RequirementCard key={requirement.id} requirement={requirement} />
      ))}
    </div>
  </article>
);

ClusterCard.propTypes = {
  cluster: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    requirements: PropTypes.arrayOf(RequirementCard.propTypes.requirement).isRequired,
    impactScore: PropTypes.number.isRequired,
    feasibilityScore: PropTypes.number.isRequired
  }).isRequired
};

export default ClusterCard;