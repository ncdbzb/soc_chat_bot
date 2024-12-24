from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey, DateTime, JSON, Numeric, Boolean
from src.auth.models import user

metadata = MetaData()

request_statistic = Table(
    "request_statistic",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("user_id", Integer, ForeignKey(user.c.id)),
    Column("received_at", DateTime),
    Column("total_time", Numeric(precision=10, scale=3), nullable=True),
    Column("from_cache", Boolean, nullable=True)
)

feedback = Table(
    "feedback",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("value", String),
    Column("user_comment", String, nullable=True),
    Column("request_id", Integer, ForeignKey(request_statistic.c.id)),
)

