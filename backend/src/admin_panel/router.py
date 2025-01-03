from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users.jwt import generate_jwt
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_async_session
from src.auth.models import AuthUser
from src.admin_panel.models import admin_requests
from src.services.celery_service import send_email
from sqlalchemy import select, update, func, and_
from src.auth.auth_config import current_superuser
from config.config import SECRET_MANAGER as verification_token_secret


router = APIRouter()


@router.get('/requests')
async def get_admin_panel(
        user: AuthUser = Depends(current_superuser),
        session: AsyncSession = Depends(get_async_session)
):
    query = select(admin_requests).where(admin_requests.c.status == 'approval')
    result = await session.execute(query)

    return result.mappings().all()


@router.post('/reject')
async def reject_request(
        request_id: int,
        user: AuthUser = Depends(current_superuser),
        session: AsyncSession = Depends(get_async_session)
):
    query = select(admin_requests).where(and_(admin_requests.c.id == int(request_id), admin_requests.c.status == 'approval'))
    result = (await session.execute(query)).fetchone()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval admin request with this id was not found")
    
    info = result.info

    send_email.delay(name=info.get('name'), user_email=info.get('email'), destiny='reject')

    stmt = update(admin_requests).where(admin_requests.c.id == int(request_id)).values(status='rejected')
    await session.execute(stmt)
    await session.commit()

    return {'status': f'request #{request_id} has been rejected successfully'}


@router.post('/accept')
async def accept_request(
        request_id: int,
        user: AuthUser = Depends(current_superuser),
        session: AsyncSession = Depends(get_async_session)
):
    query = select(admin_requests).where(and_(admin_requests.c.id == int(request_id), admin_requests.c.status == 'approval'))
    values = (await session.execute(query)).fetchone()

    if not values:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval admin request with this id was not found")
    
    info = values.info
    user_email = info.get('email')

    token_data = {
            "sub": str(values.user_id),
            "email": user_email,
            "aud": "fastapi-users:verify",
        }
    token = generate_jwt(
        token_data,
        verification_token_secret,
        86400,
    )

    send_email.delay(name=info.get('name'), user_email=user_email, token=token, destiny='accept')

    stmt = update(admin_requests).where(admin_requests.c.id == int(request_id)).values(status='accepted')
    await session.execute(stmt)
    await session.commit()

    return {'status': f'request #{request_id} has been accepted successfully'}
