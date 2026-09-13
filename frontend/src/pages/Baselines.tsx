import Button from '../components/common/Button';
import BaselineTable from '../components/baseline/BaselineTable';
import BaselineSummary from '../components/baseline/BaselineSummary';
import BaselineComparison from '../components/baseline/BaselineComparison';
import NewBaselineModal from '../components/baseline/NewBaselineModal';
import { useBaselines } from '../hooks/useBaselines';

export function Baselines() {
  const {
    baselines,
    experiments,
    loading,
    statusMessage,
    selectedBaseline,
    showNewModal,
    openNewModal,
    closeNewModal,
    selectBaseline,
    createBaseline,
  } = useBaselines();

  if (loading) {
    return <p className="home__loading">{statusMessage}</p>;
  }

  return (
    <div className="baselines-page">
      <div className="baselines-page__header">
        <div>
          <h1 className="baselines-page__title">baselines</h1>
          <p className="baselines-page__subtitle">manage baseline models and comparison reference points.</p>
        </div>
        <Button type="button" variant="primary" onClick={openNewModal}>
          + new baseline
        </Button>
      </div>

      <BaselineTable baselines={baselines} onSelect={selectBaseline} />

      <div className="baselines-page__grid">
        <BaselineSummary baselines={baselines} />
        <BaselineComparison baselines={baselines} selectedId={selectedBaseline?.id ?? null} />
      </div>

      {showNewModal ? (
        <NewBaselineModal experiments={experiments} onCancel={closeNewModal} onCreate={createBaseline} />
      ) : null}
    </div>
  );
}

export default Baselines;