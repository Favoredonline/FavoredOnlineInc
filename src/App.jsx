import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Parts';
import Home from './views/Home';
import Books from './views/Books';
import AISolutions from './views/AISolutions';
import Terms from './views/Terms';
import Privacy from './views/Privacy';

const TITLES = {
  '/': 'Favored Online | Tech career books and AI solutions for businesses',
  '/books': 'Career Path in Tech books | Favored Online',
  '/ai-solutions': 'AI solutions for businesses | Favored Online',
  '/terms': 'Terms of Service | Favored Online',
  '/privacy': 'Privacy Policy | Favored Online',
};

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] || TITLES['/'];
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView(), 0); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function SiteLayout() {
  return (
    <>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
    </>
  );
}

// Old routes from the previous site, pointed at their new homes.
const AI_ALIASES = ['/solutions', '/digital-solutions', '/services'];

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/ai-solutions" element={<AISolutions />} />
        </Route>
        {/* Legal pages carry their own header */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {AI_ALIASES.map((p) => <Route key={p} path={p} element={<Navigate to="/ai-solutions" replace />} />)}
        <Route path="/solutions/terms" element={<Navigate to="/terms" replace />} />
        <Route path="/solutions/privacy" element={<Navigate to="/privacy" replace />} />
        <Route path="/career/terms" element={<Navigate to="/terms" replace />} />
        <Route path="/career/privacy" element={<Navigate to="/privacy" replace />} />
        <Route path="/contact" element={<Navigate to="/ai-solutions#contact" replace />} />
        <Route path="/store" element={<Navigate to="/books" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
