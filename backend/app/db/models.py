from datetime import datetime

from sqlalchemy import DateTime, String, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    path: Mapped[str] = mapped_column(
        String(1000),
        nullable=False,
        unique=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class MLRun(Base):
    __tablename__ = "ml_runs"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"),
        nullable=False,
        index=True,
    )

    # Exact Git state when this ML run happened
    git_commit: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # DVC state when this ML run happened
    dvc_state: Mapped[dict | None] = mapped_column(
    JSON,
    nullable=True,
    )

    # ML information
    model_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    features: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    parameters: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    # Example: {"rmse": 42000, "r2": 0.94}
    metrics: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )