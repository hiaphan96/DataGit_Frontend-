import type { BeforeAfterMetric } from '../../types/preprocessing';

interface BeforeAfterSummaryProps {
  metrics: BeforeAfterMetric[];
}

export function BeforeAfterSummary({ metrics }: BeforeAfterSummaryProps) {
  return (
    <div className="before-after">
      <p className="section-label">before vs after summary</p>
      <table className="before-after__table">
        <thead>
          <tr>
            <th>metric</th>
            <th>before</th>
            <th>after</th>
            <th>change</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.id}>
              <td className="before-after__label">{metric.label}</td>
              <td>{metric.before}</td>
              <td>{metric.after}</td>
              <td className={`before-after__change before-after__change--${metric.direction}`}>
                {metric.changeLabel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BeforeAfterSummary;