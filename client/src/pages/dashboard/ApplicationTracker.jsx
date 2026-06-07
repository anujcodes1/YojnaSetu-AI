import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../api/services';
import { Trash2, ClipboardList, ChevronDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'interested',           label: '🔵 Interested' },
  { value: 'documents_collecting', label: '🟡 Collecting Docs' },
  { value: 'applied',              label: '🟣 Applied' },
  { value: 'under_review',         label: '🟠 Under Review' },
  { value: 'approved',             label: '🟢 Approved ✓' },
  { value: 'rejected',             label: '🔴 Rejected' },
];

const STATUS_BADGE = {
  interested:           'badge-blue',
  documents_collecting: 'badge-gray',
  applied:              'badge-purple',
  under_review:         'badge-saffron',
  approved:             'badge-green',
  rejected:             'badge-red',
};

export default function ApplicationTracker() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await applicationAPI.getAll();
      setApps(res.data.data || []);
    } catch {
      toast.error('Failed to load tracker');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleStatusChange = async (schemeId, status) => {
    try {
      await applicationAPI.upsert({ schemeId, status });
      toast.success('Status updated');
      fetchApps();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this from tracker?')) return;
    try {
      await applicationAPI.remove(id);
      toast.success('Removed from tracker');
      setApps(prev => prev.filter(a => a._id !== id));
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron-50 rounded-xl flex items-center justify-center">
            <ClipboardList size={20} className="text-saffron-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-navy-800">
              Application Tracker
            </h1>
            <p className="text-gray-500 text-sm">
              Track your scheme application progress
            </p>
          </div>
        </div>
        <Link to="/schemes" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Add Scheme
        </Link>
      </div>

      {/* Status legend */}
      <div className="card mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Status Guide
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(s => (
            <span key={s.value} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {apps.length === 0 ? (
        <div className="card text-center py-16">
          <ClipboardList size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold text-lg">
            No applications tracked yet
          </p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            Go to any scheme and click "Track Application" to add it here
          </p>
          <Link to="/schemes" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Browse Schemes
          </Link>
        </div>
      ) : (
        <>
          {/* Count */}
          <p className="text-sm text-gray-500 mb-3">
            Tracking <span className="font-semibold text-navy-800">{apps.length}</span> scheme{apps.length > 1 ? 's' : ''}
          </p>

          {/* Applications list */}
          <div className="space-y-3">
            {apps.map(app => (
              <div key={app._id}
                className="card-hover flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Scheme info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-800 truncate">
                    {app.scheme?.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {app.scheme?.ministry}
                  </p>
                  {app.scheme?.benefitAmount && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Benefit: {app.scheme.benefitAmount}
                    </p>
                  )}
                </div>

                {/* Current status badge */}
                <span className={`badge ${STATUS_BADGE[app.status]} flex-shrink-0`}>
                  {STATUS_OPTIONS.find(s => s.value === app.status)?.label}
                </span>

                {/* Status dropdown */}
                <div className="relative flex-shrink-0">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app.scheme._id, e.target.value)
                    }
                    className="appearance-none pl-3 pr-8 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white cursor-pointer focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12}
                    className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                </div>

                {/* View + Delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/schemes/${app.scheme?._id}`}
                    className="text-xs text-saffron-600 font-medium hover:underline"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}