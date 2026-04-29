import requests
import json

BASE = 'http://127.0.0.1:9010'

# First, index the transcript
print('1. Indexing transcript...')
r = requests.post(f'{BASE}/api/video/index-transcript', json={'videoId': 'dQw4w9WgXcQ'})
print(f'   Indexed: {r.json()}')

# Test summary
print('\n2. Testing summary (force refresh)...')
r = requests.post(f'{BASE}/api/video/summary', json={'videoId': 'dQw4w9WgXcQ', 'forceRefresh': True})
result = r.json()
if 'data' in result:
    data = result['data']
    para = data.get('paragraph', '')
    print(f'   Paragraph: {para[:80]}...')
    print(f'   Bullets: {len(data.get("bullets", []))}')
    print(f'   Sources: {len(data.get("sources", []))}')
else:
    print(f'   Error: {result}')

# Test flashcards
print('\n3. Testing flashcards (force refresh)...')
r = requests.post(f'{BASE}/api/video/flashcards', json={'videoId': 'dQw4w9WgXcQ', 'forceRefresh': True})
result = r.json()
if 'data' in result:
    data = result['data']
    print(f'   Flashcards: {len(data.get("flashcards", []))}')
    if data.get('flashcards'):
        fc = data['flashcards'][0]
        print(f'   First card source: {fc.get("source_chunk_id")}')
else:
    print(f'   Error: {result}')

# Test quiz
print('\n4. Testing quiz (force refresh)...')
r = requests.post(f'{BASE}/api/video/quiz', json={'videoId': 'dQw4w9WgXcQ', 'forceRefresh': True})
result = r.json()
if 'data' in result:
    data = result['data']
    print(f'   Questions: {len(data.get("quiz", []))}')
    if data.get('quiz'):
        q = data['quiz'][0]
        print(f'   First question source: {q.get("source")} - {q.get("source_chunk_id")}')
else:
    print(f'   Error: {result}')

# Test notes
print('\n5. Testing notes (force refresh)...')
r = requests.post(f'{BASE}/api/video/notes', json={'videoId': 'dQw4w9WgXcQ', 'forceRefresh': True})
result = r.json()
if 'data' in result:
    data = result['data']
    notes = data.get('notes', '')
    print(f'   Notes length: {len(notes)} chars')
else:
    print(f'   Error: {result}')

print('\nAll tests completed!')