from datetime import datetime

from sqlalchemy import insert, select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from src.auth.models import AuthUser
from src.llm_service.models import request_statistic, feedback
from src.llm_service.utils import convert_time
from src.services.celery_service import send_email
from config.config import SEND_ADMIN_NOTICES


async def add_statistic_row(
        current_user: AuthUser,
        total_time: float,
        from_cache: bool,
        session: AsyncSession
) -> int:
    stmt = insert(request_statistic).values(
        user_id=current_user.id,
        received_at=convert_time(datetime.now()),
        total_time=total_time,
        from_cache=from_cache
    )
    await session.execute(stmt)
    await session.commit()

    last_row = await session.execute(select(request_statistic).order_by(request_statistic.c.id.desc()).limit(1))
    last_id = last_row.scalar()

    return last_id


async def add_feedback_row(
        value: str,
        user_comment: str,
        request_id: int,
        session: AsyncSession
):
    try:
        stmt = insert(feedback).values(
            value=value,
            user_comment=user_comment,
            request_id=request_id,
        )
        await session.execute(stmt)
        await session.commit()
        return {'status': 'added new feedback row'}
    except IntegrityError as e:
        print(e)
