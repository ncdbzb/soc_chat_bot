from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_async_session
from src.auth.models import AuthUser, user
from src.auth.auth_config import current_verified_user


CONTEST_DATAPK_ITM = 'DATAPK_ITM_VERSION_1_7'
CONTEST_DATAPK = 'DATAPK_VERSION_2_1'

router = APIRouter()

@router.get("/leaderboard_me")
async def get_my_leaderboards(
    session: AsyncSession = Depends(get_async_session),
    current_user: AuthUser = Depends(current_verified_user)
) -> dict:
    return {'datapk_itm':
                {
                    'doc_name': CONTEST_DATAPK_ITM,
                    'leaderboard': []
                },
            'datapk':
                {
                    'doc_name': CONTEST_DATAPK,
                    'leaderboard': []
                }
    }
