import { useState, useEffect } from 'react';
import { fetchRunComparison } from '../services/api';

export function RunComparisonView({ projectId, run1, run2 }: { projectId: number; run1: number; run2: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvidence() {
      try {
        setLoading(true);
        const result = await fetchRunComparison(projectId, run1, run2);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error loading comparison data');
      } finally {
        setLoading(false);
      }
    }
    loadEvidence();
  }, [projectId, run1, run2]);

  if (loading) return <div>Loading deterministic evidence...</div>;
  if (error) return <div className="error-badge">Error: {error}</div>;

  return (
    <div className="comparison-container">
      <h2>Experiment Comparison</h2>
      
      {/* Metric Deltas */}
      <div className="metric-panel">
        <p>RMSE: {data?.metrics?.rmse?.before} → {data?.metrics?.rmse?.after}</p>
        <p>Change: {data?.metrics?.rmse?.percentage_change}%</p>
      </div>

      {/* Structured AI Interpretation */}
      <div className="explanation-panel">
        <h3>AI Analysis</h3>
        <p>{data?.explanation?.overall}</p>
      </div>
    </div>
  );
}