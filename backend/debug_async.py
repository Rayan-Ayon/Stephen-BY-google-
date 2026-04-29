import sys
sys.path.insert(0, 'C:/Users/Ayonbhai/Documents/Stephen-google/backend')
import asyncio

async def test():
    from app.services.rag_agent_service import generate_context_aware_async
    
    result = await generate_context_aware_async('dQw4w9WgXcQ', 'summary')
    print(f'Result keys: {result.keys()}')
    print(f'Context used: {result.get("context_used")}')
    print(f'Data: {result.get("data", {}).keys() if isinstance(result.get("data"), dict) else "not a dict"}')

asyncio.run(test())