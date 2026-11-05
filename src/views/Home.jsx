import { Link } from 'react-router-dom';
import { BOOKS, BUNDLE, SERVICES } from '../data/content';
import { Cover, Price, preorderLine } from '../components/Parts';

export default function Home() {
  return (
    <>
      <div className="wrap">
        <div className="hero-intro">
          <h1>Books to grow your tech career. AI to grow your business.</h1>
          <p className="lede">
            Favored Online publishes practical guides for people building a career in tech, and designs AI
            systems that help businesses work faster and serve customers better.
          </p>
        </div>

        <div className="doors">
          <div className="door door-books">
            <span className="tag">Books</span>
            <h2>Career Path in Tech</h2>
            <p className="measure">
              A three-book series on getting into tech, landing the role and building a career that lasts in the age of AI.
            </p>
            <div className="fan" aria-hidden="true">
              {BOOKS.map((b) => (
                <Cover key={b.id} src={b.cover} title={b.title} label={`Book ${b.number}: ${b.name}`} eager />
              ))}
            </div>
            <div className="btn-row">
              <Link to="/books" className="btn btn-ink">See the books</Link>
              <span className="small sans">Full series from <Price item={BUNDLE} /></span>
            </div>
          </div>

          <div className="door door-ai pine">
            <span className="tag">AI for business</span>
            <h2>AI that does real work in your business</h2>
            <ul className="outcomes">
              <li>Answer customer questions at any hour</li>
              <li>Take repetitive admin off your team</li>
              <li>See this month's numbers and forecast the next</li>
            </ul>
            <div className="btn-row">
              <Link to="/ai-solutions#contact" className="btn btn-lime">Book a consultation</Link>
              <Link to="/ai-solutions" className="link-arrow">Our services</Link>
            </div>
          </div>
        </div>
      </div>

      <section className="block" aria-labelledby="books-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="books-h">Start, get in, grow</h2>
            <p className="lede">
              Each book takes one stage of a tech career and gives you the decisions, steps and worksheets for it,
              drawing on more than twenty practitioners, educators and leaders. {preorderLine()}
            </p>
          </div>
          <div className="book-row">
            {BOOKS.map((b) => (
              <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer">
                <Cover src={b.cover} title={b.title} label={`Book ${b.number}: ${b.name}`} />
                <div className="book-name">Book {b.number}: {b.name}</div>
                <p className="small">{b.title}</p>
                <Price item={b} />
              </a>
            ))}
          </div>
          <p className="mt-lg"><Link to="/books" className="link-arrow">Read what each book covers</Link></p>
        </div>
      </section>

      <section className="block pine" aria-labelledby="ai-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="ai-h">AI solutions, built around your business</h2>
            <p className="lede">
              We start with the problem you want solved, not the technology. Then we build, connect and support the
              system that solves it.
            </p>
          </div>
          <div className="services">
            {SERVICES.map((s) => (
              <div className="service" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <div className="btn-row mt-lg">
            <Link to="/ai-solutions#contact" className="btn btn-lime">Book a consultation</Link>
            <Link to="/ai-solutions#process" className="link-arrow">How we work</Link>
          </div>
        </div>
      </section>

      <section className="block moss" id="about" aria-labelledby="about-h">
        <div className="wrap about">
          <blockquote>
            Practical help for the people building careers in tech, and for the businesses putting AI to work.
          </blockquote>
          <div>
            <h2 id="about-h" style={{ fontSize: 'clamp(1.6rem,2.6vw,2.1rem)' }}>About Favored Online</h2>
            <p>
              Favored Online was founded by Opeyemi Adeniran, an AI researcher at Morgan State University whose work
              focuses on making AI systems more trustworthy. She was named to Technical.ly's 2026 RealLIST Innovators
              for Maryland and has been featured in Forbes.
            </p>
            <p>
              The same research background shapes both sides of our work: books that give honest, practical guidance
              about tech careers as AI changes them, and AI systems for businesses that are reliable, measurable and
              built to be trusted.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link to="/books" className="btn btn-ink">Browse the books</Link>
              <Link to="/ai-solutions" className="btn btn-line">Explore AI services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
