import sys
sys.path.insert(0, 'C:/Users/Ayonbhai/Documents/Stephen-google/backend')
from app.services.db_service import add_transcript_chunks, create_video_chunks, retrieve_relevant_chunks, delete_video_chunks

transcripts = [
    {'text': 'Welcome to this video about machine learning.', 'start': 0, 'duration': 5},
    {'text': 'Today we will cover neural networks and deep learning.', 'start': 5, 'duration': 8},
    {'text': 'Neural networks consist of layers of neurons.', 'start': 13, 'duration': 6},
]

print("1. Creating chunks...")
chunks = create_video_chunks(transcripts)
print(f"   Created {len(chunks)} chunks")

print("2. Adding chunks to ChromaDB...")
result = add_transcript_chunks('test_video_123', chunks, 'test_collection')
print(f"   Added {result['added']} chunks for video {result['video_id']}")

print("3. Retrieving relevant chunks...")
relevant = retrieve_relevant_chunks('What is machine learning?', 'test_collection', top_k=3)
print(f"   Retrieved {len(relevant)} chunks")

print("4. Deleting test chunks...")
deleted = delete_video_chunks('test_video_123', 'test_collection')
print(f"   Deleted: {deleted}")

print("\nAll RAG operations completed successfully!")