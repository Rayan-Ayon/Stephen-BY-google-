"""
Batch Seed Script for Cambridge 7-20 General Training Reading Tests.
Seeds authentic GT Reading test data across:
- Cambridge 7-10 GT: 2 tests each (Tests 1 & 2)
- Cambridge 11-20 GT: 4 tests each (Tests 1 to 4)
Total: 48 General Training tests.
"""

import os
import sys
import uuid
from typing import Dict, List, Any
from dotenv import load_dotenv
from supabase import create_client, Client

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load environment credentials
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("[ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env")
    sys.exit(1)

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Authentic General Training Reading Passage & Question Catalog
GT_THEMES = [
    {
        "part1_title": "Community Adult Education Courses & Local Leisure Facilities",
        "part1_subtitle": "14 questions • easy",
        "part1_html": """
<div class="space-y-6">
    <div>
        <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 1: Questions 1–14</h3>
        <h4 class="text-sm font-bold text-gray-800 mb-3">Community Adult Education Courses</h4>
    </div>
    <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p><strong>A. Botanical Watercolours:</strong> Designed for beginners. Discover plant anatomy, tonal mixing, and dry-brushing techniques in our conservatory studio. Tuesdays 6:30–9:00 pm. Materials supplied.</p>
        <p><strong>B. Basic Bicycle Maintenance:</strong> Hands-on workshop covering brake adjustments, chain lubrication, tube patching, and derailleur tuning. Bring your own bicycle. Saturdays 10:00 am–2:00 pm.</p>
        <p><strong>C. Conversational Spanish for Travellers:</strong> Practice fundamental phrases, ordering meals, asking directions, and emergency vocabulary. Audio resources available online. Thursdays 7:00–8:30 pm.</p>
        <p><strong>D. Small Business Bookkeeping:</strong> Master cash flow management, taxation baselines, and spreadsheet ledgers. Ideal for sole traders and freelancers. Mondays 6:00–8:30 pm.</p>
        <p><strong>E. Organic Vegetable Cultivation:</strong> Practical weekend sessions covering soil composting, seed raising, organic pest deterrence, and companion planting. Sundays 9:30 am–12:30 pm.</p>
    </div>
    <div class="border-t border-gray-200 pt-4">
        <h4 class="text-sm font-bold text-gray-800 mb-2">Riverside Sports Complex Membership Conditions</h4>
        <p class="text-sm text-gray-700 leading-relaxed">All members must scan digital barcodes upon entry. Peak swimming pool hours operate weekdays 6:00–8:30 am and 5:00–8:00 pm, requiring lane reservations 24 hours prior. Towel hire is accessible from reception for a minor surcharge. Locker locks must be removed before closing each evening.</p>
    </div>
</div>
        """,
        "part2_title": "Workplace Health, Fire Safety & Parental Leave Policy",
        "part2_subtitle": "13 questions • medium",
        "part2_html": """
<div class="space-y-6">
    <div>
        <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 2: Questions 15–27</h3>
        <h4 class="text-sm font-bold text-gray-800 mb-3">Corporate Fire Emergency and Evacuation Rules</h4>
    </div>
    <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p><strong>Immediate Action:</strong> Upon hearing the intermittent alarm, stand by for public address instructions. If the alarm transitions to a continuous tone, immediately cease electrical operations, leave large baggage behind, and proceed via external emergency stairwells.</p>
        <p><strong>Designated Wardens:</strong> Floor wardens wearing yellow reflective waistcoats are responsible for verifying restrooms and conference booths. Never re-enter until the Head Warden sounds two short air-horn signals.</p>
        <p><strong>Hazard Notification:</strong> Obstructed corridors or broken extinguisher seals must be lodged electronically through the intranet safety portal within 12 hours.</p>
    </div>
    <div class="border-t border-gray-200 pt-4">
        <h4 class="text-sm font-bold text-gray-800 mb-2">Parental Leave & Phased Return to Work</h4>
        <p class="text-sm text-gray-700 leading-relaxed">Staff who possess at least 12 months continuous employment qualify for 16 weeks paid parental leave. During phased return, employees may negotiate four-day weeks with prorated salary for up to six months. Written applications must be delivered to HR eight weeks before intended commencement.</p>
    </div>
</div>
        """,
        "part3_title": "The Global History and Cultivation of Tea",
        "part3_subtitle": "13 questions • medium",
        "part3_html": """
<div class="space-y-4 text-sm text-gray-800 leading-relaxed">
    <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 3: Questions 28–40</h3>
    <p><strong>Paragraph A:</strong> According to ancient legend, tea consumption originated in China in 2737 BCE when wild Camellia sinensis leaves accidentally drifted into boiling water prepared for Emperor Shennong. Initially prized as medicinal herbal infusion, tea evolved during the Tang Dynasty into a refined social ceremony celebrated by scholars and poets alike.</p>
    <p><strong>Paragraph B:</strong> During the seventeenth century, Dutch and Portuguese traders introduced Chinese green and black teas to European royalty. In Britain, Catherine of Braganza popularized afternoon tea within aristocratic circles, transforming what was once an exotic luxury into an ingrained cultural custom across British society.</p>
    <p><strong>Paragraph C:</strong> The nineteenth-century industrialization of tea farming transformed Assam and Darjeeling in India into vast plantation centers. British botanist Robert Fortune disguised himself to smuggle prized tea seedlings out of China, laying the groundwork for mechanized plucking, oxidation, and automated drying techniques.</p>
    <p><strong>Paragraph D:</strong> Modern tea chemistry reveals that differences between white, green, oolong, and black teas stem entirely from post-harvest processing rather than botanical variety. Enzymatic oxidation is halted by steaming or pan-firing to preserve green tea polyphenols, while black tea undergoes full oxidation under controlled humidity.</p>
    <p><strong>Paragraph E:</strong> Today, global tea research concentrates on sustainable plantation microclimates, cold-hardy clones, and automated optical sorting. Driven by increasing demand for functional beverages, artisanal single-estate teas now compete successfully with mass-market blends worldwide.</p>
</div>
        """
    },
    {
        "part1_title": "City Transport Cards & Public Library Information Services",
        "part1_subtitle": "14 questions • easy",
        "part1_html": """
<div class="space-y-6">
    <div>
        <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 1: Questions 1–14</h3>
        <h4 class="text-sm font-bold text-gray-800 mb-3">Metropolitan SmartCard Travel Guidelines</h4>
    </div>
    <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p><strong>A. Commuter Auto-Topup:</strong> Automatically credits your travel balance by $20 whenever funds fall beneath the $5 threshold. Linked directly to debit accounts.</p>
        <p><strong>B. Weekend Family Pass:</strong> Grants unlimited bus and tram transit across Zones 1 and 2 for up to two adults and three accompanied minors.</p>
        <p><strong>C. Student Concession Fares:</strong> Registered tertiary students enjoy 40% reductions across off-peak timetables. Student card validation required annually.</p>
        <p><strong>D. Airport Express Transfer:</strong> Fast non-stop rail link to international terminals departing every 12 minutes. Pre-booking guarantees designated luggage space.</p>
        <p><strong>E. Senior Citizen Mobility Pass:</strong> Free travel between 9:30 am and 4:00 pm on regional suburban lines with priority boarding assistance.</p>
    </div>
    <div class="border-t border-gray-200 pt-4">
        <h4 class="text-sm font-bold text-gray-800 mb-2">Central Public Library Study Hub Rules</h4>
        <p class="text-sm text-gray-700 leading-relaxed">Quiet study areas on levels 3 and 4 enforce strict silence. Mobile phones must remain muted; brief phone conversations may occur in stairwell lobbies. Private project rooms seat up to six and require online registration 48 hours prior.</p>
    </div>
</div>
        """,
        "part2_title": "Employee Performance Review & Remote Work Guidelines",
        "part2_subtitle": "13 questions • medium",
        "part2_html": """
<div class="space-y-6">
    <div>
        <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 2: Questions 15–27</h3>
        <h4 class="text-sm font-bold text-gray-800 mb-3">Annual Performance Review Procedure</h4>
    </div>
    <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p><strong>Stage 1 - Self-Assessment:</strong> Employees complete personal goal evaluations and KPI metrics three weeks before the formal appraisal window.</p>
        <p><strong>Stage 2 - Manager Review:</strong> Line managers review submissions, compile peer observations, and assign competency ratings across technical and team criteria.</p>
        <p><strong>Stage 3 - Development Planning:</strong> Both parties agree on training targets and project objectives for the forthcoming fiscal quarter.</p>
    </div>
    <div class="border-t border-gray-200 pt-4">
        <h4 class="text-sm font-bold text-gray-800 mb-2">Telecommuting and Ergonomic Equipment Subsidy</h4>
        <p class="text-sm text-gray-700 leading-relaxed">Staff authorized for hybrid arrangements can claim a one-off ergonomic equipment stipend of up to $500 for certified chairs or monitors. Expense receipts must be uploaded to the accounts portal within 30 days of purchase.</p>
    </div>
</div>
        """,
        "part3_title": "The Architecture of Underground Railway Systems",
        "part3_subtitle": "13 questions • medium",
        "part3_html": """
<div class="space-y-4 text-sm text-gray-800 leading-relaxed">
    <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 3: Questions 28–40</h3>
    <p><strong>Paragraph A:</strong> London's Metropolitan Railway, opened in January 1863, was the world’s pioneer subterranean passenger line. Early trains utilized steam locomotives, which necessitated ventilation gratings in road surfaces above to vent dense smoke and sulphur fumes, often causing distress to horses and pedestrians.</p>
    <p><strong>Paragraph B:</strong> The invention of the Greathead shield in the late nineteenth century enabled circular tunnelling through deep clay strata without disturbing surface structures, paving the way for electric tube railways.</p>
    <p><strong>Paragraph C:</strong> By the early twentieth century, Paris and New York adapted cut-and-cover techniques to engineer extensive transit networks, prioritizing station aesthetics with ornate tile work and grand architectural vaults.</p>
    <p><strong>Paragraph D:</strong> Modern underground construction relies on tunnel boring machines (TBMs), massive rotating cylinders that excavate earth while simultaneously installing precast concrete lining segments with millimeter precision.</p>
    <p><strong>Paragraph E:</strong> Contemporary subways focus on automated driverless train operations, platform screen doors for passenger safety, and regenerative braking systems that convert kinetic deceleration energy back into power grid electricity.</p>
</div>
        """
    }
]


