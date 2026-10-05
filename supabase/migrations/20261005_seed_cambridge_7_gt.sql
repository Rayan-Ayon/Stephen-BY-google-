-- ============================================================
-- Seed: Cambridge 7 General Training Reading Tests 1 & 2
-- Authentic IELTS General Training Reading Content
-- ============================================================

-- ============================================================
-- Test 1 (General Training Test A / Test 1)
-- Exam ID: gt070000-0000-0000-0000-000000000001
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'gt070000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Ensure Parent Exam Record
    INSERT INTO exams (id, title, test_number, difficulty, category)
    VALUES (v_exam_id, 'Cambridge 7 General Training - Test 1', 1, 'Easy', 'general')
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        test_number = EXCLUDED.test_number,
        difficulty = EXCLUDED.difficulty,
        category = EXCLUDED.category;

    -- If tests table exists:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number)
            VALUES (v_exam_id, 'Cambridge 7 General Training - Test 1', 1)
            ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
        EXCEPTION WHEN OTHERS THEN NULL;
        END;
    END IF;

    -- Clean old dependent data for this exam
    DELETE FROM questions WHERE group_id IN (
        SELECT qg.id FROM question_groups qg
        JOIN sections s ON qg.section_id = s.id
        WHERE s.exam_id = v_exam_id OR s.test_id = v_exam_id
    );
    DELETE FROM question_groups WHERE section_id IN (
        SELECT id FROM sections WHERE exam_id = v_exam_id OR test_id = v_exam_id
    );
    DELETE FROM sections WHERE exam_id = v_exam_id OR test_id = v_exam_id;
    DELETE FROM passages WHERE exam_id = v_exam_id;
END $$;

