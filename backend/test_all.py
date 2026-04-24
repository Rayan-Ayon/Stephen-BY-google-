import requests

tests = [
    ('/api/video/summary', 'summary'),
    ('/api/video/flashcards', 'flashcards'),
    ('/api/video/quiz', 'quiz'),
    ('/api/video/notes', 'notes')
]

BASE = 'http://127.0.0.1:9004'

for endpoint, name in tests:
    try:
        r = requests.post(f'{BASE}{endpoint}', json={'videoId': 'dQw4w9WgXcQ'}, timeout=60)
        result = r.json()
        if 'detail' in result:
            print(f'{name}: FAILED - {result["detail"]}')
        else:
            print(f'{name}: SUCCESS - cached={result.get("cached")}')
    except Exception as e:
        print(f'{name}: ERROR - {e}')