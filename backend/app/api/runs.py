from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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