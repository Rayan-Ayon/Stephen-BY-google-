import os
import chromadb
from dotenv import load_dotenv

# 1. Define the path to your .env file
# This assumes your .env is inside the 'backend' folder
env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')

# 2. Load the variables
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
    print(f"✅ Loaded .env from: {env_path}")
else:
    print(f"❌ Error: Could not find .env at {env_path}")
    exit(1)

# 3. Retrieve keys (Safety check)
api_key = os.getenv("CHROMA_API_KEY")
tenant = os.getenv("CHROMA_TENANT")
database = os.getenv("CHROMA_DATABASE")

if not api_key or not tenant or not database:
    print("❌ Error: Missing credentials in .env file!")
    print(f"   API_KEY: {api_key is not None}")
    print(f"   TENANT: {tenant is not None}")
    print(f"   DATABASE: {database is not None}")
    exit(1)

# 4. Connect to Cloud
try:
    print("Connecting to Chroma Cloud...")
    client = chromadb.CloudClient(
        api_key=api_key,
        tenant=tenant,
        database=database
    )
    
    # 5. Heartbeat Test
    heartbeat = client.heartbeat()
    print("✅ Success! Successfully connected to ChromaDB Cloud.")
    print(f"Server Heartbeat: {heartbeat}")

except Exception as e:
    print("❌ Connection failed.")
    print(f"Details: {e}")