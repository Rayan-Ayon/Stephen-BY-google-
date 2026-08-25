// ── Dormant navigation segments ──
// Edgram, Course Creator (Add Courses), Competition, and Consult are temporarily
// isolated from the UI. Set DORMANT_NAV_ENABLED = false to instantly restore all four.

export const DORMANT_NAV_ENABLED = true;

export const DORMANT_NAV_KEYS = new Set<string>([
    'add_courses',        // Course Creator
    'competitions',       // Competition
    'consult_professors', // Consult
    'edgram',             // Edgram
]);

// Full definitions preserved as a manifest for instant restore (unused while dormant).
export const DISABLED_DORMANT_NAV_ITEMS = [
    { name: 'Add Courses', key: 'add_courses' },
    { name: 'Competitions', key: 'competitions' },
    { name: 'Consult', key: 'consult_professors' },
    { name: 'Edgram', key: 'edgram' },
];
