export type NavSection =
  | 'home'
  | 'datasets'
  | 'projects'
  | 'dataset-preparation'
  | 'evaluation'
  | 'baselines'
  | 'reports'
  | 'compare'
  | 'settings'
  | 'upgrade';

interface NavLeaf {
  id: NavSection;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavLeaf[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'DATA',
    items: [
      { id: 'datasets', label: 'DATASETS' },
      { id: 'projects', label: 'PROJECTS' },
      { id: 'dataset-preparation', label: 'DATASET PREPARATION' },
    ],
  },
  {
    label: 'EXPERIMENTS',
    items: [
      { id: 'evaluation', label: 'EVALUATION' },
      { id: 'baselines', label: 'BASELINES' },
    ],
  },
  {
    label: 'AI & INSIGHTS',
    items: [
      { id: 'reports', label: 'REPORTS' },
      { id: 'compare', label: 'COMPARE' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings', label: 'SETTINGS' },
      { id: 'upgrade', label: 'UPGRADE' },
    ],
  },
];

interface SidebarProps {
  active: NavSection;
  onSelect: (section: NavSection) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="sidebar__nav">
        <ul className="sidebar__list">
          <li>
            <button
              type="button"
              className={`sidebar__item ${
                active === 'home' ? 'sidebar__item--active' : ''
              }`}
              onClick={() => onSelect('home')}
            >
              <span className="sidebar__caret">&gt;</span>
              HOME
            </button>
          </li>
        </ul>

        {NAV_GROUPS.map((group) => (
          <div className="sidebar__group" key={group.label}>
            <p className="sidebar__group-label">{group.label}</p>

            <ul className="sidebar__list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`sidebar__item ${
                      active === item.id
                        ? 'sidebar__item--active'
                        : ''
                    }`}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="sidebar__caret">&gt;</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__footer-rule" />
        <p>USER : guest</p>
        <p>ROLE : viewer</p>
      </div>
    </nav>
  );
}

export default Sidebar;