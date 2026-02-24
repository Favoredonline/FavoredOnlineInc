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
  const { currentUser } = useAuth();
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

  // Pre-fill from auth
  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.displayName || '').trim().split(' ');
      if (parts[0]) setFirstName(parts[0]);
      if (parts.slice(1).join(' ')) setLastName(parts.slice(1).join(' '));
      if (currentUser.email) setEmail(currentUser.email);
    }
  }, [currentUser]);

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

      // METHOD 1: fetch with no-cors (primary - most reliable)
      const formBody = new URLSearchParams();
      Object.entries(fields).forEach(([k, v]) => formBody.append(k, v));

      fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      }).catch(() => {});

      // METHOD 2: hidden iframe backup (runs in parallel)
      const iframeName = 'hidden_iframe_' + Date.now();
      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.action = FORM_URL;
      form.method = 'POST';
      form.target = iframeName;
      form.style.display = 'none';

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        try { document.body.removeChild(form); document.body.removeChild(iframe); } catch (_) {}
      }, 3000);

      // Show success after delay
      await new Promise((r) => setTimeout(r, 1500));

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
    <div className="min-h-screen overflow-hidden flex flex-col relative bg-white">
      <Navbar />

      <main className="flex-grow pt-16 sm:pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-7xl">

          {/* Hero Section */}
          <section className="relative mb-16 sm:mb-24 md:mb-32 pt-8 sm:pt-12 md:pt-20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                <div className="h-2 w-2 sm:h-3 sm:w-3 bg-orange-500 rounded-full"></div>
                <span className="text-orange-600 uppercase tracking-widest text-xs sm:text-sm md:text-lg font-black">
                  Personalized 1-on-1 Coaching
                </span>
                <div className="h-2 w-2 sm:h-3 sm:w-3 bg-orange-500 rounded-full"></div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 md:mb-12 leading-[0.9] tracking-tight text-gray-900">
                Career{' '}
                <span className="block mt-2 sm:mt-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500">
                  Coaching
                </span>
              </h1>

              <div className="h-1 sm:h-2 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-8 sm:mb-12 md:mb-16"></div>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 md:mb-16 text-gray-600 max-w-5xl mx-auto leading-relaxed font-light px-4">
                Get personalized guidance from{' '}
                <span className="text-orange-600 font-semibold">experienced tech career professionals</span>.
                Whether you're navigating a{' '}
                <span className="text-orange-600 font-semibold">career transition</span>, preparing for{' '}
                <span className="text-orange-600 font-semibold">interviews</span>, or building{' '}
                <span className="text-orange-600 font-semibold">leadership skills</span>, our coaches are here to help.
              </p>
            </div>
          </section>

          {/* What to Expect Section */}
          <section className="mb-16 sm:mb-24 md:mb-32">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6 md:mb-8">
                What to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Expect
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              {[
                {
                  step: '1',
                  title: 'Apply',
                  description: 'Complete the short application form below and pay the $50 non-refundable application fee.',
                  gradient: 'from-orange-500 to-amber-500',
                },
                {
                  step: '2',
                  title: 'Get Matched',
                  description: 'Receive a personalized coaching document with session pricing and coach details sent to your email.',
                  gradient: 'from-orange-600 to-orange-500',
                },
                {
                  step: '3',
                  title: 'Start Coaching',
                  description: 'Book your first session and begin your career transformation with expert 1-on-1 guidance.',
                  gradient: 'from-amber-500 to-orange-500',
                },
              ].map((item, index) => (
                <div key={index} className="group transform hover:scale-105 transition-all duration-500">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-lg h-full flex flex-col transition-all duration-300 hover:bg-orange-50">
                    <div className="mb-4 sm:mb-6 text-center">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-black mx-auto shadow-md group-hover:shadow-lg transition-shadow duration-500`}>
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 text-gray-900 group-hover:text-orange-600 transition-colors duration-500 text-center">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-center text-sm sm:text-base flex-grow">
                      {item.description}
                    </p>
                    <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${item.gradient} transition-all duration-700 mt-6 rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fee Notice */}
          <section className="mb-16 sm:mb-24 md:mb-32">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-500">
              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 p-6 sm:p-8 md:p-12 text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-6">
                  Application Fee
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-orange-100 font-light leading-relaxed">
                  Important information about the coaching application process
                </p>
              </div>
              <div className="p-6 sm:p-8 md:p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-100">
                    <div className="flex items-center mb-4 sm:mb-6 md:mb-8 justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-lg font-bold mr-3 sm:mr-4 md:mr-6 shadow-md">
                        $50
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
                        Non-Refundable Fee
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-5 md:mb-6 leading-relaxed font-light text-center">
                      A <span className="text-orange-600 font-bold">$50 non-refundable application fee</span> is required and will be credited toward your coaching sessions when you attend.
                    </p>
                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-gray-200">
                      <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
                        <span className="font-bold text-orange-600">After submitting:</span> You'll receive a coaching document with full session pricing and next steps via email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Application Form */}
          <section className="mb-16 sm:mb-24 md:mb-32">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200 shadow-sm">

              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6 md:mb-8">
                  Apply for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    Career Coaching
                  </span>
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                  Fill out the form below to apply for personalized 1-on-1 career coaching with our experienced tech professionals.
                </p>
              </div>

              {formStatus.message && (
                <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                  formStatus.isError
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  <p className="text-base sm:text-lg md:text-xl font-medium">
                    {formStatus.message}
                  </p>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

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

                {/* Left Column */}
                <div className="space-y-4 sm:space-y-6">

                  <div className="group">
                    <label htmlFor="firstName" className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg font-medium"
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="lastName" className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg font-medium"
                      placeholder="Your last name"
                      required
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg font-medium"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="phone" className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      Contact Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg font-medium"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">

                  <div className="group">
                    <label htmlFor="lookingForward" className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      What are you looking forward to in our conversation? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="lookingForward"
                      value={lookingForward}
                      onChange={(e) => setLookingForward(e.target.value)}
                      className="w-full h-[150px] sm:h-[180px] md:h-[200px] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg font-medium resize-none"
                      placeholder="Share your career goals, challenges, or anything on your mind. For example: career transition guidance, interview preparation, building leadership skills, salary negotiation..."
                      required
                    ></textarea>
                  </div>

                  {/* Willing to Pay */}
                  <div className="group">
                    <label className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      Are you willing to pay a <span className="text-orange-600">$50 non-refundable</span> coaching application fee? <span className="text-red-500">*</span>
                    </label>
                    <p className="text-gray-500 text-sm mb-3">This amount is credited toward your coaching sessions when you attend.</p>
                    <div className="flex gap-4">
                      <label
                        className={`flex-1 cursor-pointer rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 text-center transition-all duration-300 ${
                          willingToPay === 'Yes'
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-300 hover:bg-orange-50/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="willingToPay"
                          value="Yes"
                          checked={willingToPay === 'Yes'}
                          onChange={(e) => setWillingToPay(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-lg sm:text-xl font-bold block">✅ Yes</span>
                        <span className="text-sm text-gray-500 mt-1 block">I'm ready to invest</span>
                      </label>
                      <label
                        className={`flex-1 cursor-pointer rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 text-center transition-all duration-300 ${
                          willingToPay === 'No'
                            ? 'border-gray-500 bg-gray-100 text-gray-700 shadow-md'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="willingToPay"
                          value="No"
                          checked={willingToPay === 'No'}
                          onChange={(e) => setWillingToPay(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-lg sm:text-xl font-bold block">❌ No</span>
                        <span className="text-sm text-gray-500 mt-1 block">Not at this time</span>
                      </label>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="group">
                    <label htmlFor="captcha" className="block text-gray-900 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                      Verify you are human <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-100 mb-3 sm:mb-4">
                      <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-black text-gray-900">{captcha.num1}</span>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-600">{captcha.operation}</span>
                        <span className="text-2xl sm:text-3xl font-black text-gray-900">{captcha.num2}</span>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-600">=</span>
                        <span className="text-2xl sm:text-3xl font-black text-gray-400">?</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9-]*"
                        id="captcha"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg font-medium text-center"
                        placeholder="Your answer"
                        maxLength="4"
                        autoComplete="off"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 border border-orange-200 font-semibold text-sm sm:text-base"
                        title="Generate new problem"
                      >
                        REFRESH
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">
                      Solve the math problem above to verify you are human
                    </p>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="lg:col-span-2 flex justify-center mt-6 sm:mt-8">
                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`group relative bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-full font-black text-lg sm:text-xl md:text-2xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden w-full sm:w-auto ${
                      formStatus.isSubmitting ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative flex items-center justify-center">
                      {formStatus.isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2 sm:mr-4 text-xl sm:text-2xl md:text-3xl">⟳</span>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <span className="ml-2 sm:ml-4 group-hover:translate-x-2 transition-transform text-xl sm:text-2xl md:text-3xl">→</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-8 sm:mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4 sm:mb-6">
                <img src="/Images/512X512.png" alt="Favored Online Logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2 sm:mr-3 md:mr-4 transform hover:scale-110 transition-transform duration-300" />
                <span className="text-xl sm:text-2xl md:text-3xl font-black">Favored Online</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
                Tech skills development through hands-on projects and structured learning journeys.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg sm:text-xl font-black text-orange-400 mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base font-medium">Home</Link></li>
                <li><Link to="/career/about" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base font-medium">About</Link></li>
                <li><Link to="/career/contact" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base font-medium">Contact</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg sm:text-xl font-black text-orange-400 mb-4 sm:mb-6">Support & Legal</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><Link to="/career/support" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base font-medium">Support</Link></li>
                <li><Link to="/career/terms" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base font-medium">Terms of Service</Link></li>
                <li><Link to="/career/privacy" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base font-medium">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-gray-400 text-sm sm:text-base">© {new Date().getFullYear()} Favored Online. All rights reserved.</p>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-orange-400 text-lg sm:text-xl">•</span>
                <span className="text-gray-400 text-sm font-medium">Career Coaching</span>
                <span className="text-orange-400 text-lg sm:text-xl">•</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @media (max-width: 768px) {
          button, a, input, textarea, select { min-height: 44px; }
        }
      `}</style>
    </div>
  );
};

export default CareerCoach;
