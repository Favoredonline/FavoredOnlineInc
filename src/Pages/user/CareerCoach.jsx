// src/Pages/user/CareerCoach.jsx - INTERACTIVE CHATBOT CAREER COACHING APPLICATION

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

// ─── GOOGLE FORM CONFIG ───────────────────────────────────────────────────────
// The form action from the actual <form> tag in Google Forms HTML
const FORM_ACTION_URL =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdW_rYRPNVLycQnMq9FsB5TNCfBg5dlrff1E59tH7rWf3nnOg/formResponse';

// Map chatbot field keys → Google Form entry IDs
const FORM_FIELD_MAP = {
  firstName:      'entry.2005620554',
  lastName:       'entry.1934638032',
  email:          'entry.1045781291',
  phone:          'entry.1166974658',
  lookingForward: 'entry.839337160',
  willingToPay:   'entry.1735599415',
};

// ─── CONVERSATION STEPS (matched to actual Google Form) ───────────────────────
const STEPS = [
  {
    id: 'welcome',
    type: 'info',
    message:
      "👋 Welcome to **Career Coaching** at Favored Online! I'm here to help you apply for personalized 1-on-1 coaching with our experienced tech career professionals.\n\nBefore we begin, here's what to expect:\n• A short application (takes ~2 minutes)\n• A **$50 non-refundable application fee** credited toward your sessions\n• A coaching document sent to you with full session pricing\n\nReady to get started?",
  },
  {
    id: 'firstName',
    type: 'input',
    field: 'firstName',
    message: "Great! Let's start with the basics.\n\nWhat's your **first name**?",
    placeholder: 'Your first name...',
    validate: (v) =>
      v.trim().length >= 2 ? null : 'Please enter at least 2 characters.',
  },
  {
    id: 'lastName',
    type: 'input',
    field: 'lastName',
    message: (data) =>
      `Nice to meet you, **${data.firstName}**! 👋\n\nAnd your **last name**?`,
    placeholder: 'Your last name...',
    validate: (v) =>
      v.trim().length >= 2 ? null : 'Please enter at least 2 characters.',
  },
  {
    id: 'email',
    type: 'input',
    field: 'email',
    inputType: 'email',
    message:
      'Perfect. What **email address** should we use to send your coaching document?',
    placeholder: 'your@email.com',
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? null
        : 'Please enter a valid email address.',
  },
  {
    id: 'phone',
    type: 'input',
    field: 'phone',
    inputType: 'tel',
    message: "Got it! What's the best **phone number** to reach you?",
    placeholder: '+1 (555) 000-0000',
    validate: (v) =>
      v.trim().length >= 7 ? null : 'Please enter a valid phone number.',
  },
  {
    id: 'lookingForward',
    type: 'input',
    field: 'lookingForward',
    message:
      "Now let's talk about your goals.\n\n**What are you looking forward to in our conversation?**\n\nShare what you'd like to get out of coaching — career goals, challenges, or anything on your mind.",
    placeholder:
      'e.g. I want help navigating my career transition, preparing for interviews, building leadership skills...',
    multiline: true,
    validate: (v) =>
      v.trim().length >= 5
        ? null
        : 'Please share a bit more (at least 5 characters).',
  },
  {
    id: 'willingToPay',
    type: 'choice',
    field: 'willingToPay',
    message:
      "Last question — are you willing to pay a **$50 non-refundable coaching application fee**?\n\nThis amount is credited toward your coaching sessions when you attend.",
    choices: [
      { value: 'Yes', label: '✅ Yes', sub: "I'm ready to invest in my career" },
      { value: 'No', label: '❌ No', sub: 'Not at this time' },
    ],
  },
  {
    id: 'review',
    type: 'review',
    message:
      "Almost done! Here's a **summary of your application**. Please review everything and hit submit when ready:",
  },
  {
    id: 'submitted',
    type: 'success',
    message: (data) =>
      `🎉 **Application submitted, ${data.firstName}!**\n\nThank you for applying to Favored Online Career Coaching. Here's what happens next:\n\n**1.** Check your email at **${data.email}** for a confirmation\n**2.** Complete the **$50 application fee** to reserve your spot\n**3.** Receive your personalized **coaching document** with session pricing\n**4.** Book your first session!\n\nWe're excited to help you reach your goals. 🚀`,
  },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    background:
      'linear-gradient(160deg, #09090f 0%, #0f0f1c 50%, #09090f 100%)',
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
  },
  botBubble: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  inputField: {
    backgroundColor: '#141420',
    border: '1.5px solid rgba(255,255,255,0.14)',
    color: '#f3f4f6',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  choiceBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    transition: 'all 0.15s ease',
  },
  choiceBtnHover: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(249,115,22,0.45)',
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.11)',
  },
  reviewHeader: {
    backgroundColor: 'rgba(249,115,22,0.10)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  feeNotice: {
    backgroundColor: 'rgba(249,115,22,0.09)',
    border: '1px solid rgba(249,115,22,0.30)',
  },
  onlinePill: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  inputZone: {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    background: 'linear-gradient(to top, #09090f 55%, transparent)',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
};

