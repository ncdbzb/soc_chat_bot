from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy import insert, select, delete, update, or_
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.auth_config import current_verified_user, current_superuser
from src.auth.models import AuthUser
from database.database import get_async_session
from src.docs.models import doc


router = APIRouter()


@router.get(
    '/my',
    status_code=status.HTTP_200_OK,
)
async def get_my_docs(
    user: AuthUser = Depends(current_verified_user),
    session: AsyncSession = Depends(get_async_session)
):
    query = select(doc.c.name, doc.c.description).where(doc.c.user_id == int(user.id))
    result = await session.execute(query)

    return result.mappings().all()


@router.get(
    '/all',
    status_code=status.HTTP_200_OK,
)
async def get_all_docs(
    session: AsyncSession = Depends(get_async_session),
    user: AuthUser = Depends(current_superuser)
):
    my_docs = await session.execute(select(doc.c.name, doc.c.description))

    return my_docs.mappings().all()
