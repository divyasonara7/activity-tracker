// ============================================
// Pre-defined Inspirational Quotes
// ============================================

export interface Quote {
    text: string;
    author: string;
}

export const INSPIRATIONAL_QUOTES: Quote[] = [
    // Growth & Learning
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },

    // Habits & Consistency
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Rohn" },
    { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },

    // Mindset & Attitude
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },

    // Action & Progress
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Little things make big days.", author: "Unknown" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },

    // Self-belief
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "Do something today that your future self will thank you for.", author: "Unknown" },

    // Focus & Discipline
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "Your daily routine is your daily ritual.", author: "Unknown" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },

    // Personal Growth
    { text: "Become the person who would attract the results you seek.", author: "Jim Cathcart" },
    { text: "Growth is never by mere chance; it is the result of forces working together.", author: "James Cash Penney" },
    { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Invest in yourself. It pays the best interest.", author: "Benjamin Franklin" },
];

/**
 * Get a random quote from the collection
 */
export function getRandomQuote(): Quote {
    const index = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
    return INSPIRATIONAL_QUOTES[index];
}

/**
 * Get quote based on day of year (consistent for the whole day)
 */
export function getDailyQuote(): Quote {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use day of year to pick a consistent quote for the day
    const index = dayOfYear % INSPIRATIONAL_QUOTES.length;
    return INSPIRATIONAL_QUOTES[index];
}
