export interface WritingPrompt {
    id: string;
    title: string;
    category: string;
    description: string;
    taskType: string;
    timeLabel: string;
    mode: string;
    timeMinutes: number;
}

export const WRITING_PROMPTS: WritingPrompt[] = [
    {
        id: 'opinion',
        title: 'Opinion',
        category: 'ESSAY',
        description: 'Express your personal viewpoint, agreeing or disagreeing with a given statement.',
        taskType: 'Task 2',
        timeLabel: '40 min',
        mode: 'task2_only',
        timeMinutes: 40,
    },
    {
        id: 'discussion',
        title: 'Discussion',
        category: 'ESSAY',
        description: 'Discuss both sides of an argument and give your own opinion.',
        taskType: 'Task 2',
        timeLabel: '40 min',
        mode: 'task2_only',
        timeMinutes: 40,
    },
    {
        id: 'problem-solution',
        title: 'Problem-Solution',
        category: 'ESSAY',
        description: 'Explore the causes, effects, or propose specific solutions.',
        taskType: 'Task 2',
        timeLabel: '40 min',
        mode: 'task2_only',
        timeMinutes: 40,
    },
    {
        id: 'advantage-disadvantage',
        title: 'Advantage-Disadvantage',
        category: 'ESSAY',
        description: 'Discuss the advantages and disadvantages of a specific issue.',
        taskType: 'Task 2',
        timeLabel: '40 min',
        mode: 'task2_only',
        timeMinutes: 40,
    },
    {
        id: 'two-part',
        title: 'Two-part / Double Questions',
        category: 'ESSAY',
        description: 'Analyze and write an essay to answer two questions on the same topic.',
        taskType: 'Task 2',
        timeLabel: '40 min',
        mode: 'task2_only',
        timeMinutes: 40,
    },
];
