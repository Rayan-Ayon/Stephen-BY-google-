from youtube_transcript_api import YouTubeTranscriptApi
from openai import AsyncOpenAI
import os
import json

async def get_youtube_transcript(video_id: str):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript_list
    except Exception as e:
        raise Exception(f"Failed to fetch transcript: {str(e)}")

async def generate_chapters(transcript_data):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return [
            {"title": "Introduction", "time": "0:00", "desc": "Overview of the content"},
            {"title": "Deep Dive", "time": "2:30", "desc": "Detailed analysis and concepts"},
            {"title": "Conclusion", "time": "5:00", "desc": "Final thoughts and summary"}
        ]
        
    client = AsyncOpenAI(api_key=api_key)
    
    text_chunks = [f"[{int(item['start'])}] {item['text']}" for item in transcript_data]
    text = " ".join(text_chunks)
    
    if len(text) > 15000:
        text = text[:15000] + "... (truncated)"
        
    prompt = f"""Given the following transcript from a video with timestamps in seconds, generate 5-10 logical chapters for the video.
Return ONLY a JSON object with a 'chapters' key containing an array like this:
{{
  "chapters": [
    {{ "title": "Chapter name", "time": "M:SS", "desc": "Short description" }}
  ]
}}

Transcript:
{text}
"""
    
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates video chapters from transcripts."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        response_format={ "type": "json_object" }
    )
    
    result_text = response.choices[0].message.content
    try:
        data = json.loads(result_text)
        return data.get("chapters", [])
    except:
        return []
