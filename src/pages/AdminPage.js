import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:8080/api';
const sevColour = { CRITICAL:'#FF3B30', HIGH:'#FF6B00', MODERATE:'#F59E0B', LOW:'#00D9B8' };
const catIcon   = { INSECURITY:'🔫', ROAD_HAZARD:'🚧', EMERGENCY:'🚑', OUTAGE:'⚡', OTHER:'📍' };

export default function AdminPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const { incidents } = useIncidents();
  const [updating, setUpdating] = useState(null);

  if (!user || user.role !== 'ADMIN') {
    navigate('/map'); return null;
  }

  const pending  = incidents.filter(i => i.status === 'PENDING');
  const verified = incidents.filter(i => i.status === 'VERIFIED');
  const critical = incidents.filter(i => i.severity === 'CRITICAL');

  // Chart data — computed from live incidents state
const catData = ['INSECURITY','ROAD_HAZARD','EMERGENCY','OUTAGE','OTHER'].map(cat => ({
  name: cat.replace('_',' '),
  value: incidents.filter(i => i.category === cat).length,
})).filter(d => d.value > 0);

const sevData = ['LOW','MODERATE','HIGH','CRITICAL'].map(sev => ({
  name: sev,
  value: incidents.filter(i => i.severity === sev).length,
  fill: { LOW:'#00D9B8', MODERATE:'#F59E0B', HIGH:'#FF6B00', CRITICAL:'#FF3B30' }[sev],
}));

  const updateStatus = async (id, status) => {
  setUpdating(id);

  try {
    await axios.patch(`${API}/incidents/${id}/status?status=${status}`);
    toast.success(`Report ${status.toLowerCase()} successfully`);
  } catch {
    toast.error('Failed to update status');
  } finally {
    setUpdating(null);
  }
};

  const StatCard = ({ label, value, colour }) => (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 animate-fade-in">
      <div className="text-3xl font-bold" style={{ color: colour }}>{value}</div>
      <div className="text-xs text-[#8B949E] mt-1 font-medium">{label}</div>
    </div>
  );

  return (
    <PageWrapper>
    <div className="min-h-screen bg-[#0D1117] pt-20 pb-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#F0F4F8]">Admin Dashboard</h1>
          <p className="text-sm text-[#8B949E] mt-1">
            Verify reports and monitor incidents in real time
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Reports"   value={incidents.length} colour="#F0F4F8" />
          <StatCard label="Pending Review"  value={pending.length}   colour="#F59E0B" />
          <StatCard label="Verified"        value={verified.length}  colour="#00D9B8" />
          <StatCard label="Critical Alerts" value={critical.length}  colour="#FF3B30" />
        </div>

        {/* Charts row */}
{incidents.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

    {/* Pie — by category */}
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[#F0F4F8] mb-4">By Category</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={catData} dataKey="value" nameKey="name"
               cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
            {catData.map((_, i) => (
              <Cell key={i}
                fill={['#00D9B8','#F59E0B','#FF3B30','#FF6B00','#8B949E'][i % 5]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background:'#161B22', border:'1px solid #30363D',
                            borderRadius:'8px', fontSize:'12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Bar — by severity */}
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[#F0F4F8] mb-4">By Severity</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={sevData} barSize={28}>
          <XAxis dataKey="name" tick={{ fill:'#8B949E', fontSize:11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:'#8B949E', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background:'#161B22', border:'1px solid #30363D',
                            borderRadius:'8px', fontSize:'12px' }} />
          <Bar dataKey="value" radius={[6,6,0,0]}>
            {sevData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
)}

        {/* Pending incidents table */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#30363D] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#F0F4F8]">
              Pending Review ({pending.length})
            </span>
          </div>

          {pending.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#8B949E]">
              All caught up — no pending reports ✓
            </div>
          ) : (
            <div className="divide-y divide-[#30363D]">
              {pending.map(inc => (
                <div key={inc.id}
                  className="px-5 py-4 flex items-start gap-4 hover:bg-[#1C2128]
                             transition-colors animate-fade-in">

                  {/* Severity dot */}
                  <div className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                       style={{ background: sevColour[inc.severity] || '#555' }} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[#F0F4F8] truncate">
                        {catIcon[inc.category]} {inc.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{
                              background: `${sevColour[inc.severity]}20`,
                              color: sevColour[inc.severity]
                            }}>
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-xs text-[#8B949E] mt-0.5">
                      {inc.category} · {inc.reporterName} ·{' '}
                      {new Date(inc.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-[#8B949E] mt-0.5">
                      📍 {inc.latitude?.toFixed?.(4) ?? inc.latitude},
                      {' '}{inc.longitude?.toFixed?.(4) ?? inc.longitude}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button disabled={updating === inc.id}
                      onClick={() => updateStatus(inc.id, 'VERIFIED')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-[#00D9B8]/10 border border-[#00D9B8]/40 text-[#00D9B8]
                                 hover:bg-[#00D9B8]/20 disabled:opacity-50 transition-all">
                      ✓ Verify
                    </button>
                    <button disabled={updating === inc.id}
                      onClick={() => updateStatus(inc.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-[#FF3B30]/10 border border-[#FF3B30]/40 text-[#FF3B30]
                                 hover:bg-[#FF3B30]/20 disabled:opacity-50 transition-all">
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
