// This file will store our word lists

// Common English words for easy difficulty
const COMMON_WORDS = {
    3: ['CAT', 'DOG', 'RUN', 'HAT', 'SIT', 'MAP', 'CUP', 'BOX', 'SUN', 'RED', 'BIG', 'TOP', 'BAG', 'CAR', 'DAY', 'EAT'],
    4: ['PLAY', 'LOVE', 'HOPE', 'TIME', 'BOOK', 'WALK', 'TALK', 'SING', 'RAIN', 'BLUE', 'GROW', 'CARE', 'FIRE', 'GAME', 'HAND', 'LIFE'],
    5: ['HAPPY', 'SMILE', 'WATER', 'HOUSE', 'LIGHT', 'MUSIC', 'PHONE', 'BREAD', 'CHAIR', 'SLEEP', 'TABLE', 'WATCH', 'WORLD', 'BEACH', 'DREAM', 'EARTH'],
    6: ['FRIEND', 'SCHOOL', 'FAMILY', 'COFFEE', 'SUMMER', 'WINTER', 'SPRING', 'GARDEN', 'MOTHER', 'FATHER', 'SISTER', 'WINDOW', 'STREET', 'BRIDGE']
};

// Load word lists from the comprehensive dictionary
async function loadWordLists() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
        const text = await response.text();
        const words = text.split('\n').map(word => word.trim().toUpperCase());
        
        // Filter words by length and ensure they only contain letters
        const allWords = {
            3: words.filter(word => word.length === 3 && /^[A-Z]+$/.test(word)),
            4: words.filter(word => word.length === 4 && /^[A-Z]+$/.test(word)),
            5: words.filter(word => word.length === 5 && /^[A-Z]+$/.test(word)),
            6: words.filter(word => word.length === 6 && /^[A-Z]+$/.test(word))
        };

        // Create difficulty-based word lists
        const wordLists = {
            easy: COMMON_WORDS,
            medium: {
                3: allWords[3].filter(word => word.length <= 5),
                4: allWords[4].filter(word => word.length <= 6),
                5: allWords[5].filter(word => word.length <= 7),
                6: allWords[6].filter(word => word.length <= 8)
            },
            hard: allWords
        };

        // Store all words for validation
        wordLists.allWords = allWords;

        return wordLists;
    } catch (error) {
        console.error('Error loading word lists:', error);
        // Fallback to basic word lists if fetch fails
        return {
            easy: COMMON_WORDS,
            medium: COMMON_WORDS,
            hard: COMMON_WORDS,
            allWords: COMMON_WORDS
        };
    }
}

export { loadWordLists, COMMON_WORDS };
