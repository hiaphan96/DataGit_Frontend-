import DatasetDetails from '../components/dataset/DatasetDetails';
import FileUploadCard from '../components/dataset/FileUploadCard';
import UploadActions from '../components/dataset/UploadActions';
import UploadSummary from '../components/dataset/UploadSummary';
import ValidationChecklist from '../components/dataset/ValidationChecklist';
import { useDatasetUpload } from '../hooks/useDatasetUpload';

export function Datasets() {
  const {
    form,
    checks,
    overallStatus,
    statusMessage,
    formError,
    datasetNameError,
    estimatedSize,
    canContinue,
    setDatasetName,
    setTaskType,
    setTextField,
    setDescription,
    handleFileSelect,
    handleFileRemove,
    handleReset,
    handleStartValidation,
  } = useDatasetUpload();

  return (
    <div className="datasets-page">
      <p className="datasets-page__breadcrumb">stage 2 / upload</p>
      <h1 className="datasets-page__title">upload new dataset</h1>
      <p className="datasets-page__subtitle">upload your training and test data files to create a new version.</p>

      <div className="datasets-page__grid">
        <div className="datasets-page__main">
          <DatasetDetails
            form={form}
            datasetNameError={datasetNameError}
            onDatasetNameChange={setDatasetName}
            onTaskTypeChange={setTaskType}
            onTextFieldChange={setTextField}
            onDescriptionChange={setDescription}
          />

          <section className="dataset-panel">
            <h2 className="section-label">2. upload files</h2>
            <div className="dataset-upload-grid">
              <FileUploadCard kind="train" label="training data (csv)" fileMeta={form.trainFile} onFileSelect={handleFileSelect} onFileRemove={handleFileRemove} />
              <FileUploadCard kind="test" label="test data (csv)" fileMeta={form.testFile} onFileSelect={handleFileSelect} onFileRemove={handleFileRemove} />
            </div>

            <div className="dataset-requirements">
              <p className="dataset-requirements__title">supported data</p>
              <ul className="dataset-requirements__list">
                <li>csv</li>
                <li>json</li>
                <li>txt</li>
                <li>parquet</li>
              </ul>
              <p className="dataset-requirements__note">train and test files should share compatible columns · headers recommended · max ~500 MB per file</p>
            </div>
          </section>

          <UploadActions
            overallStatus={overallStatus}
            formError={formError}
            canContinue={canContinue}
            onStartValidation={handleStartValidation}
            onReset={handleReset}
            onContinue={() => { /* wire to next stage later */ }}
          />

          <p className="datasets-page__status-line">&gt; {statusMessage}</p>
        </div>

        <div className="datasets-page__side">
          <UploadSummary form={form} estimatedSize={estimatedSize} />
          <ValidationChecklist checks={checks} overallStatus={overallStatus} />
        </div>
      </div>
    </div>
  );
}

export default Datasets;