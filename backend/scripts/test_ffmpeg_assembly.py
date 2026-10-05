import os
import subprocess
import tempfile
import httpx
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

def assemble_parts(urls, output_mp3):
    headers = {'User-Agent': 'Mozilla/5.0'}
    with tempfile.TemporaryDirectory() as tmpdir:
        part_files = []
        with httpx.Client(headers=headers, follow_redirects=True, timeout=30.0) as client:
            for i, u in enumerate(urls):
                ext = ".m4a" if ".m4a" in u.lower() else ".mp3"
                part_path = os.path.join(tmpdir, f"part_{i}{ext}")
                r = client.get(u)
                if r.status_code != 200 or len(r.content) < 500_000:
                    raise ValueError(f"Failed to fetch {u}: status={r.status_code}, len={len(r.content)}")
                with open(part_path, "wb") as f:
                    f.write(r.content)
                part_files.append(part_path)
        
        # Concat filter with ffmpeg
        # ffmpeg -i part0 -i part1 -i part2 -i part3 -filter_complex "[0:a][1:a][2:a][3:a]concat=n=4:v=0:a=1[out]" -map "[out]" -b:a 128k out.mp3
        inputs = []
        filter_in = ""
        for i, pf in enumerate(part_files):
            inputs.extend(["-i", pf])
            filter_in += f"[{i}:a]"
        filter_complex = f"{filter_in}concat=n={len(part_files)}:v=0:a=1[out]"
        
        cmd = [
            ffmpeg_exe, "-y",
            *inputs,
            "-filter_complex", filter_complex,
            "-map", "[out]",
            "-b:a", "128k",
            "-ar", "44100",
            output_mp3
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg failed: {res.stderr}")

test_urls = [
    f"https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam10-Test1-Section{s}.mp3"
    for s in (1, 2, 3, 4)
]
out_file = os.path.join(tempfile.gettempdir(), "test_cam10_t1.mp3")
print("Assembling Cambridge 10 Test 1...")
assemble_parts(test_urls, out_file)
size = os.path.getsize(out_file)
print(f"Assembly SUCCESS: {size} bytes ({size / (1024*1024):.2f} MB)")
