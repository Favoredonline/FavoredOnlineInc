// src/Pages/user/CareerCoach.jsx - CAREER COACHING APPLICATION PAGE

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const CareerCoach = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Pre-fill form URL with user data if available
  const baseFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdW_rYRPNVLycQnMq9FsB5TNCfBg5dlrff1E59tH7rWf3nnOg/viewform?embedded=true';
  
  const buildFormUrl = () => {
    let url = baseFormUrl;
    if (currentUser) {
      const displayName = currentUser.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const email = currentUser.email || '';

      if (firstName) url += `&entry.2005620554=${encodeURIComponent(firstName)}`;
      if (lastName) url += `&entry.1934638032=${encodeURIComponent(lastName)}`;
      if (email) url += `&entry.1045781291=${encodeURIComponent(email)}`;
    }
    return url;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-blue-500/10" />
          <div className="relative max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 pt-6 xs:pt-8 sm:pt-12 pb-6 xs:pb-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 xs:mb-6 min-h-[44px] px-2 py-2 rounded-lg hover:bg-white/5 active:bg-white/10"
              aria-label="Back to dashboard"
            >
              <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs xs:text-sm font-medium">Back to Dashboard</span>
            </button>

            {/* Page Title */}
            <div className="text-center mb-6 xs:mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl xs:rounded-2xl mb-3 xs:mb-4 shadow-lg shadow-orange-500/30">
                <svg className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 xs:mb-3 leading-tight"
                  style={{ textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.9)', fontFamily: '"Inter", sans-serif' }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500">
                  Career Coaching
                </span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-2"
                 style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                Get personalized guidance from experienced career coaches to accelerate your tech career journey.
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 pb-4 xs:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xs:gap-4 mb-6 xs:mb-8">
            {/* How It Works */}
            <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 backdrop-blur-2xl rounded-lg xs:rounded-xl p-4 xs:p-5 border border-white/20 shadow-2xl">
              <div className="w-9 h-9 xs:w-10 xs:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-sm xs:text-base font-bold text-white mb-1.5" style={{ fontFamily: '"Inter", sans-serif' }}>Step 1: Apply</h3>
              <p className="text-xs xs:text-sm text-gray-300 leading-relaxed">
                Fill out the application form below with your details and goals.
              </p>
            </div>

            {/* Application Fee */}
            <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 backdrop-blur-2xl rounded-lg xs:rounded-xl p-4 xs:p-5 border border-orange-500/30 shadow-2xl">
              <div className="w-9 h-9 xs:w-10 xs:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm xs:text-base font-bold text-white mb-1.5" style={{ fontFamily: '"Inter", sans-serif' }}>Step 2: Pay $50 Fee</h3>
              <p className="text-xs xs:text-sm text-gray-300 leading-relaxed">
                The <span className="text-orange-400 font-semibold">$50 non-refundable application fee</span> will be credited toward your coaching sessions if you proceed.
              </p>
            </div>

            {/* Get Coaching Doc */}
            <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 backdrop-blur-2xl rounded-lg xs:rounded-xl p-4 xs:p-5 border border-white/20 shadow-2xl">
              <div className="w-9 h-9 xs:w-10 xs:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm xs:text-base font-bold text-white mb-1.5" style={{ fontFamily: '"Inter", sans-serif' }}>Step 3: Coaching Doc</h3>
              <p className="text-xs xs:text-sm text-gray-300 leading-relaxed">
                After your application fee, you'll receive a coaching document with session pricing and booking details.
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg xs:rounded-xl p-4 xs:p-5 border border-orange-500/30 mb-6 xs:mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 xs:w-9 xs:h-9 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm xs:text-base font-bold text-orange-400 mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Important: About the Application Fee
                </h4>
                <p className="text-xs xs:text-sm text-gray-300 leading-relaxed">
                  The <span className="font-semibold text-white">$50 non-refundable coaching application fee</span> is part of your overall career coaching fees. 
                  If you eventually show up for your coaching sessions, this amount will be <span className="font-semibold text-green-400">deducted from your total coaching cost</span> — 
                  meaning it goes directly toward paying for your sessions, not an extra charge.
                </p>
                <p className="text-xs xs:text-sm text-gray-300 leading-relaxed mt-2">
                  After submitting the application and fee, a <span className="font-semibold text-white">coaching document will be sent to you</span> containing the full pricing 
                  breakdown for the coaching sessions you'd like to book. You can then choose the plan that works best for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 pb-8 xs:pb-12">
          <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 backdrop-blur-2xl rounded-lg xs:rounded-xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="p-4 xs:p-5 sm:p-6 border-b border-white/10">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-white flex items-center gap-2"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,0.8)', fontFamily: '"Inter", sans-serif' }}>
                <svg className="w-5 h-5 xs:w-6 xs:h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Career Coaching Application Form
              </h2>
              <p className="text-xs xs:text-sm text-gray-400 mt-1">
                Complete all required fields to submit your application.
              </p>
            </div>

            {/* Loading Indicator */}
            {!iframeLoaded && (
              <div className="flex items-center justify-center py-16 xs:py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 xs:h-12 xs:w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading application form...</p>
                </div>
              </div>
            )}

            {/* Google Form Embed */}
            <div className={`${!iframeLoaded ? 'h-0 overflow-hidden' : ''}`}>
              <iframe
                src={buildFormUrl()}
                width="100%"
                height="900"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Career Coaching Application Form"
                onLoad={() => setIframeLoaded(true)}
                className="w-full"
                style={{ minHeight: '900px' }}
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 pb-8 xs:pb-12">
          <div className="text-center">
            <p className="text-xs xs:text-sm text-gray-500">
              Have questions? Reach out to us at{' '}
              <a
                href="https://careers.favoredonline.com/career/support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline transition-colors"
              >
                Support
              </a>
            </p>
          </div>
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Inter', sans-serif; }
        `}</style>
      </div>
    </>
  );
};

export default CareerCoach;
