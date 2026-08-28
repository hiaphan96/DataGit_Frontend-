import { useCallback, useRef, useState } from 'react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { SUPPORTED_EXTENSIONS, formatFileSize, type DatasetFileKind, type DatasetFileMeta } from '../../types/dataset';

interface FileUploadCardProps {
  kind: DatasetFileKind;
  label: string;
  fileMeta: DatasetFileMeta;
  onFileSelect: (kind: DatasetFileKind, file: File) => void;
  onFileRemove: (kind: DatasetFileKind) => void;
}

function getFileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  return idx >= 0 ? fileName.slice(idx + 1).toUpperCase() : '';
}

export function FileUploadCard({ kind, label, fileMeta, onFileSelect, onFileRemove }: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFileSelect(kind, files[0]);
  }, [kind, onFileSelect]);

  const badge = () => {
    if (fileMeta.status === 'uploaded' || fileMeta.status === 'valid') return <StatusBadge label="ready" tone="positive" />;
    if (fileMeta.status === 'warning') return <StatusBadge label="warning" tone="neutral" />;
    if (fileMeta.status === 'error') return <StatusBadge label="error" tone="negative" />;
    return null;
  };

  return (
    <div className="dataset-upload-card">
      <p className="dataset-upload-card__label">{label}</p>

      {fileMeta.status === 'idle' ? (
        <div
          className={`dataset-dropzone dataset-dropzone--compact ${dragOver ? 'dataset-dropzone--active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        >
          <span className="dataset-dropzone__icon" aria-hidden="true">○</span>
          <span>click or drag file</span>
        </div>
      ) : (
        <div className="dataset-file-info dataset-file-info--compact">
          <div className="dataset-file-info__row">
            <span className="dataset-file-type-tag">{getFileExtension(fileMeta.fileName)}</span>
            <span className="dataset-file-info__name">{fileMeta.fileName}</span>
            <span className="dataset-file-info__size">{formatFileSize(fileMeta.sizeBytes)}</span>
            {badge()}
          </div>

          {fileMeta.status === 'uploading' && (
            <div className="dataset-progress">
              <div className="dataset-progress__fill" style={{ width: `${fileMeta.uploadProgress}%` }} />
              <span className="dataset-progress__label">uploading... {fileMeta.uploadProgress}%</span>
            </div>
          )}

          {fileMeta.rows !== null && (fileMeta.status === 'uploaded' || fileMeta.status === 'valid' || fileMeta.status === 'warning') && (
            <p className="dataset-file-info__meta">{fileMeta.rows.toLocaleString()} rows • {fileMeta.columns} columns</p>
          )}

          {fileMeta.status === 'error' && <p className="dataset-file-info__error">✕ {fileMeta.errorMessage ?? 'upload failed'}</p>}

          <div className="dataset-file-info__actions">
            <Button type="button" onClick={() => inputRef.current?.click()}>replace</Button>
            <Button type="button" onClick={() => onFileRemove(kind)}>remove</Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="dataset-visually-hidden"
        accept={SUPPORTED_EXTENSIONS.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export default FileUploadCard;