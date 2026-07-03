import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';

const CATEGORIES = ['INSECURITY','ROAD_HAZARD','EMERGENCY','OUTAGE','OTHER'];
const SEVERITIES = ['LOW','MODERATE','HIGH','CRITICAL'];
const sevColour  = { LOW:'#00D9B8', MODERATE:'#F59E0B', HIGH:'#FF6B00', CRITICAL:'#FF3B30' };

const API = 'http://localhost:8080/api';

export default function ReportPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    title:'', description:'', category:'INSECURITY',
    severity:'MODERATE', latitude:'', longitude:'', mediaUrls:[]
  });
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login'); return null;
  }

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude:  pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocLoading(false);
      },
      () => { setError('Could not get location'); setLocLoading(false); }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      setError('Please set a location first'); return;
    }
    setSubmitting(true); setError('');
    try {
  await axios.post(`${API}/incidents`, {
    ...form,
    latitude: parseFloat(form.latitude),
    longitude: parseFloat(form.longitude),
  });

  toast.success('Report submitted — broadcasting now!');
  setSuccess(true);
  setTimeout(() => navigate('/map'), 2000);

  } catch (err){
  toast.error('Submission failed. Are you logged in?');
  setError('Failed to submit. Make sure you are logged in.');
} finally { setSubmitting(false); }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
      <div className="text-center animate-pop">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-[#F0F4F8]">Report submitted!</h2>
        <p className="text-sm text-[#8B949E] mt-2">Broadcasting to all connected users…</p>
      </div>
    </div>
  );

  return (
    <PageWrapper>
    <div className="min-h-screen bg-[#0D1117] pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto animate-fade-in">

        <h1 className="text-xl font-bold text-[#F0F4F8] mb-1">Report an Incident</h1>
        <p className="text-sm text-[#8B949E] mb-6">
          Your report will appear on the live map instantly.
        </p>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-[#FF3B30]/10 border border-[#FF3B30]/30
                          rounded-lg text-sm text-[#FF3B30]">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#8B949E] mb-1.5">
              Incident Title *
            </label>
            <input name="title" value={form.title} onChange={handle} required
              placeholder="e.g. Armed robbery on Lagos Island"
              className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3 py-2.5
                         text-sm text-[#F0F4F8] placeholder-[#484F58]
                         focus:outline-none focus:border-[#00D9B8] transition-colors" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#8B949E] mb-1.5">
              Description
            </label>
            <textarea name="description" value={form.description} onChange={handle} rows={3}
              placeholder="Describe what you saw in detail…"
              className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3 py-2.5
                         text-sm text-[#F0F4F8] placeholder-[#484F58] resize-none
                         focus:outline-none focus:border-[#00D9B8] transition-colors" />
          </div>

          {/* Category + Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handle}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3 py-2.5
                           text-sm text-[#F0F4F8] focus:outline-none focus:border-[#00D9B8]">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Severity</label>
              <select name="severity" value={form.severity} onChange={handle}
                style={{ borderColor: sevColour[form.severity] }}
                className="w-full bg-[#161B22] border rounded-xl px-3 py-2.5 text-sm
                           text-[#F0F4F8] focus:outline-none transition-colors">
                {SEVERITIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-[#8B949E] mb-1.5">
              Location *
            </label>
            <div className="flex gap-2">
              <input name="latitude" value={form.latitude} onChange={handle}
                placeholder="Latitude" readOnly
                className="flex-1 bg-[#161B22] border border-[#30363D] rounded-xl px-3 py-2.5
                           text-sm text-[#F0F4F8] placeholder-[#484F58] focus:outline-none" />
              <input name="longitude" value={form.longitude} onChange={handle}
                placeholder="Longitude" readOnly
                className="flex-1 bg-[#161B22] border border-[#30363D] rounded-xl px-3 py-2.5
                           text-sm text-[#F0F4F8] placeholder-[#484F58] focus:outline-none" />
              <button type="button" onClick={getLocation} disabled={locLoading}
                className="px-4 py-2.5 rounded-xl bg-[#00D9B8]/10 border border-[#00D9B8]/40
                           text-[#00D9B8] text-xs font-medium hover:bg-[#00D9B8]/20
                           disabled:opacity-50 transition-all whitespace-nowrap">
                {locLoading ? '…' : '📍 My Location'}
              </button>
            </div>
            {form.latitude && (
              <p className="text-xs text-[#00D9B8] mt-1.5">
                ✓ Location set — {form.latitude}, {form.longitude}
              </p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
                       disabled:opacity-50"
            style={{ background: sevColour[form.severity], color:'#0D1117' }}>
            {submitting ? 'Submitting…' : '🚨 Submit Report'}
          </button>

        </form>
      </div>
    </div>
    </PageWrapper>
  );
}