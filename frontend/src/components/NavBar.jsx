import PropTypes from 'prop-types';

const NavBar = ({ pages, currentPage, onNavigate }) => (
  <header
    style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 1200,
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <strong>Smart City Platform</strong>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Stakeholder Workspace</div>
      </div>
      <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => onNavigate(page.id)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 999,
              border: '1px solid',
              borderColor: page.id === currentPage ? '#2563eb' : '#d1d5db',
              backgroundColor: page.id === currentPage ? '#2563eb' : '#fff',
              color: page.id === currentPage ? '#fff' : '#374151',
              fontSize: '0.9rem'
            }}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

NavBar.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  currentPage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default NavBar;