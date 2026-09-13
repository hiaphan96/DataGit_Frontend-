import Tabs from '../components/common/Tabs';
import ExperimentSelector from '../components/evaluation/ExperimentSelector';
import PrimaryMetrics from '../components/evaluation/PrimaryMetrics';
import PerformanceChart from '../components/evaluation/PerformanceChart';
import EvaluationStatus from '../components/evaluation/EvaluationStatus';
import ConfusionMatrix from '../components/evaluation/ConfusionMatrix';
import MetricsDetails from '../components/evaluation/MetricsDetails';
import RocCurve from '../components/evaluation/RocCurve';
import { useEvaluation } from '../hooks/useEvaluation';
import { EVALUATION_TABS } from '../types/evaluation';

export function Evaluation() {
  const {
    evaluableIds,
    selectedId,
    evaluation,
    activeTab,
    setActiveTab,
    loading,
    statusMessage,
    handleSelect,
    comparisonRows,
    f1Comparison,
    evaluationStatus,
  } = useEvaluation();

  if (loading || !evaluation) {
    return <p className="home__loading">{statusMessage}</p>;
  }

  return (
    <div className="evaluation-page">
      <div className="evaluation-page__header">
        <div>
          <p className="evaluation-page__breadcrumb">stage 6 / evaluation</p>
          <h1 className="evaluation-page__title">model evaluation</h1>
          <p className="evaluation-page__subtitle">detailed performance analysis.</p>
        </div>
      </div>

      <ExperimentSelector
        evaluableIds={evaluableIds}
        selectedId={selectedId}
        evaluation={evaluation}
        onSelect={handleSelect}
      />

      <Tabs tabs={EVALUATION_TABS} active={activeTab} onSelect={setActiveTab} />

      {activeTab === 'performance' ? (
        <>
          <div className="evaluation-page__performance-grid">
            <PrimaryMetrics rows={comparisonRows} />
            {evaluation.previousMetrics ? (
              <PerformanceChart
                current={evaluation.metrics}
                previous={evaluation.previousMetrics}
                currentLabel={evaluation.experimentId}
                previousLabel={evaluation.previousExperimentId ?? 'previous'}
              />
            ) : null}
          </div>
          {f1Comparison ? (
            <EvaluationStatus
              status={evaluationStatus}
              percentageChange={f1Comparison.percentageChange}
              previousExperimentId={evaluation.previousExperimentId}
            />
          ) : null}
        </>
      ) : null}

      {activeTab === 'confusion-matrix' ? <ConfusionMatrix matrix={evaluation.confusionMatrix} /> : null}

      {activeTab === 'metrics' ? (
        <MetricsDetails metrics={evaluation.metrics} perClassMetrics={evaluation.perClassMetrics} />
      ) : null}

      {activeTab === 'roc-curve' ? (
        <RocCurve points={evaluation.rocPoints} auc={evaluation.metrics.aucRoc} />
      ) : null}
    </div>
  );
}

export default Evaluation;