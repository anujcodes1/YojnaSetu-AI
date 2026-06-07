import React from 'react';
import { Inbox } from 'lucide-react';

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader text="Loading YojnaSetu..." />
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
        <Icon size={24} className="text-gray-400" />
      </div>
      <h3 className="font-display font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function MatchScoreBadge({ score }) {
  const level = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
  const styles = {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === 'high' ? 'bg-green-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
      {score}% Match
    </span>
  );
}

export function CategoryBadge({ category }) {
  const colors = {
    agriculture: 'bg-green-100 text-green-700',
    education: 'bg-blue-100 text-blue-700',
    health: 'bg-red-100 text-red-700',
    women: 'bg-pink-100 text-pink-700',
    startup: 'bg-purple-100 text-purple-700',
    housing: 'bg-orange-100 text-orange-700',
    employment: 'bg-teal-100 text-teal-700',
    pension: 'bg-indigo-100 text-indigo-700',
    disability: 'bg-cyan-100 text-cyan-700',
    minority: 'bg-lime-100 text-lime-700',
    youth: 'bg-violet-100 text-violet-700',
    rural: 'bg-emerald-100 text-emerald-700',
    urban: 'bg-sky-100 text-sky-700',
    finance: 'bg-yellow-100 text-yellow-700',
    skill_development: 'bg-fuchsia-100 text-fuchsia-700',
  };
  const icons = {
    agriculture: '🌾', education: '📚', health: '🏥', women: '👩',
    startup: '🚀', housing: '🏠', employment: '💼', pension: '👴',
    disability: '♿', minority: '🤝', youth: '🎯', rural: '🏡',
    urban: '🏙️', finance: '💰', skill_development: '🛠️'
  };
  const color = colors[category] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {icons[category] || '📋'} {category?.replace('_', ' ')}
    </span>
  );
}

export function StatCard({ icon, label, value, sub, color = 'saffron' }) {
  const colors = {
    saffron: 'bg-saffron-50 text-saffron-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="card-hover">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-0.5">{label}</p>
          <p className="text-2xl font-display font-bold text-navy-800">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export function ProfileCompleteBanner({ onComplete }) {
  return (
    <div className="bg-gradient-to-r from-saffron-600 to-amber-500 rounded-2xl p-5 text-white mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg">Complete your profile</h3>
          <p className="text-sm text-white/80 mt-1">Get personalized AI recommendations for government schemes you're eligible for.</p>
        </div>
        <button onClick={onComplete} className="flex-shrink-0 bg-white text-saffron-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">
          Complete Now
        </button>
      </div>
    </div>
  );
}
