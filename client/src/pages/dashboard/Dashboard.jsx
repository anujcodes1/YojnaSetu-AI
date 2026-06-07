import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recommendationAPI, userAPI } from '../../api/services';
import { Sparkles, Star, CheckCircle, ArrowRight, User, AlertCircle } from 'lucide-react';
import SchemeCard from '../../components/schemes/SchemeCard';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-navy-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [recRes, savedRes] = await Promise.all([
          recommendationAPI.getQuickRecommendations(),
          userAPI.getSavedSchemes()
        ]);
        if (recRes.data.meta?.profileIncomplete) {
          setProfileIncomplete(true);
        } else {
          setRecommendations(recRes.data.data || []);
        }
        setSavedCount((savedRes.data.data || []).length);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const profileFields = ['age', 'gender', 'state', 'income', 'occupation', 'category'];
  const filledFields = profileFields.filter(f => user?.[f] !== undefined && user?.[f] !== '' && user?.[f] !== null && user?.[f] !== 0);
  const profilePct = Math.round((filledFields.length / profileFields.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-700 rounded-2xl p-6 text-white">
        <h1 className="font-display font-bold text-xl sm:text-2xl mb-1">
          Namaste, {user?.name?.split(' ')[0]} 🙏
        </h1>
        <p className="text-gray-300 text-sm">
          {user?.profileComplete
            ? 'Your AI recommendations are ready. Explore schemes matched to your profile.'
            : 'Complete your profile to unlock personalized AI recommendations.'}
        </p>
        {!user?.profileComplete && (
          <Link to="/profile" className="inline-flex items-center gap-2 mt-4 bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
            Complete Profile <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {/* Profile completeness */}
      {!user?.profileComplete && (
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Profile {profilePct}% complete</p>
              <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${profilePct}%` }} />
              </div>
              <p className="text-xs text-amber-700 mt-1.5">Add your age, state, income, occupation and category to get AI-matched schemes</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Sparkles} label="Schemes Matched" value={recommendations.length || '—'} color="bg-saffron-600" />
        <StatCard icon={Star} label="Saved Schemes" value={savedCount} color="bg-navy-700" />
        <StatCard icon={CheckCircle} label="Profile Status" value={user?.profileComplete ? '✓ Done' : 'Incomplete'} color={user?.profileComplete ? 'bg-green-600' : 'bg-gray-400'} />
      </div>

      {/* Quick Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-navy-800 flex items-center gap-2">
            <Sparkles size={18} className="text-saffron-600" /> Top Matches for You
          </h2>
          <Link to="/recommendations" className="text-saffron-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : profileIncomplete ? (
          <div className="card text-center py-10">
            <User size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600 mb-1">Profile needed for recommendations</p>
            <p className="text-sm text-gray-400 mb-4">Tell us about yourself so our AI can find the right schemes for you.</p>
            <Link to="/profile" className="btn-primary inline-flex items-center gap-2">
              Complete Profile <ArrowRight size={16} />
            </Link>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-500">No matching schemes found. Try updating your profile.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(scheme => (
              <SchemeCard key={scheme._id} scheme={scheme} showMatchScore />
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/recommendations', label: 'AI Recommendations', icon: Sparkles, color: 'text-saffron-600 bg-saffron-50' },
          { to: '/schemes', label: 'Browse Schemes', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
          { to: '/eligibility', label: 'Check Eligibility', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { to: '/chat', label: 'Ask AI Assistant', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
        ].map(({ to, label, icon: Icon, color }) => (
          <Link key={to} to={to} className="card-hover flex flex-col items-center gap-2 py-5 text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <span className="text-xs font-semibold text-navy-800 leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
