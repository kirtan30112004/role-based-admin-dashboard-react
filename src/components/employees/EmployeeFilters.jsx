import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import Select    from '../ui/Select';
import Button    from '../ui/Button';
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../../constants/roles';

/**
 * EmployeeFilters — search bar + department / status / type filters.
 *
 * Props:
 *  filters     { search, department, status, employmentType }
 *  onChange    (key, value) => void
 *  onReset     () => void
 *  resultCount number
 *  totalCount  number
 */
function EmployeeFilters({ filters, onChange, onReset, resultCount, totalCount }) {
  const hasActiveFilters =
    filters.search || filters.department || filters.status || filters.employmentType;

  return (
    <div className="card p-4 space-y-3">
      {/* Search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={filters.search}
          onChange={(v) => onChange('search', v)}
          placeholder="Search name, email, title, department…"
          debounceMs={0}
          className="flex-1"
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            leftIcon={<RotateCcw size={14} />}
            onClick={onReset}
            className="flex-shrink-0 text-slate-500"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Filter:</span>
        </div>

        <Select
          options={DEPARTMENTS}
          value={filters.department}
          onChange={(e) => onChange('department', e.target.value)}
          className="w-auto min-w-[150px] !py-1.5 text-xs"
          id="filter-dept"
          aria-label="Filter by department"
        />

        <Select
          options={['Active', 'Inactive']}
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
          className="w-auto min-w-[120px] !py-1.5 text-xs"
          id="filter-status"
          aria-label="Filter by status"
        />

        <Select
          options={EMPLOYMENT_TYPES}
          value={filters.employmentType}
          onChange={(e) => onChange('employmentType', e.target.value)}
          className="w-auto min-w-[130px] !py-1.5 text-xs"
          id="filter-type"
          aria-label="Filter by employment type"
        />
      </div>

      {/* Result summary */}
      <p className="text-xs text-slate-400">
        {resultCount === totalCount
          ? `${totalCount} employees total`
          : `${resultCount} of ${totalCount} employees`}
      </p>
    </div>
  );
}

export default EmployeeFilters;
