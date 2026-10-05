#!/usr/bin/env python3
"""
Automated Audio Ingestion Script for Cambridge 7–21 IELTS Listening Tests
Target: Supabase Cloud (Storage bucket: 'listening-audio' & Tables: 'exams', 'sections')
Uses native curl.exe and FFmpeg for maximum reliability and throughput on Windows.
"""

import os
import sys
import json
import time
import logging
import tempfile
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import requests
from dotenv import load_dotenv
import imageio_ffmpeg

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("listening_ingest")

# Locate and load backend/.env
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
ENV_PATH = PROJECT_ROOT / "backend" / ".env"
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
    logger.info(f"Loaded credentials from {ENV_PATH}")
else:
    load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.")
    sys.exit(1)

from supabase import create_client, Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BUCKET_NAME = "listening-audio"
CDN_BASE_URL = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{BUCKET_NAME}"
FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()


def download_file_streaming(url: str, dest_path: str, min_size: int = 500_000, timeout: int = 75):
    """Download a file using native curl.exe to eliminate any Python/WinError 10035 socket issues."""
    for attempt in range(1, 4):
        try:
            cmd = ["curl.exe", "-L", "-s", "-S", "--fail", "--max-time", str(timeout), "-o", dest_path, url]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                raise RuntimeError(f"curl failed: {res.stderr.strip()}")
            size = os.path.getsize(dest_path)
            if size < min_size:
                raise ValueError(f"Downloaded file too small: {size} < {min_size}")
            return size
        except Exception as e:
            if attempt == 3:
                raise RuntimeError(f"Failed downloading {url} after 3 attempts: {e}")
            logger.warning(f"Download attempt {attempt} failed for {url}: {e}. Retrying in 2s...")
            time.sleep(2)


def get_source_plan(book: int, test: int):
    """Returns the download strategy and URLs for a given Cambridge book and test."""
    # Cambridge 7: Direct single-file MP3s from IELTSXpress
    if book == 7:
        urls_by_test = {
            1: "https://www.ieltsxpress.com/wp-content/uploads/2020/01/Cambridge-IELTS-7-Listening-Test-1-with-Answers-IELTSXpress.mp3",
            2: "https://www.ieltsxpress.com/wp-content/uploads/2020/11/Cambridge-ielts-7-listening-test-2-audio-ieltsxpress.mp3",
            3: "https://www.ieltsxpress.com/wp-content/uploads/2020/11/Cambridge-IELTS-7-Listening-Test-3-IELTSXpress.mp3",
            4: "https://www.ieltsxpress.com/wp-content/uploads/2020/11/Cambridge-IELTS-7-Listening-Test-4-IELTSXpress.mp3",
        }
        return {"type": "single", "url": urls_by_test[test]}

    # Cambridge 8
    if book == 8:
        if test == 1:
            parts = [f"https://archive.org/download/cambridge_ielts_1_to_8/Cambridge%20IELTS%208/CD1/01-AudioTrack%20{tr:02d}.mp3" for tr in range(1, 5)]
            return {"type": "multi", "urls": parts}
        elif test == 2:
            parts = [f"https://archive.org/download/cambridge_ielts_1_to_8/Cambridge%20IELTS%208/CD1/01-AudioTrack%20{tr:02d}.mp3" for tr in range(5, 9)]
            return {"type": "multi", "urls": parts}
        elif test == 3:
            return {"type": "single", "url": "https://www.ieltsxpress.com/wp-content/uploads/2020/01/Cambridge-IELTS-8-Listening-Test-3-ieltsxpress.mp3"}
        elif test == 4:
            parts = [f"https://archive.org/download/cambridge_ielts_1_to_8/Cambridge%20IELTS%208/CD2/01-AudioTrack%20{tr:02d}.mp3" for tr in range(5, 9)]
            return {"type": "multi", "urls": parts}

    # Cambridge 9: Direct single-file MP3s from IELTSXpress
    if book == 9:
        urls_by_test = {
            1: "https://www.ieltsxpress.com/wp-content/uploads/2021/01/Cambridge-IELTS-9-Listening-Test-1-IELTSXpress.mp3",
            2: "https://www.ieltsxpress.com/wp-content/uploads/2021/01/Cambridge-IELTS-9-Listening-Test-2-IELTSXpress.mp3",
            3: "https://www.ieltsxpress.com/wp-content/uploads/2021/02/Cambridge-IELTS-9-Listening-Test-3-IELTSXpress.mp3",
            4: "https://www.ieltsxpress.com/wp-content/uploads/2021/02/Cambridge-IELTS-9-Listening-Test-4-IELTSXpress.mp3",
        }
        return {"type": "single", "url": urls_by_test[test]}

    # Cambridge 10-14: 4 sections per test (.mp3)
    if 10 <= book <= 14:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam{book}-Test{test}-Section{s}.mp3"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 15: 4 parts per test (.m4a)
    if book == 15:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam15-Test{test}-Part{s}.m4a"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 16: 4 parts per test (.mp3)
    if book == 16:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam16-Test{test}-Part{s}.mp3"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 17: 4 parts per test (.mp3)
    if book == 17:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2022/06/cam17-test{test}-part{s}.mp3"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 18: 4 parts per test (.mp3)
    if book == 18:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2023/06/cam18-test{test}-part{s}.mp3"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 19: 4 parts per test (.m4a)
    if book == 19:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam19-test{test}-part{s}.m4a"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 20: 4 parts per test (.MP3)
    if book == 20:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2025/07/cam20-test{test}-part{s}.MP3"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    # Cambridge 21: 4 parts per test (.MP3)
    if book == 21:
        parts = [
            f"https://ieltstrainingonline.com/wp-content/uploads/2026/07/cam21-test{test}-part{s}.MP3"
            for s in range(1, 5)
        ]
        return {"type": "multi", "urls": parts}

    raise ValueError(f"Unknown book {book}")


