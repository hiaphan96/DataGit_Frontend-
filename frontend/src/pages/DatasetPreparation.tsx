import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import Collapsible from '../components/common/Collapsible';
import CleaningStepRow from '../components/preprocessing/CleaningStepRow';
import DataPreviewTable from '../components/preprocessing/DataPreviewTable';
import BeforeAfterSummary from '../components/preprocessing/BeforeAfterSummary';
import WarningsPanel from '../components/preprocessing/WarningsPanel';
import AiSuggestionCard from '../components/preprocessing/AiSuggestionCard';
import PreprocessingActionBar from '../components/preprocessing/PreprocessingActionBar';
import { useDatasetPreparation } from '../hooks/useDatasetPreparation';
import { PREPROCESSING_TABS } from '../types/preprocessing';

export function DatasetPreparation() {
  const {
    activeTab,
    setActiveTab,
    cleaningSteps,
    preview,
    metrics,
    warnings,
    aiSuggestion,
    nextVersionLabel,
    loading,
    previewStatus,
    createStatus,
    statusMessage,
    createDisabled,
    handleToggleStep,
    handleSelectChange,
    handlePreview,
    handleCreateVersion,
  } = useDatasetPreparation();

  if (loading) {
    return <p className="home__loading">{statusMessage}</p>;
  }

  return (
    <div className="preprocessing-page">
      <div className="preprocessing-page__header">
        <div>
          <p className="preprocessing-page__breadcrumb">stage 4 / preprocessing</p>
          <h1 className="preprocessing-page__title">preprocessing &amp; data preparation</h1>
          <p className="preprocessing-page__subtitle">
            configure how your data should be cleaned and transformed before training.
          </p>
        </div>
        <Button type="button" variant="secondary">
          &lt; back to profiling
        </Button>
      </div>

      <div className="preprocessing-page__grid">
        <div className="preprocessing-page__left">
          <Collapsible title="preprocessing steps" stepNumber={1} defaultOpen>
            <Tabs tabs={PREPROCESSING_TABS} active={activeTab} onSelect={setActiveTab} />

            {activeTab === 'cleaning' ? (
              <div className="cleaning-step-list">
                {cleaningSteps.map((step) => (
                  <CleaningStepRow
                    key={step.id}
                    step={step}
                    onToggle={handleToggleStep}
                    onSelectChange={handleSelectChange}
                  />
                ))}
              </div>
            ) : (
              <div className="module-placeholder module-placeholder--inline">
                <p className="module-placeholder__eyebrow">{activeTab}</p>
                <p className="module-placeholder__message">MODULE NOT IMPLEMENTED YET</p>
              </div>
            )}
          </Collapsible>

          <Collapsible
            title="feature preparation"
            stepNumber={2}
            description="configure feature-related preprocessing"
          >
            <div className="module-placeholder module-placeholder--inline">
              <p className="module-placeholder__message">MODULE NOT IMPLEMENTED YET</p>
            </div>
          </Collapsible>

          <Collapsible
            title="output options"
            stepNumber={3}
            description="save preprocessed data as new version"
          >
            <div className="module-placeholder module-placeholder--inline">
              <p className="module-placeholder__message">MODULE NOT IMPLEMENTED YET</p>
            </div>
          </Collapsible>
        </div>

        <div className="preprocessing-page__right">
          {preview ? <DataPreviewTable preview={preview} /> : null}
          <BeforeAfterSummary metrics={metrics} />
          <WarningsPanel warnings={warnings} />
          {aiSuggestion ? <AiSuggestionCard suggestion={aiSuggestion} /> : null}
        </div>
      </div>

      <PreprocessingActionBar
        previewStatus={previewStatus}
        createStatus={createStatus}
        nextVersionLabel={nextVersionLabel}
        onPreview={handlePreview}
        onCreateVersion={handleCreateVersion}
        createDisabled={createDisabled}
      />
    </div>
  );
}

export default DatasetPreparation;