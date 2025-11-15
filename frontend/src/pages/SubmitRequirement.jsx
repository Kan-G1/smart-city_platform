import { useMemo, useState } from 'react';
import { submitRequirement } from '../api/api';

const roles = [
  { value: 'operations', label: 'City Operations' },
  { value: 'emergency-services', label: 'Emergency Services' },
  { value: 'mobility', label: 'Mobility & Transit' },
  { value: 'planning', label: 'Urban Planning' }
];

const SubmitRequirement = () => {
  const [input, setInput] = useState('');
  const [role, setRole] = useState(roles[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const charCount = useMemo(() => input.length, [input]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) {
      setMessage('Please provide requirement details before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');
      await submitRequirement(input.trim(), role);
      alert('Submitted!');
      setMessage('Requirement submitted for review.');
      setInput('');
      setRole(roles[0].value);
    } catch (error) {
      const fallback = 'Unable to submit requirement. Please try again.';
      setMessage(error?.response?.data?.message ?? error?.message ?? fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <header style={{ marginBottom: '1rem' }}>
        <h2>Share a new requirement</h2>
        <p style={{ color: '#4b5563' }}>
          Provide context in plain language, choose your role, and we will route it to the right triage queue.
        </p>
      </header>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          Requirement details
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={6}
            placeholder="Describe the issue, impacted area, and desired outcomes"
            style={{
              padding: '0.85rem',
              borderRadius: 10,
              border: '1px solid #d1d5db',
              fontFamily: 'inherit',
              fontSize: '1rem'
            }}
          />
          <small style={{ textAlign: 'right', color: '#6b7280' }}>{charCount} characters</small>
        </label>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          Stakeholder role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            style={{ padding: '0.65rem', borderRadius: 10, border: '1px solid #d1d5db' }}
          >
            {roles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.85rem',
            borderRadius: 10,
            border: 'none',
            backgroundColor: isSubmitting ? '#93c5fd' : '#2563eb',
            color: '#fff',
            fontWeight: 600
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit requirement'}
        </button>
        {message && <small style={{ color: '#2563eb' }}>{message}</small>}
      </form>
    </section>
  );
};

export default SubmitRequirement;