def fetch_and_prepare_audio(book: int, test: int) -> bytes:
    """Fetches, concatenates (if multi-part), and returns high quality MP3 bytes."""
    plan = get_source_plan(book, test)

    with tempfile.TemporaryDirectory() as tmpdir:
        if plan["type"] == "single":
            url = plan["url"]
            logger.info(f"[C{book} T{test}] Downloading full test audio from {url}...")
            local_file = os.path.join(tmpdir, "full_audio.mp3")
            download_file_streaming(url, local_file, min_size=5 * 1024 * 1024, timeout=90)
            with open(local_file, "rb") as f:
                audio_bytes = f.read()

        elif plan["type"] == "multi":
            urls = plan["urls"]
            logger.info(f"[C{book} T{test}] Fetching and assembling {len(urls)} parts via curl + FFmpeg...")
            part_files = []
            for i, u in enumerate(urls):
                ext = ".m4a" if ".m4a" in u.lower() else ".mp3"
                part_path = os.path.join(tmpdir, f"part_{i}{ext}")
                download_file_streaming(u, part_path, min_size=500_000, timeout=60)
                part_files.append(part_path)

            output_mp3 = os.path.join(tmpdir, f"cam_{book}_t{test}_full.mp3")
            inputs = []
            filter_in = ""
            for i, pf in enumerate(part_files):
                inputs.extend(["-i", pf])
                filter_in += f"[{i}:a]"
            filter_complex = f"{filter_in}concat=n={len(part_files)}:v=0:a=1[out]"

            cmd = [
                FFMPEG_EXE, "-y",
                *inputs,
                "-filter_complex", filter_complex,
                "-map", "[out]",
                "-b:a", "128k",
                "-ar", "44100",
                output_mp3
            ]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                raise RuntimeError(f"FFmpeg concat failed for C{book} T{test}: {res.stderr}")

            with open(output_mp3, "rb") as f:
                audio_bytes = f.read()

        # Enforce strict audio guards
        if len(audio_bytes) < 5 * 1024 * 1024:
            raise ValueError(f"Payload too small: {len(audio_bytes)} bytes. Minimum is 5 MB.")

        if not (audio_bytes.startswith(b"ID3") or audio_bytes[:2] in (b"\xff\xfb", b"\xff\xfa", b"\xff\xf3", b"\xff\xf2")):
            raise ValueError(f"Invalid MP3 audio signature for Cambridge {book} Test {test}")

        return audio_bytes


def check_existing_storage_size(file_path: str) -> int:
    """Checks the size of the existing object in Supabase Storage via HEAD request."""
    url = f"{CDN_BASE_URL}/{file_path}"
    try:
        r = requests.head(url, timeout=10)
        if r.status_code == 200:
            return int(r.headers.get("content-length", 0))
    except Exception:
        pass
    return 0


