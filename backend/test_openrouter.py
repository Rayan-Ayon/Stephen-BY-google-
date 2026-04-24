import asyncio
import logging

logging.basicConfig(level=logging.INFO)

async def test():
    from app.services.ai_client import get_ai_response_json
    result = get_ai_response_json('Say hello in JSON format like {"message": "hello"}')
    print(f'Result: {result}')

asyncio.run(test())