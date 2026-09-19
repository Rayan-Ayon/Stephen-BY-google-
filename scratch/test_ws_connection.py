import asyncio
import sys

async def test_ws(url):
    print(f"Testing WebSocket connection to: {url}")
    try:
        import websockets
        async with websockets.connect(url) as ws:
            print(f"SUCCESS: Connected to {url}")
            # Receive initial frame or ping
            msg = await asyncio.wait_for(ws.recv(), timeout=5.0)
            print(f"Received from server: {type(msg)} (len: {len(msg) if hasattr(msg, '__len__') else 'N/A'})")
            return True
    except asyncio.TimeoutError:
        print(f"Connected to {url} but timed out waiting for server greeting.")
        return True
    except Exception as e:
        print(f"FAILED connection to {url}: {type(e).__name__}: {e}")
        return False

async def main():
    token = "test"
    part = 1
    # Route 1: Direct backend
    url_direct = f"ws://localhost:8000/api/ielts/ws/speaking-session?token={token}&part={part}"
    res1 = await test_ws(url_direct)

    # Route 2: Vite proxy
    url_proxy = f"ws://localhost:3000/api/ielts/ws/speaking-session?token={token}&part={part}"
    res2 = await test_ws(url_proxy)

    if res1 and res2:
        print("\nALL WEBSOCKET HANDSHAKES VERIFIED SUCCESSFULLY!")
    else:
        print("\nSOME WEBSOCKET HANDSHAKES FAILED.")

if __name__ == "__main__":
    asyncio.run(main())