def process_test(book: int, test: int) -> dict:
    """Checks existing size, downloads & uploads if needed, and updates database records."""
    file_path = f"cambridge-{book}/test-{test}/full_audio.mp3"
    public_url = f"{CDN_BASE_URL}/{file_path}"
    exam_id = f"c{book:02d}00000-0000-0000-0000-{test:012d}"

    existing_size = check_existing_storage_size(file_path)
    
    # If already genuine real audio (> 15 MB), skip re-uploading and ensure DB sync
    if existing_size >= 15 * 1024 * 1024:
        logger.info(f"[C{book} T{test}] Already online & verified ({existing_size / (1024*1024):.2f} MB). Skipping upload.")
        final_size = existing_size
        uploaded = True
    else:
        if existing_size > 0:
            logger.warning(f"[C{book} T{test}] Overwriting legacy placeholder ({existing_size} bytes)...")
        else:
            logger.info(f"[C{book} T{test}] Ingesting fresh audio...")

        audio_bytes = fetch_and_prepare_audio(book, test)
        final_size = len(audio_bytes)

        # Upload with upsert=true in retry loop
        uploaded = False
        for upload_attempt in range(1, 4):
            try:
                supabase.storage.from_(BUCKET_NAME).upload(
                    file_path,
                    audio_bytes,
                    file_options={"content-type": "audio/mpeg", "upsert": "true"}
                )
                logger.info(f"[C{book} T{test}] Uploaded {final_size / (1024*1024):.2f} MB successfully.")
                uploaded = True
                break
            except Exception as e:
                if upload_attempt == 3:
                    raise RuntimeError(f"Storage upload failed after 3 attempts: {e}")
                logger.warning(f"Storage upload attempt {upload_attempt} failed: {e}. Retrying in 2s...")
                time.sleep(2)

    # Update database records
    db_updated = False
    db_warning = None
    try:
        supabase.table("exams").update({"audio_url": public_url}).eq("id", exam_id).execute()
        supabase.table("sections").update({"audio_url": public_url}).eq("test_id", exam_id).execute()
        db_updated = True
    except Exception as e:
        err = str(e)
        if "PGRST204" in err or "schema cache" in err:
            db_warning = "Pending schema reload"
        else:
            db_warning = err

    return {
        "book": book,
        "test": test,
        "size_bytes": final_size,
        "size_mb": round(final_size / (1024 * 1024), 2),
        "url": public_url,
        "uploaded": uploaded,
        "db_updated": db_updated,
        "db_warning": db_warning
    }


def main():
    start_time = time.time()
    logger.info("=" * 70)
    logger.info("STARTING CAMBRIDGE 7–21 LISTENING AUDIO VERIFICATION & COMPLETION PASS")
    logger.info("=" * 70)

    # 60 tests across Cambridge 7 to 21
    tasks = []
    for b in range(7, 22):
        for t in range(1, 5):
            tasks.append((b, t))

    results = []
    # 1 sequential worker for maximum rock-solid connection reliability on remaining items
    for b, t in tasks:
        try:
            res = process_test(b, t)
            results.append(res)
            logger.info(f"[RESULT] Cambridge {b} Test {t} -> {res['size_mb']} MB (DB: {res['db_updated']})")
        except Exception as e:
            logger.error(f"[ERROR] Cambridge {b} Test {t}: {e}")
            results.append({
                "book": b,
                "test": t,
                "size_bytes": 0,
                "size_mb": 0.0,
                "url": "",
                "uploaded": False,
                "db_updated": False,
                "db_warning": str(e)
            })

    results.sort(key=lambda x: (x["book"], x["test"]))

    # Save manifest
    manifest = {
        "version": "2.0.0",
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "bucket": BUCKET_NAME,
        "total_tests": len(results),
        "tests": {
            f"c{r['book']:02d}_t{r['test']}": {
                "book": r["book"],
                "test": r["test"],
                "size_mb": r["size_mb"],
                "audio_url": r["url"]
            }
            for r in results
        }
    }
    manifest_dir = PROJECT_ROOT / "frontend" / "data"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    with open(manifest_dir / "listening_audio_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    logger.info(f"Updated manifest at {manifest_dir / 'listening_audio_manifest.json'}")
    logger.info(f"Ingestion pipeline completed in {time.time() - start_time:.2f}s")


if __name__ == "__main__":
    main()
