import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isPreorder, launchLabel, SOCIALS, STORE_URL, BOOKS, BUNDLE } from '../data/content';

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
          <a href="/#books">The books</a>
          <a href="/#about">About</a>
          <a href={BUNDLE.url} className="btn btn-ink" target="_blank" rel="noopener noreferrer">
            {isPreorder() ? 'Pre-order the series' : 'Get the series'}
          </a>
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
            <p>Practical books for building a career in tech.</p>
          </div>
          <div>
            <h4>Career Path in Tech</h4>
            <ul>
              <li><a href={BUNDLE.url} target="_blank" rel="noopener noreferrer">The complete series</a></li>
              {BOOKS.map((b) => (
                <li key={b.id}><a href={b.url} target="_blank" rel="noopener noreferrer">Book {b.number}: {b.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><a href={STORE_URL} target="_blank" rel="noopener noreferrer">Store</a></li>
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
