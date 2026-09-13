from sqlalchemy.orm import Session

from app.db.models import MLRun
from app.services.git_service import GitService
from app.services.dvc_service import DVCService


class MLRunService:

    @staticmethod
    def create_run(
        db: Session,
        project_id: int,
        project_path: str,
        model_name: str,
        features: list[str] | None = None,
        parameters: dict | None = None,
        metrics: dict | None = None,
    ) -> MLRun:

        # 1. Capture the exact Git commit
        git_commit = GitService.get_current_commit(
            project_path
        )

        # 2. Capture the complete DVC state
        dvc_state = DVCService.get_state(
            project_path
        )

        # 3. Create ML run
        run = MLRun(
            project_id=project_id,
            git_commit=git_commit,
            dvc_state=dvc_state,
            model_name=model_name,
            features=features,
            parameters=parameters,
            metrics=metrics,
        )

        # 4. Save to database
        db.add(run)
        db.commit()
        db.refresh(run)

        return run

    @staticmethod
    def get_runs(
        db: Session,
        project_id: int,
    ) -> list[MLRun]:

        return (
            db.query(MLRun)
            .filter(
                MLRun.project_id == project_id
            )
            .order_by(
                MLRun.created_at.desc()
            )
            .all()
        )