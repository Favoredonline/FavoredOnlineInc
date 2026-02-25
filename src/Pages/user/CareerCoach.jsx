// src/Pages/user/CareerCoach.jsx - CAREER COACHING APPLICATION FORM
// Standard form submission (same pattern as Support.jsx)

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

// ─── GOOGLE FORM CONFIG ───────────────────────────────────────────────────────
// Form action URL (from the actual Google Form HTML source)
const FORM_URL =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfJOTuBNLF5O0tWip8nH1XfqXhoKVDuk4j4pzCM1kDMGHmdWw/formResponse';

// Entry IDs extracted from the actual Google Form HTML source
const FIELD_IDS = {
  firstName:      'entry.640877948',
  lastName:       'entry.708138434',
  email:          'entry.64027578',
  phone:          'entry.1300524080',
  lookingForward: 'entry.1092093939',
  willingToPay:   'entry.133740837',
};

const CareerCoach = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookingForward, setLookingForward] = useState('');
  const [willingToPay, setWillingToPay] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');

  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isSubmitting: false,
    isSuccess: false,
  });

  // Captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '*'];
    const operation = ops[Math.floor(Math.random() * ops.length)];
    let answer;
    switch (operation) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
      default:  answer = num1 + num2;
    }
    setCaptcha({ num1, num2, operation, answer });
    setUserAnswer('');
  };

  useEffect(() => { generateCaptcha(); }, []);

  // ─── Submission (same pattern as Support.jsx) ───────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot
    if (honeypot) {
      setFormStatus({ message: 'There was an error. Please try again later.', isError: true, isSubmitting: false, isSuccess: false });
      generateCaptcha();
      return;
    }

    // Captcha check
    const parsed = parseInt(userAnswer.trim(), 10);
    if (isNaN(parsed) || parsed !== captcha.answer) {
      setFormStatus({ message: 'Please solve the math problem correctly to verify you are human.', isError: true, isSubmitting: false, isSuccess: false });
      generateCaptcha();
      return;
    }

    // Willing to pay validation
    if (!willingToPay) {
      setFormStatus({ message: 'Please select whether you are willing to pay the application fee.', isError: true, isSubmitting: false, isSuccess: false });
      return;
    }

    setFormStatus({ message: '', isError: false, isSubmitting: true, isSuccess: false });

    try {
      const fields = {
        [FIELD_IDS.firstName]:      firstName,
        [FIELD_IDS.lastName]:       lastName,
        [FIELD_IDS.email]:          email,
        [FIELD_IDS.phone]:          phone || 'Not provided',
        [FIELD_IDS.lookingForward]: lookingForward,
        [FIELD_IDS.willingToPay]:   willingToPay,
      };

      // Submit via fetch (single request, no iframe)
      const formBody = new URLSearchParams();
      Object.entries(fields).forEach(([k, v]) => formBody.append(k, v));

      await fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });

      setFormStatus({
        message: `🎉 Application submitted successfully, ${firstName}! Check your email at ${email} for next steps. We'll send you a coaching document with full session pricing. The $50 application fee will be credited toward your sessions.`,
        isError: false,
        isSubmitting: false,
        isSuccess: true,
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setLookingForward('');
      setWillingToPay('');
      setHoneypot('');
      setUserAnswer('');
      generateCaptcha();

    } catch (error) {
      setFormStatus({ message: 'There was an error submitting your application. Please try again later.', isError: true, isSubmitting: false, isSuccess: false });
      generateCaptcha();
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="pt-20 sm:pt-24">

        {/* ═══════════════════════════════════════ */}
        {/* HERO                                   */}
        {/* ═══════════════════════════════════════ */}
        <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-300 text-xs sm:text-sm font-semibold tracking-wide">Personalized 1-on-1 Coaching</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
              <span className="text-white">Career</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Coaching
              </span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-10">
              Get personalized guidance from <span className="text-orange-400 font-medium">experienced tech career professionals</span> — whether you're navigating a career transition, preparing for interviews, or building leadership skills.
            </p>

            <a href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full font-bold text-base sm:text-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-105">
              Apply Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* HOW IT WORKS                           */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                How It <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">Three simple steps to start your coaching journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  step: '01',
                  title: 'Apply',
                  description: 'Complete the short application form below and pay the $50 non-refundable application fee.',
                  icon: '📝'
                },
                {
                  step: '02',
                  title: 'Get Matched',
                  description: 'Receive a personalized coaching document with session pricing and coach details sent to your email.',
                  icon: '🤝'
                },
                {
                  step: '03',
                  title: 'Start Coaching',
                  description: 'Book your first session and begin your career transformation with expert 1-on-1 guidance.',
                  icon: '🚀'
                },
              ].map((item, index) => (
                <div key={index} className="group relative">
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-orange-500/30 to-transparent z-0" />
                  )}
                  <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/20 rounded-2xl p-7 sm:p-8 transition-all duration-300 hover:bg-white/[0.05] h-full">
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-orange-400/40 text-4xl font-black">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* APPLICATION FEE NOTICE                 */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-16 sm:py-20 border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-amber-500/10 border border-orange-500/15 p-8 sm:p-10 md:p-12">
                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white text-2xl font-black mb-6 shadow-lg shadow-orange-500/20">
                    $50
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Application Fee</h3>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 max-w-lg mx-auto">
                    A <span className="text-orange-400 font-semibold">$50 non-refundable application fee</span> is required and will be credited toward your coaching sessions when you attend.
                  </p>
                  <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                    <span className="text-orange-400 text-lg">📧</span>
                    <p className="text-gray-300 text-sm">
                      <span className="text-orange-400 font-semibold">After submitting:</span> You'll receive a coaching document with full session pricing and next steps via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* APPLICATION FORM                       */}
        {/* ═══════════════════════════════════════ */}
        <section id="apply" className="py-16 sm:py-24 border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

              {/* Form Header */}
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                  Apply for{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Career Coaching</span>
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                  Fill out the form below and we'll match you with an experienced tech career coach.
                </p>
              </div>

              {/* Status Message */}
              {formStatus.message && (
                <div className={`mb-8 p-5 sm:p-6 rounded-xl border transition-all duration-500 ${
                  formStatus.isError
                    ? 'bg-red-500/10 text-red-300 border-red-500/20'
                    : 'bg-green-500/10 text-green-300 border-green-500/20'
                }`}>
                  <p className="text-base sm:text-lg font-medium">{formStatus.message}</p>
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 sm:p-8 md:p-10">
                <form ref={formRef} onSubmit={handleSubmit}>

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">

                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-gray-300 font-semibold mb-2 text-sm">
                        First Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-base"
                        placeholder="Your first name"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-gray-300 font-semibold mb-2 text-sm">
                        Last Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-base"
                        placeholder="Your last name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm">
                        Email Address <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-base"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-gray-300 font-semibold mb-2 text-sm">
                        Contact Number <span className="text-gray-600">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-base"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Looking Forward - Full Width */}
                  <div className="mb-6">
                    <label htmlFor="lookingForward" className="block text-gray-300 font-semibold mb-2 text-sm">
                      What are you looking forward to in our conversation? <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                      id="lookingForward"
                      value={lookingForward}
                      onChange={(e) => setLookingForward(e.target.value)}
                      className="w-full h-36 sm:h-44 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-base resize-none"
                      placeholder="Share your career goals, challenges, or anything on your mind. For example: career transition guidance, interview preparation, building leadership skills, salary negotiation..."
                      required
                    />
                  </div>

                  {/* Willing to Pay */}
                  <div className="mb-6">
                    <label className="block text-gray-300 font-semibold mb-2 text-sm">
                      Are you willing to pay a <span className="text-orange-400">$50 non-refundable</span> coaching application fee? <span className="text-orange-400">*</span>
                    </label>
                    <p className="text-gray-500 text-xs mb-3">This amount is credited toward your coaching sessions when you attend.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                        willingToPay === 'Yes'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                      }`}>
                        <input
                          type="radio"
                          name="willingToPay"
                          value="Yes"
                          checked={willingToPay === 'Yes'}
                          onChange={(e) => setWillingToPay(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-lg font-bold block">✅ Yes</span>
                        <span className="text-xs text-gray-500 mt-1 block">I'm ready to invest</span>
                      </label>
                      <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                        willingToPay === 'No'
                          ? 'border-gray-500 bg-gray-500/10 text-gray-300'
                          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                      }`}>
                        <input
                          type="radio"
                          name="willingToPay"
                          value="No"
                          checked={willingToPay === 'No'}
                          onChange={(e) => setWillingToPay(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-lg font-bold block">❌ No</span>
                        <span className="text-xs text-gray-500 mt-1 block">Not at this time</span>
                      </label>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="mb-8">
                    <label htmlFor="captcha" className="block text-gray-300 font-semibold mb-2 text-sm">
                      Verify you are human <span className="text-orange-400">*</span>
                    </label>
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-5 mb-3">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl font-black text-white">{captcha.num1}</span>
                        <span className="text-3xl font-black text-orange-400">{captcha.operation}</span>
                        <span className="text-3xl font-black text-white">{captcha.num2}</span>
                        <span className="text-3xl font-black text-orange-400">=</span>
                        <span className="text-3xl font-black text-gray-600">?</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9-]*"
                        id="captcha"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="flex-1 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-lg font-medium text-center"
                        placeholder="Your answer"
                        maxLength="4"
                        autoComplete="off"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-orange-500/30 text-orange-400 font-semibold text-sm transition-all hover:bg-orange-500/5"
                        title="Generate new problem"
                      >
                        ↻ New
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`w-full py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 ${
                      formStatus.isSubmitting
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01]'
                    }`}
                  >
                    {formStatus.isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="animate-spin text-xl">⟳</span>
                        Submitting Application...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Submit Application
                        <span className="text-xl">→</span>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════ */}
      {/* FOOTER                                 */}
      {/* ═══════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/Images/512X512.png" alt="Favored Online" className="w-8 h-8" />
                <span className="text-lg font-bold text-white">Favored Online</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tech skills development through hands-on projects and structured learning journeys.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Home</Link></li>
                <li><Link to="/career/about" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">About</Link></li>
                <li><Link to="/career/contact" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-4">Support & Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/career/support" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Support</Link></li>
                <li><Link to="/career/terms" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Terms of Service</Link></li>
                <li><Link to="/career/privacy" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Favored Online. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareerCoach;
