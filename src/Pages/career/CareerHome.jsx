// src/Pages/career/CareerHome.jsx - Merged: Digital Solutions + Talent Marketplace + Badge System

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─── Constants ───

const SERVICES = [
  {
    emoji: "⚡",
    title: "AI Integration & Transformation",
    description: "Integrate AI into existing platforms — chatbots, recommendation engines, workflow automation, and custom APIs."
  },
  {
    emoji: "🌐",
    title: "AI-Powered Web Apps",
    description: "Custom web platforms with real-time analytics, predictive dashboards, and secure multi-user enterprise systems."
  },
  {
    emoji: "📱",
    title: "Mobile Applications",
    description: "Intelligent iOS and Android apps with personalization, smart notifications, and scalable backend integrations."
  },
  {
    emoji: "🤖",
    title: "Intelligent Automation",
    description: "Automate onboarding, sales funnels, support routing, HR workflows, and core business processes."
  },
  {
    emoji: "📊",
    title: "Data & Predictive Analytics",
    description: "KPI dashboards, predictive forecasting, customer behavior analysis, and data pipeline architecture."
  },
  {
    emoji: "💼",
    title: "AI Strategy & Consulting",
    description: "Readiness assessments, transformation roadmaps, MVP planning, compliance guidance, and ongoing optimization."
  }
];

const EMPLOYER_BENEFITS = [
  { text: "Badge-verified skills", detail: "filter talent by badge track, level, and industry" },
  { text: "Project portfolios", detail: "see real work they've built, not just claims" },
  { text: "Hire for projects or roles", detail: "freelance gigs, contracts, or full-time" },
  { text: "Or let us build it", detail: "our in-house team delivers end-to-end AI-powered solutions" },
];

const TALENT_BENEFITS = [
  { text: "AI Career Navigator", detail: "personalized career path based on your goals" },
  { text: "Real projects, real teams", detail: "build portfolio work employers actually value" },
  { text: "TechTalent Badges", detail: "industry-recognized credentials earned through work" },
  { text: "Opportunity Hub", detail: "jobs, paid gigs, scholarships, and internships" },
];

const BADGE_TRACKS = [
  { name: "TechMO", image: "/Images/TechMO.png", title: "Mentorship" },
  { name: "TechQA", image: "/Images/TechQA.png", title: "Quality Testing" },
  { name: "TechDev", image: "/Images/TechDev.png", title: "Development" },
  { name: "TechLeads", image: "/Images/TechLeads.png", title: "Leadership" },
  { name: "TechArchs", image: "/Images/TechArchs.png", title: "Design & No-Code" },
  { name: "TechGuard", image: "/Images/TechGuard.png", title: "Security & DevOps" }
];

const SAMPLE_TALENT = [
  {
    initials: "AJ",
    name: "Adaeze Johnson",
    role: "Full-Stack Developer",
    badges: ["TechDev Lv.3", "TechGuard Lv.1"],
    skills: ["React", "Node.js", "Firebase", "AI Integration"],
    rate: "$45/hr",
    color: "from-green-500 to-green-600"
  },
  {
    initials: "KM",
    name: "Kwame Mensah",
    role: "QA Engineer & Automation",
    badges: ["TechQA Lv.3", "TechMO Lv.2"],
    skills: ["Selenium", "Cypress", "CI/CD", "Test Strategy"],
    rate: "$40/hr",
    color: "from-orange-500 to-orange-600"
  },
  {
    initials: "SR",
    name: "Sofia Reyes",
    role: "UI/UX Designer & No-Code",
    badges: ["TechArchs Lv.3", "TechLeads Lv.1"],
    skills: ["Figma", "Webflow", "Framer", "Design Systems"],
    rate: "$50/hr",
    color: "from-blue-500 to-blue-600"
  }
];

