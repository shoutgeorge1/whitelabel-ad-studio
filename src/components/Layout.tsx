import { Outlet } from 'react-router-dom';
import './Layout.css';

/**
 * Legacy React shell — retired.
 * Active site: MedVirtual Ad Production (/studio.html and the VMA HTML pages).
 */
export function Layout() {
  return (
    <div className="app-shell">
      <header className="doc-header">
        <div className="doc-header__row">
          <a className="doc-header__brand" href="/studio.html">
            <span className="doc-header__mark">MV</span>
            <div>
              <h1 className="doc-header__title">MedVirtual Ad Production</h1>
              <p className="doc-header__tagline">Scroll-stopping ads that book demos</p>
            </div>
          </a>
          <nav className="doc-nav" aria-label="Primary">
            <a href="/studio.html">Dashboard</a>
            <a href="/vma-approved.html">Approved Creative</a>
            <a href="/ideas.html">New Ad Ideas</a>
            <a href="/vma-video.html">Animated Video</a>
          </nav>
        </div>
        <div className="doc-header__page">
          <h2 className="doc-header__page-title">Retired React surface</h2>
          <p className="doc-header__page-sub">
            Use the Ad Production HTML site — start at Dashboard.
          </p>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
