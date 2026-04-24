from app.services.ai_client import get_ai_response

result = get_ai_response('Say hello in JSON format {"message": "hi"}')
print("Raw response:", repr(result[:200]))