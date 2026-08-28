import type { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return <h2 className="section-label">{children}</h2>;
}

export default SectionLabel;