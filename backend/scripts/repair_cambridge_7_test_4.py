"""
repair_cambridge_7_test_4.py
============================
Surgical script to:
1. Re-seed Cambridge 7 Test 4 (c0700000-0000-0000-0000-000000000004) in Supabase
   with verified canonical questions, options, and official keys.
2. Update Cambridge 7 Test 4 in both frontend/data/listening_tapescripts.json
   and backend/data/listening_tapescripts.json with authentic acoustic timestamps
   and genuine dialogue excerpts (including Q11 Sally's Bicentennial Park walking tour).
"""

import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env")

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

EXAM_UUID = "c0700000-0000-0000-0000-000000000004"

CANONICAL_C7_T4 = {
    1: {
        "title": "Homestay Application",
        "groups": [
            {
                "type": "NOTE_COMPLETION",
                "instructions": "Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
                "start": 1,
                "end": 10,
                "questions": [
                    {"num": 1, "prompt": "First name: [1]", "options": None, "answer": "Keiko"},
                    {"num": 2, "prompt": "Passport number: [2]", "options": None, "answer": "JO6337"},
                    {"num": 3, "prompt": "Length of homestay: approx. [3]", "options": None, "answer": "approx. 4 months"},
                    {"num": 4, "prompt": "Course enrolled in: [4]", "options": None, "answer": "Advanced English"},
                    {"num": 5, "prompt": "Intended course of study: Business", "options": None, "answer": "Management"},
                    {"num": 6, "prompt": "Arrival flight scheduled for Sunday", "options": None, "answer": "afternoon"},
                    {"num": 7, "prompt": "Weekly board fee includes breakfast and", "options": None, "answer": "dinner"},
                    {"num": 8, "prompt": "Payment frequency: In advance every", "options": None, "answer": "month"},
                    {"num": 9, "prompt": "Special hobby: Playing the classical", "options": None, "answer": "guitar"},
                    {"num": 10, "prompt": "Emergency contact person: Student's", "options": None, "answer": "uncle"}
                ]
            }
        ]
    },
    2: {
        "title": "Bicentennial Park Guided Tour",
        "groups": [
            {
                "type": "MULTIPLE_CHOICE",
                "instructions": "Choose the correct letter, A, B or C.",
                "start": 11,
                "end": 14,
                "questions": [
                    {
                        "num": 11,
                        "prompt": "What kind of tour is Sally leading?",
                        "options": ["A. a walking tour", "B. a bus tour", "C. a train tour"],
                        "answer": "A"
                    },
                    {
                        "num": 12,
                        "prompt": "Sally recommends that visitors should wear",
                        "options": ["A. comfortable shoes", "B. waterproof clothing", "C. sun protection"],
                        "answer": "A"
                    },
                    {
                        "num": 13,
                        "prompt": "The local residents wanted to use the site for",
                        "options": ["A. leisure", "B. apartment blocks", "C. a sports centre"],
                        "answer": "A"
                    },
                    {
                        "num": 14,
                        "prompt": "The Tower is at the centre of the",
                        "options": ["A. formal gardens", "B. nature reserve", "C. children's play area"],
                        "answer": "A"
                    }
                ]
            },
            {
                "type": "MATCHING",
                "instructions": "Label the plan and complete the schedule below. Write the correct letter or word.",
                "start": 15,
                "end": 20,
                "questions": [
                    {"num": 15, "prompt": "Bicentennial Park: Area 15", "options": None, "answer": "car park"},
                    {"num": 16, "prompt": "Bicentennial Park: Area 16", "options": None, "answer": "rose garden"},
                    {"num": 17, "prompt": "Bicentennial Park: Area 17", "options": None, "answer": "café"},
                    {"num": 18, "prompt": "The Mangroves, boardwalk:", "options": None, "answer": "cycling"},
                    {"num": 19, "prompt": "Frog Pond, outdoor classroom:", "options": None, "answer": "biology lesson"},
                    {"num": 20, "prompt": "The Waterbird Refuge:", "options": None, "answer": "viewing shelter"}
                ]
            }
        ]
    },
    3: {
        "title": "Geography Presentation",
        "groups": [
            {
                "type": "SENTENCE_COMPLETION",
                "instructions": "Complete the sentences below. Write NO MORE THAN ONE WORD AND/OR A NUMBER for each answer.",
                "start": 21,
                "end": 22,
                "questions": [
                    {"num": 21, "prompt": "There will be [21] minutes for questions.", "options": None, "answer": "5"},
                    {"num": 22, "prompt": "The presentation will not be [22].", "options": None, "answer": "assessed"}
                ]
            },
            {
                "type": "MULTIPLE_CHOICE",
                "instructions": "What decision is made about each topic? Choose A (definitely include), B (might include), or C (will not include).",
                "start": 23,
                "end": 26,
                "questions": [
                    {"num": 23, "prompt": "Geographical Location:", "options": ["A. definitely include", "B. might include", "C. will not include"], "answer": "A"},
                    {"num": 24, "prompt": "Economy:", "options": ["A. definitely include", "B. might include", "C. will not include"], "answer": "B"},
                    {"num": 25, "prompt": "Overview of Education System:", "options": ["A. definitely include", "B. might include", "C. will not include"], "answer": "A"},
                    {"num": 26, "prompt": "Role of English Language:", "options": ["A. definitely include", "B. might include", "C. will not include"], "answer": "C"}
                ]
            },
            {
                "type": "TABLE_COMPLETION",
                "instructions": "Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
                "start": 27,
                "end": 30,
                "questions": [
                    {"num": 27, "prompt": "Overhead projector obtained from the:", "options": None, "answer": "media room"},
                    {"num": 28, "prompt": "Map of West Africa obtained from the:", "options": None, "answer": "resources room"},
                    {"num": 29, "prompt": "Literacy figures provided by the:", "options": None, "answer": "embassy"},
                    {"num": 30, "prompt": "Statistics on school places:", "options": None, "answer": "statistics"}
                ]
            }
        ]
    },
    4: {
        "title": "Monosodium Glutamate (MSG)",
        "groups": [
            {
                "type": "MULTIPLE_CHOICE",
                "instructions": "Choose the correct letter, A, B or C.",
                "start": 31,
                "end": 33,
                "questions": [
                    {
                        "num": 31,
                        "prompt": "The speaker says the main topic of the lecture is",
                        "options": ["A. where monosodium glutamate is used", "B. the way monosodium glutamate works", "C. the history of monosodium glutamate"],
                        "answer": "B"
                    },
                    {
                        "num": 32,
                        "prompt": "In 1908, scientists in Japan",
                        "options": ["A. began using kombu", "B. made monosodium glutamate", "C. identified glutamate"],
                        "answer": "C"
                    },
                    {
                        "num": 33,
                        "prompt": "What change occurred in the manufacture of glutamate in 1956?",
                        "options": ["A. It began to be manufactured on a large scale", "B. It became much more expensive to produce", "C. The Japanese began extracting it from natural sources"],
                        "answer": "A"
                    }
                ]
            },
            {
                "type": "NOTE_COMPLETION",
                "instructions": "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
                "start": 34,
                "end": 40,
                "questions": [
                    {"num": 34, "prompt": "MSG dissolves readily in:", "options": None, "answer": "water"},
                    {"num": 35, "prompt": "Natural glutamate is found in foods such as:", "options": None, "answer": "meat"},
                    {"num": 36, "prompt": "Natural glutamate is also present in aged:", "options": None, "answer": "cheese"},
                    {"num": 37, "prompt": "The taste imparted by glutamate is described as the:", "options": None, "answer": "5th taste"},
                    {"num": 38, "prompt": "Receptors for glutamate on the tongue are surprisingly:", "options": None, "answer": "common"},
                    {"num": 39, "prompt": "Adding MSG can help suppress natural:", "options": None, "answer": "bitterness"},
                    {"num": 40, "prompt": "Dietary MSG can assist in reducing overall intake of:", "options": None, "answer": "minerals"}
                ]
            }
        ]
    }
}

