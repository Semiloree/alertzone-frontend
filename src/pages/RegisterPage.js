import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/map');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper>
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#00D9B8]/20 border border-[#00D9B8]/40
                          flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F0F4F8]">
            Alert<span className="text-[#00D9B8]">Zone</span>
          </h1>
          <p className="text-sm text-[#8B949E] mt-1">Join the reporting network</p>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-[#F0F4F8] mb-5">Create account</h2>

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-[#FF3B30]/10 border border-[#FF3B30]/30
                            rounded-lg text-sm text-[#FF3B30]">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {[
              { name:'name',     label:'Full Name', type:'text',     ph:'Ada Okonkwo' },
              { name:'email',    label:'Email',     type:'email',    ph:'you@example.com' },
              { name:'password', label:'Password',  type:'password', ph:'At least 8 characters' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-[#8B949E] mb-1.5">{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.ph}
                  value={form[f.name]} onChange={handle} required
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl
                             px-3 py-2.5 text-sm text-[#F0F4F8] placeholder-[#484F58]
                             focus:outline-none focus:border-[#00D9B8] transition-colors" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#00D9B8] text-[#0D1117] font-semibold
                         text-sm hover:bg-[#00D9B8]/80 disabled:opacity-50 transition-all mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-xs text-[#8B949E] text-center mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00D9B8] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}