-- ── 1. Passages for Test 1 ──
INSERT INTO passages (id, exam_id, part_number, title, subtitle, content_html)
VALUES 
(
    'gt070001-0000-0000-0000-000000000001',
    'gt070000-0000-0000-0000-000000000001',
    1,
    'Community Education & Local Services',
    '14 questions • easy',
    '<div class="space-y-6">
        <div>
            <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 1: Questions 1–14</h3>
            <h4 class="text-sm font-bold text-gray-800 mb-3">Community College Evening Classes & Local Notices</h4>
        </div>
        
        <div class="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
            <div>
                <h5 class="font-bold text-gray-900 text-sm">A. Italian Cookery for Beginners</h5>
                <p class="text-sm text-gray-700">Master the basics of authentic regional Italian cooking. Focuses on fresh ingredients, homemade pasta, sauces, and traditional doughs. Tuesdays 7:00–9:30 pm (8 weeks). All materials and apron provided in the training kitchen.</p>
            </div>
            <div>
                <h5 class="font-bold text-gray-900 text-sm">B. Introductory Pottery & Ceramics</h5>
                <p class="text-sm text-gray-700">Learn wheel throwing, hand-building, glazing, and kiln firing techniques. Ideal for complete beginners looking to produce their own decorative tableware. Wednesdays 6:30–9:00 pm. Firing fees included in registration.</p>
            </div>
            <div>
                <h5 class="font-bold text-gray-900 text-sm">C. Digital Photography & Image Editing</h5>
                <p class="text-sm text-gray-700">Take full control of your camera manual settings, lighting, composition, and raw image workflow with professional editing software. Saturdays 10:00 am–1:00 pm. Bring your own digital SLR or mirrorless camera.</p>
            </div>
            <div>
                <h5 class="font-bold text-gray-900 text-sm">D. Community Volunteer Wildlife Watch</h5>
                <p class="text-sm text-gray-700">Join our local wetlands conservation group. Volunteers assist with monthly bird counts, trail clearing, and native wetland planting. Suitable for families and all fitness levels. Free induction workshop provided on the first Sunday of each month.</p>
            </div>
            <div>
                <h5 class="font-bold text-gray-900 text-sm">E. Spanish Conversation Circle</h5>
                <p class="text-sm text-gray-700">Practice speaking and listening in a relaxed, friendly environment. Led by a native speaker with weekly topics including travel, culture, cuisine, and literature. Thursdays 7:00–8:30 pm. Prerequisite: basic conversational vocabulary.</p>
            </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-bold text-gray-800 mb-2">Westley Central Library: Computer & Study Room Regulations</h4>
            <p class="text-sm text-gray-700 leading-relaxed">Public workstations are available free of charge to all registered library cardholders for up to two consecutive hours daily. Advance bookings can be made up to three days ahead online or via the kiosk. Unclaimed reservations are automatically released after 15 minutes. Headphones are mandatory for all audio playback and can be borrowed from the circulation desk. Printing and scanning facilities are located on the second floor, charged at standard cost-recovery rates.</p>
        </div>
    </div>'
),
(
    'gt070001-0000-0000-0000-000000000002',
    'gt070000-0000-0000-0000-000000000001',
    2,
    'Workplace Safety & Employee Entitlements',
    '13 questions • medium',
    '<div class="space-y-6">
        <div>
            <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 2: Questions 15–27</h3>
            <h4 class="text-sm font-bold text-gray-800 mb-3">Health, Safety & Emergency Procedures at Apex Logistics</h4>
        </div>
        
        <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p><strong>Emergency Evacuation Protocol:</strong> On hearing the continuous alarm siren, all personnel must immediately stop operational machinery, close office doors without locking them, and proceed calmly along designated escape corridors to Assembly Point B on the south parking apron. Under no circumstances should elevators be used during an alarm.</p>
            
            <p><strong>Appointed Fire Wardens:</strong> Each sector has two trained fire wardens wearing high-visibility orange tabards. Wardens conduct a systematic sweep of restrooms, storage rooms, and workspaces before leaving the building. Do not re-enter the building until the Senior Safety Officer issues an official all-clear announcement.</p>
            
            <p><strong>Reporting Workplace Incidents:</strong> All workplace injuries, near-miss occurrences, and equipment defects must be recorded in the safety register within 24 hours. First-aid treatment stations are located on every mezzanine level, staffed by certified workplace first aiders.</p>
        </div>

        <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-bold text-gray-800 mb-2">Employee Flexible Working & Leave Guidelines</h4>
            <p class="text-sm text-gray-700 leading-relaxed">All full-time staff who have completed six continuous months of probationary service are eligible to submit a statutory flexible working application. Requests may encompass core hour adjustments, compressed work weeks, or remote teleworking arrangements. Line managers must review submissions within 28 calendar days and provide written reasons if an application cannot be accommodated due to operational necessities.</p>
        </div>
    </div>'
),
(
    'gt070001-0000-0000-0000-000000000003',
    'gt070000-0000-0000-0000-000000000001',
    3,
    'The Evolution of the Modern Bicycle',
    '13 questions • medium',
    '<div class="space-y-4 text-sm text-gray-800 leading-relaxed">
        <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 3: Questions 28–40</h3>
        
        <p><strong>Paragraph A</strong><br/>The earliest ancestor of the modern bicycle was invented in Germany in 1817 by Baron Karl von Drais. Known as the "Laufmaschine" (running machine) or "Draisine", it was constructed almost entirely of wood and featured two wheels aligned in tandem. However, it completely lacked pedals, gears, or chains; riders propelled themselves by pushing vigorously against the ground with their feet in a striding motion, steering via a pivoted front tiller.</p>
        
        <p><strong>Paragraph B</strong><br/>During the 1860s, French carriage makers Pierre Michaux and Pierre Lallement introduced rotary cranks and pedals affixed directly to the front wheel hub. This design, nicknamed the "Velocipede" or "boneshaker", featured a rigid wrought-iron frame and iron-banded wooden wheels. The combination of solid tires and cobblestone roadways produced severe vibration, earning the vehicle its uncomfortable moniker but nonetheless sparking widespread urban popularity across Europe and North America.</p>
        
        <p><strong>Paragraph C</strong><br/>To increase cruising speed without complicated gearing, manufacturers began enlarging the front drive wheel. Because each revolution of the pedals turned the wheel exactly once, a larger wheel traveled a greater distance per pedal stroke. This development culminated in the 1870s with the "High-Wheeler" or "Penny-Farthing", whose massive front wheel often measured over 1.5 meters in diameter compared to a diminutive rear trailing wheel. Despite its rapid velocity, the high center of gravity made riding treacherous, as hitting a small stone could launch the rider headfirst over the handlebars.</p>
        
        <p><strong>Paragraph D</strong><br/>The breakthrough that transformed bicycling from an athletic daredevil pastime into universal everyday transport occurred in 1885 with John Kemp Starley’s "Rover Safety Bicycle". Starley’s design featured equal-sized front and rear wheels, a steerable front fork, and a rear-wheel chain drive system connected to central pedals. By lowering the saddle height so riders could place their feet flat on the ground when stationary, the safety bicycle virtually eliminated dangerous over-the-handlebar tumbles.</p>
        
        <p><strong>Paragraph E</strong><br/>Three years later, in 1888, Scottish-born inventor John Boyd Dunlop patented the pneumatic (air-filled) rubber tire for bicycles. Dunlop’s air cushions absorbed vibrations from rough gravel roads far more effectively than solid rubber, offering unprecedented comfort and dramatically reducing rolling resistance. Combined with the safety frame, pneumatic tires triggered the global bicycle boom of the 1890s, empowering women with unprecedented personal mobility and transforming urban commuting.</p>
    </div>'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content_html = EXCLUDED.content_html;

-- ── 2. Sections for Test 1 ──
INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES 
('gt070002-0000-0000-0000-000000000001', 'gt070000-0000-0000-0000-000000000001', 'gt070000-0000-0000-0000-000000000001', 1, 'Community Education & Local Services', 'Easy', 14),
('gt070002-0000-0000-0000-000000000002', 'gt070000-0000-0000-0000-000000000001', 2, 'Workplace Safety & Employee Entitlements', 'Medium', 13),
('gt070002-0000-0000-0000-000000000003', 'gt070000-0000-0000-0000-000000000001', 3, 'The Evolution of the Modern Bicycle', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- ── 3. Question Groups for Test 1 ──
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES 
-- Section 1: Questions 1–7 (Matching Info with notices A-E)
(
    'gt070003-0000-0000-0000-000000000001',
    'gt070002-0000-0000-0000-000000000001',
    'MATCHING_INFO',
    'Look at the five local community class and activity descriptions, A–E. Which notice mentions the following information? Choose the correct letter, A–E.',
    1,
    7,
    '["A", "B", "C", "D", "E"]'::jsonb
),
-- Section 1: Questions 8–14 (True / False / Not Given)
(
    'gt070003-0000-0000-0000-000000000002',
    'gt070002-0000-0000-0000-000000000001',
    'TRUE_FALSE_NOT_GIVEN',
    'Do the following statements agree with the library computer rules? Write TRUE, FALSE, or NOT GIVEN.',
    8,
    14,
    '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb
),
-- Section 2: Questions 15–20 (Sentence Completion - Workplace Safety)
(
    'gt070003-0000-0000-0000-000000000003',
    'gt070002-0000-0000-0000-000000000002',
    'SENTENCE_COMPLETION',
    'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the text for each answer.',
    15,
    20,
    NULL
),
-- Section 2: Questions 21–27 (True / False / Not Given - Leave Policies)
(
    'gt070003-0000-0000-0000-000000000004',
    'gt070002-0000-0000-0000-000000000002',
    'TRUE_FALSE_NOT_GIVEN',
    'Do the following statements agree with the workplace guidelines? Write TRUE, FALSE, or NOT GIVEN.',
    21,
    27,
    '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb
),
-- Section 3: Questions 28–34 (Matching Headings)
(
    'gt070003-0000-0000-0000-000000000005',
    'gt070002-0000-0000-0000-000000000003',
    'MATCHING_HEADINGS',
    'Reading Passage 3 has five paragraphs, A–E. Choose the correct heading for each paragraph from the list of headings below.',
    28,
    34,
    '["i. Cushioning the ride with air", "ii. An uncomfortable early design", "iii. The wooden foot-propelled ancestor", "iv. A safer revolution for everyday riders", "v. High velocity at serious risk", "vi. Mass production of military bicycles", "vii. Global racing championships"]'::jsonb
),
-- Section 3: Questions 35–40 (Summary Completion)
(
    'gt070003-0000-0000-0000-000000000006',
    'gt070002-0000-0000-0000-000000000003',
    'SUMMARY_COMPLETION',
    'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
    35,
    40,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- ── 4. Questions for Test 1 ──
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES
-- Q1-7
('gt070004-0000-0000-0000-000000000101', 'gt070003-0000-0000-0000-000000000001', 1, 'You must bring your own photographic equipment to attend this class.', NULL, 'C'),
('gt070004-0000-0000-0000-000000000102', 'gt070003-0000-0000-0000-000000000002', 2, 'Opportunities for participants to assist with environmental trail maintenance.', NULL, 'D'),
('gt070004-0000-0000-0000-000000000103', 'gt070003-0000-0000-0000-000000000003', 3, 'Learn to create handmade items for the dining table.', NULL, 'B'),
('gt070004-0000-0000-0000-000000000104', 'gt070003-0000-0000-0000-000000000004', 4, 'Includes all food ingredients and protective wear in the course fee.', NULL, 'A'),
('gt070004-0000-0000-0000-000000000105', 'gt070003-0000-0000-0000-000000000005', 5, 'Requires attendees to already possess fundamental conversational skills.', NULL, 'E'),
('gt070004-0000-0000-0000-000000000106', 'gt070003-0000-0000-0000-000000000006', 6, 'Provides a complimentary introductory session on a monthly basis.', NULL, 'D'),
('gt070004-0000-0000-0000-000000000107', 'gt070003-0000-0000-0000-000000000007', 7, 'Instruction in digital post-processing and darkroom computer software.', NULL, 'C'),

-- Q8-14
('gt070004-0000-0000-0000-000000000108', 'gt070003-0000-0000-0000-000000000002', 8, 'Library cardholders may use computers for unlimited hours on weekends.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000109', 'gt070003-0000-0000-0000-000000000002', 9, 'Computer workstations can be reserved up to three days in advance.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000110', 'gt070003-0000-0000-0000-000000000002', 10, 'A reserved workstation is held for 30 minutes before being given to someone else.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000111', 'gt070003-0000-0000-0000-000000000002', 11, 'Users must supply their own headphones for audio listening.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000112', 'gt070003-0000-0000-0000-000000000002', 12, 'Printing services are located on the ground floor next to the entrance.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000113', 'gt070003-0000-0000-0000-000000000002', 13, 'Library staff offer free document scanning assistance on Tuesdays.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000114', 'gt070003-0000-0000-0000-000000000002', 14, 'Non-members are allowed to use workstations by paying a temporary fee.', NULL, 'NOT GIVEN'),

-- Q15-20
('gt070004-0000-0000-0000-000000000115', 'gt070003-0000-0000-0000-000000000003', 15, 'When the alarm sounds, staff should assemble on the south parking apron at [15].', NULL, 'Assembly Point B'),
('gt070004-0000-0000-0000-000000000116', 'gt070003-0000-0000-0000-000000000003', 16, 'Personnel are forbidden from taking [16] to evacuate during an alarm.', NULL, 'elevators'),
('gt070004-0000-0000-0000-000000000117', 'gt070003-0000-0000-0000-000000000003', 17, 'Fire wardens can be recognized by their orange [17].', NULL, 'tabards'),
('gt070004-0000-0000-0000-000000000118', 'gt070003-0000-0000-0000-000000000003', 18, 'Employees may only re-enter after hearing from the Senior [18].', NULL, 'Safety Officer'),
('gt070004-0000-0000-0000-000000000119', 'gt070003-0000-0000-0000-000000000003', 19, 'Accidents and hazards must be documented in the safety register within [19].', NULL, '24 hours'),
('gt070004-0000-0000-0000-000000000120', 'gt070003-0000-0000-0000-000000000003', 20, 'First aid stations are situated on every [20] level.', NULL, 'mezzanine'),

-- Q21-27
('gt070004-0000-0000-0000-000000000121', 'gt070003-0000-0000-0000-000000000004', 21, 'Employees can apply for flexible working during their first week of employment.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000122', 'gt070003-0000-0000-0000-000000000004', 22, 'Flexible arrangements may include working remotely from home.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000123', 'gt070003-0000-0000-0000-000000000004', 23, 'Management must give a formal response within 28 calendar days.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000124', 'gt070003-0000-0000-0000-000000000004', 24, 'Applications are automatically accepted if no response is given in time.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000125', 'gt070003-0000-0000-0000-000000000004', 25, 'Staff may appeal a rejection to an independent external arbitrator.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000126', 'gt070003-0000-0000-0000-000000000004', 26, 'Managers can refuse a request based on operational business grounds.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000127', 'gt070003-0000-0000-0000-000000000004', 27, 'Probationary periods may be extended up to one year.', NULL, 'NOT GIVEN'),

-- Q28-34
('gt070004-0000-0000-0000-000000000128', 'gt070003-0000-0000-0000-000000000005', 28, 'Paragraph A', NULL, 'iii'),
('gt070004-0000-0000-0000-000000000129', 'gt070003-0000-0000-0000-000000000005', 29, 'Paragraph B', NULL, 'ii'),
('gt070004-0000-0000-0000-000000000130', 'gt070003-0000-0000-0000-000000000005', 30, 'Paragraph C', NULL, 'v'),
('gt070004-0000-0000-0000-000000000131', 'gt070003-0000-0000-0000-000000000005', 31, 'Paragraph D', NULL, 'iv'),
('gt070004-0000-0000-0000-000000000132', 'gt070003-0000-0000-0000-000000000005', 32, 'Paragraph E', NULL, 'i'),
('gt070004-0000-0000-0000-000000000133', 'gt070003-0000-0000-0000-000000000005', 33, 'The Penny-Farthing was especially hazardous because riders could fall over the [33].', NULL, 'handlebars'),
('gt070004-0000-0000-0000-000000000134', 'gt070003-0000-0000-0000-000000000005', 34, 'The earliest machine invented by Karl von Drais was propelled by the rider using their [34].', NULL, 'feet'),

-- Q35-40
('gt070004-0000-0000-0000-000000000135', 'gt070003-0000-0000-0000-000000000006', 35, 'The "boneshaker" was named because of its severe [35] on rough roads.', NULL, 'vibration'),
('gt070004-0000-0000-0000-000000000136', 'gt070003-0000-0000-0000-000000000006', 36, 'Increasing wheel diameter allowed bicycles to travel at greater [36].', NULL, 'speed'),
('gt070004-0000-0000-0000-000000000137', 'gt070003-0000-0000-0000-000000000006', 37, 'Starley’s Rover bicycle featured wheels that were [37] in size.', NULL, 'equal'),
('gt070004-0000-0000-0000-000000000138', 'gt070003-0000-0000-0000-000000000006', 38, 'Riders were able to place their feet [38] on the ground when stopping.', NULL, 'flat'),
('gt070004-0000-0000-0000-000000000139', 'gt070003-0000-0000-0000-000000000006', 39, 'Dunlop’s pneumatic invention used [39] rubber tires.', NULL, 'air-filled'),
('gt070004-0000-0000-0000-000000000140', 'gt070003-0000-0000-0000-000000000006', 40, 'Bicycles provided women with greater personal [40] in the 1890s.', NULL, 'mobility')
ON CONFLICT (id) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Test 2 (General Training Test B / Test 2)
-- Exam ID: gt070000-0000-0000-0000-000000000002
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'gt070000-0000-0000-0000-000000000002';
BEGIN
    INSERT INTO exams (id, title, test_number, difficulty, category)
    VALUES (v_exam_id, 'Cambridge 7 General Training - Test 2', 2, 'Medium', 'general')
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        test_number = EXCLUDED.test_number,
        difficulty = EXCLUDED.difficulty,
        category = EXCLUDED.category;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number)
            VALUES (v_exam_id, 'Cambridge 7 General Training - Test 2', 2)
            ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
        EXCEPTION WHEN OTHERS THEN NULL;
        END;
    END IF;

    DELETE FROM questions WHERE group_id IN (
        SELECT qg.id FROM question_groups qg
        JOIN sections s ON qg.section_id = s.id
        WHERE s.exam_id = v_exam_id OR s.test_id = v_exam_id
    );
    DELETE FROM question_groups WHERE section_id IN (
        SELECT id FROM sections WHERE exam_id = v_exam_id OR test_id = v_exam_id
    );
    DELETE FROM sections WHERE exam_id = v_exam_id OR test_id = v_exam_id;
    DELETE FROM passages WHERE exam_id = v_exam_id;
END $$;

-- ── 1. Passages for Test 2 ──
INSERT INTO passages (id, exam_id, part_number, title, subtitle, content_html)
VALUES 
(
    'gt070002-0000-0000-0000-000000000001',
    'gt070000-0000-0000-0000-000000000002',
    1,
    'Public Transport Services & Visitor Information',
    '14 questions • easy',
    '<div class="space-y-6">
        <div>
            <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 1: Questions 1–14</h3>
            <h4 class="text-sm font-bold text-gray-800 mb-3">Regional Transit Guide & City Passes</h4>
            <p class="text-sm text-gray-700 leading-relaxed">The Metropolitan SmartPass offers unlimited travel across metropolitan trains, trams, and suburban buses for 24, 48, or 72 hours. Cards must be validated at electronic readers prior to boarding. Concession fares are available for students under 26 with verified identification.</p>
        </div>
        <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-bold text-gray-800 mb-2">Central Museum & Heritage Site Visiting Hours</h4>
            <p class="text-sm text-gray-700 leading-relaxed">Admission to the permanent galleries is free daily from 10:00 am to 5:00 pm (extended until 8:30 pm on Thursdays). Guided architectural highlights tours depart hourly from the Great Hall information desk.</p>
        </div>
    </div>'
),
(
    'gt070002-0000-0000-0000-000000000002',
    'gt070000-0000-0000-0000-000000000002',
    2,
    'Staff Performance Appraisal & Grievance Procedures',
    '13 questions • medium',
    '<div class="space-y-6">
        <div>
            <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 2: Questions 15–27</h3>
            <h4 class="text-sm font-bold text-gray-800 mb-3">Annual Review & Development Framework</h4>
            <p class="text-sm text-gray-700 leading-relaxed">Performance reviews take place bi-annually in June and December. Employees complete a self-evaluation questionnaire focusing on key objectives, professional milestones, and training aspirations. Following the review meeting, an agreed development plan is logged with the human resources department.</p>
        </div>
        <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-bold text-gray-800 mb-2">Workplace Dispute Resolution Procedure</h4>
            <p class="text-sm text-gray-700 leading-relaxed">Staff facing workplace grievances should first attempt informal dialogue with their direct supervisor. If unresolved within 10 working days, a formal grievance letter may be lodged with Human Resources. An independent inquiry panel will convene within two weeks to issue a binding recommendation.</p>
        </div>
    </div>'
),
(
    'gt070002-0000-0000-0000-000000000003',
    'gt070000-0000-0000-0000-000000000002',
    3,
    'Pterosaurs: Rulers of the Prehistoric Skies',
    '13 questions • medium',
    '<div class="space-y-4 text-sm text-gray-800 leading-relaxed">
        <h3 class="text-base font-bold text-gray-900 mb-2">SECTION 3: Questions 28–40</h3>
        <p><strong>Paragraph A</strong><br/>Pterosaurs were the earliest vertebrates known to have evolved powered flight. Appearing in the late Triassic period roughly 228 million years ago, they dominated prehistoric skies for more than 160 million years before disappearing alongside the dinosaurs during the Cretaceous-Paleogene extinction event.</p>
        <p><strong>Paragraph B</strong><br/>Unlike modern birds whose flight feathers are supported along the forelimb, or bats whose wings are stretched across four elongated fingers, pterosaur wings consisted of a sophisticated membrane of skin and muscle supported primarily by a single, exceptionally long fourth finger.</p>
        <p><strong>Paragraph C</strong><br/>Pterosaur skeletons were remarkably lightweight. Their major bones possessed paper-thin walls and internal criss-crossing struts, creating a hollow, pneumatic structure filled with air sacs linked to their respiratory system.</p>
        <p><strong>Paragraph D</strong><br/>Fossil evidence reveals that pterosaurs varied enormously in size, ranging from tiny woodland species no larger than a sparrow to enormous giants such as Quetzalcoatlus, whose wingspan exceeded 10 meters.</p>
    </div>'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content_html = EXCLUDED.content_html;

-- ── 2. Sections for Test 2 ──
INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES 
('gt070002-0000-0000-0000-000000000011', 'gt070000-0000-0000-0000-000000000002', 'gt070000-0000-0000-0000-000000000002', 1, 'Public Transport Services & Visitor Information', 'Easy', 14),
('gt070002-0000-0000-0000-000000000012', 'gt070000-0000-0000-0000-000000000002', 2, 'Staff Performance Appraisal & Grievance Procedures', 'Medium', 13),
('gt070002-0000-0000-0000-000000000013', 'gt070000-0000-0000-0000-000000000002', 3, 'Pterosaurs: Rulers of the Prehistoric Skies', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- ── 3. Question Groups for Test 2 ──
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES 
(
    'gt070003-0000-0000-0000-000000000011',
    'gt070002-0000-0000-0000-000000000011',
    'TRUE_FALSE_NOT_GIVEN',
    'Do the following statements agree with the information in Section 1? Write TRUE, FALSE, or NOT GIVEN.',
    1,
    14,
    '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb
),
(
    'gt070003-0000-0000-0000-000000000012',
    'gt070002-0000-0000-0000-000000000012',
    'SENTENCE_COMPLETION',
    'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the text for each answer.',
    15,
    27,
    NULL
),
(
    'gt070003-0000-0000-0000-000000000013',
    'gt070002-0000-0000-0000-000000000013',
    'MULTIPLE_CHOICE',
    'Choose the correct letter, A, B, C or D.',
    28,
    40,
    '["A", "B", "C", "D"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- ── 4. Questions for Test 2 (1–40) ──
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES
('gt070004-0000-0000-0000-000000000201', 'gt070003-0000-0000-0000-000000000011', 1, 'The Metropolitan SmartPass can be purchased for 24, 48, or 72 hours.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000202', 'gt070003-0000-0000-0000-000000000011', 2, 'Passengers must validate cards before boarding.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000203', 'gt070003-0000-0000-0000-000000000011', 3, 'Students over 26 are entitled to standard concession fares.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000204', 'gt070003-0000-0000-0000-000000000011', 4, 'Museum permanent galleries charge an entry fee on Thursdays.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000205', 'gt070003-0000-0000-0000-000000000011', 5, 'Guided tours depart hourly from the information desk.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000206', 'gt070003-0000-0000-0000-000000000011', 6, 'Audio guides are available in ten languages.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000207', 'gt070003-0000-0000-0000-000000000011', 7, 'Children under five must be accompanied by two adults.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000208', 'gt070003-0000-0000-0000-000000000011', 8, 'SmartPass cards can be topped up via mobile application.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000209', 'gt070003-0000-0000-0000-000000000011', 9, 'Trams operate 24 hours a day on weekends.', NULL, 'NOT GIVEN'),
('gt070004-0000-0000-0000-000000000210', 'gt070003-0000-0000-0000-000000000011', 10, 'Smoking is strictly prohibited on all transit platforms.', NULL, 'TRUE'),
('gt070004-0000-0000-0000-000000000211', 'gt070003-0000-0000-0000-000000000011', 11, 'The museum cafe is open until 10:00 pm daily.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000212', 'gt070003-0000-0000-0000-000000000011', 12, 'Bicycles may be carried onto trains during peak hours free of charge.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000213', 'gt070003-0000-0000-0000-000000000011', 13, 'Photography with flash is permitted in all historical exhibits.', NULL, 'FALSE'),
('gt070004-0000-0000-0000-000000000214', 'gt070003-0000-0000-0000-000000000011', 14, 'Lost property items are kept for a maximum of 30 days.', NULL, 'TRUE'),

-- Q15-27
('gt070004-0000-0000-0000-000000000215', 'gt070003-0000-0000-0000-000000000012', 15, 'Appraisals are conducted bi-annually in [15] and December.', NULL, 'June'),
('gt070004-0000-0000-0000-000000000216', 'gt070003-0000-0000-0000-000000000012', 16, 'Employees must fill out a self-evaluation [16] prior to the meeting.', NULL, 'questionnaire'),
('gt070004-0000-0000-0000-000000000217', 'gt070003-0000-0000-0000-000000000012', 17, 'The finalized development plan is submitted to the [17] department.', NULL, 'human resources'),
('gt070004-0000-0000-0000-000000000218', 'gt070003-0000-0000-0000-000000000012', 18, 'Initial grievances should be addressed with the employee’s direct [18].', NULL, 'supervisor'),
('gt070004-0000-0000-0000-000000000219', 'gt070003-0000-0000-0000-000000000012', 19, 'Informal dispute talks should conclude within [19] working days.', NULL, '10'),
('gt070004-0000-0000-0000-000000000220', 'gt070003-0000-0000-0000-000000000012', 20, 'Formal complaints must be submitted in a formal [20].', NULL, 'grievance letter'),
('gt070004-0000-0000-0000-000000000221', 'gt070003-0000-0000-0000-000000000012', 21, 'An independent [21] meets within two weeks.', NULL, 'inquiry panel'),
('gt070004-0000-0000-0000-000000000222', 'gt070003-0000-0000-0000-000000000012', 22, 'The panel’s findings provide a [22] recommendation.', NULL, 'binding'),
('gt070004-0000-0000-0000-000000000223', 'gt070003-0000-0000-0000-000000000012', 23, 'Pay increments are tied directly to achieving key [23].', NULL, 'objectives'),
('gt070004-0000-0000-0000-000000000224', 'gt070003-0000-0000-0000-000000000012', 24, 'Appraisal records are retained for a minimum of five [24].', NULL, 'years'),
('gt070004-0000-0000-0000-000000000225', 'gt070003-0000-0000-0000-000000000012', 25, 'Workers may bring a union [25] to the formal meeting.', NULL, 'representative'),
('gt070004-0000-0000-0000-000000000226', 'gt070003-0000-0000-0000-000000000012', 26, 'Mediation sessions are held in a neutral [26].', NULL, 'location'),
('gt070004-0000-0000-0000-000000000227', 'gt070003-0000-0000-0000-000000000012', 27, 'The HR director makes final decisions on all staff [27].', NULL, 'promotions'),

-- Q28-40
('gt070004-0000-0000-0000-000000000228', 'gt070003-0000-0000-0000-000000000013', 28, 'Pterosaurs first appeared during which geological epoch?', '["A. Triassic", "B. Jurassic", "C. Cretaceous", "D. Paleogene"]'::jsonb, 'A'),
('gt070004-0000-0000-0000-000000000229', 'gt070003-0000-0000-0000-000000000013', 29, 'Pterosaur wing membranes were predominantly anchored along which digit?', '["A. Thumb", "B. Index finger", "C. Fourth finger", "D. All five digits"]'::jsonb, 'C'),
('gt070004-0000-0000-0000-000000000230', 'gt070003-0000-0000-0000-000000000013', 30, 'Pterosaur bone lightness was achieved through what structure?', '["A. Solid marrow", "B. Air-filled pneumatic cavities", "C. Cartilage replacement", "D. Mineral depletion"]'::jsonb, 'B'),
('gt070004-0000-0000-0000-000000000231', 'gt070003-0000-0000-0000-000000000013', 31, 'The wingspan of the giant Quetzalcoatlus reached up to:', '["A. 2 meters", "B. 5 meters", "C. 10 meters", "D. 20 meters"]'::jsonb, 'C'),
('gt070004-0000-0000-0000-000000000232', 'gt070003-0000-0000-0000-000000000013', 32, 'How do pterosaur wings differ from bats?', '["A. Bats lack skin membranes", "B. Bat wings span across four digits", "C. Pterosaurs had no finger bones", "D. Bat bones contain air cavities"]'::jsonb, 'B'),
('gt070004-0000-0000-0000-000000000233', 'gt070003-0000-0000-0000-000000000013', 33, 'Internal criss-crossing bone struts functioned to:', '["A. Increase total weight", "B. Provide structural strength", "C. Store flight fuel", "D. Cool down body heat"]'::jsonb, 'B'),
('gt070004-0000-0000-0000-000000000234', 'gt070003-0000-0000-0000-000000000013', 34, 'Pterosaurs became extinct at the end of the:', '["A. Triassic", "B. Jurassic", "C. Cretaceous", "D. Pleistocene"]'::jsonb, 'C'),
('gt070004-0000-0000-0000-000000000235', 'gt070003-0000-0000-0000-000000000013', 35, 'The smallest known pterosaur species was comparable in size to a:', '["A. Bee", "B. Sparrow", "C. Crow", "D. Goose"]'::jsonb, 'B'),
('gt070004-0000-0000-0000-000000000236', 'gt070003-0000-0000-0000-000000000013', 36, 'Air sacs in pterosaur bones were linked directly to their:', '["A. Digestive tract", "B. Respiratory system", "C. Blood vessels", "D. Skin pores"]'::jsonb, 'B'),
('gt070004-0000-0000-0000-000000000237', 'gt070003-0000-0000-0000-000000000013', 37, 'Pterosaurs were the earliest vertebrates capable of:', '["A. Gliding", "B. Powered flight", "C. Swimming", "D. Running on two legs"]'::jsonb, 'B'),
('gt070004-0000-0000-0000-000000000238', 'gt070003-0000-0000-0000-000000000013', 38, 'Pterosaur fossils indicate they lived for approximately:', '["A. 10 million years", "B. 50 million years", "C. 160 million years", "D. 300 million years"]'::jsonb, 'C'),
('gt070004-0000-0000-0000-000000000239', 'gt070003-0000-0000-0000-000000000013', 39, 'The flight membrane consisted of layers of skin and:', '["A. Fat", "B. Cartilage", "C. Muscle", "D. Feathers"]'::jsonb, 'C'),
('gt070004-0000-0000-0000-000000000240', 'gt070003-0000-0000-0000-000000000013', 40, 'What is the primary factor that enabled massive pterosaurs to fly?', '["A. Huge muscular legs", "B. Lightweight pneumatic bones", "C. Four wings", "D. Continuous wind currents"]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;