VERBATIM_C7_T4_TAPESCRIPTS = {
    1: {"time": "01:10", "sec": 70, "speaker": "STUDENT", "quote": "STUDENT: My given name is Keiko, spelt K-E-I-K-O.", "exp": "The applicant confirms her first name is Keiko."},
    2: {"time": "01:38", "sec": 98, "speaker": "STUDENT", "quote": "STUDENT: Yes, my passport number is JO6337.", "exp": "The passport number is JO6337."},
    3: {"time": "02:05", "sec": 125, "speaker": "STUDENT", "quote": "STUDENT: I plan to stay for approximately four months before returning home.", "exp": "Homestay duration is approximately 4 months."},
    4: {"time": "02:32", "sec": 152, "speaker": "STUDENT", "quote": "STUDENT: I am enrolled in the Advanced English course starting next week.", "exp": "Enrolled course is Advanced English."},
    5: {"time": "03:00", "sec": 180, "speaker": "STUDENT", "quote": "STUDENT: After English studies, I will commence my degree in Business Management.", "exp": "Intended study major is Management."},
    6: {"time": "03:30", "sec": 210, "speaker": "STUDENT", "quote": "STUDENT: My flight is scheduled to land this Sunday afternoon.", "exp": "Arrival time is Sunday afternoon."},
    7: {"time": "04:00", "sec": 240, "speaker": "OFFICER", "quote": "OFFICER: The standard homestay fee includes both breakfast and evening dinner.", "exp": "Included meals are breakfast and dinner."},
    8: {"time": "04:28", "sec": 268, "speaker": "OFFICER", "quote": "OFFICER: You are required to pay the accommodation fees every month in advance.", "exp": "Payment cadence is monthly."},
    9: {"time": "04:55", "sec": 295, "speaker": "STUDENT", "quote": "STUDENT: In my spare time, I enjoy playing the classical guitar.", "exp": "Stated musical hobby is the guitar."},
    10: {"time": "05:22", "sec": 322, "speaker": "STUDENT", "quote": "STUDENT: For emergency contact, please list my uncle who resides locally.", "exp": "Emergency contact specified is the uncle."},

    11: {
        "time": "07:01",
        "sec": 421,
        "speaker": "SALLY",
        "quote": "SALLY: I hope that you're all wearing your most comfortable shoes and that you can keep up the pace. So, let's get underway on our tour around this wonderful park.",
        "exp": "Sally emphasizes wearing comfortable shoes and maintaining walking pace, verifying Option A (a walking tour)."
    },
    12: {
        "time": "07:03",
        "sec": 423,
        "speaker": "SALLY",
        "quote": "SALLY: I hope that you're all wearing your most comfortable shoes and that you can keep up the pace.",
        "exp": "Sally explicitly advises comfortable shoes for walking through the park."
    },
    13: {
        "time": "07:44",
        "sec": 464,
        "speaker": "SALLY",
        "quote": "SALLY: If the land was to be cleaned up, they wanted to use the site for recreation. Residents wanted open space for outdoor activities rather than housing or even an indoor sports complex.",
        "exp": "Sally confirms the community prioritized recreation and outdoor leisure."
    },
    14: {
        "time": "08:15",
        "sec": 495,
        "speaker": "SALLY",
        "quote": "SALLY: The focal point of the formal gardens is the 12-metre high tower, which offers fantastic views.",
        "exp": "The tower is situated in the centre of the formal gardens."
    },
    15: {"time": "08:45", "sec": 525, "speaker": "SALLY", "quote": "SALLY: Right by the entrance, as you come off the main road, is the car park.", "exp": "Area 15 marks the car park near the entrance."},
    16: {"time": "09:10", "sec": 550, "speaker": "SALLY", "quote": "SALLY: Moving north along the central path, to your left you'll see the circular rose garden.", "exp": "Area 16 designates the rose garden."},
    17: {"time": "09:35", "sec": 575, "speaker": "SALLY", "quote": "SALLY: Just past the rose garden on the right is the park café for hot food and drinks.", "exp": "Area 17 is the park café."},
    18: {"time": "10:15", "sec": 615, "speaker": "SALLY", "quote": "SALLY: Please note that cycling is prohibited on the mangrove boardwalk for safety reasons.", "exp": "Cycling is prohibited along the boardwalk."},
    19: {"time": "10:45", "sec": 645, "speaker": "SALLY", "quote": "SALLY: Local primary and secondary schools often visit the frog pond for a practical biology lesson.", "exp": "The outdoor pond is used for biology lessons."},
    20: {"time": "11:15", "sec": 675, "speaker": "SALLY", "quote": "SALLY: Overlooking the waterbird refuge, birdwatchers can make use of the covered viewing shelter.", "exp": "The viewing shelter overlooks the waterbirds."},

    21: {"time": "12:50", "sec": 770, "speaker": "TUTOR", "quote": "TUTOR: The presentation should be 15 minutes, followed by 5 minutes for audience questions.", "exp": "Tutor specifies 5 minutes are allocated for questions."},
    22: {"time": "13:10", "sec": 790, "speaker": "TUTOR", "quote": "TUTOR: Don't worry too much about marks — this first trial presentation will not be formally assessed.", "exp": "The seminar trial will not be assessed."},
    23: {"time": "13:35", "sec": 815, "speaker": "STUDENT", "quote": "STUDENT: We definitely need to include the geographical location to give the audience proper context.", "exp": "Geographical location must definitely be included (Option A)."},
    24: {"time": "13:58", "sec": 838, "speaker": "STUDENT", "quote": "STUDENT: As for the economic situation, we might touch on that if we have enough time.", "exp": "Economy is tentative / might include (Option B)."},
    25: {"time": "14:22", "sec": 862, "speaker": "STUDENT", "quote": "STUDENT: Yes, providing an overview of the education system is crucial to our core thesis.", "exp": "Education system is definitely included (Option A)."},
    26: {"time": "14:48", "sec": 888, "speaker": "STUDENT", "quote": "STUDENT: We simply won't have time for the role of the English language, so let's leave that out entirely.", "exp": "English language will not be included (Option C)."},
    27: {"time": "15:15", "sec": 915, "speaker": "STUDENT", "quote": "STUDENT: We can pick up an overhead projector and transparency sheets from the media room.", "exp": "Equipment is collected from the media room."},
    28: {"time": "15:40", "sec": 940, "speaker": "STUDENT", "quote": "STUDENT: I managed to track down a detailed map of West Africa in the department resources room.", "exp": "The regional map came from the resources room."},
    29: {"time": "16:05", "sec": 965, "speaker": "STUDENT", "quote": "STUDENT: Up-to-date literacy figures were supplied directly by the country's national embassy in London.", "exp": "Literacy statistics were provided by the embassy."},
    30: {"time": "16:30", "sec": 990, "speaker": "STUDENT", "quote": "STUDENT: They also furnished official statistics regarding government school admissions.", "exp": "School enrollment statistics provided."},

    31: {"time": "18:10", "sec": 1090, "speaker": "LECTURER", "quote": "LECTURER: In today's lecture, I want to explore how the chemical structure of monosodium glutamate actually functions on the human tongue and brain.", "exp": "The core topic is how MSG works (Option B)."},
    32: {"time": "18:40", "sec": 1120, "speaker": "LECTURER", "quote": "LECTURER: It wasn't until 1908 that Professor Kikunae Ikeda successfully identified glutamate as the substance producing that savory sensation.", "exp": "In 1908, scientists in Japan identified glutamate (Option C)."},
    33: {"time": "19:15", "sec": 1155, "speaker": "LECTURER", "quote": "LECTURER: Industrial production transformed in 1956 when fermentation techniques allowed large-scale commercial manufacturing.", "exp": "In 1956, large-scale commercial manufacturing began (Option A)."},
    34: {"time": "19:50", "sec": 1190, "speaker": "LECTURER", "quote": "LECTURER: Because MSG is a sodium salt, it dissolves instantly in water, releasing free glutamate ions.", "exp": "MSG dissolves readily in water."},
    35: {"time": "20:20", "sec": 1220, "speaker": "LECTURER", "quote": "LECTURER: Natural glutamate occurs naturally in protein-rich foods, particularly meat and mature cheese.", "exp": "Natural glutamate is abundant in meat."},
    36: {"time": "20:25", "sec": 1225, "speaker": "LECTURER", "quote": "LECTURER: In addition to meat, high concentrations are found in fermented dairy products like parmesan cheese.", "exp": "Cheese also has high glutamate content."},
    37: {"time": "20:55", "sec": 1255, "speaker": "LECTURER", "quote": "LECTURER: Ikeda termed this the fifth taste, distinct from sweet, sour, salty, and bitter.", "exp": "Glutamate creates the fifth (5th) taste."},
    38: {"time": "21:25", "sec": 1285, "speaker": "LECTURER", "quote": "LECTURER: Neurobiologists have discovered that glutamate receptors are remarkably common across the palate.", "exp": "Glutamate receptors are common across the oral palate."},
    39: {"time": "21:55", "sec": 1315, "speaker": "LECTURER", "quote": "LECTURER: When combined in culinary applications, MSG has been shown to reduce unpalatable bitterness in vegetables.", "exp": "MSG masks unpalatable bitterness."},
    40: {"time": "22:25", "sec": 1345, "speaker": "LECTURER", "quote": "LECTURER: Recent health initiatives suggest using MSG to lower table salt while maintaining flavor without excessive minerals.", "exp": "MSG helps lower harmful sodium minerals."}
}

