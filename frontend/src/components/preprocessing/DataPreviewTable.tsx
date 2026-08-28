import { MoreHorizontal } from 'lucide-react';
import type { DataPreview } from '../../types/preprocessing';

interface DataPreviewTableProps {
  preview: DataPreview;
  rowLimit?: number;
}

export function DataPreviewTable({ preview, rowLimit = 5 }: DataPreviewTableProps) {
  const rows = preview.rows.slice(0, rowLimit);

  return (
    <div className="dataset-table-section">
      <p className="section-label">data preview (first {rows.length} rows)</p>
      <div className="dataset-table-scroll">
        <table className="dataset-table">
          <thead>
            <tr>
              {preview.columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th aria-label="row actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {preview.columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
                <td>
                  <button type="button" className="dataset-table__row-menu" aria-label="row options">
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataPreviewTable;