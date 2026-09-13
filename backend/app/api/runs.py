from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.database import get_db
from app.schemas.ml_run import MLRunCreate, MLRunResponse
from app.services.ml_run_service import MLRunService
from app.services.project_service import ProjectService


router = APIRouter(
    prefix="/projects/{project_id}/runs",
    tags=["ML Runs"],
)


@router.post(
    "",
    response_model=MLRunResponse,
    status_code=201,
)
def create_ml_run(
    project_id: int,
    run_data: MLRunCreate,
    db: Session = Depends(get_db),
):
    project = ProjectService.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    run = MLRunService.create_run(
        db=db,
        project_id=project_id,
        project_path=project.path,
        model_name=run_data.model_name,
        features=run_data.features,
        parameters=run_data.parameters,
        metrics=run_data.metrics,
    )

    return run


@router.get(
    "",
    response_model=list[MLRunResponse],
)
def get_ml_runs(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = ProjectService.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return MLRunService.get_runs(
        db,
        project_id,
    )

@router.delete(
    "/{run_id}",
)
def delete_ml_run(
    project_id: int,
    run_id: int,
    db: Session = Depends(get_db),
):

    # Check if project exists
    project = ProjectService.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    # Check if ML run exists
    run = MLRunService.get_run(
        db=db,
        project_id=project_id,
        run_id=run_id,
    )

    if run is None:
        raise HTTPException(
            status_code=404,
            detail="Experiment not found.",
        )

    # Delete experiment
    MLRunService.delete_run(
        db=db,
        run=run,
    )

    return {
        "message": "Experiment deleted successfully.",
        "deleted_run_id": run_id,
    }

@router.get(
    "/{run_id}/evaluation",
)
def get_run_evaluation(
    project_id: int,
    run_id: int,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------
    # CHECK PROJECT
    # --------------------------------------------------

    project = ProjectService.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    # --------------------------------------------------
    # GET CURRENT RUN
    # --------------------------------------------------

    runs = MLRunService.get_runs(
        db,
        project_id,
    )

    current_run = None

    for run in runs:

        if run.id == run_id:

            current_run = run
            break

    if current_run is None:

        raise HTTPException(
            status_code=404,
            detail="Experiment run not found.",
        )

    # --------------------------------------------------
    # FIND PREVIOUS RUN
    # --------------------------------------------------

    previous_run = None

    for run in runs:

        if run.id < run_id:

            if (
                previous_run is None
                or run.id > previous_run.id
            ):

                previous_run = run

    # --------------------------------------------------
    # CURRENT METRICS
    # --------------------------------------------------

    metrics = current_run.metrics or {}

    current_metrics = {

        "accuracy":
            metrics.get("accuracy", 0),

        "precision":
            metrics.get("precision", 0),

        "recall":
            metrics.get("recall", 0),

        "f1Score":
            metrics.get("f1_score", 0),

        "aucRoc":
            metrics.get("auc_roc", 0),

    }

    # --------------------------------------------------
    # PREVIOUS METRICS
    # --------------------------------------------------

    previous_metrics = None

    if previous_run:

        previous_data = (
            previous_run.metrics
            or {}
        )

        previous_metrics = {

            "accuracy":
                previous_data.get(
                    "accuracy",
                    0,
                ),

            "precision":
                previous_data.get(
                    "precision",
                    0,
                ),

            "recall":
                previous_data.get(
                    "recall",
                    0,
                ),

            "f1Score":
                previous_data.get(
                    "f1_score",
                    0,
                ),

            "aucRoc":
                previous_data.get(
                    "auc_roc",
                    0,
                ),

        }

    # --------------------------------------------------
    # CONFUSION MATRIX
    # --------------------------------------------------

    confusion_matrix = {

        "truePositive":
            metrics.get(
                "true_positive",
                0,
            ),

        "falseNegative":
            metrics.get(
                "false_negative",
                0,
            ),

        "falsePositive":
            metrics.get(
                "false_positive",
                0,
            ),

        "trueNegative":
            metrics.get(
                "true_negative",
                0,
            ),

    }

    # --------------------------------------------------
    # RETURN EVALUATION DATA
    # --------------------------------------------------

    return {

        "experimentId":
            f"EXP-{str(current_run.id).zfill(3)}",

        "previousExperimentId":
            (
                f"EXP-{str(previous_run.id).zfill(3)}"
                if previous_run
                else None
            ),

        "datasetName":
            "Project Dataset",

        "datasetVersion":
            "V01",

        "model":
            current_run.model_name,

        "status":
            "completed",

        "metrics":
            current_metrics,

        "previousMetrics":
            previous_metrics,

        "confusionMatrix":
            confusion_matrix,

        "rocPoints":
            metrics.get(
                "roc_points",
                [],
            ),

        "perClassMetrics":
            metrics.get(
                "per_class_metrics",
                [],
            ),

    }

@router.delete(
    "/{run_id}",
    status_code=204,
)
def delete_ml_run(
    project_id: int,
    run_id: int,
    db: Session = Depends(get_db),
):
    run = MLRunService.get_run(
        db=db,
        project_id=project_id,
        run_id=run_id,
    )

    if run is None:
        raise HTTPException(
            status_code=404,
            detail="ML run not found.",
        )

    MLRunService.delete_run(
        db=db,
        run=run,
    )

    return None