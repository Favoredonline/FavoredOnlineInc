// src/Pages/user/CareerCoach.jsx - INTERACTIVE CHATBOT CAREER COACHING APPLICATION

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

// ─── CONVERSATION FLOW STEPS ───────────────────────────────────────────────
const STEPS = [
  {
    id: 'welcome',
    type: 'info',
    message: "👋 Welcome to **Career Coaching** at Favored Online! I'm here to help you apply for personalized 1-on-1 coaching with our experienced tech career professionals.\n\nBefore we begin, here's what to expect:\n• A short application (takes ~3 minutes)\n• A **$50 non-refundable application fee** credited toward your sessions\n• A coaching document sent to you with full session pricing\n\nReady to get started?",
    action: 'start',
    actionLabel: "Let's go! →",
  },
  {
    id: 'firstName',
    type: 'input',
    field: 'firstName',
    message: "Great! Let's start with the basics.\n\nWhat's your **first name**?",
    placeholder: 'Your first name...',
    validate: (v) => v.trim().length >= 2 ? null : 'Please enter at least 2 characters.',
  },
  {
    id: 'lastName',
    type: 'input',
    field: 'lastName',
    message: (data) => `Nice to meet you, **${data.firstName}**! 👋\n\nAnd your **last name**?`,
    placeholder: 'Your last name...',
    validate: (v) => v.trim().length >= 2 ? null : 'Please enter at least 2 characters.',
  },
  {
    id: 'email',
    type: 'input',
    field: 'email',
    inputType: 'email',
    message: "Perfect. What **email address** should we use to send your coaching document?",
    placeholder: 'your@email.com',
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email address.',
  },
  {
    id: 'phone',
    type: 'input',
    field: 'phone',
    inputType: 'tel',
    message: "Got it! What's the best **phone number** to reach you?",
    placeholder: '+1 (555) 000-0000',
    validate: (v) => v.trim().length >= 7 ? null : 'Please enter a valid phone number.',
  },
  {
    id: 'currentRole',
    type: 'input',
    field: 'currentRole',
    message: "Now let's talk about where you are today.\n\nWhat is your **current job title or role**? (e.g. \"Software Engineer\", \"Recent Graduate\", \"Product Manager\")",
    placeholder: 'Your current role...',
    validate: (v) => v.trim().length >= 2 ? null : 'Please describe your current role.',
  },
  {
    id: 'experience',
    type: 'choice',
    field: 'experience',
    message: "How many **years of experience** do you have in tech?",
    choices: [
      { value: '0-1 years', label: '0–1 years', sub: 'Just starting out' },
      { value: '1-3 years', label: '1–3 years', sub: 'Building experience' },
      { value: '3-5 years', label: '3–5 years', sub: 'Mid-level' },
      { value: '5-10 years', label: '5–10 years', sub: 'Senior level' },
      { value: '10+ years', label: '10+ years', sub: 'Veteran' },
    ],
  },
  {
    id: 'goal',
    type: 'choice',
    field: 'goal',
    message: "What is your **primary coaching goal**?",
    choices: [
      { value: 'Land my first tech job', label: '🚀 Land my first tech job', sub: 'Breaking into the industry' },
      { value: 'Get a promotion or raise', label: '📈 Get a promotion or raise', sub: 'Level up at current company' },
      { value: 'Switch tech roles', label: '🔄 Switch tech roles', sub: 'Change specialization' },
      { value: 'Move to a top company', label: '🏢 Move to a top company', sub: 'FAANG / top-tier employer' },
      { value: 'Build leadership skills', label: '🎯 Build leadership skills', sub: 'Grow into management' },
      { value: 'Start a tech business', label: '💡 Start a tech business', sub: 'Entrepreneurship path' },
    ],
  },
  {
    id: 'challenge',
    type: 'input',
    field: 'challenge',
    message: (data) => `Understood — **"${data.goal}"** is a great goal!\n\nWhat is the **biggest challenge** holding you back right now? Be as specific as you like.`,
    placeholder: "e.g. I keep failing technical interviews, I don't know how to negotiate salary...",
    multiline: true,
    validate: (v) => v.trim().length >= 10 ? null : 'Please share a bit more detail (at least 10 characters).',
  },
  {
    id: 'availability',
    type: 'choice',
    field: 'availability',
    message: "When are you typically **available for coaching sessions**?",
    choices: [
      { value: 'Weekday mornings', label: '🌅 Weekday mornings', sub: '7am – 12pm' },
      { value: 'Weekday afternoons', label: '☀️ Weekday afternoons', sub: '12pm – 5pm' },
      { value: 'Weekday evenings', label: '🌆 Weekday evenings', sub: '5pm – 9pm' },
      { value: 'Weekends', label: '📅 Weekends', sub: 'Saturday or Sunday' },
      { value: 'Flexible', label: '🔄 Flexible', sub: 'I can work around the coach' },
    ],
  },
  {
    id: 'howHeard',
    type: 'choice',
    field: 'howHeard',
    message: "Last question — how did you **hear about our coaching program**?",
    choices: [
      { value: 'Favored Online dashboard', label: '🖥️ Favored Online dashboard', sub: 'Found it while browsing' },
      { value: 'Referred by a friend', label: '👥 Referred by a friend', sub: 'Word of mouth' },
      { value: 'Social media', label: '📱 Social media', sub: 'LinkedIn, Twitter, etc.' },
      { value: 'Community post', label: '💬 Community post', sub: 'Saw it in the community' },
      { value: 'Other', label: '🔍 Other', sub: '' },
    ],
  },
  {
    id: 'review',
    type: 'review',
    message: "Almost done! Here's a **summary of your application**. Please review everything below and hit submit when you're ready:",
  },
  {
    id: 'submitted',
    type: 'success',
    message: (data) => `🎉 **Application submitted, ${data.firstName}!**\n\nThank you for applying to Favored Online Career Coaching. Here's what happens next:\n\n**1.** Check your email at **${data.email}** for a confirmation\n**2.** Complete the **$50 application fee** to reserve your spot\n**3.** Receive your personalized **coaching document** with session pricing\n**4.** Book your first session!\n\nWe're excited to help you reach your goals. 🚀`,
  },
];

// ─── PARSE BOLD MARKDOWN ──────────────────────────────────────────────────
const ParsedText = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="text-white font-semibold">{part}</strong>
          : <span key={i}>{part.split('\n').map((line, j, arr) => (
              <React.Fragment key={j}>{line}{j < arr.length - 1 && <br />}</React.Fragment>
            ))}</span>
      )}
    </>
  );
};

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────
const BotBubble = ({ text, animate = true }) => {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    }
  }, [animate]);

  return (
    <div className={`flex items-start gap-2 xs:gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      <div className="flex-shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mt-0.5">
        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="max-w-[85%] xs:max-w-[80%] sm:max-w-[75%] bg-white/8 border border-white/12 rounded-2xl rounded-tl-sm px-3 xs:px-4 py-2.5 xs:py-3 shadow-lg">
        <p className="text-gray-200 text-xs xs:text-sm sm:text-base leading-relaxed">
          <ParsedText text={text} />
        </p>
      </div>
    </div>
  );
};

const UserBubble = ({ text }) => (
  <div className="flex justify-end">
    <div className="max-w-[75%] xs:max-w-[70%] bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl rounded-tr-sm px-3 xs:px-4 py-2 xs:py-2.5 shadow-lg shadow-orange-500/20">
      <p className="text-white text-xs xs:text-sm sm:text-base leading-relaxed font-medium">{text}</p>
    </div>
  </div>
);

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-start gap-2 xs:gap-3">
    <div className="flex-shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mt-0.5">
      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
    <div className="bg-white/8 border border-white/12 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
      <div className="flex gap-1.5 items-center h-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── REVIEW CARD ──────────────────────────────────────────────────────────
const ReviewCard = ({ data }) => {
  const fields = [
    { label: 'Full Name', value: `${data.firstName || ''} ${data.lastName || ''}`.trim() },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Current Role', value: data.currentRole },
    { label: 'Experience', value: data.experience },
    { label: 'Primary Goal', value: data.goal },
    { label: 'Main Challenge', value: data.challenge },
    { label: 'Availability', value: data.availability },
    { label: 'How You Heard', value: data.howHeard },
  ].filter(f => f.value);

  return (
    <div className="w-full mt-2">
      <div className="bg-white/5 border border-white/15 rounded-2xl overflow-hidden">
        <div className="px-3 xs:px-4 py-2.5 border-b border-white/10 bg-orange-500/10">
          <p className="text-orange-400 font-semibold text-[10px] xs:text-xs uppercase tracking-widest">Application Summary</p>
        </div>
        <div className="divide-y divide-white/8">
          {fields.map(({ label, value }) => (
            <div key={label} className="px-3 xs:px-4 py-2 xs:py-2.5 flex gap-2 xs:gap-3">
              <span className="text-gray-500 text-[10px] xs:text-xs font-medium uppercase tracking-wide w-20 xs:w-28 flex-shrink-0 mt-0.5">{label}</span>
              <span className="text-gray-200 text-xs xs:text-sm leading-relaxed flex-1 break-words">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 bg-orange-500/10 border border-orange-500/30 rounded-xl px-3 xs:px-4 py-2.5 xs:py-3">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-300 text-[11px] xs:text-xs leading-relaxed">
            By submitting, you agree to the <span className="text-orange-400 font-semibold">$50 non-refundable application fee</span>. This amount is credited toward your coaching sessions when you attend.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
const CareerCoach = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [showReviewCard, setShowReviewCard] = useState(false);

  // Pre-fill from auth
  useEffect(() => {
    if (currentUser) {
      const displayName = currentUser.displayName || '';
      const parts = displayName.trim().split(' ');
      const pre = {};
      if (parts[0]) pre.firstName = parts[0];
      if (parts.slice(1).join(' ')) pre.lastName = parts.slice(1).join(' ');
      if (currentUser.email) pre.email = currentUser.email;
      setFormData(pre);
    }
  }, [currentUser]);

  // Initial welcome message
  useEffect(() => {
    const welcome = STEPS[0];
    setMessages([{ role: 'bot', text: welcome.message, id: 'welcome-0' }]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, isTyping, showReviewCard]);

  // Focus input
  useEffect(() => {
    const step = STEPS[stepIndex];
    if (step?.type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [stepIndex]);

  const resolveMessage = (step, data) =>
    typeof step.message === 'function' ? step.message(data) : step.message;

  const pushBotMessage = useCallback((text, delay = 650) => {
    return new Promise(resolve => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'bot', text, id: `bot-${Date.now()}-${Math.random()}` }]);
        resolve();
      }, delay);
    });
  }, []);

  const advanceToStep = useCallback(async (nextIndex, currentData) => {
    if (nextIndex >= STEPS.length) return;
    const step = STEPS[nextIndex];
    const msg = resolveMessage(step, currentData);
    setStepIndex(nextIndex);
    if (step.id === 'review') setShowReviewCard(false);
    await pushBotMessage(msg, 700);
    if (step.id === 'review') {
      setTimeout(() => setShowReviewCard(true), 200);
    }
  }, [pushBotMessage]);

  const handleStart = useCallback(async () => {
    setStarted(true);
    const newData = { ...formData };
    let nextIdx = 1;

    // Skip prefilled steps silently
    while (nextIdx < STEPS.length) {
      const s = STEPS[nextIdx];
      if (s.type === 'input' && s.field && newData[s.field]) {
        nextIdx++;
      } else {
        break;
      }
    }

    await advanceToStep(nextIdx, newData);
    setStepIndex(nextIdx);
  }, [formData, advanceToStep]);

  const handleInputSubmit = useCallback(async () => {
    const step = STEPS[stepIndex];
    const val = inputValue.trim();
    const error = step.validate ? step.validate(val) : null;
    if (error) { setInputError(error); return; }

    setInputError('');
    const newData = { ...formData, [step.field]: val };
    setFormData(newData);
    setMessages(prev => [...prev, { role: 'user', text: val, id: `user-${Date.now()}` }]);
    setInputValue('');

    const nextIdx = stepIndex + 1;
    await advanceToStep(nextIdx, newData);
    setStepIndex(nextIdx);
  }, [stepIndex, inputValue, formData, advanceToStep]);

  const handleChoice = useCallback(async (choice) => {
    const step = STEPS[stepIndex];
    const newData = { ...formData, [step.field]: choice.value };
    setFormData(newData);
    setMessages(prev => [...prev, { role: 'user', text: choice.label, id: `user-${Date.now()}` }]);

    const nextIdx = stepIndex + 1;
    await advanceToStep(nextIdx, newData);
    setStepIndex(nextIdx);
  }, [stepIndex, formData, advanceToStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdW_rYRPNVLycQnMq9FsB5TNCfBg5dlrff1E59tH7rWf3nnOg/formResponse';
      const body = new URLSearchParams();
      body.append('entry.2005620554', formData.firstName || '');
      body.append('entry.1934638032', formData.lastName || '');
      body.append('entry.1045781291', formData.email || '');
      body.append('entry.1166974658', formData.phone || '');
      body.append('entry.839337160', formData.currentRole || '');
      body.append('entry.1824927963', formData.experience || '');
      body.append('entry.1037378329', formData.goal || '');
      body.append('entry.301428969', formData.challenge || '');
      body.append('entry.123456789', formData.availability || '');
      body.append('entry.987654321', formData.howHeard || '');
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    } catch (e) {
      // no-cors — submission still goes through
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setShowReviewCard(false);

    const successStep = STEPS.find(s => s.id === 'submitted');
    const msg = resolveMessage(successStep, formData);
    setMessages(prev => [...prev, { role: 'user', text: '✅ Submit my application', id: `user-${Date.now()}` }]);
    await pushBotMessage(msg, 900);
    setStepIndex(STEPS.findIndex(s => s.id === 'submitted'));
  }, [formData, pushBotMessage]);

  // Progress
  const totalInputSteps = STEPS.filter(s => s.type === 'input' || s.type === 'choice').length;
  const completedSteps = Object.keys(formData).length;
  const progress = Math.min((completedSteps / totalInputSteps) * 100, 100);

  const currentStep = STEPS[stepIndex];

  // ─── INPUT AREA ────────────────────────────────────────────────────────
  const renderInputArea = () => {
    if (!started) {
      return (
        <div className="flex justify-center py-2">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95 text-white font-bold px-6 xs:px-8 py-3 xs:py-3.5 rounded-2xl shadow-lg shadow-orange-500/30 transition-all duration-200 text-sm xs:text-base"
          >
            Let's go!
            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      );
    }

    if (isTyping || !currentStep) return null;

    // Text / email / tel input
    if (currentStep.type === 'input') {
      return (
        <div className="space-y-2">
          {inputError && (
            <p className="text-red-400 text-[11px] xs:text-xs px-1 flex items-center gap-1.5">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {inputError}
            </p>
          )}
          <div className="flex gap-2 xs:gap-2.5 items-end">
            {currentStep.multiline ? (
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); setInputError(''); }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleInputSubmit(); }}
                placeholder={currentStep.placeholder}
                rows={3}
                className="flex-1 bg-white/8 border border-white/15 focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/15 rounded-2xl px-3 xs:px-4 py-2.5 xs:py-3 text-white placeholder-gray-600 text-xs xs:text-sm resize-none outline-none transition-all duration-200 leading-relaxed"
              />
            ) : (
              <input
                ref={inputRef}
                type={currentStep.inputType || 'text'}
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); setInputError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleInputSubmit(); }}
                placeholder={currentStep.placeholder}
                className="flex-1 bg-white/8 border border-white/15 focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/15 rounded-2xl px-3 xs:px-4 py-2.5 xs:py-3 text-white placeholder-gray-600 text-xs xs:text-sm outline-none transition-all duration-200"
              />
            )}
            <button
              onClick={handleInputSubmit}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 w-10 h-10 xs:w-11 xs:h-11 bg-gradient-to-br from-orange-500 to-orange-600 disabled:opacity-35 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all duration-200"
              aria-label="Send"
            >
              <svg className="w-4 h-4 xs:w-5 xs:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          {currentStep.multiline && (
            <p className="text-gray-600 text-[10px] xs:text-xs px-1">Press Ctrl+Enter or click → to continue</p>
          )}
        </div>
      );
    }

    // Multiple choice
    if (currentStep.type === 'choice') {
      return (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {currentStep.choices.map((choice) => (
            <button
              key={choice.value}
              onClick={() => handleChoice(choice)}
              className="text-left bg-white/5 hover:bg-white/10 active:scale-[0.97] border border-white/10 hover:border-orange-400/40 rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 transition-all duration-150 group"
            >
              <p className="text-white text-xs xs:text-sm font-medium group-hover:text-orange-300 transition-colors leading-snug">{choice.label}</p>
              {choice.sub && <p className="text-gray-600 text-[10px] xs:text-xs mt-0.5">{choice.sub}</p>}
            </button>
          ))}
        </div>
      );
    }

    // Review + submit
    if (currentStep.type === 'review') {
      return (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white font-bold py-3 xs:py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 text-sm xs:text-base"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit My Application
            </>
          )}
        </button>
      );
    }

    // Success actions
    if (currentStep.type === 'success') {
      return (
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all duration-200 active:scale-[0.99] text-sm xs:text-base"
          >
            Back to Dashboard
          </button>
          <a
            href="https://careers.favoredonline.com/career/support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white/8 hover:bg-white/12 border border-white/15 text-gray-300 hover:text-white font-medium py-3 rounded-2xl transition-all duration-200 text-sm xs:text-base text-center"
          >
            Contact Support
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(135deg, #09090f 0%, #0f0f1c 50%, #09090f 100%)' }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
          .career-coach-wrap * { font-family: 'DM Sans', system-ui, sans-serif !important; }
          .career-coach-wrap ::-webkit-scrollbar { width: 3px; }
          .career-coach-wrap ::-webkit-scrollbar-track { background: transparent; }
          .career-coach-wrap ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.35); border-radius: 3px; }
        `}</style>

        {/* Ambient blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-72 h-72 xs:w-96 xs:h-96 bg-orange-500/7 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-60 h-60 xs:w-80 xs:h-80 bg-orange-600/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-amber-500/4 rounded-full blur-3xl" />
        </div>

        <div className="career-coach-wrap relative z-10 flex flex-col flex-1 max-w-2xl w-full mx-auto px-3 xs:px-4 sm:px-6" style={{ minHeight: 0 }}>

          {/* ── TOP HEADER ── */}
          <div className="flex-shrink-0 pt-4 xs:pt-5 sm:pt-6 pb-3 xs:pb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-300 transition-colors mb-3 xs:mb-4 min-h-[40px] text-xs xs:text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            <div className="flex items-center gap-3 xs:gap-4">
              <div className="w-10 h-10 xs:w-12 xs:h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/25">
                <svg className="w-5 h-5 xs:w-6 xs:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg xs:text-xl sm:text-2xl font-black text-white" style={{ textShadow: '0 0 24px rgba(249,115,22,0.2)' }}>
                  Career Coaching
                </h1>
                <p className="text-gray-600 text-[11px] xs:text-xs mt-0.5">1-on-1 with experienced tech coaches</p>
              </div>

              {/* Online indicator */}
              <div className="ml-auto flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-400 text-[10px] xs:text-xs font-medium">Online</span>
              </div>
            </div>

            {/* Progress bar */}
            {started && !submitted && (
              <div className="mt-3 xs:mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 text-[10px] xs:text-xs">Progress</span>
                  <span className="text-orange-500 text-[10px] xs:text-xs font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="border-t border-white/6 mt-3 xs:mt-4" />
          </div>

          {/* ── MESSAGE AREA ── */}
          <div className="flex-1 overflow-y-auto py-3 xs:py-4 space-y-3 xs:space-y-4" style={{ minHeight: 0 }}>
            {messages.map((msg, i) =>
              msg.role === 'bot'
                ? <BotBubble key={msg.id} text={msg.text} animate={i > 0} />
                : <UserBubble key={msg.id} text={msg.text} />
            )}

            {isTyping && <TypingIndicator />}

            {/* Inline review card */}
            {showReviewCard && !isTyping && currentStep?.type === 'review' && (
              <ReviewCard data={formData} />
            )}

            <div ref={bottomRef} className="h-2" />
          </div>

          {/* ── INPUT ZONE ── */}
          <div
            className="flex-shrink-0 pt-2 xs:pt-3 pb-4 xs:pb-5 sm:pb-6 border-t border-white/6"
            style={{ background: 'linear-gradient(to top, #09090f 60%, transparent)' }}
          >
            {renderInputArea()}
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerCoach;
