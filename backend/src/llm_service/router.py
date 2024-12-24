from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, update

from database.database import get_async_session
from src.auth.models import AuthUser
from src.llm_service.schemas import Feedback, CheckTest
from src.llm_service.utils import send_data_to_llm, convert_time
from src.docs.models import doc
from src.llm_service.statistics import add_statistic_row, add_feedback_row
from src.auth.auth_config import current_verified_user


router = APIRouter()


@router.post("/get_answer")
async def send_data(
    filename: str,
    question: str,
    current_user: AuthUser = Depends(current_verified_user),
    session: AsyncSession = Depends(get_async_session)
):
    data = {'question': question}
    
    query = select(doc).where(doc.c.name == filename)
    if not (await session.execute(query)).fetchone():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document with this name was not found")
    
    response = await send_data_to_llm('ask', data)
    request_id = await add_statistic_row(
        current_user=current_user,
        total_time=None,
        from_cache=False,
        session=session
    )
    result = {
        'result':
            {
                'question': question,
                'answer': response['answer']
            },
        'request_id': request_id
    }

    return result


@router.post("/send_feedback")
async def send_feedback(
    feedback: Feedback,
    current_user: AuthUser = Depends(current_verified_user),
    session: AsyncSession = Depends(get_async_session)
):
    await add_feedback_row(
        value=feedback.value,
        user_comment=feedback.user_comment,
        request_id=feedback.request_id,
        session=session
    )

    return {"result": "feedback added successfully"}
