import './CategoryFilter.css';

export default function CategoryFilter({ categories, filters, onFilterChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Status:</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Category:</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.symbol} {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