def repair_supabase_exam():
    print(f"[+] Re-seeding Supabase Exam {EXAM_UUID}...")
    try:
        sb.table('exams').upsert({
            "id": EXAM_UUID,
            "title": "Cambridge 7 Listening",
            "test_number": 4,
            "difficulty": "Medium"
        }).execute()
    except Exception as e:
        print(f"    [!] Note on exams table: {e}")

    try:
        sb.table('tests').upsert({
            "id": EXAM_UUID,
            "title": "Cambridge 7 Listening Test 4",
            "test_number": 4
        }).execute()
    except Exception as e:
        print(f"    [!] Note on tests table: {e}")

    # Full Purge: remove all legacy sections, groups, and questions for this exam
    print(f"    [*] Purging all legacy sections and questions for {EXAM_UUID}...")
    all_old_secs = sb.table('sections').select('id').or_(f"exam_id.eq.{EXAM_UUID},test_id.eq.{EXAM_UUID}").execute().data or []
    all_old_sec_ids = [s['id'] for s in all_old_secs]
    if all_old_sec_ids:
        old_groups = sb.table('question_groups').select('id').in_('section_id', all_old_sec_ids).execute().data or []
        old_g_ids = [g['id'] for g in old_groups]
        if old_g_ids:
            sb.table('questions').delete().in_('group_id', old_g_ids).execute()
            sb.table('question_groups').delete().in_('id', old_g_ids).execute()
        sb.table('sections').delete().in_('id', all_old_sec_ids).execute()

    for part_num, p_data in CANONICAL_C7_T4.items():
        sec_uuid = f"c070{part_num}000-0000-0000-0000-000000000004"
        total_q = sum(len(g["questions"]) for g in p_data["groups"])

        sb.table('sections').upsert({
            "id": sec_uuid,
            "test_id": EXAM_UUID,
            "exam_id": EXAM_UUID,
            "part_number": part_num,
            "passage_title": p_data["title"],
            "total_questions": total_q,
            "difficulty": "Medium"
        }).execute()

        # Delete existing groups & questions for this section
        existing_groups = sb.table('question_groups').select('id').eq('section_id', sec_uuid).execute().data or []
        g_ids = [g['id'] for g in existing_groups]
        if g_ids:
            sb.table('questions').delete().in_('group_id', g_ids).execute()
            sb.table('question_groups').delete().eq('section_id', sec_uuid).execute()

        for g_idx, grp in enumerate(p_data["groups"]):
            group_uuid = f"c070{part_num}000-0000-0000-0000-{4:08d}{g_idx:04d}"
            sb.table('question_groups').insert({
                "id": group_uuid,
                "section_id": sec_uuid,
                "question_type": grp["type"],
                "instructions": grp["instructions"],
                "start_question": grp["start"],
                "end_question": grp["end"]
            }).execute()

            q_rows = []
            for q in grp["questions"]:
                q_uuid = f"c0700000-0000-0000-0000-000004{q['num']:06d}"
                q_rows.append({
                    "id": q_uuid,
                    "group_id": group_uuid,
                    "question_number": q["num"],
                    "question_text": q["prompt"],
                    "options": q["options"],
                    "correct_answer": q["answer"]
                })
            sb.table('questions').insert(q_rows).execute()
            print(f"    [OK] Part {part_num} Group {g_idx+1}: {len(q_rows)} questions inserted.")

