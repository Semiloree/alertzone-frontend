import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🗺', title: 'Live Incident Map',    desc: 'See every report appear on the map in real time — no refresh needed.' },
  { icon: '⚡', title: 'Instant WebSocket Push', desc: 'Powered by Spring Boot WebSockets. Sub-second broadcast to all users.' },
  { icon: '🔒', title: 'Secure by Default',     desc: 'JWT authentication with role-based access control for admins.' },
  { icon: '📍', title: 'GPS Location',           desc: 'One-tap GPS detection or click the map to pin your exact location.' },
  { icon: '🚨', title: 'Critical Alerts',        desc: 'CRITICAL incidents trigger a real-time banner alert on every screen.' },
  { icon: '🛡️', title: 'Admin Verification',    desc: 'Admins review and verify reports before they become official.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] pt-14">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[600px] rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #00D9B8 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-2xl mx-auto animate-fade-in">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-[#FF3B30]/40 bg-[#FF3B30]/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="text-xs font-medium text-[#FF3B30]">Live incident reporting — Nigeria & beyond</span>
          </div>

          <h1 className="text-5xl font-bold text-[#F0F4F8] leading-tight mb-4">
            Report incidents.<br />
            <span className="text-[#00D9B8]">Save lives.</span>
          </h1>
          <p className="text-lg text-[#8B949E] mb-10 leading-relaxed">
            AlertZone is a distributed real-time incident reporting platform.
            Submit security threats, road hazards, and emergencies — and watch
            them broadcast to every user instantly.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/map"
              className="px-8 py-3.5 rounded-xl bg-[#00D9B8] text-[#0D1117] font-semibold
                         text-sm hover:bg-[#00D9B8]/80 transition-all duration-200
                         shadow-lg shadow-[#00D9B8]/20">
              View Live Map →
            </Link>
            <Link to="/register"
              className="px-8 py-3.5 rounded-xl border border-[#30363D] text-[#F0F4F8]
                         font-semibold text-sm hover:border-[#00D9B8] hover:text-[#00D9B8]
                         transition-all duration-200">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[#30363D] bg-[#161B22] py-6 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: 'Real-Time', label: 'WebSocket broadcast' },
            { value: '5 types',   label: 'Incident categories' },
            { value: '4 levels',  label: 'Severity scale' },
          ].map(s => (
            <div key={s.value}>
              <div className="text-xl font-bold text-[#00D9B8]">{s.value}</div>
              <div className="text-xs text-[#8B949E] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#F0F4F8] text-center mb-12">
          Built for real-world impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5
                         hover:border-[#00D9B8]/40 transition-all duration-300
                         hover:bg-[#1C2128] group">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-[#F0F4F8] mb-1.5
                             group-hover:text-[#00D9B8] transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-16 text-center border-t border-[#30363D]">
        <h2 className="text-2xl font-bold text-[#F0F4F8] mb-3">
          See something? Report it.
        </h2>
        <p className="text-sm text-[#8B949E] mb-8">
          Your report reaches every connected user in under a second.
        </p>
        <Link to="/report"
          className="inline-block px-10 py-3.5 rounded-xl bg-[#FF3B30] text-white
                     font-semibold text-sm hover:bg-[#FF3B30]/80 transition-all duration-200
                     shadow-lg shadow-[#FF3B30]/20 animate-pulse-red">
          🚨 Report Now
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#30363D] py-6 px-6 text-center">
        <p className="text-xs text-[#8B949E]">
          AlertZone · Built with Spring Boot, React & WebSockets
        </p>
      </footer>
    </div>
  );
}
