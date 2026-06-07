import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { schemeAPI, userAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import SchemeCard from '../../components/schemes/SchemeCard';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'agriculture', label: '🌾 Agriculture' },
  { value: 'education', label: '📚 Education' },
  { value: 'health', label: '🏥 Health' },
  { value: 'women', label: '👩 Women' },
  { value: 'startup', label: '🚀 Startup' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'employment', label: '💼 Employment' },
  { value: 'pension', label: '👴 Pension' },
  { value: 'disability', label: '♿ Disability' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'skill_development', label: '🛠️ Skill Dev' },
  { value: 'rural', label: '🏡 Rural' },
  { value: 'youth', label: '🎯 Youth' },
];

export default function Schemes() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    gender: '',
    page: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 12, ...filters };
      if (!params.search) delete params.search;
      if (!params.category) delete params.category;
      if (!params.gender) delete params.gender;
      const res = await schemeAPI.getSchemes(params);
      setSchemes(res.data.data || []);
      setMeta(res.data.meta || { total: 0, pages: 1, page: 1 });
    } catch {}
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (user) {
      userAPI.getSavedIds().then(r => setSavedIds(r.data.data || []));
    }
  }, [user]);

  const setFilter = (key, val) => setFilters(p => ({ ...p, [key]: val, page: 1 }));
  const clearFilters = () => setFilters({ search: '', category: '', gender: '', page: 1 });
  const hasFilters = filters.search || filters.category || filters.gender;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-800">Browse Schemes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{meta.total} government schemes available</p>
        </div>
        {user && (
          <Link to="/recommendations" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            ✨ My AI Matches
          </Link>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            placeholder="Search schemes..." className="input-field pl-10" />
        </div>
        <button onClick={() => setShowFilters(p => !p)}
          className={`btn-secondary flex items-center gap-2 text-sm py-2.5 px-4 ${showFilters ? 'border-saffron-400 text-saffron-600' : ''}`}>
          <Filter size={15} /> Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-saffron-600" />}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 px-3 transition-colors">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card bg-gray-50 grid sm:grid-cols-2 gap-4 animate-slide-up">
          <div>
            <label className="label">Category</label>
            <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className="select-field">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Gender Specific</label>
            <select value={filters.gender} onChange={e => setFilter('gender', e.target.value)} className="select-field">
              <option value="">All</option>
              <option value="female">For Women</option>
              <option value="male">For Men</option>
            </select>
          </div>
        </div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.slice(0, 8).map(c => (
          <button key={c.value} onClick={() => setFilter('category', c.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filters.category === c.value ? 'bg-saffron-600 text-white border-saffron-600' : 'bg-white text-gray-600 border-gray-200 hover:border-saffron-300'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="card animate-pulse h-44">
              <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-4/5 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/5" />
            </div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="card text-center py-14">
          <p className="font-semibold text-gray-600 mb-1">No schemes found</p>
          <p className="text-sm text-gray-400 mb-4">Try different search terms or filters</p>
          <button onClick={clearFilters} className="btn-secondary text-sm">Clear Filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map(scheme => (
            <SchemeCard key={scheme._id} scheme={scheme} savedIds={savedIds}
              onSaveToggle={() => userAPI.getSavedIds().then(r => setSavedIds(r.data.data))} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
            disabled={filters.page === 1} className="btn-secondary p-2 disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600 px-3">Page {meta.page} of {meta.pages}</span>
          <button onClick={() => setFilters(p => ({ ...p, page: Math.min(meta.pages, p.page + 1) }))}
            disabled={filters.page === meta.pages} className="btn-secondary p-2 disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
