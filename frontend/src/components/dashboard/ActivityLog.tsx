import SectionLabel from '../common/SectionLabel';
import type { ActivityItem } from '../../types/dashboard';

interface ActivityLogProps {
  activity: ActivityItem[];
}

export function ActivityLog({ activity }: ActivityLogProps) {
  return (
    <section className="activity-log">
      <SectionLabel>RECENT ACTIVITY</SectionLabel>
      <ul className="activity-log__list">
        {activity.map((item) => (
          <li key={item.id} className="activity-log__row">
            <span className="activity-log__timestamp">[{item.timestamp}]</span>
            <span className="activity-log__message">{item.message}</span>
            <span className={`activity-log__tag activity-log__tag--${item.type}`}>[ {item.type} ]</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ActivityLog;