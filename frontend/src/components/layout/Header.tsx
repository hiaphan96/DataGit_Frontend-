import { HelpCircle, CircleUserRound } from 'lucide-react';

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">DATAGIT &gt;_</div>
      <div className="app-header__mode">LOCAL ML CONTROL</div>
      <div className="app-header__actions">
        <button type="button" className="app-header__action">
          <HelpCircle size={14} strokeWidth={1.75} />
          HELP
        </button>
        <button
          type="button"
          className="app-header__action app-header__action--icon"
          aria-label="User"
        >
          <CircleUserRound size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

export default Header;