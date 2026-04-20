from youtube_transcript_api import YouTubeTranscriptApi

async def get_youtube_transcript(video_id: str):
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        try:
            transcript = transcript_list.find_transcript(['en'])
        except:
            transcript = transcript_list.find_transcript(['en-US'])
        return transcript.fetch()
    except Exception as e:
        raise Exception(f"Failed to fetch transcript: {str(e)}")

async def generate_chapters(transcript_data):
    if not transcript_data:
        return []
    
    duration = transcript_data[-1]['start'] + transcript_data[-1].get('duration', 5)
    interval = max(duration // 6, 30)
    chapters = []
    labels = [
        "Introduction and Overview",
        "Getting Started with the Basics",
        "Core Concepts and Fundamentals",
        "Practical Examples and Implementation",
        "Advanced Techniques and Best Practices",
        "Summary and Final Thoughts"
    ]
    
    for i in range(6):
        time_sec = i * interval
        minutes = time_sec // 60
        seconds = time_sec % 60
        time_str = f"{minutes}:{seconds:02d}"
        
        chapter_text = f"Topics covered from {time_str} onwards in this section"
        
        chapters.append({
            "title": labels[i],
            "time": time_str,
            "desc": chapter_text
        })
    
    return chapters