// ─── PARSED TEXT (bold markdown) ──────────────────────────────────────────────
const ParsedText = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: '#fff', fontWeight: 600 }}>
            {part}
          </strong>
        ) : (
          <span key={i}>
            {part.split('\n').map((line, j, arr) => (
              <React.Fragment key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        ),
      )}
    </>
  );
};

// ─── BOT AVATAR ───────────────────────────────────────────────────────────────
const BotAvatar = ({ size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #fb923c, #ea580c)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(249,115,22,0.35)',
    }}
  >
    <svg
      width={size * 0.44}
      height={size * 0.44}
      fill="none"
      viewBox="0 0 24 24"
      stroke="#fff"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  </div>
);

// ─── BOT BUBBLE ───────────────────────────────────────────────────────────────
const BotBubble = ({ text, animate }) => {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [animate]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <BotAvatar size={34} />
      <div
        style={{
          ...S.botBubble,
          borderRadius: '0 16px 16px 16px',
          padding: '10px 14px',
          maxWidth: 'min(80%, 420px)',
          lineHeight: 1.6,
        }}
      >
        <p
          style={{
            color: '#d1d5db',
            fontSize: 'clamp(13px, 2vw, 15px)',
            margin: 0,
          }}
        >
          <ParsedText text={text} />
        </p>
      </div>
    </div>
  );
};

