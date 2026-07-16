import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConceptCard } from '../components/ConceptCard';
import { FilterBar, type Filters } from '../components/FilterBar';
import { useConcepts } from '../context/ConceptsContext';
import { filterConcepts } from '../utils/concepts';
import './DashboardView.css';

const DEFAULT_FILTERS: Filters = {
  role: 'all',
  angle: 'all',
  status: 'all',
  search: '',
};

export function DashboardView() {
  const { concepts, resetAll } = useConcepts();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const navigate = useNavigate();

  const filtered = useMemo(
    () => filterConcepts(concepts, filters),
    [concepts, filters]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    concepts.forEach((c) => {
      counts[c.production_status] = (counts[c.production_status] ?? 0) + 1;
    });
    return counts;
  }, [concepts]);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Concept Dashboard</h2>
          <p>{concepts.length} concepts · 5 roles × 5 message angles</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={resetAll}>
          Reset to seed data
        </button>
      </div>

      <div className="dashboard__stats">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="dashboard__stat">
            <span className="dashboard__stat-value">{count}</span>
            <span className="dashboard__stat-label">{status}</span>
          </div>
        ))}
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        total={concepts.length}
        filtered={filtered.length}
      />

      <div className="dashboard__grid">
        {filtered.map((concept) => (
          <ConceptCard
            key={concept.concept_id}
            concept={concept}
            onExport={() => navigate(`/export?concept=${concept.concept_id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="dashboard__empty">No concepts match your filters.</p>
      )}
    </div>
  );
}
