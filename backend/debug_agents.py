import sys
sys.path.insert(0, 'C:/Users/Ayonbhai/Documents/Stephen-google/backend')
from app.services.rag_agent_service import ContextAgent, SummaryAgent, FlashcardAgent, QuizAgent

# Test indexing with a fresh video ID
test_video = "dQw4w9WgXcQ"

print("1. Testing indexing...")
result = ContextAgent.ensure_chunks_indexed(test_video)
print(f"   Indexed: {result}")

print("\n2. Testing context retrieval...")
chunks = ContextAgent.retrieve_context(test_video, "summary", top_k=5)
print(f"   Retrieved {len(chunks)} chunks")
if chunks:
    first_chunk = chunks[0]
    meta = first_chunk.get("metadata", {})
    print(f"   First chunk video_id: {meta.get('video_id')}")
    print(f"   First chunk index: {meta.get('chunk_index')}")
    print(f"   First chunk text: {first_chunk.get('text', '')[:50]}...")

print("\n3. Testing Summary Agent...")
if chunks:
    summary = SummaryAgent.generate(chunks, test_video)
    print(f"   Paragraph: {summary.get('paragraph', '')[:50]}...")
    print(f"   Bullets: {len(summary.get('bullets', []))}")
    print(f"   Sources: {len(summary.get('sources', []))}")

print("\n4. Testing Flashcard Agent...")
if chunks:
    cards = FlashcardAgent.generate(chunks, test_video)
    print(f"   Flashcards: {len(cards.get('flashcards', []))}")
    if cards.get('flashcards'):
        fc = cards['flashcards'][0]
        print(f"   First card question: {fc.get('question', '')[:30]}...")
        print(f"   First card source: {fc.get('source_chunk_id')}")

print("\n5. Testing Quiz Agent...")
if chunks:
    quiz = QuizAgent.generate(chunks, test_video)
    print(f"   Questions: {len(quiz.get('quiz', []))}")
    if quiz.get('quiz'):
        q = quiz['quiz'][0]
        print(f"   First question: {q.get('question', '')[:30]}...")
        print(f"   First question source: {q.get('source')} - {q.get('source_chunk_id')}")

print("\nAll agent tests completed!")