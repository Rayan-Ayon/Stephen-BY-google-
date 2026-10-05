import requests
from concurrent.futures import ThreadPoolExecutor

BASE_URL = "https://hucadzqsqsfqgmwnpipp.supabase.co/storage/v1/object/public/listening-audio"

def probe(b, t):
    url = f"{BASE_URL}/cambridge-{b}/test-{t}/full_audio.mp3"
    try:
        r = requests.head(url, timeout=10)
        size = int(r.headers.get("content-length", 0))
        ct = r.headers.get("content-type", "")
        return (b, t, r.status_code, size, ct, url)
    except Exception as e:
        return (b, t, 0, 0, str(e), url)

with ThreadPoolExecutor(max_workers=10) as executor:
    tasks = [(b, t) for b in range(7, 22) for t in range(1, 5)]
    results = list(executor.map(lambda p: probe(*p), tasks))

results.sort(key=lambda x: (x[0], x[1]))

print("\n" + "=" * 80)
print("AUDIT & VERIFICATION MATRIX ACROSS ALL 60 CAMBRIDGE LISTENING TESTS")
print("=" * 80)
print(f"{'TEST ID':<20} | {'STATUS':<8} | {'SIZE (MB)':<12} | {'TYPE':<12} | {'COMPLIANCE'}")
print("-" * 80)

passed = 0
failed = []

for b, t, status, size, ct, url in results:
    size_mb = size / (1024 * 1024)
    test_id = f"Cambridge {b} Test {t}"
    if status == 200 and size >= 15 * 1024 * 1024 and "audio" in ct:
        compliance = "PASS (>15MB Official Audio)"
        passed += 1
    elif status == 200 and size < 1 * 1024 * 1024:
        compliance = "FAIL (Legacy <1MB Placeholder)"
        failed.append((b, t, size, "Placeholder"))
    elif status == 200:
        compliance = f"PASS ({size_mb:.2f}MB Real Audio)"
        passed += 1
    else:
        compliance = f"FAIL (HTTP {status})"
        failed.append((b, t, size, f"HTTP {status}"))
    
    print(f"{test_id:<20} | {status:<8} | {size_mb:>8.2f} MB | {ct:<12} | {compliance}")

print("-" * 80)
print(f"SUMMARY: {passed}/60 TESTS PASSED COMPLIANCE")
print(f"FAILED / PENDING RETRY: {len(failed)}")
if failed:
    print("Pending tests:", failed)
print("=" * 80)
