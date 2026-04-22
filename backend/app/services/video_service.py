from youtube_transcript_api import YouTubeTranscriptApi
import logging

logger = logging.getLogger(__name__)

async def get_youtube_transcript(video_id: str):
    try:
        logger.info(f"Fetching transcript for video: {video_id}")
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        try:
            transcript = transcript_list.find_transcript(['en'])
            logger.info(f"Found English transcript for {video_id}")
        except:
            try:
                transcript = transcript_list.find_transcript(['en-US'])
                logger.info(f"Found en-US transcript for {video_id}")
            except Exception as e:
                logger.warning(f"No English transcript found for {video_id}: {e}")
                raise Exception(f"No transcript available for video {video_id}")
        
        result = transcript.fetch()
        logger.info(f"Successfully fetched {len(result)} transcript segments")
        return result
    except Exception as e:
        logger.error(f"Failed to fetch transcript for {video_id}: {str(e)}")
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
