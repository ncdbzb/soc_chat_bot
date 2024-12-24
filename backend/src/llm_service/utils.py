import httpx
import pytz
from datetime import datetime
from config.config import SOC_LLM_PORT


async def send_data_to_llm(endpoint: str, data: dict):
    async with httpx.AsyncClient(timeout=150) as client:
        url = f"http://soc_llm:{SOC_LLM_PORT}/{endpoint}"
        response = await client.post(url, json=data)
        return response.json()


def convert_time(cur_time: str | datetime) -> datetime:
    if isinstance(cur_time, str):
        time_utc = datetime.fromisoformat(cur_time.rstrip("Z"))
    else:
        time_utc = cur_time

    local_timezone = pytz.timezone("Asia/Yekaterinburg")

    time_local = time_utc.replace(tzinfo=pytz.UTC).astimezone(local_timezone)

    return time_local.replace(tzinfo=None)
