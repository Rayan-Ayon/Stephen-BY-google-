import asyncio
import logging

logging.basicConfig(level=logging.INFO)

async def test():
    from app.services.llm_service import generate
    result = await generate('Say hello in JSON format like {"message": "hello"}')
    print(f'Result: {result}')

asyncio.run(test())