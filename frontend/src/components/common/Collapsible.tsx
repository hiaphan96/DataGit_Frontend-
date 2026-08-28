import { useState } from 'react';

interface CollapsibleProps {
  title: string;
  description?: string;
  stepNumber?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Collapsible({ title, description, stepNumber, defaultOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible ${open ? 'collapsible--open' : ''}`}>
      <button
        type="button"
        className="collapsible__trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="collapsible__heading">
          <p className="collapsible__title">
            {stepNumber != null ? `${stepNumber}. ` : ''}
            {title}
          </p>
          {description ? <p className="collapsible__description">{description}</p> : null}
        </div>
        <span className="collapsible__chevron">{open ? '⌄' : '›'}</span>
      </button>
      {open ? <div className="collapsible__content">{children}</div> : null}
    </div>
  );
}

export default Collapsible;