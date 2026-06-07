import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, ChevronRight, Building2, Eye } from 'lucide-react';
import { userAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SchemeCard({ scheme, savedIds = [], onSaveToggle, showMatchScore = false }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const isSaved = savedIds.includes(scheme._id);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save schemes'); return; }
    setSaving(true);
    try {
      if (isSaved) {
        await userAPI.removeSavedScheme(scheme._id);
        toast.success('Removed from saved');
      } else {
        await userAPI.saveScheme(scheme._id);
        toast.success('Scheme saved!');
      }
      onSaveToggle?.(scheme._id, !isSaved);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-hover flex flex-col h-full">

      {/* Top badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {scheme.category?.slice(0, 2).map(cat => (
          <span key={cat} className="badge-saffron capitalize">{cat}</span>
        ))}
        {showMatchScore && scheme.matchScore !== undefined && (
          <span className={`badge ml-auto ${
            scheme.matchScore >= 80 ? 'badge-green' :
            scheme.matchScore >= 50 ? 'badge-saffron' : 'badge-gray'
          }`}>
            {scheme.matchScore}% Match
          </span>
        )}
        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`ml-auto p-1.5 rounded-lg transition-colors ${
            isSaved
              ? 'text-saffron-500 hover:text-saffron-700'
              : 'text-gray-300 hover:text-saffron-400'
          }`}
        >
          <Star size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-navy-800 mb-1 line-clamp-2 leading-snug">
        {scheme.title}
      </h3>

      {/* Ministry */}
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
        <Building2 size={11} />
        {scheme.ministry}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
        {scheme.shortDescription}
      </p>

      {/* AI Explanation if available */}
      {scheme.aiExplanation && (
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-3 italic line-clamp-2">
          💡 {scheme.aiExplanation}
        </p>
      )}

      {/* Benefit amount */}
      {scheme.benefitAmount && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Benefit</span>
          <span className="text-xs font-semibold text-green-600">
            {scheme.benefitAmount}
          </span>
        </div>
      )}

      {/* View count and launch year */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Eye size={11} />
          {scheme.views || 0} views
        </span>
        {scheme.launchYear && (
          <span className="text-xs text-gray-400">
            Since {scheme.launchYear}
          </span>
        )}
      </div>

      {/* Bottom actions */}
    {/* Bottom actions */}
      <div className="flex items-center justify-between mt-auto">
        <Link
          to={`/schemes/${scheme._id}`}
          className="text-sm text-saffron-600 font-medium hover:text-saffron-700 flex items-center gap-1 transition-colors"
        >
          View Details <ChevronRight size={14} />
        </Link>
        {scheme.applicationLink && (
            <a
          
            href={scheme.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            Apply <ExternalLink size={11} />
          </a>
        )}
      </div>

    </div>
  );
}