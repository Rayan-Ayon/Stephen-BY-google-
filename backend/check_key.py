import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("OPENROUTER_API_KEY")
print(f"Key loaded: {key[:10]}..." if key and len(key) > 10 else f"Key: {key}")
print(f"Key length: {len(key) if key else 'None'}")