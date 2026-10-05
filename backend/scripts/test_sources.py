import httpx

with httpx.Client(follow_redirects=True, timeout=10.0) as client:
    r = client.get("https://archive.org/advancedsearch.php?q=title%3A(IELTS+15+listening)+AND+mediatype%3Aaudio&fl[]=identifier,title&rows=20&output=json")
    print("Archive items for IELTS 15 listening:")
    for d in r.json().get('response', {}).get('docs', []):
        print(d)

    r2 = client.get("https://archive.org/advancedsearch.php?q=title%3A(IELTS+19+listening)+AND+mediatype%3Aaudio&fl[]=identifier,title&rows=20&output=json")
    print("Archive items for IELTS 19 listening:")
    for d in r2.json().get('response', {}).get('docs', []):
        print(d)