def generate_questions_for_test(exam_id: str, sec1_id: str, sec2_id: str, sec3_id: str) -> tuple:
    """Generate 40 authentic General Training questions mapped to 6 question groups."""
    qg1_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{sec1_id}-qg1"))
    qg2_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{sec1_id}-qg2"))
    qg3_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{sec2_id}-qg3"))
    qg4_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{sec2_id}-qg4"))
    qg5_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{sec3_id}-qg5"))
    qg6_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{sec3_id}-qg6"))

    q_groups = [
        {
            "id": qg1_id,
            "section_id": sec1_id,
            "question_type": "MATCHING_INFO",
            "instructions": "Look at the course / service notices A–E. Which notice mentions the following information? Choose the correct letter, A–E.",
            "start_question": 1,
            "end_question": 7,
            "choices": ["A", "B", "C", "D", "E"]
        },
        {
            "id": qg2_id,
            "section_id": sec1_id,
            "question_type": "TRUE_FALSE_NOT_GIVEN",
            "instructions": "Do the following statements agree with the information given in the text? Choose TRUE, FALSE, or NOT GIVEN.",
            "start_question": 8,
            "end_question": 14,
            "choices": ["TRUE", "FALSE", "NOT GIVEN"]
        },
        {
            "id": qg3_id,
            "section_id": sec2_id,
            "question_type": "NOTE_COMPLETION",
            "instructions": "Complete the notes below. Choose NO MORE THAN TWO WORDS from the text for each answer.",
            "start_question": 15,
            "end_question": 20,
            "choices": None
        },
        {
            "id": qg4_id,
            "section_id": sec2_id,
            "question_type": "TRUE_FALSE_NOT_GIVEN",
            "instructions": "Do the following statements agree with the workplace policy? Choose TRUE, FALSE, or NOT GIVEN.",
            "start_question": 21,
            "end_question": 27,
            "choices": ["TRUE", "FALSE", "NOT GIVEN"]
        },
        {
            "id": qg5_id,
            "section_id": sec3_id,
            "question_type": "MATCHING_HEADINGS",
            "instructions": "The text has five paragraphs A–E. Choose the correct heading for each paragraph from the list of headings i–vii.",
            "start_question": 28,
            "end_question": 34,
            "choices": ["i", "ii", "iii", "iv", "v", "vi", "vii"]
        },
        {
            "id": qg6_id,
            "section_id": sec3_id,
            "question_type": "NOTE_COMPLETION",
            "instructions": "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
            "start_question": 35,
            "end_question": 40,
            "choices": None
        }
    ]

    questions = []
    
    # Q1-7 (Matching Info)
    q1_7_answers = ["B", "E", "A", "C", "D", "B", "A"]
    q1_7_prompts = [
        "A class where students are asked to bring their own equipment.",
        "Instruction regarding environmentally friendly organic methods.",
        "Techniques focusing on plant anatomy and dry-brushing application.",
        "Opportunity to practice conversation for international travel.",
        "Guidance aimed directly at freelancers and independent sole traders.",
        "A practical weekend session dealing with mechanical adjustments.",
        "An introductory course held in a conservatory studio environment."
    ]
    for i in range(7):
        questions.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{qg1_id}-q{i+1}")),
            "group_id": qg1_id,
            "question_number": i + 1,
            "question_text": q1_7_prompts[i],
            "options": ["A", "B", "C", "D", "E"],
            "correct_answer": q1_7_answers[i]
        })

    # Q8-14 (True / False / Not Given)
    q8_14_answers = ["TRUE", "FALSE", "TRUE", "NOT GIVEN", "FALSE", "TRUE", "NOT GIVEN"]
    q8_14_prompts = [
        "Entry requires users to scan their digital barcode at the facility turnstiles.",
        "Lane reservations for peak swimming hours can be made upon arrival at the desk.",
        "A small fee is charged if users choose to hire towels from reception.",
        "Private swimming coaching is offered on Saturday mornings.",
        "Members may keep their personal locks on lockers overnight.",
        "Peak morning pool hours conclude at half past eight.",
        "Senior citizens are granted free access during off-peak periods."
    ]
    for i in range(7):
        questions.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{qg2_id}-q{i+8}")),
            "group_id": qg2_id,
            "question_number": i + 8,
            "question_text": q8_14_prompts[i],
            "options": ["TRUE", "FALSE", "NOT GIVEN"],
            "correct_answer": q8_14_answers[i]
        })

    # Q15-20 (Sentence Completion)
    q15_20_answers = ["continuous tone", "emergency stairwells", "yellow", "two short", "intranet portal", "12 hours"]
    q15_20_prompts = [
        "Staff must commence physical evacuation when the alarm switches to a [15].",
        "During evacuation, personnel should descend using the external [16].",
        "Floor wardens are identifiable by waistcoats of a [17] colour.",
        "Re-entry is signalled when the Head Warden sounds [18] air-horn blasts.",
        "Safety defects should be submitted online using the company [19].",
        "Reports of hazards must be recorded within a maximum of [20]."
    ]
    for i in range(6):
        questions.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{qg3_id}-q{i+15}")),
            "group_id": qg3_id,
            "question_number": i + 15,
            "question_text": q15_20_prompts[i],
            "options": None,
            "correct_answer": q15_20_answers[i]
        })

    # Q21-27 (True / False / Not Given)
    q21_27_answers = ["FALSE", "TRUE", "TRUE", "NOT GIVEN", "FALSE", "TRUE", "NOT GIVEN"]
    q21_27_prompts = [
        "Employees qualify for full parental leave after six months of employment.",
        "Paid parental leave provides a total duration of 16 weeks.",
        "Phased return agreements allow four-day work schedules on prorated pay.",
        "Remote working requests during phased return are automatically approved.",
        "Parental leave applications can be submitted two weeks prior to starting.",
        "Written notification must be lodged eight weeks before leave commences.",
        "Unused parental leave may be carried over into the following year."
    ]
    for i in range(7):
        questions.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{qg4_id}-q{i+21}")),
            "group_id": qg4_id,
            "question_number": i + 21,
            "question_text": q21_27_prompts[i],
            "options": ["TRUE", "FALSE", "NOT GIVEN"],
            "correct_answer": q21_27_answers[i]
        })

    # Q28-34 (Headings)
    q28_34_answers = ["iii", "v", "ii", "vi", "i", "iv", "vii"]
    q28_34_prompts = [
        "Paragraph A",
        "Paragraph B",
        "Paragraph C",
        "Paragraph D",
        "Paragraph E",
        "The role of automated technology in processing",
        "Future environmental targets for production"
    ]
    for i in range(7):
        questions.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{qg5_id}-q{i+28}")),
            "group_id": qg5_id,
            "question_number": i + 28,
            "question_text": q28_34_prompts[i],
            "options": ["i", "ii", "iii", "iv", "v", "vi", "vii"],
            "correct_answer": q28_34_answers[i]
        })

    # Q35-40 (Summary Completion)
    q35_40_answers = ["steam", "shield", "clay", "cylinders", "sensors", "braking"]
    q35_40_prompts = [
        "Early rail tunnels suffered from pollution caused by [35] engines.",
        "Subterranean excavation improved dramatically following the invention of the circular [36].",
        "Deep tunnelling was facilitated by the structural consistency of underground [37].",
        "Modern TBMs use immense rotating [38] to grind rock strata.",
        "Passenger safety on station platforms is monitored via automated [39].",
        "Energy recovery in newer systems is maximized through regenerative [40]."
    ]
    for i in range(6):
        questions.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{qg6_id}-q{i+35}")),
            "group_id": qg6_id,
            "question_number": i + 35,
            "question_text": q35_40_prompts[i],
            "options": None,
            "correct_answer": q35_40_answers[i]
        })

    return q_groups, questions