// ─── USER BUBBLE ──────────────────────────────────────────────────────────────
const UserBubble = ({ text }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <div
      style={{
        background: 'linear-gradient(135deg, #f97316, #ea580c)',
        borderRadius: '16px 0 16px 16px',
        padding: '9px 14px',
        maxWidth: 'min(75%, 380px)',
        boxShadow: '0 4px 14px rgba(249,115,22,0.25)',
      }}
    >
      <p
        style={{
          color: '#fff',
          fontSize: 'clamp(13px, 2vw, 15px)',
          margin: 0,
          fontWeight: 500,
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {text}
      </p>
    </div>
  </div>
);

// ─── TYPING DOTS ──────────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <BotAvatar size={34} />
    <div
      style={{
        ...S.botBubble,
        borderRadius: '0 16px 16px 16px',
        padding: '12px 16px',
      }}
    >
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#f97316',
              animation: 'ccBounce 0.8s ease infinite',
              animationDelay: `${i * 160}ms`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── REVIEW CARD ──────────────────────────────────────────────────────────────
const ReviewCard = ({ data }) => {
  const fields = [
    {
      label: 'Full Name',
      value: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Looking Forward To', value: data.lookingForward },
    { label: 'Willing to Pay $50', value: data.willingToPay },
  ].filter((f) => f.value);

  return (
    <div style={{ width: '100%', marginTop: 8 }}>
      <div style={{ ...S.reviewCard, borderRadius: 16, overflow: 'hidden' }}>
        <div style={S.reviewHeader}>
          <p
            style={{
              color: '#fb923c',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '10px 14px',
              margin: 0,
            }}
          >
            Application Summary
          </p>
        </div>
        {fields.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              gap: 12,
              padding: '9px 14px',
              borderBottom:
                i < fields.length - 1
                  ? '1px solid rgba(255,255,255,0.06)'
                  : 'none',
            }}
          >
            <span
              style={{
                color: '#6b7280',
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                width: 110,
                flexShrink: 0,
                paddingTop: 2,
              }}
            >
              {label}
            </span>
            <span
              style={{
                color: '#e5e7eb',
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                lineHeight: 1.5,
                flex: 1,
                wordBreak: 'break-word',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          ...S.feeNotice,
          borderRadius: 12,
          padding: '10px 14px',
          marginTop: 10,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <svg
          width={16}
          height={16}
          style={{ flexShrink: 0, marginTop: 1 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="#fb923c"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p
          style={{
            color: '#d1d5db',
            fontSize: 'clamp(11px, 1.6vw, 13px)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          By submitting, you agree to the{' '}
          <strong style={{ color: '#fb923c' }}>
            $50 non-refundable application fee
          </strong>
          . This amount is credited toward your coaching sessions when you
          attend.
        </p>
      </div>
    </div>
  );
};

// ─── GOOGLE FORM SUBMISSION (hidden iframe + real form POST) ──────────────────
// This exactly replicates what happens when you click Submit on the actual
// Google Form, including ALL required hidden fields.
function submitToGoogleForm(data) {
  return new Promise((resolve) => {
    // 1. Hidden iframe to absorb the Google response page
    const iframeName = `__gf_iframe_${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // 2. Build a real <form> targeting that iframe
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORM_ACTION_URL;
    form.target = iframeName;
    form.style.display = 'none';

    // Helper to add hidden inputs
    const addField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    // 3. Add all user-entered fields
    Object.entries(FORM_FIELD_MAP).forEach(([field, entryId]) => {
      addField(entryId, data[field] || '');
    });

    // 4. Add the radio button sentinel field (required by Google Forms
    //    for multiple-choice / radio questions)
    addField('entry.1735599415_sentinel', '');

    // 5. Add ALL required Google Forms hidden fields
    //    (extracted from the actual form HTML)
    const fbzx = String(Date.now()) + String(Math.floor(Math.random() * 1000000));
    addField('fvv', '1');
    addField('partialResponse', `[null,null,"${fbzx}"]`);
    addField('pageHistory', '0');
    addField('fbzx', fbzx);
    addField('submissionTimestamp', String(Date.now()));

    document.body.appendChild(form);

    // 6. Submit
    form.submit();

    // 7. Clean up after Google's confirmation page loads in iframe
    setTimeout(() => {
      try {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      } catch (_) {
        /* already removed */
      }
      resolve(true);
    }, 3000);
  });
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CareerCoach = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

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
  const [inputFocused, setInputFocused] = useState(false);

  // Pre-fill from auth
  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.displayName || '').trim().split(' ');
      const pre = {};
      if (parts[0]) pre.firstName = parts[0];
      if (parts.slice(1).join(' ')) pre.lastName = parts.slice(1).join(' ');
      if (currentUser.email) pre.email = currentUser.email;
      setFormData(pre);
    }
  }, [currentUser]);

  // Welcome message on mount
  useEffect(() => {
    setMessages([{ role: 'bot', text: STEPS[0].message, id: 'welcome' }]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 80);
    return () => clearTimeout(timer);
  }, [messages, isTyping, showReviewCard]);

  // Auto-focus input
  useEffect(() => {
    if (STEPS[stepIndex]?.type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 450);
    }
  }, [stepIndex]);

  const resolveMsg = (step, data) =>
    typeof step.message === 'function' ? step.message(data) : step.message;

  const pushBot = useCallback(
    (text, delay = 700) =>
      new Promise((resolve) => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text, id: `b-${Date.now()}-${Math.random()}` },
          ]);
          resolve();
        }, delay);
      }),
    [],
  );

  const goToStep = useCallback(
    async (idx, data) => {
      if (idx >= STEPS.length) return;
      const step = STEPS[idx];
      setStepIndex(idx);
      setShowReviewCard(false);
      await pushBot(resolveMsg(step, data), idx <= 1 ? 500 : 700);
      if (step.id === 'review')
        setTimeout(() => setShowReviewCard(true), 150);
    },
    [pushBot],
  );

  const handleStart = useCallback(async () => {
    setStarted(true);
    const data = { ...formData };
    let idx = 1;
    // Skip steps already prefilled from auth
    while (
      idx < STEPS.length &&
      STEPS[idx].type === 'input' &&
      STEPS[idx].field &&
      data[STEPS[idx].field]
    ) {
      idx++;
    }
    await goToStep(idx, data);
  }, [formData, goToStep]);

  const submitInput = useCallback(async () => {
    const step = STEPS[stepIndex];
    const val = inputValue.trim();
    const err = step.validate?.(val);
    if (err) {
      setInputError(err);
      return;
    }
    setInputError('');
    const data = { ...formData, [step.field]: val };
    setFormData(data);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: val, id: `u-${Date.now()}` },
    ]);
    setInputValue('');
    await goToStep(stepIndex + 1, data);
  }, [stepIndex, inputValue, formData, goToStep]);

  const pickChoice = useCallback(
    async (choice) => {
      const step = STEPS[stepIndex];
      const data = { ...formData, [step.field]: choice.value };
      setFormData(data);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: choice.label, id: `u-${Date.now()}` },
      ]);
      await goToStep(stepIndex + 1, data);
    },
    [stepIndex, formData, goToStep],
  );

  // ── Submit via hidden iframe ──
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await submitToGoogleForm(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
    setIsSubmitting(false);
    setSubmitted(true);
    setShowReviewCard(false);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: '✅ Submit my application', id: `u-${Date.now()}` },
    ]);
    const successStep = STEPS.find((s) => s.id === 'submitted');
    await pushBot(resolveMsg(successStep, formData), 900);
    setStepIndex(STEPS.findIndex((s) => s.id === 'submitted'));
  }, [formData, pushBot]);

  const totalFields = STEPS.filter(
    (s) => s.type === 'input' || s.type === 'choice',
  ).length;
  const progress = Math.min(
    (Object.keys(formData).length / totalFields) * 100,
    100,
  );
  const currentStep = STEPS[stepIndex];

  // ─── INPUT AREA ─────────────────────────────────────────────────────────────
  const renderInput = () => {
    if (!started) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <button
            onClick={handleStart}
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 'clamp(14px, 2.2vw, 16px)',
              padding: '13px 32px',
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Let's go!
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      );
    }

    if (isTyping || !currentStep) return null;

    // ── Text input ──
    if (currentStep.type === 'input') {
      const sharedInputStyle = {
        ...S.inputField,
        flex: 1,
        borderRadius: 14,
        padding: '12px 16px',
        fontSize: 'clamp(13px, 2vw, 15px)',
        fontFamily: 'inherit',
        borderColor: inputFocused ? 'rgba(249,115,22,0.55)' : 'rgba(255,255,255,0.14)',
        boxShadow: inputFocused ? '0 0 0 3px rgba(249,115,22,0.12)' : 'none',
      };
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {inputError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: 12 }}>
              <svg width={13} height={13} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {inputError}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {currentStep.multiline ? (
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitInput(); }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={currentStep.placeholder}
                rows={3}
                style={{ ...sharedInputStyle, resize: 'none', lineHeight: 1.6 }}
              />
            ) : (
              <input
                ref={inputRef}
                type={currentStep.inputType || 'text'}
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitInput(); }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={currentStep.placeholder}
                style={{ ...sharedInputStyle, height: 48 }}
              />
            )}
            <button
              onClick={submitInput}
              disabled={!inputValue.trim()}
              style={{
                width: 48, height: 48, borderRadius: 14, border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                background: inputValue.trim()
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: inputValue.trim() ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
                transition: 'all 0.15s',
                opacity: inputValue.trim() ? 1 : 0.4,
              }}
              aria-label="Send"
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          {currentStep.multiline && (
            <p style={{ color: '#4b5563', fontSize: 11, margin: 0, paddingLeft: 4 }}>
              Press Ctrl+Enter or click → to continue
            </p>
          )}
        </div>
      );
    }

    // ── Multiple choice ──
    if (currentStep.type === 'choice') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: 8 }}>
          {currentStep.choices.map((choice) => (
            <ChoiceButton key={choice.value} choice={choice} onClick={() => pickChoice(choice)} />
          ))}
        </div>
      );
    }

    // ── Review submit ──
    if (currentStep.type === 'review') {
      return (
        <button
          onClick={submitForm}
          disabled={isSubmitting}
          style={{
            width: '100%',
            background: isSubmitting ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#fff', fontWeight: 700, fontSize: 'clamp(14px, 2.2vw, 16px)',
            padding: '14px 20px', borderRadius: 16, border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 20px rgba(249,115,22,0.3)',
            fontFamily: 'inherit', transition: 'opacity 0.2s',
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', animation: 'ccSpin 0.7s linear infinite' }} />
              Submitting...
            </>
          ) : (
            <>
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit My Application
            </>
          )}
        </button>
      );
    }

    // ── Success ──
    if (currentStep.type === 'success') {
      return (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              flex: '1 1 140px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', fontWeight: 700, fontSize: 'clamp(13px, 2vw, 15px)',
              padding: '13px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Back to Dashboard
          </button>
          <a
            href="https://careers.favoredonline.com/career/support"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: '1 1 120px', ...S.secondaryBtn, color: '#9ca3af', fontWeight: 500,
              fontSize: 'clamp(13px, 2vw, 15px)', padding: '13px 16px', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', fontFamily: 'inherit',
            }}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes ccBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes ccSpin   { to{transform:rotate(360deg)} }
        .cc-chat::-webkit-scrollbar { width: 3px; }
        .cc-chat::-webkit-scrollbar-track { background: transparent; }
        .cc-chat::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 3px; }
        @media (max-width: 380px) { .cc-online-label { display: none; } }
      `}</style>

      <div
        style={{
          ...S.page,
          display: 'flex', flexDirection: 'column',
          height: 'calc(100dvh - 64px)',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {/* Ambient blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
          <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>

        {/* Center column */}
        <div
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column',
            flex: 1, overflow: 'hidden',
            width: '100%', maxWidth: 680,
            margin: '0 auto',
            padding: '0 clamp(12px, 4vw, 24px)',
            boxSizing: 'border-box',
          }}
        >
          {/* ─ HEADER ─ */}
          <div style={{ flexShrink: 0, paddingTop: 'clamp(12px, 3vw, 20px)', paddingBottom: 12 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(12px, 1.8vw, 14px)', fontFamily: 'inherit', padding: '4px 0', marginBottom: 12 }}
            >
              <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)' }}>
              <div style={{ width: 'clamp(40px, 6vw, 50px)', height: 'clamp(40px, 6vw, 50px)', borderRadius: 14, background: 'linear-gradient(135deg, #fb923c, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 20px rgba(249,115,22,0.30)' }}>
                <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ color: '#fff', fontSize: 'clamp(16px, 3.5vw, 22px)', fontWeight: 800, margin: 0, lineHeight: 1.2, textShadow: '0 0 20px rgba(249,115,22,0.2)' }}>
                  Career Coaching
                </h1>
                <p style={{ color: '#6b7280', fontSize: 'clamp(11px, 1.6vw, 13px)', margin: 0, marginTop: 2 }}>
                  1-on-1 with experienced tech coaches
                </p>
              </div>
              <div style={{ ...S.onlinePill, display: 'flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '5px 10px', flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ade80', animation: 'ccBounce 2s ease infinite' }} />
                <span className="cc-online-label" style={{ color: '#9ca3af', fontSize: 11, fontWeight: 500 }}>Online</span>
              </div>
            </div>

            {started && !submitted && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#4b5563', fontSize: 11 }}>Progress</span>
                  <span style={{ color: '#f97316', fontSize: 11, fontWeight: 600 }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ ...S.progressTrack, height: 5, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #fb923c, #f97316)', borderRadius: 999, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </div>
              </div>
            )}

            <div style={{ ...S.divider, marginTop: 14 }} />
          </div>

          {/* ─ MESSAGES ─ */}
          <div
            ref={chatRef}
            className="cc-chat"
            style={{ flex: 1, overflowY: 'auto', paddingTop: 16, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {messages.map((msg, i) =>
              msg.role === 'bot' ? (
                <BotBubble key={msg.id} text={msg.text} animate={i > 0} />
              ) : (
                <UserBubble key={msg.id} text={msg.text} />
              ),
            )}
            {isTyping && <TypingIndicator />}
            {showReviewCard && !isTyping && currentStep?.type === 'review' && (
              <ReviewCard data={formData} />
            )}
            <div ref={bottomRef} style={{ height: 4 }} />
          </div>

          {/* ─ INPUT ZONE ─ */}
          <div style={{ ...S.inputZone, flexShrink: 0, paddingTop: 12, paddingBottom: 'clamp(12px, 4vw, 24px)' }}>
            {renderInput()}
          </div>
        </div>
      </div>
    </>
  );
};

// ── Choice button ──
const ChoiceButton = ({ choice, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...(hovered ? S.choiceBtnHover : S.choiceBtn),
        borderRadius: 12,
        padding: 'clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 16px)',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <span style={{ color: hovered ? '#fdba74' : '#f3f4f6', fontSize: 'clamp(12px, 1.9vw, 14px)', fontWeight: 600, lineHeight: 1.35 }}>
        {choice.label}
      </span>
      {choice.sub && (
        <span style={{ color: '#6b7280', fontSize: 'clamp(10px, 1.5vw, 12px)', lineHeight: 1.3 }}>
          {choice.sub}
        </span>
      )}
    </button>
  );
};

export default CareerCoach;
