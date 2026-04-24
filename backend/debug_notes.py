from app.services.ai_client import get_ai_response

result = get_ai_response('Write short markdown: ## Key Concepts - Bullet 1 - Bullet 2')
print("Length:", len(result))
print("Content:", result)