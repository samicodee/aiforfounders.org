export function Hero() {
  return (
    <section className="hero">
      <img
        className="hero-image is-active"
        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2400&q=86"
        alt="Founder team working through business decisions"
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-inner">
        <p className="kicker">AI for Founders | Hyderabad first, built for real businesses</p>
        <h1>
          Build your founder operating system with AI.
        </h1>
        <p className="hero-copy">
          A practical implementation workshop for founders and business owners
          who want AI to improve sales follow-up, delegation, reporting,
          hiring, proposals, and daily decision-making.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#apply">
            Apply for Founder Cohort
          </a>
          <a className="button secondary" href="#why">
            See the System
          </a>
        </div>
        <div className="hero-metrics" aria-label="Program highlights">
          <span>2-day intensive</span>
          <span>Founder-led</span>
          <span>No coding</span>
          <span>3 working workflows</span>
        </div>
      </div>
    </section>
  );
}
