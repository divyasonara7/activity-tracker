import { useMemo } from "react";
import { getDailyQuote, INSPIRATIONAL_QUOTES } from "@/utils/quotes";
import { Lightbulb, Sparkles } from "lucide-react";
import styles from "./QuotesView.module.css";

// ============================================
// Quotes View - Daily Inspiration Gallery
// ============================================

const QUOTE_COLORS = [
    styles.quoteCardYellow,
    styles.quoteCardPink,
    styles.quoteCardBlue,
    styles.quoteCardGreen,
    styles.quoteCardPurple,
    styles.quoteCardOrange,
];

export function QuotesView() {
    // Get today's quote
    const dailyQuote = useMemo(() => getDailyQuote(), []);

    // Shuffle quotes for display (but consistently based on day)
    const displayQuotes = useMemo(() => {
        const now = new Date();
        const seed = now.getFullYear() * 1000 + now.getMonth() * 32 + now.getDate();

        // Simple shuffle based on day
        const shuffled = [...INSPIRATIONAL_QUOTES].sort((a, b) => {
            const hashA = (a.text.length * seed) % 100;
            const hashB = (b.text.length * seed) % 100;
            return hashA - hashB;
        });

        return shuffled.slice(0, 12); // Show 12 random quotes
    }, []);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1>✨ Daily Inspiration</h1>
                <p>Curated quotes to motivate your journey</p>
            </header>

            {/* Today's Quote - Featured */}
            <div className={styles.dailyQuoteCard}>
                <span className={styles.dailyQuoteLabel}>
                    <Sparkles className="inline w-3 h-3 mr-1" />
                    Today's Quote
                </span>
                <p className={styles.dailyQuoteText}>{dailyQuote.text}</p>
                <p className={styles.dailyQuoteAuthor}>— {dailyQuote.author}</p>
            </div>

            {/* More Quotes */}
            <h3 className={styles.sectionTitle}>
                <Lightbulb className="w-5 h-5" />
                More Inspiration
            </h3>

            <div className={styles.quotesGrid}>
                {displayQuotes.map((quote, index) => (
                    <div
                        key={quote.text.slice(0, 20)}
                        className={`${styles.quoteCard} ${QUOTE_COLORS[index % QUOTE_COLORS.length]}`}
                    >
                        <p className={styles.quoteText}>"{quote.text}"</p>
                        <p className={styles.quoteAuthor}>— {quote.author}</p>
                    </div>
                ))}
            </div>

            {/* Tip */}
            <div className={styles.tipCard}>
                <h4>💡 Pro Tip</h4>
                <p>
                    The daily quote changes every day at midnight. Visit the app each morning
                    for fresh inspiration! You can also add your own motivation entries in
                    the Today page using the "Motivation" category.
                </p>
            </div>
        </div>
    );
}