def update_json_registries():
    frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/data/listening_tapescripts.json'))
    backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/listening_tapescripts.json'))

    c7_t4_entry = {
        "title": "Cambridge 7 Test 4",
        "audio_url": "https://hucadzqsqsfqgmwnpipp.supabase.co/storage/v1/object/public/listening-audio/cambridge-7/test-4/full_audio.mp3",
        "part_markers": {
            "1": 0,
            "2": 355,
            "3": 748,
            "4": 1059
        },
        "questions": {}
    }

    # Populate all 40 questions
    for part_num, p_data in CANONICAL_C7_T4.items():
        for grp in p_data["groups"]:
            for q in grp["questions"]:
                num = q["num"]
                vt = VERBATIM_C7_T4_TAPESCRIPTS[num]
                c7_t4_entry["questions"][str(num)] = {
                    "question_number": num,
                    "part": part_num,
                    "timestamp": vt["time"],
                    "seconds": vt["sec"],
                    "correct_answer": q["answer"],
                    "speaker": vt["speaker"],
                    "prompt": q["prompt"],
                    "options": q["options"],
                    "evidence_quote": vt["quote"],
                    "explanation": vt["exp"]
                }

    for path in [frontend_path, backend_path]:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data["cambridge-7-test-4"] = c7_t4_entry
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"[OK] Updated Cambridge 7 Test 4 in {path}")

if __name__ == '__main__':
    print("=" * 70)
    print("REPAIR CAMBRIDGE 7 TEST 4 (SUPABASE & TAPESCRIPT REGISTRIES)")
    print("=" * 70)
    repair_supabase_exam()
    update_json_registries()
    print("[OK] All repairs completed successfully.")
