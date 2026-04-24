import asyncio
import logging

logging.basicConfig(level=logging.INFO)

async def test():
    from app.services.ai_client import get_ai_response_json
    result = get_ai_response_json('Create a quiz with 3 questions about a song: {"question": "What is the song about?", "options": ["Love", "Hate", "Joy", "Sadness"], "correct": 0}')
    print(f'Result: {result}')

asyncio.run(test())