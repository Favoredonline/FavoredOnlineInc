import { Link } from 'react-router-dom';
import { SERVICES, PROCESS, FAQS, CONSULTATION_FEE, CONTACT_EMAIL, TOOLKIT } from '../data/content';
import { ContactForm } from '../components/Parts';

export default function AISolutions() {
  return (
    <>
      <div className="pine">
        <div className="wrap page-head">
          <h1>AI solutions for businesses</h1>
          <p className="lede measure">
            We design, build and support AI systems that answer customers, automate busy work and turn your data
            into decisions, inside the tools you already use or as new products.
          </p>
          <div className="btn-row" style={{ marginTop: 28 }}>
            <a href="#contact" className="btn btn-lime">Book a consultation</a>
            <a href="#process" className="link-arrow">How we work</a>
          </div>
        </div>
        <section className="wrap" aria-labelledby="services-h" style={{ paddingBottom: 'clamp(64px,9vw,120px)' }}>
          <h2 id="services-h" className="sr-only" style={{ position: 'absolute', left: -9999 }}>Services</h2>
          <div className="services">
            {SERVICES.map((s) => (
              <div className="service" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>{s.examples.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="block" id="process" aria-labelledby="process-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="process-h">How we work</h2>
            <p className="lede">Every project starts with a consultation, so you know exactly what you are getting and what it costs before you commit.</p>
          </div>
          <ol className="process">
            {PROCESS.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="fee-note measure">
            The ${CONSULTATION_FEE} consultation fee is credited in full toward your project if you build with us. If you
            decide not to go ahead, it is non-refundable. Read the full <Link to="/terms">Terms of Service</Link>.
          </p>
        </div>
      </section>

      <section className="block moss" aria-labelledby="faq-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="faq-h">Questions</h2>
            <p className="lede">
              Not ready to talk yet? Try our free <a href={TOOLKIT.url} target="_blank" rel="noopener noreferrer">AI Business Growth Toolkit</a> first.
            </p>
          </div>
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="contact" aria-labelledby="contact-h">
        <div className="wrap contact-grid">
          <div>
            <h2 id="contact-h">Book a consultation</h2>
            <p className="lede">
              Tell us about your business and what you want to improve. We reply by email within 24 hours to
              schedule your session.
            </p>
            <p className="small">
              Prefer email? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
