import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  isPreorder, launchLabel, SOCIALS, STORE_URL, GOOGLE_FORM, CONSULTATION_FEE,
} from '../data/content';

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEffect(() => setOpen(false), [pathname, hash]);

  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap">
        <Link to="/" className="brand" aria-label="Favored Online home">
          <img src="/logo.png" alt="" width="32" height="28" />
          Favored Online
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="nav" className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/ai-solutions">AI for business</NavLink>
          <Link to="/#about">About</Link>
          <Link to="/ai-solutions#contact" className="btn btn-ink">Book a consultation</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link to="/" className="brand" style={{ marginBottom: 12 }}>
              <img src="/logo.png" alt="" width="28" height="25" />
              Favored Online
            </Link>
            <p>Books for building a career in tech, and AI systems for growing a business.</p>
          </div>
          <div>
            <h4>Books</h4>
            <ul>
              <li><Link to="/books">Career Path in Tech</Link></li>
              <li><Link to="/books#toolkit">Free AI toolkit</Link></li>
              <li><a href={STORE_URL} target="_blank" rel="noopener noreferrer">Store</a></li>
            </ul>
          </div>
          <div>
            <h4>AI for business</h4>
            <ul>
              <li><Link to="/ai-solutions">Services</Link></li>
              <li><Link to="/ai-solutions#process">How we work</Link></li>
              <li><Link to="/ai-solutions#contact">Book a consultation</Link></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Favored Online Skills Acquisition Network (BN 3080141)</span>
          <span>
            <Link to="/terms" style={{ color: 'inherit' }}>Terms of Service</Link>
            {'   '}
            <Link to="/privacy" style={{ color: 'inherit', marginLeft: 18 }}>Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Cover({ src, title, label, eager }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="cover">
      {failed ? (
        <div className="cover-fallback" role="img" aria-label={`${title} cover`}>
          <span>{label}</span>
          <b>{title}</b>
          <span>Opeyemi Adeniran</span>
        </div>
      ) : (
        <img
          src={src}
          alt={`Cover of ${title}`}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function Price({ item }) {
  const pre = isPreorder();
  return (
    <span className="price">
      <strong>${pre ? item.preorderPrice : item.price}</strong>
      {pre && <s aria-label={`regular price $${item.price}`}>${item.price}</s>}
    </span>
  );
}

export const buyLabel = () => (isPreorder() ? 'Pre-order now' : 'Buy now');
export const preorderLine = () =>
  isPreorder() ? `Pre-order price until launch day, ${launchLabel}.` : 'Out now as PDF and EPUB.';

export function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('agree')) {
      setError(`Please confirm you have read how the $${CONSULTATION_FEE} consultation fee works.`);
      return;
    }
    setError('');
    setStatus('sending');
    const { fields } = GOOGLE_FORM;
    const body = new URLSearchParams({
      [fields.firstName]: f.get('firstName'),
      [fields.lastName]: f.get('lastName'),
      [fields.email]: f.get('email'),
      [fields.phone]: f.get('phone') || '',
      [fields.message]: `[${f.get('need')}]${f.get('company') ? ` [${f.get('company')}]` : ''} ${f.get('message')}`,
      [fields.consultation]: 'Yes',
    });
    try {
      await fetch(GOOGLE_FORM.action, { method: 'POST', mode: 'no-cors', body });
      setStatus('sent');
    } catch {
      setStatus('idle');
      setError(`Your request didn't send. Check your connection and try again`);
    }
  }

  if (status === 'sent') {
    return (
      <div className="sent" role="status">
        <h3>Request received</h3>
        <p>A member of our team will email you within 24 hours to schedule your consultation and share payment details.</p>
        <p className="small" style={{ margin: 0 }}>
          While you wait, download our free <Link to="/books#toolkit" className="link-arrow">AI Business Growth Toolkit</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" name="firstName" required autoComplete="given-name" />
      </div>
      <div>
        <label htmlFor="lastName">Last name</label>
        <input id="lastName" name="lastName" required autoComplete="family-name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="company">Business name (optional)</label>
        <input id="company" name="company" autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="need">What do you need?</label>
        <select id="need" name="need" defaultValue="Not sure yet">
          <option>AI in an existing system</option>
          <option>Chatbot or assistant</option>
          <option>Workflow automation</option>
          <option>Data and forecasting</option>
          <option>New web or mobile app</option>
          <option>AI strategy</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="full">
        <label htmlFor="message">Tell us about your business and what you want to improve</label>
        <textarea id="message" name="message" required />
      </div>
      <div className="full">
        <label className="check">
          <input type="checkbox" name="agree" />
          <span>
            I understand the consultation costs ${CONSULTATION_FEE}, is credited toward my project if I go ahead, and is
            otherwise non-refundable (see the <Link to="/terms">Terms of Service</Link>).
          </span>
        </label>
      </div>
      {error && <p className="error full" role="alert">{error}</p>}
      <div className="full">
        <button className="btn btn-ink" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending request…' : 'Request a consultation'}
        </button>
      </div>
    </form>
  );
}
