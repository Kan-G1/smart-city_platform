import PropTypes from 'prop-types';

const RequirementCard = ({ requirement }) => (
  <article
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      background: '#fff'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0 }}>{requirement.title}</h3>
      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{requirement.id}</span>
    </div>
    <p style={{ margin: 0, color: '#4b5563' }}>{requirement.description}</p>
    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#374151' }}>
      <span>Stakeholder: {requirement.stakeholder}</span>
      <span>Priority: {requirement.priority}</span>
      <span>Status: {requirement.status}</span>
    </div>
  </article>
);

RequirementCard.propTypes = {
  requirement: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    stakeholder: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string
  })
};

RequirementCard.defaultProps = {
  requirement: {
    id: 'REQ-000',
    title: 'Untitled',
    description: 'No description provided yet.',
    stakeholder: 'Unknown',
    priority: 'Low',
    status: 'Pending'
  }
};

export default RequirementCard;