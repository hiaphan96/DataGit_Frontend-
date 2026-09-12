import Button from '../components/common/Button';
import ExperimentSummary from '../components/experiments/ExperimentSummary';
import ExperimentTable from '../components/experiments/ExperimentTable';
import RunningExperimentPanel from '../components/experiments/RunningExperimentPanel';
import NewExperimentModal from '../components/experiments/NewExperimentModal';
import ExperimentDetails from '../components/experiments/ExperimentDetails';
import { useExperiments } from '../hooks/useExperiments';

export function Experiments() {
  const {
    experiments,
    datasets,
    loading,
    statusMessage,
    runningExperiment,
    selectedExperiment,
    showNewModal,
    openNewExperimentModal,
    closeNewExperimentModal,
    selectExperiment,
    closeDetails,
    createExperiment,
  } = useExperiments();

  if (loading) {
    return <p className="home__loading">{statusMessage}</p>;
  }

  return (
    <div className="experiments-page">
      <div className="experiments-page__header">
        <div>
          <p className="experiments-page__breadcrumb">stage 5 / experiments</p>
          <h1 className="experiments-page__title">experiments</h1>
          <p className="experiments-page__subtitle">track and manage model training runs.</p>
        </div>
        <Button type="button" variant="primary" onClick={openNewExperimentModal}>
          + new experiment
        </Button>
      </div>

      <ExperimentSummary experiments={experiments} />

      <ExperimentTable experiments={experiments} onSelect={selectExperiment} />

      {runningExperiment ? (
        <RunningExperimentPanel experiment={runningExperiment} onViewDetails={selectExperiment} />
      ) : null}

      {showNewModal ? (
        <NewExperimentModal datasets={datasets} onCancel={closeNewExperimentModal} onCreate={createExperiment} />
      ) : null}

      {selectedExperiment ? (
        <ExperimentDetails experiment={selectedExperiment} onClose={closeDetails} />
      ) : null}
    </div>
  );
}

export default Experiments;