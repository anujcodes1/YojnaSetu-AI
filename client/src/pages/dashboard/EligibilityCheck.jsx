import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Sparkles, Search } from 'lucide-react';
import { schemeAPI, eligibilityAPI } from '../../api/services';
import toast from 'react-hot-toast';

function ResultBadge({ result }) {
  const map = {
    eligible: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', label: '✓ Eligible' },
    partial: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-200', label: '~ Partially Eligible' },
    ineligible: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', label: '✗ Not Eligible' },
  };
  const { color, label } = map[result] || map.ineligible;
  return <span className={`inline-flex items-center px-4 py-2 rounded-xl border font-semibold text-sm ${color}`}>{label}</span>;
}

export default function EligibilityCheck() {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    schemeAPI.getSchemes({ limit: 100 }).then(r => setSchemes(r.data.data || []));
    eligibilityAPI.getHistory().then(r => setHistory(r.data.data || []));
  }, []);

  const filtered = schemes.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.ministry?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheck = async () => {
    if (!selectedScheme) return toast.error('Please select a scheme');
    setLoading(true);
    setResult(null);
    try {
      const res = await eligibilityAPI.check(selectedScheme._id);
      setResult(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy-800 flex items-center gap-2">
          <CheckCircle size={22} className="text-saffron-600" /> Eligibility Checker
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Check if you qualify for any government scheme based on your profile</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="label">Search and select a scheme</label>
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setSelectedScheme(null); }}
              placeholder="Type scheme name or ministry..." className="input-field pl-10" />
          </div>
          {search && !selectedScheme && filtered.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {filtered.slice(0, 8).map(s => (
                <button key={s._id} onClick={() => { setSelectedScheme(s); setSearch(s.title); setResult(null); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-saffron-50 border-b border-gray-100 last:border-0 transition-colors">
                  <p className="text-sm font-medium text-navy-800 line-clamp-1">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.ministry}</p>
                </button>
              ))}
            </div>
          )}
          {selectedScheme && (
            <div className="mt-2 px-4 py-3 bg-saffron-50 border border-saffron-200 rounded-xl">
              <p className="font-semibold text-saffron-800 text-sm">{selectedScheme.title}</p>
              <p className="text-xs text-saffron-600">{selectedScheme.ministry}</p>
            </div>
          )}
        </div>

        <button onClick={handleCheck} disabled={loading || !selectedScheme} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={18} />}
          {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card space-y-4 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold text-navy-800">Eligibility Result</h2>
            <ResultBadge result={result.result} />
          </div>

          {/* Score bar */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">Match Score</span>
              <span className="font-semibold text-navy-800">{result.matchScore}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${result.matchScore >= 80 ? 'bg-green-500' : result.matchScore >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                style={{ width: `${result.matchScore}%` }} />
            </div>
          </div>

          {/* AI Explanation */}
          {result.aiExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <p className="text-sm font-medium text-blue-800 flex items-center gap-1.5 mb-1">
                <Sparkles size={14} /> AI Analysis
              </p>
              <p className="text-sm text-blue-700">{result.aiExplanation}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {result.matchedCriteria?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle size={14} /> Criteria Met ({result.matchedCriteria.length})
                </p>
                <ul className="space-y-1.5">
                  {result.matchedCriteria.map((c, i) => (
                    <li key={i} className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.missedCriteria?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
                  <XCircle size={14} /> Criteria Missed ({result.missedCriteria.length})
                </p>
                <ul className="space-y-1.5">
                  {result.missedCriteria.map((c, i) => (
                    <li key={i} className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="font-semibold text-navy-800 mb-3">Recent Checks</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map(h => (
              <div key={h._id} className="card flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{h.scheme?.title}</p>
                  <p className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-600">{h.matchScore}%</span>
                  <ResultBadge result={h.result} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
