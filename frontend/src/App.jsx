import { useMemo, useState } from 'react';
import NavBar from './components/NavBar';
import SubmitRequirement from './pages/SubmitRequirement';
import ClusterView from './pages/ClusterView';
import Prioritization from './pages/Prioritization';
import Visualization from './pages/Visualization';
import AdminPanel from './pages/AdminPanel';

const pages = [
  { id: 'submit', label: 'Submit Requirement', component: SubmitRequirement },
  { id: 'clusters', label: 'Cluster View', component: ClusterView },
  { id: 'prioritization', label: 'Prioritization', component: Prioritization },
  { id: 'visualization', label: 'Visualization', component: Visualization },
  { id: 'admin', label: 'Admin Panel', component: AdminPanel }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('submit');

  const PageComponent = useMemo(() => {
    const current = pages.find((page) => page.id === currentPage);
    return current?.component ?? SubmitRequirement;
  }, [currentPage]);

  return (
    <div>
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} pages={pages} />
      <main>
        <PageComponent />
      </main>
    </div>
  );
};

export default App;