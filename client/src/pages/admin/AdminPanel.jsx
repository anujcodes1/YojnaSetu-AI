import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/services';
import { LayoutDashboard, BookOpen, Users, Plus, Edit2, Trash2, X, Save, ChevronLeft, ChevronRight, LogOut, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = ['dashboard', 'schemes', 'users'];

const EMPTY_SCHEME = {
  title: '', shortDescription: '', description: '', ministry: '',
  category: [], benefits: '', benefitAmount: '', applicationLink: '',
  officialWebsite: '', applicationProcess: '', documentsRequired: '',
  tags: '', isActive: true,
  eligibility: { minAge: 0, maxAge: 100, gender: 'any', incomeLimitAnnual: 0, states: '', targetCategories: ['all'], occupations: '' }
};

function StatBox({ label, value, color }) {
  return (
    <div className={`card border-l-4 ${color}`}>
      <p className="text-3xl font-display font-bold text-navy-800">{value ?? '—'}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editScheme, setEditScheme] = useState(null);
  const [form, setForm] = useState(EMPTY_SCHEME);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === 'dashboard') loadStats();
    if (tab === 'schemes') loadSchemes();
    if (tab === 'users') loadUsers();
  }, [tab]);

  const loadStats = async () => {
    try { const r = await adminAPI.getStats(); setStats(r.data.data); } catch {}
  };

  const loadSchemes = async (page = 1) => {
    setLoading(true);
    try {
      const r = await adminAPI.getSchemes({ page, limit: 15 });
      setSchemes(r.data.data || []);
      setMeta(r.data.meta || { page: 1, pages: 1 });
    } catch {}
    setLoading(false);
  };

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const r = await adminAPI.getUsers({ page, limit: 15 });
      setUsers(r.data.data || []);
      setMeta(r.data.meta || { page: 1, pages: 1 });
    } catch {}
    setLoading(false);
  };

  const openCreate = () => { setForm(EMPTY_SCHEME); setEditScheme(null); setShowForm(true); };
  const openEdit = (s) => {
    setEditScheme(s);
    setForm({
      ...s,
      documentsRequired: s.documentsRequired?.join(', ') || '',
      tags: s.tags?.join(', ') || '',
      eligibility: {
        ...s.eligibility,
        states: s.eligibility?.states?.join(', ') || '',
        occupations: s.eligibility?.occupations?.join(', ') || '',
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scheme?')) return;
    try {
      await adminAPI.deleteScheme(id);
      toast.success('Scheme deleted');
      loadSchemes();
    } catch { toast.error('Delete failed'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        documentsRequired: form.documentsRequired ? form.documentsRequired.split(',').map(s => s.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        eligibility: {
          ...form.eligibility,
          minAge: Number(form.eligibility.minAge) || 0,
          maxAge: Number(form.eligibility.maxAge) || 100,
          incomeLimitAnnual: Number(form.eligibility.incomeLimitAnnual) || 0,
          states: form.eligibility.states ? form.eligibility.states.split(',').map(s => s.trim()).filter(Boolean) : [],
          occupations: form.eligibility.occupations ? form.eligibility.occupations.split(',').map(s => s.trim()).filter(Boolean) : [],
        }
      };
      if (editScheme) {
        await adminAPI.updateScheme(editScheme._id, payload);
        toast.success('Scheme updated');
      } else {
        await adminAPI.createScheme(payload);
        toast.success('Scheme created');
      }
      setShowForm(false);
      loadSchemes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const setF = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const setE = (key, val) => setForm(p => ({ ...p, eligibility: { ...p.eligibility, [key]: val } }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin nav */}
      <header className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-gray-400">YojnaSetu AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">{user?.name}</span>
          <button onClick={() => { logout(); navigate('/'); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 w-fit mb-6">
          {[['dashboard', LayoutDashboard, 'Dashboard'], ['schemes', BookOpen, 'Schemes'], ['users', Users, 'Users']].map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Dashboard tab */}
        {tab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox label="Total Users" value={stats?.totalUsers} color="border-blue-500" />
              <StatBox label="Active Schemes" value={stats?.totalSchemes} color="border-saffron-500" />
              <StatBox label="Total Checks" value={stats?.totalChecks} color="border-green-500" />
              <StatBox label="Checks Today" value={stats?.checksToday} color="border-purple-500" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="card">
                <h3 className="font-semibold text-navy-800 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {stats?.recentUsers?.map(u => (
                    <div key={u._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 font-bold text-sm">
                        {u.name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-800 truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="font-semibold text-navy-800 mb-4">Top Viewed Schemes</h3>
                <div className="space-y-3">
                  {stats?.topSchemes?.map((s, i) => (
                    <div key={s._id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-navy-800 truncate">{s.title}</p>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{s.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schemes tab */}
        {tab === 'schemes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-navy-800">Manage Schemes</h2>
              <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                <Plus size={15} /> Add Scheme
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="card animate-pulse h-16" />)}</div>
            ) : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">SCHEME</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">CATEGORY</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">STATUS</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map(s => (
                      <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy-800 line-clamp-1">{s.title}</p>
                          <p className="text-xs text-gray-400">{s.ministry?.replace('Ministry of ', '')}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="badge badge-saffron">{s.category?.[0]?.replace('_', ' ')}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>
                            {s.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {meta.pages > 1 && (
                  <div className="flex justify-center gap-2 py-4 border-t border-gray-100">
                    <button onClick={() => loadSchemes(Math.max(1, meta.page - 1))} disabled={meta.page === 1} className="p-1.5 rounded-lg border hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span className="text-sm text-gray-600 px-2 flex items-center">Page {meta.page} of {meta.pages}</span>
                    <button onClick={() => loadSchemes(Math.min(meta.pages, meta.page + 1))} disabled={meta.page === meta.pages} className="p-1.5 rounded-lg border hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-semibold text-navy-800">Registered Users</h2>
            {loading ? <div className="card animate-pulse h-48" /> : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">USER</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">STATE</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">OCCUPATION</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">PROFILE</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">JOINED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{u.state || '—'}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {u.occupation ? <span className="badge badge-blue capitalize">{u.occupation}</span> : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.profileComplete ? 'badge-green' : 'badge-gray'}`}>
                            {u.profileComplete ? 'Complete' : 'Incomplete'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">
                          {new Date(u.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scheme Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-navy-800">{editScheme ? 'Edit Scheme' : 'Add New Scheme'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="label">Title *</label>
                <input value={form.title} onChange={e => setF('title', e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="label">Short Description *</label>
                <input value={form.shortDescription} onChange={e => setF('shortDescription', e.target.value)} className="input-field" maxLength={300} required />
              </div>
              <div>
                <label className="label">Full Description *</label>
                <textarea value={form.description} onChange={e => setF('description', e.target.value)} rows={3} className="input-field resize-none" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Ministry *</label>
                  <input value={form.ministry} onChange={e => setF('ministry', e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="label">Category (select multiple)</label>
                  <select multiple value={form.category} onChange={e => setF('category', Array.from(e.target.selectedOptions, o => o.value))} className="input-field h-24">
                    {['agriculture','education','health','women','startup','housing','employment','pension','disability','minority','youth','rural','urban','finance','skill_development'].map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Ctrl+click to select multiple</p>
                </div>
              </div>
              <div>
                <label className="label">Benefits *</label>
                <textarea value={form.benefits} onChange={e => setF('benefits', e.target.value)} rows={2} className="input-field resize-none" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Benefit Amount (display)</label>
                  <input value={form.benefitAmount} onChange={e => setF('benefitAmount', e.target.value)} placeholder="e.g. ₹6,000/year" className="input-field" />
                </div>
                <div>
                  <label className="label">Application Link</label>
                  <input value={form.applicationLink} onChange={e => setF('applicationLink', e.target.value)} placeholder="https://" className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Documents Required (comma-separated)</label>
                <input value={form.documentsRequired} onChange={e => setF('documentsRequired', e.target.value)} placeholder="Aadhaar, PAN Card, ..." className="input-field" />
              </div>
              <div>
                <label className="label">Application Process</label>
                <textarea value={form.applicationProcess} onChange={e => setF('applicationProcess', e.target.value)} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setF('tags', e.target.value)} placeholder="farmer, loan, subsidy" className="input-field" />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-navy-800 text-sm mb-3">Eligibility Criteria</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label">Min Age</label>
                    <input type="number" value={form.eligibility.minAge} onChange={e => setE('minAge', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Max Age</label>
                    <input type="number" value={form.eligibility.maxAge} onChange={e => setE('maxAge', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Gender</label>
                    <select value={form.eligibility.gender} onChange={e => setE('gender', e.target.value)} className="select-field">
                      <option value="any">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="label">Income Limit (₹/year, 0 = no limit)</label>
                    <input type="number" value={form.eligibility.incomeLimitAnnual} onChange={e => setE('incomeLimitAnnual', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Target Categories</label>
                    <select multiple value={form.eligibility.targetCategories}
                      onChange={e => setE('targetCategories', Array.from(e.target.selectedOptions, o => o.value))} className="input-field h-20">
                      {['all','general','sc','st','obc'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">States (comma-separated, empty = all)</label>
                    <input value={form.eligibility.states} onChange={e => setE('states', e.target.value)} placeholder="Maharashtra, Gujarat" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Occupations (comma-separated, empty = all)</label>
                    <input value={form.eligibility.occupations} onChange={e => setE('occupations', e.target.value)} placeholder="farmer, student" className="input-field" />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setF('isActive', e.target.checked)} className="w-4 h-4 rounded text-saffron-600" />
                <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