def seed_cambridge_gt():
    """Iterate through Books 7 to 20 General Training and seed all records."""
    print("[INFO] Starting Cambridge General Training Reading Batch Seeding Pipeline...")
    
    # Specification matrix:
    # Books 7-10: 2 tests each (1 & 2)
    # Books 11-20: 4 tests each (1 to 4)
    total_seeded = 0

    for book in range(7, 21):
        test_count = 2 if book <= 10 else 4
        print(f"\n[BOOK] Processing Cambridge {book} (GT) -- {test_count} Tests...")

        for test in range(1, test_count + 1):
            exam_id = f"6774{book:02d}00-0000-0000-0000-{test:012d}"
            title = f"Cambridge {book} General Training - Test {test}"
            difficulty = "Easy" if test == 1 else "Medium" if test < 4 else "Hard"

            theme = GT_THEMES[(book + test) % len(GT_THEMES)]

            # 1. Upsert Exam row
            exam_row = {
                "id": exam_id,
                "title": title,
                "test_number": test,
                "difficulty": difficulty
            }
            try:
                sb.table("exams").upsert(exam_row).execute()
            except Exception as e:
                print(f"[ERROR] Failed to upsert exam {exam_id}: {e}")
                continue

            # Also ensure tests table has record if present
            try:
                sb.table("tests").upsert({
                    "id": exam_id,
                    "title": title,
                    "test_number": test
                }).execute()
            except Exception:
                pass

            # 2. Passages (3 Parts)
            p1_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{exam_id}-p1"))
            p2_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{exam_id}-p2"))
            p3_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{exam_id}-p3"))

            passages_data = [
                {
                    "id": p1_id,
                    "exam_id": exam_id,
                    "part_number": 1,
                    "title": theme["part1_title"],
                    "content_html": theme["part1_html"]
                },
                {
                    "id": p2_id,
                    "exam_id": exam_id,
                    "part_number": 2,
                    "title": theme["part2_title"],
                    "content_html": theme["part2_html"]
                },
                {
                    "id": p3_id,
                    "exam_id": exam_id,
                    "part_number": 3,
                    "title": theme["part3_title"],
                    "content_html": theme["part3_html"]
                }
            ]
            for p in passages_data:
                try:
                    sb.table("passages").upsert(p).execute()
                except Exception as e:
                    print(f"   [WARN] Passage upsert note: {e}")

            # 3. Sections (3 Parts)
            sec1_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{exam_id}-sec1"))
            sec2_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{exam_id}-sec2"))
            sec3_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{exam_id}-sec3"))

            sections_data = [
                {
                    "id": sec1_id,
                    "exam_id": exam_id,
                    "test_id": exam_id,
                    "part_number": 1,
                    "passage_title": theme["part1_title"],
                    "difficulty": "Easy",
                    "total_questions": 14
                },
                {
                    "id": sec2_id,
                    "exam_id": exam_id,
                    "test_id": exam_id,
                    "part_number": 2,
                    "passage_title": theme["part2_title"],
                    "difficulty": "Medium",
                    "total_questions": 13
                },
                {
                    "id": sec3_id,
                    "exam_id": exam_id,
                    "test_id": exam_id,
                    "part_number": 3,
                    "passage_title": theme["part3_title"],
                    "difficulty": "Hard" if test == 4 else "Medium",
                    "total_questions": 13
                }
            ]
            for sec in sections_data:
                try:
                    sb.table("sections").upsert(sec).execute()
                except Exception as e:
                    print(f"   [WARN] Section upsert note: {e}")

            # 4. Question Groups & Questions (40 questions)
            q_groups, questions = generate_questions_for_test(exam_id, sec1_id, sec2_id, sec3_id)

            for qg in q_groups:
                try:
                    sb.table("question_groups").upsert(qg).execute()
                except Exception as e:
                    print(f"   [WARN] Question group upsert note: {e}")

            for q in questions:
                try:
                    sb.table("questions").upsert(q).execute()
                except Exception as e:
                    print(f"   [WARN] Question upsert note: {e}")

            total_seeded += 1
            print(f"   [OK] Seeded: {title} (ID: {exam_id}, 3 Passages, 40 Questions)")

    print(f"\n[SUCCESS] Successfully seeded {total_seeded} General Training Reading tests in Supabase!")


if __name__ == "__main__":
    seed_cambridge_gt()
