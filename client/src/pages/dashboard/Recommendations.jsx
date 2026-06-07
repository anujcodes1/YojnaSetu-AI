import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, RefreshCw, AlertCircle, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { recommendationAPI, userAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MATCH_STYLE = score =>
  score >= 80 ? { bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50 border-green-200' } :
  score >= 50 ? { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' } :
               { bar: 'bg-red-400', text: 'text-red-700', bg: 'bg-red-50 border-red-200' };

function RecommendationCard({ scheme, onSave, savedIds }) {
  const style = MATCH_STYLE(scheme.matchScore);
  const isSaved = savedIds.includes(scheme._id);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isSaved) {
        await userAPI.removeSavedScheme(scheme._id);
        toast.success('Removed from saved');
      } else {
        await userAPI.saveScheme(scheme._id);
        toast.success('Scheme saved!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`card border ${style.bg} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {scheme.category?.slice(0, 2).map(c => (
              <span key={c} className="badge badge-saffron text-xs">{c.replace('_', ' ')}</span>
            ))}
          </div>
          <h3 className="font-semibold text-navy-800 leading-snug">{scheme.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{scheme.ministry}</p>
        </div>
        <div className="flex-shrink-0 text-center">
          <div className={`text-2xl font-display font-bold ${style.text}`}>{scheme.matchScore}%</div>
          <p className="text-xs text-gray-500">match</p>
        </div>
      </div>

      {/* Match bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div className={`h-full ${style.bar} rounded-full transition-all`} style={{ width: `${scheme.matchScore}%` }} />
      </div>

      {/* AI explanation */}
      {scheme.aiExplanation && (
        <div className="bg-white/60 rounded-xl px-3 py-2 mb-3 border border-white">
          <p className="text-xs text-gray-600 italic flex gap-1.5">
            <Sparkles size={12} className="text-saffron-500 mt-0.5 flex-shrink-0" />
            {scheme.aiExplanation}
          </p>
        </div>
      )}

      {/* Matched criteria */}
      {scheme.matchedCriteria?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1.5">Why you qualify:</p>
          <div className="flex flex-wrap gap-1.5">
            {scheme.matchedCriteria.slice(0, 3).map((c, i) => (
              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">✓ {c}</span>
            ))}
          </div>
        </div>
      )}

      {scheme.benefitAmount && (
        <p className="text-sm font-semibold text-green-700 mb-3">💰 {scheme.benefitAmount}</p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-white/50">
        <Link to={`/schemes/${scheme._id}`}
          className="flex-1 text-center text-sm font-semibold text-saffron-600 hover:text-saffron-700 py-2 rounded-xl hover:bg-white/80 transition-all">
          View Details
        </Link>
        <button onClick={handleSave} disabled={saving}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'text-saffron-600 bg-white' : 'text-gray-400 hover:text-saffron-500 hover:bg-white'}`}>
          <Star size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        {scheme.applicationLink && (
          <a href={scheme.applicationLink} target="_blank" rel="noreferrer"
            className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-white transition-all">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Recommendations() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [recRes, savedRes] = await Promise.all([
        recommendationAPI.getRecommendations(),
        userAPI.getSavedIds()
      ]);
      setSchemes(recRes.data.data || []);
      setSavedIds(savedRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? schemes :
    filter === 'high' ? schemes.filter(s => s.matchScore >= 80) :
    filter === 'saved' ? schemes.filter(s => savedIds.includes(s._id)) : schemes;

  if (!user?.profileComplete) return (
    <div className="max-w-md mx-auto text-center py-16">
      <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
      <h2 className="font-display font-bold text-xl text-navy-800 mb-2">Complete Your Profile First</h2>
      <p className="text-gray-500 mb-6">We need your details to generate AI-powered recommendations tailored to you.</p>
      <Link to="/profile" className="btn-primary inline-flex items-center gap-2">Complete Profile <ArrowRight size={16} /></Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-800 flex items-center gap-2">
            <Sparkles size={22} className="text-saffron-600" /> AI Recommendations
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Schemes matched to your profile by Gemini AI</p>
        </div>
        <button onClick={load} disabled={loading}
          className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[['all', 'All Schemes'], ['high', 'High Match (80%+)'], ['saved', 'Saved']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === val ? 'bg-saffron-600 text-white border-saffron-600' : 'bg-white text-gray-600 border-gray-200 hover:border-saffron-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card animate-pulse h-48">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No schemes found for this filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(scheme => (
            <RecommendationCard key={scheme._id} scheme={scheme}
              savedIds={savedIds} onSave={() => userAPI.getSavedIds().then(r => setSavedIds(r.data.data))} />
          ))}
        </div>
      )}
    </div>
  );
}
