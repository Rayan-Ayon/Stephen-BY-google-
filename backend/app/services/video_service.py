from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai
import os
import json

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
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return [
            {"title": "Introduction", "time": "0:00", "desc": "Overview of the content"},
            {"title": "Deep Dive", "time": "2:30", "desc": "Detailed analysis and concepts"},
            {"title": "Conclusion", "time": "5:00", "desc": "Final thoughts and summary"}
        ]
        
    genai.configure(api_key=api_key)
    
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
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    
    try:
        result_text = response.text
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        data = json.loads(result_text.strip())
        return data.get("chapters", [])
    except Exception as e:
        return []
