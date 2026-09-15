import { useState } from 'react';
import Button from '../components/common/Button';
import Collapsible from '../components/common/Collapsible';
import { useDatasetPreparation } from '../hooks/useDatasetPreparation';

export function DatasetPreparation() {
  const {
    activeTab,
    setActiveTab,
    loading,
    statusMessage,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    versions,
    selectedVersionId,
    setSelectedVersionId,
    categories,
    activeOperations,
    toggleOperation,
    isOperationSelected,
    selectedOperations,
    uploadedFilename,
    uploadStatus,
    handleUpload,
    handleLoadProfile,
    profile,
    handleSaveSelection,
    handleSaveConfiguration,
    handleValidate,
    handleProcess,
    handleGenerateReport,
    handleCreateVersion,
    preparedDatasets,
    preparationReports,
    processResponse,
    validationResponse,
    error,
    phase,
  } = useDatasetPreparation();

  const [pickedFileName, setPickedFileName] = useState<string>('');
  const [versionDescription, setVersionDescription] = useState('');

  if (loading) {
    return <p className="home__loading">{statusMessage}</p>;
  }

  return (
    <div className="preprocessing-page">
      <div className="preprocessing-page__header">
        <div>
          <p className="preprocessing-page__breadcrumb">data / dataset preparation</p>
          <h1 className="preprocessing-page__title">dataset preparation</h1>
          <p className="preprocessing-page__subtitle">
            prepare and validate your dataset before model training.
          </p>
        </div>
      </div>

      {/* ---------- DATASET CONTEXT ---------- */}
      <Collapsible title="dataset context" stepNumber={0} defaultOpen>
        <div className="preprocessing-page__context">
          <label className="preprocessing-page__field">
            <span>project</span>
            <select
              value={selectedProjectId ?? ''}
              onChange={(e) => setSelectedProjectId(e.target.value || null)}
            >
              <option value="">— select a project —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="preprocessing-page__field">
            <span>version</span>
            <select
              value={selectedVersionId ?? ''}
              onChange={(e) => setSelectedVersionId(e.target.value || null)}
              disabled={!selectedProjectId}
            >
              <option value="">— select a version —</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  V{String(v.versionNumber).padStart(2, '0')}
                </option>
              ))}
            </select>
          </label>

          <div className="preprocessing-page__field">
            <span>dataset file</span>
            <label className="preprocessing-file">
              <input
                type="file"
                accept=".csv,.json,.parquet"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setPickedFileName(f.name);
                    handleUpload(f);
                  }
                }}
              />
              <span className="preprocessing-file__button">choose file</span>
              <span className="preprocessing-file__name">
                {pickedFileName || 'no file chosen'}
              </span>
            </label>
            {uploadedFilename ? (
              <span className="preprocessing-page__hint">uploaded: {uploadedFilename}</span>
            ) : null}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleLoadProfile}
            disabled={!uploadedFilename || uploadStatus !== 'success'}
          >
            load profile
          </Button>
        </div>

        {profile ? (
          <div className="profile-panel">
            <div className="profile-panel__stats">
              <div className="profile-stat">
                <span className="profile-stat__label">file</span>
                <span className="profile-stat__value">{profile.filename}</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">type</span>
                <span className="profile-stat__value">{profile.file_type}</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">rows</span>
                <span className="profile-stat__value">{profile.rows}</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">columns</span>
                <span className="profile-stat__value">{profile.columns}</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">missing</span>
                <span className="profile-stat__value">{profile.missing_value_count}</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">duplicates</span>
                <span className="profile-stat__value">{profile.duplicate_rows}</span>
              </div>
            </div>

            <div className="profile-panel__section">
              <p className="profile-panel__section-label">columns</p>
              <div className="profile-panel__table-scroll">
                <table className="profile-panel__table">
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>type</th>
                      <th>missing</th>
                      <th>unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.column_information.map((col) => (
                      <tr key={col.name}>
                        <td>{col.name}</td>
                        <td className="profile-panel__type">{col.data_type}</td>
                        <td className={col.missing > 0 ? 'profile-panel__warn' : ''}>
                          {col.missing}
                        </td>
                        <td>{col.unique}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {Object.keys(profile.missing_values).length > 0 ? (
              <div className="profile-panel__section">
                <p className="profile-panel__section-label">missing values by column</p>
                <ul className="profile-panel__list">
                  {Object.entries(profile.missing_values).map(([col, count]) => (
                    <li key={col}>
                      <span className="profile-panel__col-name">{col}</span>
                      <span className="profile-panel__warn">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="profile-panel__section profile-panel__section--split">
              <div>
                <p className="profile-panel__section-label">numeric columns</p>
                <p className="profile-panel__chips">
                  {profile.numeric_columns.length === 0
                    ? '—'
                    : profile.numeric_columns.map((c) => (
                        <span key={c} className="profile-chip">
                          {c}
                        </span>
                      ))}
                </p>
              </div>
              <div>
                <p className="profile-panel__section-label">categorical columns</p>
                <p className="profile-panel__chips">
                  {profile.categorical_columns.length === 0
                    ? '—'
                    : profile.categorical_columns.map((c) => (
                        <span key={c} className="profile-chip">
                          {c}
                        </span>
                      ))}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </Collapsible>

      {/* ---------- MAIN GRID ---------- */}
      <div className="preprocessing-page__grid">
        <div className="preprocessing-page__left">
          <Collapsible title="preparation steps" stepNumber={1} defaultOpen>
            <div className="tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`tabs__item${activeTab === cat ? ' tabs__item--active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeOperations.length === 0 ? (
              <div className="module-placeholder module-placeholder--inline">
                <p className="module-placeholder__message">No operations available</p>
              </div>
            ) : (
              <div className="cleaning-step-list">
                                {activeOperations.map((op, idx) => {
                  const raw = op as Record<string, unknown>;
                  const opId = (raw.operation as string) ?? '';
                  const label = opId
                    ? opId.replace(/_/g, ' ')
                    : `operation ${idx + 1}`;
                  const description = (raw.description as string) ?? '';
                  const status = (raw.status as string) ?? 'available';
                  const selected = isOperationSelected(activeTab, raw);
                  return (
                    <div className="cleaning-step" key={`${activeTab}-${idx}`}>
                      <div className="cleaning-step__text">
                        <p className="cleaning-step__title">{label}</p>
                        {description ? (
                          <p className="cleaning-step__description">{description}</p>
                        ) : null}
                        {status !== 'available' ? (
                          <p
                            className="cleaning-step__description"
                            style={{ color: 'var(--color-warning)' }}
                          >
                            status: {status}
                          </p>
                        ) : null}
                      </div>
                      <div className="cleaning-step__control">
                        <button
                          type="button"
                          className={`toggle${selected ? ' toggle--on' : ''}`}
                          onClick={() => toggleOperation(activeTab, raw)}
                          aria-pressed={selected}
                        >
                          <span className="toggle__thumb" />
                        </button>
                        <span className="cleaning-step__status">
                          {selected ? 'selected' : 'off'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Collapsible>

          <Collapsible
            title="configuration"
            stepNumber={2}
            description="review and save the selected operations"
          >
            <p className="preprocessing-page__hint">
              {selectedOperations.length} operation(s) selected.
            </p>
            <div className="preprocessing-page__actions">
              <Button type="button" onClick={handleSaveSelection}>
                save selection
              </Button>
              <Button type="button" onClick={handleSaveConfiguration}>
                save configuration
              </Button>
              <Button type="button" onClick={handleValidate}>
                validate configuration
              </Button>
            </div>
          </Collapsible>

          <Collapsible
            title="process"
            stepNumber={3}
            description="apply the preparation plan to the dataset"
          >
            <div className="preprocessing-page__actions">
              <Button type="button" variant="primary" onClick={handleProcess}>
                process dataset
              </Button>
              <Button type="button" onClick={handleGenerateReport}>
                generate report
              </Button>
            </div>
          </Collapsible>

          <Collapsible
            title="output options"
            stepNumber={4}
            description="save prepared data as a new version"
          >
            <label className="preprocessing-page__field">
              <span>version description</span>
              <input
                type="text"
                value={versionDescription}
                onChange={(e) => setVersionDescription(e.target.value)}
                placeholder="e.g. cleaned and normalized customer churn dataset"
              />
            </label>
            <Button
              type="button"
              variant="primary"
              onClick={() => handleCreateVersion(versionDescription)}
              disabled={!versionDescription.trim() || phase === 'creating-version'}
            >
              create new version
            </Button>
          </Collapsible>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="preprocessing-page__right">
          {validationResponse ? (
            <div className="warnings-panel">
              <p className="warnings-panel__label">validation result</p>
              <pre className="preprocessing-page__profile-json">
                {JSON.stringify(validationResponse, null, 2)}
              </pre>
            </div>
          ) : null}

          {processResponse ? (
            <div className="warnings-panel">
              <p className="warnings-panel__label">process result</p>
              <pre className="preprocessing-page__profile-json">
                {JSON.stringify(processResponse, null, 2)}
              </pre>
            </div>
          ) : null}

          {preparedDatasets && Object.keys(preparedDatasets.files ?? {}).length > 0 ? (
            <div className="warnings-panel">
              <p className="warnings-panel__label">prepared datasets</p>
              <ul className="warnings-panel__list">
                {Object.keys(preparedDatasets.files).map((fname) => (
                  <li key={fname} className="warnings-panel__item">
                    <span>{fname}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {preparationReports && Object.keys(preparationReports.files ?? {}).length > 0 ? (
            <div className="warnings-panel">
              <p className="warnings-panel__label">reports</p>
              <ul className="warnings-panel__list">
                {Object.keys(preparationReports.files).map((fname) => (
                  <li key={fname} className="warnings-panel__item">
                    <span>{fname}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {error ? (
            <div className="warnings-panel">
              <p className="warnings-panel__label">error</p>
              <p className="warnings-panel__item warnings-panel__item--warning">{error}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ---------- BOTTOM BAR ---------- */}
      <div className="preprocessing-action-bar">
        <div className="preprocessing-action-bar__group">
          <div className="preprocessing-action-bar__text">
            <p className="preprocessing-action-bar__title">status</p>
            <p className="preprocessing-action-bar__description">{statusMessage}</p>
          </div>
        </div>
        <div className="preprocessing-action-bar__group preprocessing-action-bar__group--primary">
          <div className="preprocessing-action-bar__text">
            <p className="preprocessing-action-bar__title">phase</p>
            <p className="preprocessing-action-bar__description">{phase}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatasetPreparation;