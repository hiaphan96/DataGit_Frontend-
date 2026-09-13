import type { ConfusionMatrixData } from '../../types/evaluation';

interface ConfusionMatrixProps {
  matrix: ConfusionMatrixData;
}

export function ConfusionMatrix({ matrix }: ConfusionMatrixProps) {
  const { truePositive, falseNegative, falsePositive, trueNegative } = matrix;

  return (
    <div className="confusion-matrix">
      <p className="section-label">confusion matrix</p>

      <div className="confusion-matrix__grid">
        <div className="confusion-matrix__corner" />
        <div className="confusion-matrix__col-header">predicted</div>

        <div className="confusion-matrix__corner" />
        <div className="confusion-matrix__axis-label">positive</div>
        <div className="confusion-matrix__axis-label">negative</div>

        <div className="confusion-matrix__row-header">
          actual
          <br />
          positive
        </div>
        <div className="confusion-matrix__cell confusion-matrix__cell--tp">
          <span className="confusion-matrix__value">{truePositive}</span>
          <span className="confusion-matrix__tag">true positive</span>
        </div>
        <div className="confusion-matrix__cell confusion-matrix__cell--fn">
          <span className="confusion-matrix__value">{falseNegative}</span>
          <span className="confusion-matrix__tag">false negative</span>
        </div>

        <div className="confusion-matrix__row-header">
          actual
          <br />
          negative
        </div>
        <div className="confusion-matrix__cell confusion-matrix__cell--fp">
          <span className="confusion-matrix__value">{falsePositive}</span>
          <span className="confusion-matrix__tag">false positive</span>
        </div>
        <div className="confusion-matrix__cell confusion-matrix__cell--tn">
          <span className="confusion-matrix__value">{trueNegative}</span>
          <span className="confusion-matrix__tag">true negative</span>
        </div>
      </div>
    </div>
  );
}

export default ConfusionMatrix;