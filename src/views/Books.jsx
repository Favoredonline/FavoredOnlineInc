import { Link } from 'react-router-dom';
import { BOOKS, BUNDLE, TOOLKIT, STORE_URL, isPreorder } from '../data/content';
import { Cover, Price, buyLabel, preorderLine } from '../components/Parts';

export default function Books() {
  const pre = isPreorder();
  return (
    <>
      <div className="wrap page-head">
        <h1>Career Path in Tech</h1>
        <p className="lede measure">
          Three practical books by Opeyemi Adeniran for finding your way into tech, getting hired and building a
          career that lasts as AI reshapes the job market. {preorderLine()}
        </p>
      </div>

      <section className="wrap" aria-labelledby="bundle-h">
        <div className="bundle">
          <Cover src={BUNDLE.cover} title={`${BUNDLE.title}: ${BUNDLE.subtitle}`} label="Complete series" eager />
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

      <section className="wrap" aria-label="The three books">
        <div className="books">
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
      </section>

      <section className="block" id="toolkit" aria-labelledby="toolkit-h">
        <div className="wrap">
          <div className="toolkit pine">
            <Cover src={TOOLKIT.cover} title={TOOLKIT.title} label="Free download" />
            <div>
              <h3 id="toolkit-h">Free for business owners: {TOOLKIT.title}</h3>
              <p>{TOOLKIT.blurb}</p>
            </div>
            <a href={TOOLKIT.url} className="btn btn-lime" target="_blank" rel="noopener noreferrer">Download free</a>
          </div>
          <p className="small mt-lg">
            All books are sold and delivered through our <a href={STORE_URL} target="_blank" rel="noopener noreferrer">Selar store</a>.
            Want AI working inside your own business? <Link to="/ai-solutions" className="link-arrow">See our AI services</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
