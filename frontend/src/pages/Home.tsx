import ProjectStatus from '../components/dashboard/ProjectStatus';
import MetricPanel from '../components/dashboard/MetricPanel';
import DatasetTable from '../components/dashboard/DatasetTable';
import ActivityLog from '../components/dashboard/ActivityLog';
import type { DashboardData } from '../hooks/useDashboardData';

interface HomeProps {
  data: DashboardData;
}

export function Home({ data }: HomeProps) {
  const { project, datasets, metrics, activity, isLoading } = data;

  if (isLoading || !project || !metrics) {
    return <p className="home__loading">loading local project data...</p>;
  }

  return (
    <div className="home">
      <div className="home__intro">
        <p className="home__intro-line">&gt; welcome back.</p>
        <p className="home__intro-sub">local ML control center.</p>
      </div>

      <ProjectStatus project={project} />

      <div className="metric-grid">
        <MetricPanel label="DATASETS" value={String(metrics.totalDatasets)} sublabel="active datasets" />
        <MetricPanel label="VERSIONS" value={String(metrics.totalVersions)} sublabel="dataset checkpoints" />
        <MetricPanel label="EXPERIMENTS" value={String(metrics.totalExperiments)} sublabel="training runs" />
        <MetricPanel label="LAST 7 DAYS" rows={metrics.last7Days} />
      </div>

      <DatasetTable datasets={datasets} />
      <ActivityLog activity={activity} />
    </div>
  );
}

export default Home;