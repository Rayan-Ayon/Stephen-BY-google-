// ── Dormant navigation segments ──
// Edgram, Course Creator (Add Courses), Competition, and Consult are temporarily
// isolated from the UI. Set DORMANT_NAV_ENABLED = false to instantly restore all four.

export const DORMANT_NAV_ENABLED = true;

export const DORMANT_NAV_KEYS = new Set<string>([
    'add_courses',        // Course Creator
    'competitions',       // Competition
    'consult_professors', // Consult
    'edgram',             // Edgram
    'discover',           // Discover
    'learning_methods',   // Learning Methods (original segment, preserved in DISABLED_DORMANT_NAV_ITEMS)
    'tracker',            // Tracker (preserved for one-prompt restore)
    'research_lab',       // Research Lab (preserved for one-prompt restore)
]);

// Full definitions preserved as a manifest for instant restore (unused while dormant).
export const DISABLED_DORMANT_NAV_ITEMS = [
    { name: 'Add Courses', key: 'add_courses' },
    { name: 'Competitions', key: 'competitions' },
    { name: 'Consult', key: 'consult_professors' },
    { name: 'Edgram', key: 'edgram' },
    { name: 'Discover', key: 'discover' },
    { name: 'Learning Methods', key: 'learning_methods' },
    { name: 'Tracker', key: 'tracker' },
    { name: 'Research Lab', key: 'research_lab' },
];
