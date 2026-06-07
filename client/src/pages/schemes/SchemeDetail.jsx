import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, CheckCircle, FileText, Globe, Sparkles, AlertCircle , Printer, ClipboardList } from 'lucide-react';
import { schemeAPI, userAPI, applicationAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORY_EMOJI = { agriculture: '🌾', education: '📚', health: '🏥', women: '👩', startup: '🚀', housing: '🏠', employment: '💼', pension: '👴', disability: '♿', finance: '💰', skill_development: '🛠️', rural: '🏡', urban: '🏙️' };

export default function SchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [eligResult, setEligResult] = useState(null);
  const [eligLoading, setEligLoading] = useState(false);
  const handlePrint = () => {
    window.print();
  };

  const handleTrack = async () => {
  if (!user) {
    toast.error('Please login to track applications');
    return;
  }
  try {
    await applicationAPI.upsert({ schemeId: scheme._id, status: 'interested' });
    toast.success('Added to Application Tracker!');
  } catch {
    toast.error('Something went wrong');
  }
};
  
  useEffect(() => {
    schemeAPI.getSchemeById(id)
      .then(r => { setScheme(r.data.data); setLoading(false); })
      .catch(() => { toast.error('Scheme not found'); navigate('/schemes'); });
    if (user) {
      userAPI.getSavedIds().then(r => setSaved((r.data.data || []).includes(id)));
    }
  }, [id]);

  const handleSave = async () => {
    if (!user) return toast.error('Please login to save schemes');
    setSaving(true);
    try {
      if (saved) { await userAPI.removeSavedScheme(id); setSaved(false); toast.success('Removed from saved'); }
      else { await userAPI.saveScheme(id); setSaved(true); toast.success('Scheme saved!'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleEligibility = async () => {
    if (!user) return toast.error('Please login to check eligibility');
    if (!user.profileComplete) return toast.error('Complete your profile first');
    setEligLoading(true);
    try {
      const res = await eligibilityAPI.check(id);
      setEligResult(res.data.data);
    } catch { toast.error('Eligibility check failed'); }
    setEligLoading(false);
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      {[...Array(5)].map((_, i) => <div key={i} className="card animate-pulse h-16" />)}
    </div>
  );

  if (!scheme) return null;

  const resultColor = {
    eligible: 'bg-green-50 border-green-200 text-green-700',
    partial: 'bg-amber-50 border-amber-200 text-amber-700',
    ineligible: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-saffron-600 text-sm transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-3">
          {scheme.category?.map(c => (
            <span key={c} className="badge badge-saffron">{CATEGORY_EMOJI[c] || ''} {c.replace('_', ' ')}</span>
          ))}
        </div>
        <h1 className="font-display font-bold text-xl sm:text-2xl text-navy-800 mb-1">{scheme.title}</h1>
        <p className="text-gray-500 text-sm mb-4">{scheme.ministry}</p>
        <p className="text-gray-700 leading-relaxed">{scheme.description}</p>

        {scheme.benefitAmount && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <span className="text-green-700 font-semibold">💰 {scheme.benefitAmount}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${saved ? 'bg-saffron-50 border-saffron-300 text-saffron-700' : 'border-gray-200 text-gray-600 hover:border-saffron-300 hover:text-saffron-600'}`}>
            <Star size={16} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save Scheme'}
          </button>
          {scheme.applicationLink && (
            <a href={scheme.applicationLink} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white transition-all">
              Apply Now <ExternalLink size={14} />
            </a>
          )}
             <button
               onClick={handlePrint}
               className="btn-secondary flex items-center gap-2 text-sm print:hidden"
               >
               <Printer size={15} /> Print
             </button>

             <button
  onClick={handleTrack}
  className="btn-outline flex items-center gap-2 text-sm print:hidden"
>
  <ClipboardList size={15} /> Track Application
</button>



          
        </div>
      </div>

      {/* Eligibility Check */}
      <div className="card">
        <h2 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-saffron-600" /> Check Your Eligibility
        </h2>
        {!user ? (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-3">Login to check if you qualify for this scheme</p>
            <Link to="/login" className="btn-primary text-sm py-2 px-5 inline-block">Login to Check</Link>
          </div>
        ) : !user.profileComplete ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Profile incomplete</p>
              <p className="text-xs text-amber-700 mt-0.5">
                <Link to="/profile" className="underline">Complete your profile</Link> to use the eligibility checker.
              </p>
            </div>
          </div>
        ) : eligResult ? (
          <div className={`border rounded-xl p-4 space-y-3 ${resultColor[eligResult.result]}`}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {eligResult.result === 'eligible' ? '✓ You are Eligible!' : eligResult.result === 'partial' ? '~ Partially Eligible' : '✗ Not Eligible'}
              </p>
              <span className="font-bold text-lg">{eligResult.matchScore}%</span>
            </div>
            {eligResult.aiExplanation && (
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-xs flex gap-1.5"><Sparkles size={12} className="mt-0.5 flex-shrink-0" />{eligResult.aiExplanation}</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {eligResult.matchedCriteria?.length > 0 && (
                <div><p className="font-medium mb-1">✓ Met:</p>
                  <ul className="space-y-1">{eligResult.matchedCriteria.map((c, i) => <li key={i} className="bg-white/60 px-2 py-1 rounded">{c}</li>)}</ul>
                </div>
              )}
              {eligResult.missedCriteria?.length > 0 && (
                <div><p className="font-medium mb-1">✗ Missed:</p>
                  <ul className="space-y-1">{eligResult.missedCriteria.map((c, i) => <li key={i} className="bg-white/60 px-2 py-1 rounded">{c}</li>)}</ul>
                </div>
              )}
            </div>
            <button onClick={() => setEligResult(null)} className="text-xs underline opacity-70 hover:opacity-100">Check Again</button>
          </div>
        ) : (
          <button onClick={handleEligibility} disabled={eligLoading}
            className="btn-primary flex items-center gap-2 text-sm">
            {eligLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={16} />}
            {eligLoading ? 'Checking...' : 'Check My Eligibility'}
          </button>
        )}
      </div>

      {/* Eligibility criteria */}
      <div className="card">
        <h2 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-saffron-600" /> Eligibility Criteria
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ['Age Range', `${scheme.eligibility?.minAge || 0} – ${scheme.eligibility?.maxAge || 100} years`],
            ['Gender', scheme.eligibility?.gender === 'any' ? 'All genders' : scheme.eligibility?.gender],
            ['Income Limit', scheme.eligibility?.incomeLimitAnnual ? `₹${scheme.eligibility.incomeLimitAnnual.toLocaleString('en-IN')}/year` : 'No limit'],
            ['States', scheme.eligibility?.states?.length > 0 ? scheme.eligibility.states.join(', ') : 'All India'],
            ['Category', scheme.eligibility?.targetCategories?.includes('all') ? 'All categories' : scheme.eligibility?.targetCategories?.map(c => c.toUpperCase()).join(', ')],
            ['Occupation', scheme.eligibility?.occupations?.length > 0 ? scheme.eligibility.occupations.join(', ') : 'All occupations'],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="font-medium text-navy-800 capitalize">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <h2 className="font-semibold text-navy-800 mb-3">Benefits</h2>
        <p className="text-gray-700 leading-relaxed text-sm">{scheme.benefits}</p>
      </div>

      {/* Documents */}
      {scheme.documentsRequired?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-saffron-600" /> Documents Required
          </h2>
          <ul className="space-y-2">
            {scheme.documentsRequired.map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application */}
      {scheme.applicationProcess && (
        <div className="card">
          <h2 className="font-semibold text-navy-800 mb-3">How to Apply</h2>
          <p className="text-gray-700 leading-relaxed text-sm">{scheme.applicationProcess}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            {scheme.applicationLink && (
              <a href={scheme.applicationLink} target="_blank" rel="noreferrer"
                className="btn-primary flex items-center gap-2 text-sm py-2.5">
                Apply Online <ExternalLink size={14} />
              </a>
            )}
            {scheme.officialWebsite && (
              <a href={scheme.officialWebsite} target="_blank" rel="noreferrer"
                className="btn-secondary flex items-center gap-2 text-sm py-2.5">
                <Globe size={14} /> Official Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {scheme.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {scheme.tags.map(tag => (
            <span key={tag} className="badge badge-gray">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
