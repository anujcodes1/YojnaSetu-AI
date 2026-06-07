import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, Trash2, Search } from 'lucide-react';
import { userAPI } from '../../api/services';
import toast from 'react-hot-toast';

export default function SavedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await userAPI.getSavedSchemes();
      setSchemes(res.data.data || []);
    } catch { toast.error('Failed to load saved schemes'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (id) => {
    try {
      await userAPI.removeSavedScheme(id);
      setSchemes(p => p.filter(s => s._id !== id));
      toast.success('Removed from saved');
    } catch { toast.error('Error removing scheme'); }
  };

  const filtered = schemes.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.ministry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-800 flex items-center gap-2">
            <Star size={22} className="text-saffron-600" /> Saved Schemes
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{schemes.length} scheme{schemes.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {schemes.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search saved schemes..." className="input-field pl-10" />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse h-24">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14">
          <Star size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-semibold text-gray-600 mb-1">{search ? 'No results found' : 'No saved schemes yet'}</p>
          <p className="text-sm text-gray-400 mb-5">{search ? 'Try a different search' : 'Browse schemes and save the ones relevant to you.'}</p>
          {!search && (
            <Link to="/schemes" className="btn-primary inline-flex items-center gap-2">Browse Schemes</Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(scheme => (
            <div key={scheme._id} className="card-hover flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {scheme.category?.slice(0, 2).map(c => (
                    <span key={c} className="badge badge-saffron">{c.replace('_', ' ')}</span>
                  ))}
                </div>
                <Link to={`/schemes/${scheme._id}`} className="font-semibold text-navy-800 hover:text-saffron-600 transition-colors line-clamp-1">
                  {scheme.title}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{scheme.ministry}</p>
                {scheme.benefitAmount && (
                  <p className="text-xs text-green-700 font-medium mt-1">💰 {scheme.benefitAmount}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {scheme.applicationLink && (
                  <a href={scheme.applicationLink} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                    <ExternalLink size={16} />
                  </a>
                )}
                <button onClick={() => handleRemove(scheme._id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
