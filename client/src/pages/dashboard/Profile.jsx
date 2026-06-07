import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api/services';
import { Save, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Chandigarh','Puducherry'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '', age: '', gender: '', state: '', district: '',
    income: '', occupation: '', category: '', education: '',
    isDisabled: false, hasLand: false, maritalStatus: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', age: user.age || '', gender: user.gender || '',
        state: user.state || '', district: user.district || '',
        income: user.income || '', occupation: user.occupation || '',
        category: user.category || '', education: user.education || '',
        isDisabled: user.isDisabled || false, hasLand: user.hasLand || false,
        maritalStatus: user.maritalStatus || ''
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setLoading(true);
    try {
      const res = await userAPI.updateProfile({
        ...form,
        age: form.age ? Number(form.age) : undefined,
        income: form.income ? Number(form.income) : undefined,
      });
      updateUser(res.data.data);
      setSaved(true);
      toast.success('Profile updated! AI recommendations will refresh.');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const profileFields = ['age', 'gender', 'state', 'income', 'occupation', 'category'];
  const filledFields = profileFields.filter(f => form[f] !== '' && form[f] !== null && form[f] !== 0 && form[f] !== undefined);
  const pct = Math.round((filledFields.length / profileFields.length) * 100);

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy-800 flex items-center gap-2">
          <User size={22} className="text-saffron-600" /> My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Your profile helps AI find the most relevant schemes</p>
      </div>

      {/* Progress */}
      <div className="card bg-gradient-to-r from-saffron-50 to-white border-saffron-200">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-navy-800 text-sm">Profile Completeness</p>
          <span className={`font-bold text-sm ${pct === 100 ? 'text-green-600' : 'text-saffron-600'}`}>{pct}%</span>
        </div>
        <div className="h-2 bg-saffron-100 rounded-full overflow-hidden">
          <div className="h-full bg-saffron-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><CheckCircle size={12} /> Profile complete! AI recommendations are fully personalised.</p>}
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Basic info */}
        <div>
          <h2 className="font-semibold text-navy-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Age</label>
              <input name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} placeholder="e.g. 28" className="input-field" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="select-field">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Marital Status</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="select-field">
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="font-semibold text-navy-800 mb-4 pb-2 border-b border-gray-100">Location</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">State</label>
              <select name="state" value={form.state} onChange={handleChange} className="select-field">
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">District</label>
              <input name="district" value={form.district} onChange={handleChange} placeholder="Your district" className="input-field" />
            </div>
          </div>
        </div>

        {/* Economic profile */}
        <div>
          <h2 className="font-semibold text-navy-800 mb-4 pb-2 border-b border-gray-100">Economic Profile</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Annual Income (₹)</label>
              <input name="income" type="number" min="0" value={form.income} onChange={handleChange} placeholder="e.g. 200000" className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Enter 0 if no income</p>
            </div>
            <div>
              <label className="label">Occupation</label>
              <select name="occupation" value={form.occupation} onChange={handleChange} className="select-field">
                <option value="">Select occupation</option>
                <option value="student">Student</option>
                <option value="farmer">Farmer</option>
                <option value="self-employed">Self-Employed</option>
                <option value="salaried">Salaried Employee</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Social Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="select-field">
                <option value="">Select category</option>
                <option value="general">General</option>
                <option value="sc">SC (Scheduled Caste)</option>
                <option value="st">ST (Scheduled Tribe)</option>
                <option value="obc">OBC</option>
              </select>
            </div>
            <div>
              <label className="label">Education Level</label>
              <select name="education" value={form.education} onChange={handleChange} className="select-field">
                <option value="">Select education</option>
                <option value="below_10th">Below 10th</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="graduate">Graduate</option>
                <option value="postgraduate">Post-Graduate</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional */}
        <div>
          <h2 className="font-semibold text-navy-800 mb-4 pb-2 border-b border-gray-100">Additional Details</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isDisabled" checked={form.isDisabled} onChange={handleChange}
                className="w-4 h-4 rounded text-saffron-600 border-gray-300 focus:ring-saffron-500" />
              <div>
                <span className="font-medium text-sm text-gray-700">Person with Disability (Divyangjan)</span>
                <p className="text-xs text-gray-400">Check to unlock disability-specific schemes</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="hasLand" checked={form.hasLand} onChange={handleChange}
                className="w-4 h-4 rounded text-saffron-600 border-gray-300 focus:ring-saffron-500" />
              <div>
                <span className="font-medium text-sm text-gray-700">I own agricultural land</span>
                <p className="text-xs text-gray-400">Relevant for farming and land-based schemes</p>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
            saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {loading ? 'Saving...' : saved ? 'Profile Saved!' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
