import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-7xl font-bold text-[#30363D] mb-4">404</div>
          <div className="text-6xl mb-6">🗺</div>
          <h1 className="text-xl font-semibold text-[#F0F4F8] mb-2">
            Page not found
          </h1>
          <p className="text-sm text-[#8B949E] mb-8">
            This location doesn't exist on the AlertZone map.
          </p>
          <Link to="/"
            className="px-6 py-2.5 rounded-xl bg-[#00D9B8] text-[#0D1117] font-semibold
                       text-sm hover:bg-[#00D9B8]/80 transition-all duration-200">
            Back to Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
