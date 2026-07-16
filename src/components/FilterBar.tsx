import { PRODUCTION_STATUSES } from '../utils/constants';
import './FilterBar.css';

export interface Filters {
  role: string;
  angle: string;
  status: string;
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  total: number;
  filtered: number;
}

export function FilterBar({ filters, onChange, total, filtered }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__counts">
        Showing <strong>{filtered}</strong> of <strong>{total}</strong> concepts
      </div>
      <div className="filter-bar__controls">
        <input
          type="search"
          className="filter-bar__search"
          placeholder="Search concepts..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
        />
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {PRODUCTION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