const INDUSTRY_TRACKS = [
  { id: 1, name: 'Healthcare/Medical', icon: '🏥' },
  { id: 2, name: 'Finance/Fintech', icon: '💰' },
  { id: 3, name: 'Education', icon: '📚' },
  { id: 4, name: 'E-commerce', icon: '🛒' },
  { id: 5, name: 'Entertainment/Media', icon: '🎮' },
  { id: 6, name: 'Government', icon: '🏛️' },
  { id: 7, name: 'Technology/Software', icon: '💻' },
  { id: 8, name: 'Cybersecurity', icon: '🔒' },
  { id: 9, name: 'Transportation', icon: '🚚' },
  { id: 10, name: 'Real Estate', icon: '🏠' },
  { id: 11, name: 'Agriculture', icon: '🌿' },
  { id: 12, name: 'Construction', icon: '🏗️' },
  { id: 13, name: 'Legal', icon: '⚖️' },
  { id: 14, name: 'Research & Science', icon: '🔬' },
  { id: 15, name: 'Marketing', icon: '🎯' },
  { id: 16, name: 'Travel & Hospitality', icon: '✈️' },
  { id: 17, name: 'Energy & Utilities', icon: '⚡' },
  { id: 18, name: 'Manufacturing', icon: '🏭' },
  { id: 19, name: 'Biotech & Pharma', icon: '🧬' },
  { id: 20, name: 'Telecommunications', icon: '📡' },
  { id: 21, name: 'Nonprofits & NGOs', icon: '🎓' }
];

const FAQs = [
  {
    question: "How do TechTalent Badges work?",
    answer: "TechTalent Badges are earned by completing real projects on our platform — not just coursework. Each badge is leveled (Beginner → Expert), industry-specific, and verified. Employers can filter talent by badge track and level to find exactly the skills they need."
  },
  {
    question: "How can I hire talent on Favored Online?",
    answer: "Browse our talent directory, filter by badge track, skill set, and industry specialization. Every professional's profile shows their earned badges, completed projects, and verified skills. You can hire for freelance gigs, contracts, or full-time roles."
  },
  {
    question: "Can I showcase my project at Favored Online?",
    answer: "Yes, but it must be with the consent or agreement of your group members."
  },
  {
    question: "What if I don't have any tech experience?",
    answer: "Perfect! Our AI specializes in identifying transferable skills from any background. Many successful users started with zero tech experience and used our personalized transition plans and real projects to advance their learning."
  },
  {
    question: "How does the project system work?",
    answer: "Browse real projects, apply to work on them, and build your portfolio while earning badges. You can also submit your own projects. This gives you practical experience and showcases your skills to the community and potential employers."
  },
  {
    question: "Can I get a career coach for one-on-one guidance?",
    answer: "Yes! You can request a dedicated career coach for personalized mentorship, career planning, and one-on-one support. Your coach will help you set goals, navigate challenges, and stay on track throughout your tech journey."
  },
  {
    question: "What digital solutions does Favored Online build?",
    answer: "We build AI-powered web and mobile applications, intelligent automation systems, predictive analytics platforms, and provide AI strategy consulting. Our in-house team — made up of badge-verified professionals — delivers end-to-end solutions for businesses."
  },
  {
    question: "Is the Opportunity Hub free to use?",
    answer: "Yes! Posting any type of opportunity — whether it's a job, scholarship, event, or project — is completely free for all users. We believe in removing barriers to opportunity for everyone in our community."
  },
  {
    question: "How do I post an opportunity on the Opportunity Hub?",
    answer: "Any registered user can post opportunities — jobs, scholarships, events, projects, internships, and paid gigs — completely free of charge. Simply log in, navigate to the Opportunity Hub, and click 'Post Opportunity'."
  }
];


