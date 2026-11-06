import { BOOKS, BUNDLE, STORE_URL, isPreorder } from '../data/content';
import { Cover, Price, buyLabel, preorderLine } from '../components/Parts';

export default function Home() {
  const pre = isPreorder();
  return (
    <>
      <div className="wrap">
        <div className="hero">
          <div className="hero-copy">
            <h1>Practical books for building a career in tech.</h1>
            <p className="lede">
              Favored Online educates people building a career in tech. Our Career Path in Tech series takes you from
              deciding whether tech is right for you, to landing the role, to building a career that lasts in the age
              of AI.
            </p>
            <div className="btn-row">
              <a href={BUNDLE.url} className="btn btn-ink" target="_blank" rel="noopener noreferrer">
                {pre ? 'Pre-order the series' : 'Get the series'}
              </a>
              <span className="small sans">All three books for <Price item={BUNDLE} /></span>
            </div>
            <p className="small sans" style={{ marginTop: 14 }}>{preorderLine()}</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="fan">
              {BOOKS.map((b) => (
                <Cover key={b.id} src={b.cover} title={b.title} label={`Book ${b.number}: ${b.name}`} eager />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="wrap" aria-labelledby="bundle-h" style={{ paddingTop: 'clamp(48px,7vw,96px)' }}>
        <div className="bundle">
          <Cover src={BUNDLE.cover} title={`${BUNDLE.title}: ${BUNDLE.subtitle}`} label="Complete series" />
          <div>
            {pre && <span className="note">Pre-order saves ${BUNDLE.separatePrice - BUNDLE.preorderPrice}</span>}
            <h2 id="bundle-h" style={{ fontSize: 'clamp(1.8rem,3.2vw,2.6rem)' }}>The complete series</h2>
            <p className="measure">{BUNDLE.blurb}</p>
            <ul className="facts">
              <li>3 books</li>
              <li>About {BUNDLE.pages} pages</li>
              <li>{BUNDLE.formats}</li>
              <li>${BUNDLE.separatePrice} if bought separately</li>
            </ul>
            <div className="btn-row">
              <a href={BUNDLE.url} className="btn btn-ink" target="_blank" rel="noopener noreferrer">{buyLabel()}</a>
              <Price item={BUNDLE} />
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="books" aria-labelledby="books-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="books-h">Start, get in, grow</h2>
            <p className="lede">
              Each book takes one stage of a tech career and gives you the decisions, steps and worksheets for it,
              drawing on more than twenty practitioners, educators and leaders.
            </p>
          </div>
          <div className="books" style={{ marginTop: 0 }}>
            {BOOKS.map((b) => (
              <article className="book" key={b.id} id={b.id}>
                <div className="book-num" aria-hidden="true">{b.number}</div>
                <Cover src={b.cover} title={b.title} label={`Book ${b.number}: ${b.name}`} />
                <div className="book-body">
                  <div className="book-name">Book {b.number}: {b.name}</div>
                  <h3>{b.title}</h3>
                  <p className="small" style={{ margin: 0 }}>{b.forWho}</p>
                  <ul>
                    {b.topics.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <div className="meta">
                    <a href={b.url} className="btn btn-ink" target="_blank" rel="noopener noreferrer">{buyLabel()}</a>
                    <Price item={b} />
                    <span className="small">{b.pages}-page PDF + EPUB, worksheets and glossary</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block moss" id="about" aria-labelledby="about-h">
        <div className="wrap about">
          <blockquote>
            Honest, practical guidance for anyone finding their place in tech as AI changes the work.
          </blockquote>
          <div>
            <h2 id="about-h" style={{ fontSize: 'clamp(1.6rem,2.6vw,2.1rem)' }}>About the author</h2>
            <p>
              Career Path in Tech is written by Opeyemi Adeniran, founder of Favored Online and an AI researcher at
              Morgan State University whose work focuses on making AI systems more trustworthy. She was named to
              Technical.ly's 2026 RealLIST Innovators for Maryland and has been featured in Forbes.
            </p>
            <p>
              Favored Online exists to help people build skills and careers in tech, with guidance that is clear,
              practical and honest about how AI is changing the job market.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <a href={BUNDLE.url} className="btn btn-ink" target="_blank" rel="noopener noreferrer">
                {pre ? 'Pre-order the series' : 'Get the series'}
              </a>
              <a href={STORE_URL} className="btn btn-line" target="_blank" rel="noopener noreferrer">Visit the store</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
