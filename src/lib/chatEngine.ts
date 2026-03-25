/**
 * Simple NLP-like chat engine using keyword matching + similarity scoring.
 * Runs entirely in the browser — no backend needed.
 */

import { faqData, type Intent } from "./faqData";

// Stopwords to remove
const STOPWORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
  "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "they",
  "them", "their", "what", "which", "who", "whom", "this", "that", "these",
  "those", "am", "is", "are", "was", "were", "be", "been", "being", "have",
  "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the",
  "and", "but", "if", "or", "because", "as", "until", "while", "of", "at",
  "by", "for", "with", "about", "against", "between", "through", "during",
  "before", "after", "above", "below", "to", "from", "up", "down", "in",
  "out", "on", "off", "over", "under", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "both", "each",
  "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only",
  "own", "same", "so", "than", "too", "very", "s", "t", "can", "will",
  "just", "don", "should", "now", "d", "ll", "m", "o", "re", "ve", "y",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export interface ChatResult {
  answer: string;
  confidence: number;
  tag: string;
}

export function getResponse(userInput: string): ChatResult {
  const inputTokens = tokenize(userInput);

  if (inputTokens.length === 0) {
    return {
      answer: "Could you please rephrase that? I didn't quite understand.",
      confidence: 0,
      tag: "unknown",
    };
  }

  let bestScore = 0;
  let bestIntent: Intent | null = null;

  for (const intent of faqData) {
    for (const pattern of intent.patterns) {
      const patternTokens = tokenize(pattern);
      const score = jaccardSimilarity(inputTokens, patternTokens);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }
  }

  if (bestIntent && bestScore >= 0.15) {
    const answer =
      bestIntent.responses[
        Math.floor(Math.random() * bestIntent.responses.length)
      ];
    return {
      answer,
      confidence: Math.round(bestScore * 100) / 100,
      tag: bestIntent.tag,
    };
  }

  return {
    answer:
      "I'm sorry, I don't have an answer for that. Please contact the help desk at info@college.edu or call +91-1234-567890.",
    confidence: Math.round(bestScore * 100) / 100,
    tag: "unknown",
  };
}
