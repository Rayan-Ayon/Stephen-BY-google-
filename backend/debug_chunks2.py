import sys
sys.path.insert(0, 'C:/Users/Ayonbhai/Documents/Stephen-google/backend')
from app.services.rag_agent_service import ContextAgent

chunks = ContextAgent.retrieve_context('dQw4w9WgXcQ', 'summary', top_k=3)
print(f'Retrieved {len(chunks)} chunks')
for i, chunk in enumerate(chunks):
    meta = chunk.get('metadata', {})
    rank = chunk.get('rank')
    print(f'Chunk {i}: rank={rank}, video_id={meta.get("video_id")}, chunk_index={meta.get("chunk_index")}')