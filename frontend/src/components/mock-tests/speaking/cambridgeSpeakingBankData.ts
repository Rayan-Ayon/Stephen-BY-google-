// Cambridge 7 to Cambridge 21 Speaking Question Bank
// Authentic Cambridge IELTS prompts for all 60 tests (Books 7-21, Tests 1-4)
// Structured for Part 1 (Interview), Part 2 (Cue Card with topic + 4 prompts), and Part 3 (Discussion)

export interface SpeakingBankEntry {
    title: string;
    part1: {
        title: string;
        questions: string[];
    };
    part2: {
        title: string;
        topic: string;
        prompts: string[];
    };
    part3: {
        title: string;
        questions: string[];
    };
}

export const CAMBRIDGE_SPEAKING_BANK_EXTENDED: Record<string, SpeakingBankEntry> = {
    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 7
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-7-1': {
        title: 'Cambridge 7 Test 1',
        part1: {
            title: 'Hometown & Accommodation',
            questions: [
                'What kind of place is your hometown or village?',
                'What is the most interesting part of your town or village?',
                'What kind of jobs do the people in your town or village do?',
                'Would you say it is a good place to live? Why?',
                'Tell me about the kind of accommodation you live in.',
                'How long have you lived there?',
            ],
        },
        part2: {
            title: 'A Teacher Who Influenced You',
            topic: 'a teacher who has greatly influenced you in your education',
            prompts: [
                'where you met them',
                'what subject they taught',
                'what was special about them',
                'and explain why this person influenced you so much',
            ],
        },
        part3: {
            title: 'Developments in Education',
            questions: [
                'How has teaching changed in your country in the last few decades?',
                'What is the effect of modern technology on education in your opinion?',
                'What changes do you think there will be in education in the future?',
                'How can a country improve its education system?',
            ],
        },
    },
    'cambridge-7-2': {
        title: 'Cambridge 7 Test 2',
        part1: {
            title: 'Laughing & Free Time',
            questions: [
                'What kinds of things make you laugh?',
                'Do you like watching comedies on TV or in cinema?',
                'Do you think it is important for people to laugh regularly?',
                'Is comedy popular in your culture?',
            ],
        },
        part2: {
            title: 'An Electronic Device',
            topic: 'an electronic device you bought that was very useful',
            prompts: [
                'what the device was',
                'where and when you bought it',
                'what you used it for',
                'and explain why it was so useful to you',
            ],
        },
        part3: {
            title: 'Technology and Daily Life',
            questions: [
                'What kinds of electronic devices do people find most essential today?',
                'Do you think people rely too much on technology nowadays?',
                'How will domestic appliances change over the next twenty years?',
                'What problems can arise when technology fails in daily life?',
            ],
        },
    },
    'cambridge-7-3': {
        title: 'Cambridge 7 Test 3',
        part1: {
            title: 'Cold Weather & Seasons',
            questions: [
                'What is your favourite season of the year?',
                'What do you usually do when the weather is very cold?',
                'Does cold weather affect people’s mood in your opinion?',
                'Have you ever seen snow or experienced extreme weather?',
            ],
        },
        part2: {
            title: 'A Historic Building',
            topic: 'a historic building or monument you visited',
            prompts: [
                'where it was located',
                'what it looked like',
                'what happened there historically',
                'and explain what impressed you most about it',
            ],
        },
        part3: {
            title: 'Historic Preservation',
            questions: [
                'Why is it important to protect historic buildings?',
                'Should governments spend public money preserving historic sites or building new infrastructure?',
                'How can old monuments be made attractive to younger generations?',
                'Does mass tourism pose a threat to historical landmarks?',
            ],
        },
    },
    'cambridge-7-4': {
        title: 'Cambridge 7 Test 4',
        part1: {
            title: 'Sports & Games',
            questions: [
                'Did you enjoy sports when you were in school?',
                'What games or sports are most popular in your country?',
                'Do you prefer playing sports or watching them on television?',
                'What are the health benefits of regular exercise?',
            ],
        },
        part2: {
            title: 'A Long Journey',
            topic: 'a long journey you took that you found interesting',
            prompts: [
                'where you travelled to',
                'how you travelled',
                'who you travelled with',
                'and explain why this journey was particularly interesting',
            ],
        },
        part3: {
            title: 'Travel and Public Transport',
            questions: [
                'Why do people travel more nowadays than they used to in the past?',
                'What can governments do to improve public transportation systems?',
                'How does long-distance commuting affect people’s quality of life?',
                'Will supersonic or high-speed rail replace air travel in the future?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 8
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-8-1': {
        title: 'Cambridge 8 Test 1',
        part1: {
            title: 'Neighbourhood & Friends',
            questions: [
                'Can you describe the neighbourhood where you grew up?',
                'Do you think your neighbourhood is a friendly place?',
                'How often do you talk to your neighbours?',
                'What facilities would make your neighbourhood better?',
            ],
        },
        part2: {
            title: 'An Artist or Musician',
            topic: 'an artist, musician, or performer you admire',
            prompts: [
                'who this person is',
                'what kind of work or performance they do',
                'when you first learned about them',
                'and explain why you admire their talent',
            ],
        },
        part3: {
            title: 'Art & Cultural Heritage',
            questions: [
                'Why do you think art education is valuable in schools?',
                'Should art and cultural events be subsidized by the state?',
                'How has the internet changed the way people experience music and art?',
                'Does art reflect society or shape society?',
            ],
        },
    },
    'cambridge-8-2': {
        title: 'Cambridge 8 Test 2',
        part1: {
            title: 'Meals & Cooking',
            questions: [
                'Who usually does the cooking in your home?',
                'What kind of food do you like to eat most?',
                'Did you learn to cook when you were a child?',
                'Do you prefer eating at home or eating in restaurants?',
            ],
        },
        part2: {
            title: 'A Restaurant or Cafe',
            topic: 'a restaurant or cafe you enjoy visiting',
            prompts: [
                'where this restaurant or cafe is',
                'what kind of food and drinks it serves',
                'how often you go there',
                'and explain why you enjoy visiting this place',
            ],
        },
        part3: {
            title: 'Food Culture & Eating Habits',
            questions: [
                'How have eating habits changed in your country over the past decade?',
                'Why do people enjoy going out to restaurants instead of cooking?',
                'What can be done to promote healthier food choices among teenagers?',
                'Do foreign restaurants affect traditional cooking cultures?',
            ],
        },
    },
    'cambridge-8-3': {
        title: 'Cambridge 8 Test 3',
        part1: {
            title: 'Primary School & Memories',
            questions: [
                'What was the name of your primary school?',
                'Did you have a favourite teacher at primary school?',
                'What subjects did you like best when you were young?',
                'Do you still keep in touch with any of your school friends?',
            ],
        },
        part2: {
            title: 'A Childhood Toy',
            topic: 'a toy that was special to you when you were a child',
            prompts: [
                'what kind of toy it was',
                'who gave it to you',
                'how often you played with it',
                'and explain why this toy was so special to you',
            ],
        },
        part3: {
            title: 'Children’s Play and Development',
            questions: [
                'Do children play with different types of toys today compared to the past?',
                'What benefits do educational toys provide for early child development?',
                'Should parents limit the amount of time children spend on screen games?',
                'Is playing outside in nature essential for young children?',
            ],
        },
    },
    'cambridge-8-4': {
        title: 'Cambridge 8 Test 4',
        part1: {
            title: 'Musical Instruments & Songs',
            questions: [
                'Do you play any musical instrument?',
                'Which musical instrument would you like to learn how to play?',
                'Did you learn music at school?',
                'What kind of music do you listen to when relaxing?',
            ],
        },
        part2: {
            title: 'A Celebration or Event',
            topic: 'an important celebration or cultural event you attended',
            prompts: [
                'what the event or celebration was',
                'where and when it took place',
                'who was there with you',
                'and explain why you remember this celebration so well',
            ],
        },
        part3: {
            title: 'Social Celebrations and Traditions',
            questions: [
                'Why are traditional festivals important to national identity?',
                'Are traditional celebrations becoming too commercialized nowadays?',
                'How do international festivals affect local cultures?',
                'Do younger people celebrate special occasions differently than their grandparents did?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 9
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-9-1': {
        title: 'Cambridge 9 Test 1',
        part1: {
            title: 'Games & Leisure',
            questions: [
                'What games did you enjoy playing when you were a child?',
                'Do you prefer indoor games or outdoor sports?',
                'Do you think playing games is important for adults too?',
                'How often do you play games with your family or friends now?',
            ],
        },
        part2: {
            title: 'A Special Gift',
            topic: 'a gift or present that took you a long time to choose',
            prompts: [
                'whom you chose the gift for',
                'what the gift was',
                'why it took you a long time to decide',
                'and explain how the recipient reacted when they received it',
            ],
        },
        part3: {
            title: 'Gift Giving & Commercialism',
            questions: [
                'What kinds of gifts are considered polite in your culture?',
                'Do people spend too much money on presents during holidays?',
                'Why do some people prefer giving handmade gifts rather than buying items?',
                'Is gift-giving in the corporate world becoming more or less common?',
            ],
        },
    },
    'cambridge-9-2': {
        title: 'Cambridge 9 Test 2',
        part1: {
            title: 'Telephoning & Text Messages',
            questions: [
                'How often do you make phone calls compared to sending text messages?',
                'Do you prefer speaking on the phone or texting?',
                'Have you ever had an urgent phone call that interrupted your day?',
                'Do people in your country speak on their mobile phones on public transit?',
            ],
        },
        part2: {
            title: 'A Sports Competition',
            topic: 'a sport or athletic competition you watched and enjoyed',
            prompts: [
                'what competition or match it was',
                'where you watched it and who you were with',
                'what happened during the competition',
                'and explain why you enjoyed watching this sporting event',
            ],
        },
        part3: {
            title: 'Professional Sports and Society',
            questions: [
                'Why do top professional athletes receive such high financial salaries?',
                'Does hosting international sporting events benefit a host city’s economy?',
                'How can schools encourage children who are not naturally athletic to participate in sports?',
                'Has television changed the culture of watching live stadium games?',
            ],
        },
    },
    'cambridge-9-3': {
        title: 'Cambridge 9 Test 3',
        part1: {
            title: 'Daily Routine & Sleep',
            questions: [
                'What time do you usually wake up each morning?',
                'Do you usually do the same things at the same time every day?',
                'What is your favourite part of the day?',
                'Do you think taking an afternoon nap is beneficial?',
            ],
        },
        part2: {
            title: 'An Important Decision',
            topic: 'an important decision you had to make in your life',
            prompts: [
                'what the decision was',
                'when and where you made it',
                'how difficult it was to choose',
                'and explain what happened as a result of that decision',
            ],
        },
        part3: {
            title: 'Decision-Making & Responsibility',
            questions: [
                'Why do some people find it difficult to make decisions quickly?',
                'Should parents allow teenagers to make their own major life decisions?',
                'What qualities make someone a reliable decision-maker in an organisation?',
                'How does access to too much information complicate modern decisions?',
            ],
        },
    },
    'cambridge-9-4': {
        title: 'Cambridge 9 Test 4',
        part1: {
            title: 'Plants & Gardens',
            questions: [
                'Do you have plants or flowers inside your home?',
                'Did you ever learn about gardening or growing vegetables at school?',
                'Are there public parks or botanical gardens in your area?',
                'Do you think growing your own food is a useful hobby?',
            ],
        },
        part2: {
            title: 'A Useful Website',
            topic: 'a website that you visit frequently and find helpful',
            prompts: [
                'what website it is and what it does',
                'how often you visit it',
                'what kind of information or service it provides',
                'and explain why this website is so useful to you',
            ],
        },
        part3: {
            title: 'The Internet and Information Society',
            questions: [
                'How has the internet changed the way people search for reliable information?',
                'What risks do people face when buying goods or banking on websites?',
                'Will traditional libraries disappear as internet databases become more universal?',
                'How can governments protect public data privacy on the internet?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 10
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-10-1': {
        title: 'Cambridge 10 Test 1',
        part1: {
            title: 'Weekends & Relaxation',
            questions: [
                'What do you usually do on your weekends?',
                'Did you do different things on weekends when you were younger?',
                'Do you think weekends are long enough for most workers?',
                'How do you feel on Sunday evenings before the work week begins?',
            ],
        },
        part2: {
            title: 'A Good Leader',
            topic: 'someone you know or have heard of who is a good leader',
            prompts: [
                'who this person is',
                'what leadership role they hold',
                'what qualities or skills they possess',
                'and explain why you think they are an effective leader',
            ],
        },
        part3: {
            title: 'Leadership Qualities & Authority',
            questions: [
                'What are the most essential characteristics of an inspiring leader?',
                'Are great leaders born with their talent or can leadership be taught?',
                'Why do some leaders fail to gain the trust of their team members?',
                'Should leaders always consult their subordinates before making decisions?',
            ],
        },
    },
    'cambridge-10-2': {
        title: 'Cambridge 10 Test 2',
        part1: {
            title: 'Music & Listening Habits',
            questions: [
                'What kind of music do you like to listen to?',
                'At what times of day do you usually listen to music?',
                'Did your musical tastes change as you grew older?',
                'Do you prefer listening to recorded songs or going to live performances?',
            ],
        },
        part2: {
            title: 'A House or Apartment',
            topic: 'a house or apartment you would like to live in in the future',
            prompts: [
                'where this house or apartment would be located',
                'what it would look like from the inside and outside',
                'who you would live there with',
                'and explain why this would be an ideal home for you',
            ],
        },
        part3: {
            title: 'Housing, Cities & Architecture',
            questions: [
                'How have housing styles in your country changed over the last 50 years?',
                'Do you think modern apartment high-rises are good places to raise children?',
                'Should city planners preserve historical architecture or build modern complexes?',
                'What environmental features should future homes include?',
            ],
        },
    },
    'cambridge-10-3': {
        title: 'Cambridge 10 Test 3',
        part1: {
            title: 'Travel & Holidays',
            questions: [
                'What kind of places do you prefer visiting for holidays?',
                'Do you prefer travelling with a group of friends or by yourself?',
                'What is the most memorable holiday you have had so far?',
                'How do you prepare when travelling to a foreign destination?',
            ],
        },
        part2: {
            title: 'A Local Small Business',
            topic: 'a small company or local business you like and use',
            prompts: [
                'what this business is and where it is located',
                'what products or services it provides',
                'how often you go there or use their services',
                'and explain why you prefer this small business over large chains',
            ],
        },
        part3: {
            title: 'Small Businesses and Corporations',
            questions: [
                'What advantages do local small businesses offer to a community?',
                'Why do many small shops struggle to survive against large online retailers?',
                'How can governments encourage entrepreneurship among young graduates?',
                'Do multinational corporations have too much influence in modern consumer markets?',
            ],
        },
    },
    'cambridge-10-4': {
        title: 'Cambridge 10 Test 4',
        part1: {
            title: 'Shopping & Spending',
            questions: [
                'Do you enjoy shopping for clothes or electronic items?',
                'How often do you go shopping in stores versus online shopping?',
                'Do you compare prices before buying expensive things?',
                'What is the last thing you purchased that was very useful?',
            ],
        },
        part2: {
            title: 'An Impressive Film',
            topic: 'a film or documentary that made a strong impression on you',
            prompts: [
                'what film it was and what it was about',
                'where and when you watched it',
                'who the main actors or subjects were',
                'and explain why this film made such a strong impression on you',
            ],
        },
        part3: {
            title: 'Cinema, Culture & Education',
            questions: [
                'Can watching cinema teach people about history and different cultures?',
                'Why do blockbusters with special effects often perform better than art cinema?',
                'Is watching movies at a cinema still important when home streaming is widespread?',
                'Should governments fund national film industries to preserve local identity?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 11
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-11-1': {
        title: 'Cambridge 11 Test 1',
        part1: {
            title: 'Food & Cooking Routine',
            questions: [
                'What is your favourite dish to eat?',
                'Did your parents teach you how to prepare meals?',
                'Do you think food culture is important in your country?',
                'What ingredients are typical in your region’s cooking?',
            ],
        },
        part2: {
            title: 'A New Hobby or Activity',
            topic: 'a time when you started a new hobby or activity',
            prompts: [
                'what the hobby or activity was',
                'why you decided to take it up',
                'how you learned it and who helped you',
                'and explain how this activity made you feel',
            ],
        },
        part3: {
            title: 'Leisure Activities and Modern Life',
            questions: [
                'Why is it healthy for busy working adults to have hobbies outside work?',
                'How have leisure activities changed since the introduction of mobile technology?',
                'Do people have more free time today or less than people did fifty years ago?',
                'Should hobbies always be productive or is simple relaxation enough?',
            ],
        },
    },
    'cambridge-11-2': {
        title: 'Cambridge 11 Test 2',
        part1: {
            title: 'Rain & Weather Changes',
            questions: [
                'Do you like rainy days or sunny weather better?',
                'What do you normally do when it rains heavily outside?',
                'Does rain affect transportation in your town or city?',
                'Did you play in the rain when you were a young child?',
            ],
        },
        part2: {
            title: 'A Piece of Good News',
            topic: 'a piece of good news you received recently',
            prompts: [
                'what the news was',
                'how you heard about it',
                'who was with you at the time',
                'and explain why this news was so significant to you',
            ],
        },
        part3: {
            title: 'News Media & Information',
            questions: [
                'How do most people in your country discover daily news today?',
                'Why do news channels often report negative stories rather than positive ones?',
                'How can readers verify whether news online is authentic or misinformation?',
                'Will printed newspapers disappear entirely in the next generation?',
            ],
        },
    },
    'cambridge-11-3': {
        title: 'Cambridge 11 Test 3',
        part1: {
            title: 'Photography & Memories',
            questions: [
                'Do you like taking photographs with your phone?',
                'What kind of things do you take pictures of most often?',
                'Do you print physical photos or keep them digitally?',
                'Are family photos important to you?',
            ],
        },
        part2: {
            title: 'A Memorable Journey with Friends',
            topic: 'a memorable event or journey you took with your friends',
            prompts: [
                'where you travelled or went',
                'who accompanied you on this journey',
                'what activities you did together',
                'and explain why this experience with friends was so memorable',
            ],
        },
        part3: {
            title: 'Friendship, Travel & Shared Experiences',
            questions: [
                'What makes travelling with friends different from travelling with family members?',
                'Can travelling together test or strengthen a friendship?',
                'Why do young adults like taking adventure trips to unfamiliar destinations?',
                'How has social media changed the way friends plan and share their travels?',
            ],
        },
    },
    'cambridge-11-4': {
        title: 'Cambridge 11 Test 4',
        part1: {
            title: 'Evening Activities & Routine',
            questions: [
                'What do you usually do in the evenings after work or study?',
                'Do you prefer spending evenings at home or going outside?',
                'Did you have a fixed bedtime when you were a child?',
                'What is your ideal way to spend a Friday evening?',
            ],
        },
        part2: {
            title: 'An Interesting Animal',
            topic: 'an interesting animal or wildlife encounter you experienced or learned about',
            prompts: [
                'what animal it was',
                'where you saw it or learned about it',
                'what makes this animal unique or interesting',
                'and explain what impressed you most about this animal',
            ],
        },
        part3: {
            title: 'Wildlife Conservation & Biodiversity',
            questions: [
                'Why is preserving endangered animal species essential for global ecosystems?',
                'Do modern zoos serve a valid conservation purpose or are they outdated?',
                'How does habitat destruction by humans threaten animal survival?',
                'Should international laws on wildlife poaching be enforced more strictly?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 12
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-12-1': {
        title: 'Cambridge 12 Test 1',
        part1: {
            title: 'Health & Physical Fitness',
            questions: [
                'What activities do you do to stay healthy and active?',
                'Do you think you have a healthy diet?',
                'Was physical education compulsory when you attended school?',
                'What healthy habit would you like to develop this year?',
            ],
        },
        part2: {
            title: 'An Occasion You Were Polite',
            topic: 'an occasion when you had to be especially polite',
            prompts: [
                'where this happened',
                'whom you were speaking with',
                'why you had to be particularly polite',
                'and explain how you felt during that situation',
            ],
        },
        part3: {
            title: 'Etiquette, Manners & Society',
            questions: [
                'Why are polite manners important when communicating with strangers?',
                'Do polite rules vary significantly across different cultures and countries?',
                'Are young people today less polite than earlier generations, or just different?',
                'How does polite communication help prevent conflict in workplaces?',
            ],
        },
    },
    'cambridge-12-2': {
        title: 'Cambridge 12 Test 2',
        part1: {
            title: 'Art, Galleries & Museums',
            questions: [
                'Do you enjoy visiting art galleries or historical museums?',
                'Did you take drawing or painting classes at school?',
                'Do you have any artworks or paintings displayed in your home?',
                'What kind of art appeals to you most?',
            ],
        },
        part2: {
            title: 'An Interesting Talk or Speech',
            topic: 'an interesting talk, presentation, or speech you heard',
            prompts: [
                'who gave the talk or speech',
                'what the topic was about',
                'where and when you heard it',
                'and explain why you found this speech so engaging',
            ],
        },
        part3: {
            title: 'Public Speaking & Communication',
            questions: [
                'What makes someone an inspiring and memorable public speaker?',
                'Why are many people nervous about speaking in front of an audience?',
                'Should public speaking skills be taught to children in primary schools?',
                'How has online video broadcasting changed political and academic presentations?',
            ],
        },
    },
    'cambridge-12-3': {
        title: 'Cambridge 12 Test 3',
        part1: {
            title: 'Public Holidays & Festivals',
            questions: [
                'What is the most popular public holiday in your country?',
                'How do people traditionally celebrate that holiday?',
                'Do you prefer public holidays in winter or in summer?',
                'What did you do during your most recent public holiday?',
            ],
        },
        part2: {
            title: 'An Exciting Book',
            topic: 'an exciting book you read recently that you enjoyed',
            prompts: [
                'what book it was and who wrote it',
                'what the main storyline or premise was',
                'why you decided to read it',
                'and explain why you found this book so exciting',
            ],
        },
        part3: {
            title: 'Reading Habits & Modern Literature',
            questions: [
                'Why are people reading fewer long novels compared to previous eras?',
                'Do e-readers and audiobooks offer the same intellectual benefit as paper books?',
                'Should school literature curricula include contemporary books or classical texts?',
                'How does reading imaginative literature benefit creative problem solving?',
            ],
        },
    },
    'cambridge-12-4': {
        title: 'Cambridge 12 Test 4',
        part1: {
            title: 'Clothes & Fashion',
            questions: [
                'What kinds of clothes do you normally wear for work or study?',
                'Do you follow the latest fashion trends?',
                'Do you prefer wearing comfortable clothes or stylish clothes?',
                'Did you have to wear a school uniform when you were younger?',
            ],
        },
        part2: {
            title: 'A Quiet Place',
            topic: 'a quiet place you like to visit to relax or concentrate',
            prompts: [
                'where this place is',
                'how often you go there',
                'what you usually do when you are there',
                'and explain why this quiet place is so relaxing for you',
            ],
        },
        part3: {
            title: 'Noise Pollution & Urban Silence',
            questions: [
                'What are the main causes of severe noise pollution in modern cities?',
                'How does constant urban noise affect human physical and mental health?',
                'What measures can city planners take to construct quieter public areas?',
                'Why do some individuals need background music while others require complete silence?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 13
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-13-1': {
        title: 'Cambridge 13 Test 1',
        part1: {
            title: 'Animals & Pets',
            questions: [
                'Did you have a pet when you were growing up?',
                'What is the most popular pet in your country?',
                'Do you think pets are good company for children and elderly people?',
                'What wild animals are native to your country?',
            ],
        },
        part2: {
            title: 'An Enjoyable Vacation',
            topic: 'a holiday or vacation you enjoyed very much',
            prompts: [
                'where you went and when',
                'who accompanied you on the trip',
                'what activities you did there',
                'and explain why this vacation was so enjoyable to you',
            ],
        },
        part3: {
            title: 'Tourism Impacts & Sustainable Travel',
            questions: [
                'How does international tourism benefit local communities economically?',
                'What negative environmental impacts can excessive tourism bring to natural areas?',
                'What can travellers do to ensure their visits are respectful of local cultures?',
                'Will virtual reality travel ever replace physical holiday journeys?',
            ],
        },
    },
    'cambridge-13-2': {
        title: 'Cambridge 13 Test 2',
        part1: {
            title: 'Mirrors & Appearance',
            questions: [
                'How often do you look at yourself in a mirror each day?',
                'Do you have many mirrors in your home?',
                'Do you ever use mirrors as interior decorations?',
                'Have you ever bought a mirror for your room?',
            ],
        },
        part2: {
            title: 'Money Received as a Gift',
            topic: 'a time when you received money as a gift',
            prompts: [
                'who gave you the money and when',
                'what the occasion was',
                'what you decided to spend the money on',
                'and explain how you felt when you received this gift',
            ],
        },
        part3: {
            title: 'Personal Finance & Young People',
            questions: [
                'Why is financial literacy an important subject for schools to teach?',
                'Should young children receive regular pocket money from their parents?',
                'Do digital payment apps encourage people to spend more carelessly than cash?',
                'How can young adults be encouraged to save money for long-term emergencies?',
            ],
        },
    },
    'cambridge-13-3': {
        title: 'Cambridge 13 Test 3',
        part1: {
            title: 'Watches & Punctuality',
            questions: [
                'Do you wear a wristwatch regularly?',
                'Do you prefer smartwatches or traditional mechanical watches?',
                'Is punctuality considered very important in your culture?',
                'What do you do if you realize you are going to be late for an appointment?',
            ],
        },
        part2: {
            title: 'An Important Plant or Tree',
            topic: 'an important plant, tree, or crop in your country',
            prompts: [
                'what plant or tree it is',
                'where it grows and what conditions it requires',
                'what products or benefits come from it',
                'and explain why this plant is so important to your country',
            ],
        },
        part3: {
            title: 'Environment, Agriculture & Forestry',
            questions: [
                'Why is deforestation a serious global environmental crisis?',
                'What role do urban trees play in regulating city temperatures and air quality?',
                'How has modern agricultural technology affected traditional crop diversity?',
                'Should governments provide financial subsidies to farmers adopting organic practices?',
            ],
        },
    },
    'cambridge-13-4': {
        title: 'Cambridge 13 Test 4',
        part1: {
            title: 'Shoes & Footwear',
            questions: [
                'Do you prefer comfortable shoes or fashionable shoes?',
                'How many pairs of shoes do you usually own?',
                'Have you ever bought shoes online?',
                'Are branded shoes popular with young people in your country?',
            ],
        },
        part2: {
            title: 'Helping Someone',
            topic: 'a time when you helped someone with a problem or task',
            prompts: [
                'who you helped',
                'what problem or task they had',
                'how you helped them',
                'and explain how you felt after helping this person',
            ],
        },
        part3: {
            title: 'Volunteering & Community Support',
            questions: [
                'Why is community volunteer work important for social cohesion?',
                'Should universities make community service hours mandatory for graduation?',
                'Do people in modern urban society help strangers as readily as in rural areas?',
                'How can non-governmental charitable organizations recruit and retain volunteers?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 14
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-14-1': {
        title: 'Cambridge 14 Test 1',
        part1: {
            title: 'Social Media & Screen Time',
            questions: [
                'Do you use social media platforms frequently?',
                'Which social media app do you use most often?',
                'Did you use social media when you were in secondary school?',
                'Do you think social media brings people closer together or causes isolation?',
            ],
        },
        part2: {
            title: 'A Low-Cost Day Out',
            topic: 'a day out you enjoyed that did not cost much money',
            prompts: [
                'where you went and who was with you',
                'what you did during that day',
                'why it did not cost much money',
                'and explain why you enjoyed that day so much',
            ],
        },
        part3: {
            title: 'Leisure Expenses & Simple Living',
            questions: [
                'Do people feel pressured to spend lots of money to enjoy leisure time today?',
                'What free public recreational facilities should city councils provide for citizens?',
                'Is outdoor recreation in parks better for mental health than paid indoor entertainment?',
                'How does advertising make people believe that happiness requires expensive purchases?',
            ],
        },
    },
    'cambridge-14-2': {
        title: 'Cambridge 14 Test 2',
        part1: {
            title: 'Colours & Aesthetics',
            questions: [
                'What is your favourite colour and why do you like it?',
                'Do colours have special meanings or cultural associations in your country?',
                'Did your colour preferences change since you were a child?',
                'What colour would you paint the walls of your bedroom?',
            ],
        },
        part2: {
            title: 'A Time You Forgot Something',
            topic: 'a time when you forgot something important',
            prompts: [
                'what you forgot',
                'when and where this happened',
                'what consequences occurred because of forgetting it',
                'and explain how you resolved the situation',
            ],
        },
        part3: {
            title: 'Memory, Organisation & Digital Tools',
            questions: [
                'Why do people occasionally forget appointments or important possessions?',
                'Are digital calendars and reminders making human memory weaker over time?',
                'What memory techniques can students utilize to prepare for complex exams?',
                'Why do some childhood memories stay vivid throughout an entire lifetime?',
            ],
        },
    },
    'cambridge-14-3': {
        title: 'Cambridge 14 Test 3',
        part1: {
            title: 'Parks & Public Green Spaces',
            questions: [
                'How often do you visit parks or gardens in your area?',
                'What activities do people enjoy doing in parks near your home?',
                'Did you visit parks frequently when you were a child?',
                'Do you think city councils should prioritize building more parks?',
            ],
        },
        part2: {
            title: 'A Memorable Advertisement',
            topic: 'an advertisement you saw that you remember very well',
            prompts: [
                'where and when you saw or heard it',
                'what product or service it was promoting',
                'what happened in the advertisement',
                'and explain why you remember this advertisement so clearly',
            ],
        },
        part3: {
            title: 'Advertising Ethics & Consumer Culture',
            questions: [
                'How do modern advertisements influence children and young consumers?',
                'Should advertising of unhealthy sugary foods be restricted by government regulation?',
                'Are influencer marketing campaigns more persuasive than traditional billboard ads?',
                'Can advertising campaigns effectively raise public awareness for social causes?',
            ],
        },
    },
    'cambridge-14-4': {
        title: 'Cambridge 14 Test 4',
        part1: {
            title: 'Morning Routines & Waking Up',
            questions: [
                'Do you consider yourself a morning person or a night owl?',
                'What do you normally do first thing after you get out of bed?',
                'Do you use an alarm clock or wake up naturally?',
                'How do your mornings on weekends differ from weekdays?',
            ],
        },
        part2: {
            title: 'A Challenging Achievement',
            topic: 'a challenging thing you accomplished that made you proud',
            prompts: [
                'what the challenge or achievement was',
                'why it was difficult for you to accomplish',
                'what steps you took to overcome the obstacles',
                'and explain why you felt proud of this accomplishment',
            ],
        },
        part3: {
            title: 'Overcoming Adversity & Ambition',
            questions: [
                'Why is perseverance essential when learning complex new skills?',
                'How do parents and educators foster a growth mindset in children?',
                'Is modern society too focused on competitive success rather than personal satisfaction?',
                'What can individuals learn from experiences of failure?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 15
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-15-1': {
        title: 'Cambridge 15 Test 1',
        part1: {
            title: 'Languages & Communication',
            questions: [
                'How many languages can you speak?',
                'How long have you been learning English?',
                'What is the most challenging aspect of learning a foreign language?',
                'Do you think learning multiple languages is important in our globalized world?',
            ],
        },
        part2: {
            title: 'A Conversation with an Older Person',
            topic: 'an interesting conversation you had with an older person',
            prompts: [
                'who the person was and where you had the conversation',
                'what topic you talked about',
                'what advice or stories they shared with you',
                'and explain why this conversation was so meaningful to you',
            ],
        },
        part3: {
            title: 'Intergenerational Wisdom & Society',
            questions: [
                'What can younger generations learn from the life experiences of elderly people?',
                'Why is there sometimes a communication barrier between grandparents and teenagers?',
                'How has the role of elderly family members changed in modern nuclear households?',
                'What responsibilities do communities have in caring for senior citizens?',
            ],
        },
    },
    'cambridge-15-2': {
        title: 'Cambridge 15 Test 2',
        part1: {
            title: 'History & Historic Sites',
            questions: [
                'Did you enjoy studying history when you were at school?',
                'Have you ever visited any historical museums or battle sites?',
                'Which period of world history do you find most interesting?',
                'Do you think learning history helps us avoid past mistakes?',
            ],
        },
        part2: {
            title: 'A Crowded Place',
            topic: 'a crowded place you visited that left a strong impression',
            prompts: [
                'where this place was and when you went there',
                'why there were so many people there',
                'what you did while you were in the crowd',
                'and explain how you felt about being in that crowded place',
            ],
        },
        part3: {
            title: 'Urban Crowding & Population',
            questions: [
                'Why do large metropolitan cities attract massive populations from rural areas?',
                'What logistical problems arise when urban areas experience extreme overcrowding?',
                'How can public transit systems be upgraded to handle rush-hour congestion?',
                'Will flexible work-from-home options reduce population pressure on major city centers?',
            ],
        },
    },
    'cambridge-15-3': {
        title: 'Cambridge 15 Test 3',
        part1: {
            title: 'Swimming & Water Sports',
            questions: [
                'Did you learn how to swim when you were a child?',
                'How often do you go swimming now?',
                'Do you prefer swimming in the ocean or in a swimming pool?',
                'Do you think all children should be taught swimming for safety reasons?',
            ],
        },
        part2: {
            title: 'A Live Performance',
            topic: 'a performance or live concert you watched and enjoyed',
            prompts: [
                'what performance or concert it was',
                'where and when you watched it',
                'who performed and who was with you',
                'and explain why this live performance made such a positive impression',
            ],
        },
        part3: {
            title: 'Performing Arts & Live Entertainment',
            questions: [
                'Why do people prefer attending live concerts over listening to recorded music at home?',
                'Should governments provide public arts subsidies to classical theater and opera?',
                'How has digital streaming changed the economic models of professional musical artists?',
                'What role do arts and stage performances play in children’s creative development?',
            ],
        },
    },
    'cambridge-15-4': {
        title: 'Cambridge 15 Test 4',
        part1: {
            title: 'Baking & Desserts',
            questions: [
                'Do you like baking cakes or pastries at home?',
                'Did anyone in your family bake when you were growing up?',
                'Do you prefer sweet snacks or savoury food?',
                'What is a traditional dessert popular in your country?',
            ],
        },
        part2: {
            title: 'A New City You Visited',
            topic: 'a time when you visited a new town or city for the first time',
            prompts: [
                'what city it was and when you visited',
                'why you went there',
                'what sights or attractions you explored',
                'and explain what your impression was of that new city',
            ],
        },
        part3: {
            title: 'City Planning & Urban Renewal',
            questions: [
                'What features make a newly visited city feel welcoming and walkable to tourists?',
                'How can historic cities modernize their transportation without destroying historic charm?',
                'What challenges do cities face when transforming industrial zones into residential spaces?',
                'How will green architecture and renewable power reshape 21st-century cities?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 16
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-16-1': {
        title: 'Cambridge 16 Test 1',
        part1: {
            title: 'Flowers & Nature',
            questions: [
                'Do you like having flowers inside your room or apartment?',
                'What is your favourite flower and why?',
                'Do people in your country give flowers as presents on special occasions?',
                'Have you ever grown flowers or plants in a garden?',
            ],
        },
        part2: {
            title: 'Sharing with Others',
            topic: 'a time when you shared something with other people',
            prompts: [
                'what you shared and who you shared it with',
                'why you decided to share it',
                'how the other people responded',
                'and explain how you felt about sharing in that situation',
            ],
        },
        part3: {
            title: 'Sharing Culture & Resources',
            questions: [
                'Why is sharing an important social value for parents to teach young children?',
                'How has the internet fostered a "sharing economy" in car rides and accommodation?',
                'What challenges arise when countries must share water resources from international rivers?',
                'Do people in modern individualistic societies share less than earlier communal generations?',
            ],
        },
    },
    'cambridge-16-2': {
        title: 'Cambridge 16 Test 2',
        part1: {
            title: 'Festivals & Traditional Events',
            questions: [
                'What is the most significant traditional festival in your country?',
                'What special foods do people prepare during that festival?',
                'Do you prefer celebrating festivals with close family or big public parties?',
                'Has the way people celebrate festivals changed in recent decades?',
            ],
        },
        part2: {
            title: 'A Difficult Skill',
            topic: 'a skill that was difficult for you to master',
            prompts: [
                'what the skill was',
                'why you wanted to learn it',
                'what made it so difficult to master',
                'and explain how you managed to develop this skill',
            ],
        },
        part3: {
            title: 'Skill Mastery & Education',
            questions: [
                'Why do some individuals give up when learning complex skills while others persevere?',
                'What role do qualified mentors play in accelerating a student’s skill development?',
                'Are practical trade skills as valuable in the modern economy as university degrees?',
                'How can online tutorial videos support independent self-directed learning?',
            ],
        },
    },
    'cambridge-16-3': {
        title: 'Cambridge 16 Test 3',
        part1: {
            title: 'Names & Identity',
            questions: [
                'Does your name have a special meaning or family history?',
                'Who chose your name when you were born?',
                'Do people in your country often change their names as adults?',
                'Do you have any nicknames that your friends use?',
            ],
        },
        part2: {
            title: 'A Reliable Home Appliance',
            topic: 'a piece of equipment or appliance you rely on at home',
            prompts: [
                'what appliance or equipment it is',
                'how long you have owned it',
                'what you use it for on a daily basis',
                'and explain why you rely on this piece of equipment so much',
            ],
        },
        part3: {
            title: 'Home Automation & Future Household Technology',
            questions: [
                'How have modern domestic appliances reduced the burden of household chores?',
                'Will smart homes and voice-controlled devices make domestic living overly dependent on internet connections?',
                'What safety or privacy concerns arise with connected household devices?',
                'How can electronic appliances be manufactured to be more energy-efficient and recyclable?',
            ],
        },
    },
    'cambridge-16-4': {
        title: 'Cambridge 16 Test 4',
        part1: {
            title: 'Cleanliness & Household Chores',
            questions: [
                'Do you enjoy keeping your living space neat and tidy?',
                'Which household chore do you dislike doing most?',
                'Did you have chores assigned to you as a child?',
                'Do you prefer cleaning a little every day or doing one big clean per week?',
            ],
        },
        part2: {
            title: 'A Natural Talent',
            topic: 'a natural talent or ability you wish you possessed',
            prompts: [
                'what talent or ability it is',
                'who you know that has this talent',
                'why you would like to have this ability',
                'and explain how having this talent would change your daily life',
            ],
        },
        part3: {
            title: 'Natural Talent vs Diligent Effort',
            questions: [
                'Is extraordinary success determined more by innate genetic talent or disciplined practice?',
                'How can school educators identify hidden talents in children early on?',
                'Why do some talented individuals fail to fulfill their potential?',
                'Should society place equal value on artistic talent and scientific talent?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 17
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-17-1': {
        title: 'Cambridge 17 Test 1',
        part1: {
            title: 'Writing & Note-Taking',
            questions: [
                'Do you prefer writing by hand or typing on a keyboard?',
                'How often do you write long texts or letters by hand?',
                'Did you learn handwriting when you were in primary school?',
                'Do you think handwriting will become obsolete in the future?',
            ],
        },
        part2: {
            title: 'A Neighborhood You Know Well',
            topic: 'a neighborhood or area in your town or city that you know well',
            prompts: [
                'where this neighborhood is',
                'what kinds of buildings, shops, and facilities are there',
                'how often you spend time there',
                'and explain why you know and like this neighborhood so well',
            ],
        },
        part3: {
            title: 'Community Life & Urban Development',
            questions: [
                'What community features help foster strong friendships among neighbors?',
                'Why are many modern residential communities less socially connected than past villages?',
                'How can urban designers balance residential spaces with green parks and commercial stores?',
                'What can local governments do to revitalize declining neighborhoods?',
            ],
        },
    },
    'cambridge-17-2': {
        title: 'Cambridge 17 Test 2',
        part1: {
            title: 'Sitting Down & Ergonomics',
            questions: [
                'Where is your favourite place to sit down at home?',
                'Do you spend a lot of time sitting down during your work or studies?',
                'Do you ever feel uncomfortable after sitting for long hours?',
                'Have you ever used a standing desk or ergonomic chair?',
            ],
        },
        part2: {
            title: 'Using a Map',
            topic: 'a time when you used a map to find your way to a destination',
            prompts: [
                'where you were travelling to',
                'what kind of map you used (paper or smartphone)',
                'why you needed to use a map',
                'and explain whether the map was easy or difficult to follow',
            ],
        },
        part3: {
            title: 'Navigation & Spatial Awareness',
            questions: [
                'How has digital GPS navigation changed the way people explore unfamiliar cities?',
                'Do people lose their innate sense of orientation when relying constantly on smartphone maps?',
                'Why is learning to read physical topographical maps still a valuable outdoor skill?',
                'How do modern delivery services utilize digital mapping algorithms to optimize routes?',
            ],
        },
    },
    'cambridge-17-3': {
        title: 'Cambridge 17 Test 3',
        part1: {
            title: 'Drinks & Beverages',
            questions: [
                'What do you normally drink first thing in the morning?',
                'Do you prefer tea or coffee throughout the day?',
                'Do you make sure to drink enough plain water every day?',
                'What traditional drinks are popular when guests visit your home?',
            ],
        },
        part2: {
            title: 'An Exciting Competition',
            topic: 'an exciting competition you participated in or watched',
            prompts: [
                'what competition it was',
                'where and when it took place',
                'who the main competitors were',
                'and explain why this competition was so exciting to experience',
            ],
        },
        part3: {
            title: 'Competition in Education and Work',
            questions: [
                'Does healthy competition motivate students to achieve higher academic results?',
                'Can excessive competitive pressure lead to anxiety and burnout among young learners?',
                'How do companies benefit when their employees collaborate instead of competing internally?',
                'Is international economic competition beneficial for consumer product quality?',
            ],
        },
    },
    'cambridge-17-4': {
        title: 'Cambridge 17 Test 4',
        part1: {
            title: 'Geography & Maps',
            questions: [
                'Did you enjoy studying geography when you were at school?',
                'Do you like looking at world maps and globes?',
                'Can you easily locate major foreign countries on a world map?',
                'Have you ever visited a place specifically because you read about its geography?',
            ],
        },
        part2: {
            title: 'A Helpful Advice',
            topic: 'a friend or mentor who gave you very helpful advice',
            prompts: [
                'who this person was',
                'what situation or dilemma you were facing',
                'what advice they gave you',
                'and explain why their advice was so helpful to you',
            ],
        },
        part3: {
            title: 'Mentorship, Role Models & Advisory Guidance',
            questions: [
                'Why is it often easier to discuss dilemmas with mentors or friends rather than family members?',
                'What qualities make someone a trustworthy counselor or mentor?',
                'Should schools provide professional career guidance advisors for every student?',
                'How does modern society evaluate the moral influence of celebrity role models?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 18
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-18-1': {
        title: 'Cambridge 18 Test 1',
        part1: {
            title: 'Reading & Books',
            questions: [
                'Do you enjoy reading books in your free time?',
                'What kinds of books do you prefer reading?',
                'Did you read many books when you were a child?',
                'Do you prefer physical printed books or e-books?',
            ],
        },
        part2: {
            title: 'A Time You Made a Promise',
            topic: 'a time when you made a promise to someone',
            prompts: [
                'whom you made the promise to',
                'what the promise was about',
                'why you made this promise',
                'and explain whether it was easy or difficult to keep it',
            ],
        },
        part3: {
            title: 'Trust and Commitments',
            questions: [
                'Why is keeping promises so crucial in personal relationships?',
                'What consequences happen when businesses fail to honor their promises to customers?',
                'Are younger people less likely to make long-term commitments than older generations?',
                'Should promises made verbally have legal weight?',
            ],
        },
    },
    'cambridge-18-2': {
        title: 'Cambridge 18 Test 2',
        part1: {
            title: 'Bags & Accessories',
            questions: [
                'What kind of bag do you normally use when going to work or school?',
                'Do you choose bags primarily for their style or practicality?',
                'Have you ever lost a bag or forgotten it somewhere?',
                'Do you own different bags for sports, travel, and formal occasions?',
            ],
        },
        part2: {
            title: 'A Memorable Restaurant Meal',
            topic: 'a restaurant you visited where the food was especially memorable',
            prompts: [
                'where the restaurant was located',
                'what meal or dishes you ordered',
                'who you went there with',
                'and explain why the food at this restaurant was so memorable',
            ],
        },
        part3: {
            title: 'Dining Culture & Food Standards',
            questions: [
                'Why has dining out become such a major component of modern leisure culture?',
                'How do restaurant review websites impact small independent eateries?',
                'What hygiene standards should governments enforce strictly on dining establishments?',
                'Is fine dining worth the high prices charged by celebrity chefs?',
            ],
        },
    },
    'cambridge-18-3': {
        title: 'Cambridge 18 Test 3',
        part1: {
            title: 'Wild Animals & Habitats',
            questions: [
                'Do you enjoy watching nature documentaries about wild animals?',
                'Have you ever seen wild animals in their natural habitats?',
                'Are there protected national parks in your country?',
                'What is your favourite wild animal and why do you find it fascinating?',
            ],
        },
        part2: {
            title: 'A Journey by Public Transport',
            topic: 'a journey by public transport you remember well',
            prompts: [
                'what type of transport you took (train, bus, ferry)',
                'where you were travelling from and to',
                'what happened during this journey',
                'and explain why you remember this particular journey so well',
            ],
        },
        part3: {
            title: 'Public Transit Infrastructure & Sustainability',
            questions: [
                'How can public transit networks be designed to encourage car drivers to switch?',
                'What economic advantages do high-speed railways offer to regional economies?',
                'How does modern ticketing technology make public transportation more user-friendly?',
                'What environmental policies are most effective at reducing carbon emissions from transport?',
            ],
        },
    },
    'cambridge-18-4': {
        title: 'Cambridge 18 Test 4',
        part1: {
            title: 'Concentration & Focus',
            questions: [
                'When do you find it easiest to concentrate on your work or studies?',
                'What things distract you most when you are trying to focus?',
                'Do you prefer studying in absolute silence or with background music?',
                'What do you do when you feel tired and can no longer concentrate?',
            ],
        },
        part2: {
            title: 'A Childhood Game',
            topic: 'a game you played frequently as a child',
            prompts: [
                'what kind of game it was',
                'who you played it with and where',
                'what rules the game followed',
                'and explain why you enjoyed playing this game so much',
            ],
        },
        part3: {
            title: 'Childhood Play & Digital Gaming',
            questions: [
                'How do traditional physical playground games contribute to social development?',
                'Are modern video games encouraging antisocial behavior or building collaborative problem-solving skills?',
                'Should parents establish strict daily screen limits for online video games?',
                'Can interactive simulation games be integrated into school academic curricula?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 19
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-19-1': {
        title: 'Cambridge 19 Test 1',
        part1: {
            title: 'Video Games & Screen Entertainment',
            questions: [
                'Do you enjoy playing video games on your phone, console, or computer?',
                'What kind of video games appeal to you most?',
                'Did you play video games when you were in primary school?',
                'How much time do you think is reasonable to spend playing games each day?',
            ],
        },
        part2: {
            title: 'A Sports Coach or Mentor',
            topic: 'a sports coach, trainer, or physical mentor who guided you',
            prompts: [
                'who this coach or mentor was',
                'what sport or activity they trained you in',
                'how they helped you improve your technique or mindset',
                'and explain why their guidance had such a positive impact on you',
            ],
        },
        part3: {
            title: 'Sports Mentorship & Athletic Culture',
            questions: [
                'What qualities distinguish an exceptional sports coach from an ordinary trainer?',
                'How does athletic participation cultivate discipline and resilience in teenagers?',
                'Should schools prioritize winning tournaments or ensuring every child participates?',
                'How do modern biometric sensors and video playback transform sports training?',
            ],
        },
    },
    'cambridge-19-2': {
        title: 'Cambridge 19 Test 2',
        part1: {
            title: 'Money & Payment Methods',
            questions: [
                'Do you prefer paying for purchases with cash, bank cards, or mobile apps?',
                'When was the last time you used physical paper banknotes?',
                'Do you check your bank balance frequently?',
                'Do you think society is heading towards a completely cashless economy?',
            ],
        },
        part2: {
            title: 'A Family Heirloom',
            topic: 'an old object or item that your family has kept for a long time',
            prompts: [
                'what this object is and what it looks like',
                'how long your family has possessed it',
                'who originally owned it',
                'and explain why this heirloom is so meaningful to your family',
            ],
        },
        part3: {
            title: 'Family Heirlooms & Historical Items',
            questions: [
                'Why do families preserve sentimental heirlooms across generations?',
                'What value do historical artifacts and antique possessions have for historians?',
                'Why do some antique objects sell for astronomical prices at international auctions?',
                'How can museums effectively preserve fragile ancient materials for future centuries?',
            ],
        },
    },
    'cambridge-19-3': {
        title: 'Cambridge 19 Test 3',
        part1: {
            title: 'Weather & Rain',
            questions: [
                'What is your favourite kind of weather?',
                'Does the weather affect your productivity or daily mood?',
                'Do you check the weather forecast before leaving your house?',
                'What season do you think is the best time for tourists to visit your country?',
            ],
        },
        part2: {
            title: 'A Difficult Piece of Technology',
            topic: 'a piece of technology or software you found difficult to learn or use',
            prompts: [
                'what the technology or software was',
                'why you needed to use it',
                'what problems you encountered while learning it',
                'and explain how you managed to use it or solve the difficulties',
            ],
        },
        part3: {
            title: 'Technological Complexity & User Accessibility',
            questions: [
                'Why do some electronic devices have overly complicated user interfaces?',
                'How can software developers design digital applications to be accessible for senior citizens?',
                'Are rapid technological upgrades creating a digital divide between generations?',
                'Will AI assistance simplify how humans interact with complex technical tools?',
            ],
        },
    },
    'cambridge-19-4': {
        title: 'Cambridge 19 Test 4',
        part1: {
            title: 'Sleep & Rest Habits',
            questions: [
                'How many hours of sleep do you usually get each night?',
                'Do you find it easy or difficult to fall asleep quickly?',
                'What do you do if you are unable to sleep at night?',
                'Do you ever take naps during the middle of the day?',
            ],
        },
        part2: {
            title: 'An Occasion of Politeness',
            topic: 'an occasion when you were extremely polite to someone',
            prompts: [
                'where and when this happened',
                'whom you were interacting with',
                'what you said or did to be polite',
                'and explain why it was important to be courteous in that situation',
            ],
        },
        part3: {
            title: 'Social Etiquette & Cultural Respect',
            questions: [
                'How does polite etiquette contribute to harmonious communication in multicultural workplaces?',
                'Why do different cultures have contrasting standards for eye contact and physical greetings?',
                'Can being excessively polite ever be misinterpreted as insincerity?',
                'How do parents effectively teach respect and empathy to young children?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 20
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-20-1': {
        title: 'Cambridge 20 Test 1',
        part1: {
            title: 'Maps & Digital Navigation',
            questions: [
                'How often do you use digital map apps on your mobile device?',
                'Did you learn how to read physical paper maps at school?',
                'Have you ever gotten lost while trying to find a new address?',
                'Do you prefer following turn-by-turn voice directions or looking at map displays?',
            ],
        },
        part2: {
            title: 'A Crowded Event',
            topic: 'a crowded event, concert, or festival you attended',
            prompts: [
                'what event or festival it was',
                'where and when it was held',
                'why there were so many people gathered there',
                'and explain how you felt being part of such a large crowd',
            ],
        },
        part3: {
            title: 'Event Organization & Public Crowd Safety',
            questions: [
                'What safety precautions must event organizers implement when managing massive crowds?',
                'Why do people enjoy the collective energy of large public gatherings and live sports?',
                'How can public transit authorities handle surges of passengers after major stadium events?',
                'Should cities place strict occupancy caps on public squares during holiday celebrations?',
            ],
        },
    },
    'cambridge-20-2': {
        title: 'Cambridge 20 Test 2',
        part1: {
            title: 'Noise & Environmental Sounds',
            questions: [
                'What sounds do you hear outside your window each morning?',
                'Do you find it easy to work in noisy environments like coffee shops?',
                'What kind of sounds do you find most irritating or distracting?',
                'Do you ever wear noise-cancelling headphones when studying or commuting?',
            ],
        },
        part2: {
            title: 'A Hardworking Person',
            topic: 'a person you know personally who works very hard',
            prompts: [
                'who this person is and what relationship you have with them',
                'what work or studies they do',
                'how they demonstrate their dedication and effort',
                'and explain why you admire their hard work and discipline',
            ],
        },
        part3: {
            title: 'Work-Life Balance & Productivity Culture',
            questions: [
                'Why is maintaining a healthy work-life balance critical for long-term health?',
                'How does modern workplace technology make it harder for professionals to disconnect after hours?',
                'Does working long hours always translate into higher productivity and quality output?',
                'How can companies cultivate a supportive environment that prevents employee burnout?',
            ],
        },
    },
    'cambridge-20-3': {
        title: 'Cambridge 20 Test 3',
        part1: {
            title: 'Gifts & Personal Celebrations',
            questions: [
                'What kinds of gifts do people in your country usually give on birthdays?',
                'Do you prefer receiving practical items or surprise gifts?',
                'Have you ever re-gifted something you received to someone else?',
                'Is giving money becoming more common than buying physical presents?',
            ],
        },
        part2: {
            title: 'A Memorable Speech',
            topic: 'a memorable speech or presentation you attended or listened to',
            prompts: [
                'who gave the speech and on what occasion',
                'what the core message of the presentation was',
                'how the speaker delivered their points to the audience',
                'and explain why this speech left such a strong impression on you',
            ],
        },
        part3: {
            title: 'Public Speaking & Rhetorical Influence',
            questions: [
                'What rhetorical strategies allow great speakers to persuade sceptical audiences?',
                'How does body language and tone of voice impact the credibility of a speaker?',
                'Why are short, concise presentations often more memorable than long keynote lectures?',
                'Can virtual webinar presentations achieve the same emotional engagement as in-person talks?',
            ],
        },
    },
    'cambridge-20-4': {
        title: 'Cambridge 20 Test 4',
        part1: {
            title: 'Collecting & Personal Hobbies',
            questions: [
                'Did you collect stamps, coins, cards, or other items when you were young?',
                'Do you currently collect anything interesting as a hobby?',
                'Why do you think some people enjoy collecting rare objects?',
                'What is the most valuable or unique item you own?',
            ],
        },
        part2: {
            title: 'Solving a Difficult Problem',
            topic: 'a time when you had to solve a difficult problem',
            prompts: [
                'what the problem was and when it occurred',
                'what made it difficult to resolve',
                'what steps or strategy you used to solve it',
                'and explain what you learned from solving this problem',
            ],
        },
        part3: {
            title: 'Problem-Solving & Critical Thinking',
            questions: [
                'How can school curricula foster critical problem-solving skills rather than rote memorization?',
                'Why is collaboration with multidisciplinary teams helpful when tackling complex challenges?',
                'What role does emotional composure play when resolving crises under intense pressure?',
                'How will artificial intelligence tools aid humans in tackling complex scientific problems?',
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CAMBRIDGE 21
    // ══════════════════════════════════════════════════════════════════════════
    'cambridge-21-1': {
        title: 'Cambridge 21 Test 1',
        part1: {
            title: 'Digital Communication & Messaging',
            questions: [
                'What messaging platforms do you use to stay in touch with friends?',
                'Do you prefer sending voice messages or text messages?',
                'How quickly do you usually respond to incoming chat notifications?',
                'Do you think constant digital messaging makes interpersonal communication less personal?',
            ],
        },
        part2: {
            title: 'An Innovative Invention',
            topic: 'an innovative product or invention you learned about that interested you',
            prompts: [
                'what the product or invention is',
                'how it works and what problem it addresses',
                'where you first discovered or read about it',
                'and explain why you find this invention so innovative and promising',
            ],
        },
        part3: {
            title: 'Innovation, AI & Future Society',
            questions: [
                'How will advancements in artificial intelligence reshape traditional knowledge professions?',
                'What ethical guardrails should governments establish for autonomous systems and robotics?',
                'Why do some societies embrace disruptive technological innovations faster than others?',
                'How can educational systems prepare young students for jobs that do not yet exist?',
            ],
        },
    },
    'cambridge-21-2': {
        title: 'Cambridge 21 Test 2',
        part1: {
            title: 'Walking & Outdoor Exercise',
            questions: [
                'Do you enjoy walking for leisure or do you mostly walk to get to places?',
                'Where is your favourite place to go for a long walk?',
                'Do you monitor your daily steps with a fitness tracker or phone?',
                'Do you think your city is pedestrian-friendly for walkers of all ages?',
            ],
        },
        part2: {
            title: 'An Impressive Museum or Exhibition',
            topic: 'a museum, exhibition, or gallery that left a strong impression on you',
            prompts: [
                'what museum or exhibition it was and where it was situated',
                'what kind of exhibits or artifacts were on display',
                'who accompanied you during your visit',
                'and explain why this museum or exhibition was so memorable to you',
            ],
        },
        part3: {
            title: 'Cultural Institutions & Digital Curation',
            questions: [
                'How do interactive touchscreens and virtual reality enhance museum exhibitions?',
                'Should public historical museums offer free admission to all citizens and students?',
                'What responsibilities do international museums have regarding the repatriation of historical artifacts?',
                'Can digital virtual tours ever replace the emotional impact of viewing original artifacts in person?',
            ],
        },
    },
    'cambridge-21-3': {
        title: 'Cambridge 21 Test 3',
        part1: {
            title: 'Morning Routines & Daily Habits',
            questions: [
                'What is the very first thing you do when you start your day?',
                'Do you eat a substantial breakfast or keep it light and quick?',
                'Do you prefer waking up early at dawn or sleeping in when possible?',
                'How has your morning routine changed over the past five years?',
            ],
        },
        part2: {
            title: 'A Team Project',
            topic: 'a time when you worked in a large team on a project or goal',
            prompts: [
                'what the project was and what team members were involved',
                'what specific role and responsibilities you carried out',
                'what obstacles the team encountered during the work',
                'and explain what the outcome was and how you felt about working in this team',
            ],
        },
        part3: {
            title: 'Teamwork, Collaboration & Remote Work',
            questions: [
                'What factors enable a diverse group of individuals to work together harmoniously?',
                'How does remote digital collaboration compare to working together in a physical office?',
                'What should team leaders do when individual team members fail to contribute fairly?',
                'Why is clear and empathetic communication essential for managing project deadlines?',
            ],
        },
    },
    'cambridge-21-4': {
        title: 'Cambridge 21 Test 4',
        part1: {
            title: 'Environmental Awareness & Recycling',
            questions: [
                'Do you recycle household waste like paper, plastic, and glass regularly?',
                'Did you learn about environmental conservation when you were at school?',
                'Do you make conscious efforts to reduce single-use plastic in your daily life?',
                'Are people in your community actively concerned about local environmental issues?',
            ],
        },
        part2: {
            title: 'A Future Dream Journey',
            topic: 'a journey or expedition you would like to take in the future',
            prompts: [
                'where you would like to travel to',
                'how you would get there and what route you would take',
                'who you would like to travel with',
                'and explain why this journey would be a dream trip for you',
            ],
        },
        part3: {
            title: 'Future of International Travel & Sustainability',
            questions: [
                'How will climate change awareness change the way people choose international holiday destinations?',
                'What can the aviation industry do to develop cleaner and more sustainable aircraft fuels?',
                'Is space tourism an exciting scientific frontier or a waste of environmental resources?',
                'How can mass tourism destinations balance economic prosperity with the protection of fragile habitats?',
            ],
        },
    },
};
