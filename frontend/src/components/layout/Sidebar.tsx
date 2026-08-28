export type NavSection =
  | 'home'
  | 'projects'
  | 'datasets'
  | 'versions'
  | 'compare'
  | 'experiments'
  | 'investigate'
  | 'history'
  | 'settings';

interface NavItem {
  id: NavSection;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'HOME' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'datasets', label: 'DATASETS' },
  { id: 'versions', label: 'VERSIONS' },
  { id: 'compare', label: 'COMPARE' },
  { id: 'experiments', label: 'EXPERIMENTS' },
  { id: 'investigate', label: 'INVESTIGATE' },
  { id: 'history', label: 'HISTORY' },
  { id: 'settings', label: 'SETTINGS' },
];

interface SidebarProps {
  active: NavSection;
  onSelect: (section: NavSection) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Primary">
      <ul className="sidebar__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`sidebar__item ${active === item.id ? 'sidebar__item--active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="sidebar__caret">&gt;</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar__footer">
        <div className="sidebar__footer-rule" />
        <p>USER : guest</p>
        <p>ROLE : viewer</p>
      </div>
    </nav>
  );
}

export default Sidebar;