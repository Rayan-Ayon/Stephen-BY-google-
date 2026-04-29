import sys
sys.path.insert(0, 'C:/Users/Ayonbhai/Documents/Stephen-google/backend')
from app.services.rag_agent_service import ContextAgent

chunks = ContextAgent.retrieve_context('dQw4w9WgXcQ', 'summary', top_k=3)
print(f'Retrieved {len(chunks)} chunks')
for i, chunk in enumerate(chunks):
    print(f'Chunk {i}:')
    txt = chunk.get('text', '')
    meta = chunk.get('metadata', {})
    rank = chunk.get('rank')
    print(f'  text: {txt[:50]}...')
    print(f'  metadata: {meta}')
    print(f'  rank: {rank}')