from src.docs.models import doc
from sqlalchemy import select, insert
from database.database import async_session_maker
from config.logs import doc_info


async def init_soc_doc(name):
    async with async_session_maker() as session:
        query = select(doc).where(doc.c.name == name)

        if not (await session.execute(query)).fetchone():
            add_stmt = insert(doc).values(
                [
                    {'name': name, 'description': 'data', 'user_id': None}
                ]
            )
            await session.execute(add_stmt)
            await session.commit()

            doc_info.info(f'Documentation {name} was created')
