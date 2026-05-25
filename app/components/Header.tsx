export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/#top" aria-label="AI for Founders home">
        <span className="wordmark">
          AI for <span>Founders</span>
        </span>
        <span className="tagline">FOUNDER OPERATING LEVERAGE.</span>
      </a>
      <nav className="nav" aria-label="Primary navigation">
        <a href="/#outcomes">Outcomes</a>
        <a href="/#why">Why</a>
        <a href="/#workflows">Workflows</a>
        <a href="/#apply">Apply</a>
      </nav>
      <a className="header-cta" href="/#apply">
        Apply
      </a>
    </header>
  );
}