const CareerHome = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { currentUser } = useAuth();

  const handleStartTest = () => navigate(currentUser ? '/career/dashboard' : '/login');
  const handleViewProjects = () => navigate(currentUser ? '/projects' : '/login');
  const handleOpportunityHub = () => navigate(currentUser ? '/hub' : '/login');
  const handleBadgesClick = () => navigate(currentUser ? '/tech-badges' : '/login');
  const handleHireTalent = () => navigate(currentUser ? '/members' : '/login');
  const handleContact = () => navigate('/solutions');

  const handleIndustryTrackClick = (trackName) => {
    if (currentUser) {
      navigate(`/projects?industry=${trackName.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════ */}
      {/* NAVBAR                                */}
      {/* ══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Images/512X512.png" alt="Favored Online" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="hidden sm:block font-bold text-gray-900 text-lg">Favored Online</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Solutions</a>
              <a href="#talent" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Find Talent</a>
              <a href="#badges" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Badges</a>
              <a href="#careers" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Careers</a>
            </nav>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="hidden md:inline-flex text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/hub" className="hidden md:inline-flex text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors">
                    Hub
                  </Link>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
                    {currentUser.photoURL && (
                      <img src={currentUser.photoURL} alt="" className="h-7 w-7 rounded-full object-cover" />
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden sm:block">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </div>
                  <button onClick={() => navigate('/logout')} className="hidden md:inline-flex px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors">
                    Log In
                  </button>
                  <button onClick={() => navigate('/login')} className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-sm transition-all">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════ */}
      {/* HERO                                  */}
      {/* ══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-green-100/20 via-transparent to-orange-100/10 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-600 text-xs sm:text-sm font-medium">
              Hire badge-verified tech talent — or earn your badges
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-gray-900">Where Businesses Find</span>
            <br />
            <span className="text-green-600">Verified Talent</span>
            <span className="text-gray-900"> & Talent</span>
            <br />
            <span className="text-gray-900">Earns </span>
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Real Credentials</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Favored Online is a talent marketplace and digital solutions platform where professionals earn TechTalent Badges through real project work — and businesses hire them with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12">
            <button onClick={handleHireTalent} className="px-7 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl">
              Hire Verified Talent →
            </button>
            <button onClick={handleStartTest} className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-orange-200">
              Earn Your Badges →
            </button>
            <button onClick={handleContact} className="px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-900 rounded-full font-bold text-sm sm:text-base transition-all border border-gray-200">
              Our Digital Solutions
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { num: "1,000+", label: "Professionals" },
              { num: "6", label: "Badge Tracks" },
              { num: "21", label: "Industry Tracks" },
              { num: "Since 2018", label: "" }
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
                <span><strong className="text-gray-800">{s.num}</strong> {s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* DUAL PANELS: Employers + Talent       */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24" id="talent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold tracking-wider uppercase mb-4">THE PLATFORM</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              One Platform. Two Sides. <span className="text-green-600">Everyone Wins.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Businesses get pre-vetted, badge-verified professionals. Professionals build real skills, earn credentials, and get hired.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* For Businesses */}
            <div className="bg-gray-900 rounded-2xl p-8 sm:p-10 text-white">
              <span className="inline-block px-3 py-1 rounded-md bg-green-500/15 text-green-400 text-xs font-bold tracking-wider uppercase mb-5">FOR BUSINESSES & EMPLOYERS</span>
              <h3 className="text-2xl sm:text-3xl font-black mb-4">Hire Talent You Can <span className="text-green-400">Trust</span></h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                Stop guessing. Every professional on Favored Online has earned their TechTalent Badges through real project work — verified skills, not just self-reported resumes.
              </p>
              <div className="space-y-3 mb-8">
                {EMPLOYER_BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                    <span className="text-gray-300 text-sm"><strong className="text-white">{b.text}</strong> — {b.detail}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleHireTalent} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">Find Talent →</button>
            </div>

            {/* For Talent */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 sm:p-10" id="careers">
              <span className="inline-block px-3 py-1 rounded-md bg-orange-500/10 text-orange-600 text-xs font-bold tracking-wider uppercase mb-5">FOR TECH PROFESSIONALS</span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Earn Badges. Build Proof. <span className="text-orange-600">Get Hired.</span></h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                Join ProjectX and work on real industry projects. Earn TechTalent Badges that prove your skills to employers — and access the Opportunity Hub for jobs, gigs, and internships.
              </p>
              <div className="space-y-3 mb-8">
                {TALENT_BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-500/15 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                    <span className="text-gray-700 text-sm"><strong className="text-gray-900">{b.text}</strong> — {b.detail}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleStartTest} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">Start Free →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* DIGITAL SOLUTIONS                     */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gray-50" id="solutions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold tracking-wider uppercase mb-4">OUR DIGITAL SOLUTIONS</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Need It Built? <span className="text-green-600">We Do That Too.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Beyond the marketplace, our in-house team builds AI-powered web and mobile applications, automation systems, and data platforms — end to end.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {SERVICES.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
                <span className="text-2xl sm:text-3xl block mb-4">{service.emoji}</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={handleContact} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all">
              Start Your Transformation →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* TECHTALENT BADGES                     */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24" id="badges">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">TECHTALENT BADGES</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Not Certificates. <span className="text-orange-600">Proof of Work.</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Most platforms rely on reviews and self-reported skills. On Favored Online, every professional earns their TechTalent Badges by completing real projects — verified, leveled, and industry-specific.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                Employers can filter talent by badge track, level (Beginner → Expert), and industry specialization. No more guessing.
              </p>
              <div className="bg-orange-50 rounded-lg p-4 sm:p-5 border-l-4 border-orange-400">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>For employers:</strong> Badges are your shortcut to finding proven talent.
                  <br className="mb-1" />
                  <strong>For professionals:</strong> Badges are your competitive edge that sets you apart from every other freelancer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BADGE_TRACKS.map((badge, i) => (
                <div key={i} onClick={handleBadgesClick} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center group cursor-pointer">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-xl mb-3 mx-auto w-fit">
                    <img src={badge.image} alt={badge.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{badge.name}</h4>
                  <span className="text-xs text-gray-500">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <button onClick={handleBadgesClick} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all">
              Learn About All Badge Tracks →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* TALENT MARKETPLACE PREVIEW            */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wider uppercase mb-4">TALENT MARKETPLACE</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Browse Badge-Verified Talent</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl">
              Every profile shows earned badges, completed projects, and verified skills. Hire with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {SAMPLE_TALENT.map((talent, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/[0.07] rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${talent.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {talent.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{talent.name}</div>
                    <div className="text-gray-400 text-xs">{talent.role}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {talent.badges.map((b, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      🏅 {b}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {talent.skills.map((s, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 text-gray-400 border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-gray-400 text-sm"><strong className="text-white text-base">{talent.rate}</strong></div>
                  <button onClick={handleHireTalent} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-green-500 hover:bg-green-600 text-white transition-all">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={handleHireTalent} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg">
              Browse All Talent →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* HOW IT WORKS                          */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold tracking-wider uppercase mb-4">THE ECOSYSTEM</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              We Build People. <span className="text-green-600">Businesses Hire Them.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Our talent pipeline means businesses get verified, project-tested professionals — and professionals get real career momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Discover Your Path", desc: "Take our AI-powered assessment to identify your strengths, interests, and the perfect tech career path — no experience required.", accent: "bg-green-500" },
              { step: "2", title: "Build Real Solutions", desc: "Join industry-aligned projects on ProjectX, collaborate with real teams, and create portfolio-worthy work that employers value.", accent: "bg-orange-500" },
              { step: "3", title: "Earn & Get Hired", desc: "Gain TechTalent Badges as you progress, showcase verified skills, and connect with employers looking for proven talent.", accent: "bg-blue-500" }
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0" />}
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all h-full relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-xl mb-4 text-white ${item.accent}`}>{item.step}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* INDUSTRY TRACKS                       */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold tracking-wider uppercase mb-4">INDUSTRY TRACKS</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Talent Across <span className="text-green-600">21 Industries</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Find talent specialized in your industry — or build your expertise in any of these tracks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {INDUSTRY_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => handleIndustryTrackClick(track.name)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-700 text-sm font-medium transition-all"
              >
                <span>{track.icon}</span>
                <span>{track.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* FAQ                                   */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Common <span className="text-green-600">Questions</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Everything you need to know about Favored Online</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <button className="w-full text-left p-5 sm:p-6" onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">{faq.question}</h3>
                    <span className={`text-green-600 text-xl transition-transform flex-shrink-0 ${expandedFAQ === index ? 'rotate-180' : ''}`}>⌄</span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${expandedFAQ === index ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* FINAL CTA                             */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 text-base sm:text-lg mb-10 leading-relaxed">
              Hire proven, badge-verified talent for your next project — or start earning your TechTalent Badges and build a career employers actually notice.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6">
              <button onClick={handleHireTalent} className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-base sm:text-lg transition-all">Hire Talent →</button>
              <button onClick={handleStartTest} className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-base sm:text-lg transition-all">Earn Your Badges →</button>
              <button onClick={handleContact} className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-base sm:text-lg transition-all border-2 border-gray-200">Explore Solutions</button>
            </div>

            <p className="text-gray-400 text-sm">Free to join · No credit card required · Start immediately</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* FOOTER                                */}
      {/* ══════════════════════════════════════ */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Favored Online Inc. — Building intelligent ecosystems and verified tech talent since 2018.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareerHome;
