const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
  "her", "was", "one", "our", "out", "has", "have", "been", "will",
  "with", "this", "that", "from", "they", "were", "said", "each",
  "which", "their", "about", "would", "make", "like", "just", "over",
  "such", "take", "than", "them", "very", "some", "into", "most",
  "other", "could", "also", "more", "what", "when", "your", "work",
  "able", "using", "used", "including", "must", "should", "well",
  "experience", "role", "team", "join", "looking", "based", "strong",
  "working", "knowledge", "understanding", "skills", "ability",
  "responsibilities", "requirements", "qualifications", "preferred",
  "required", "years", "plus", "etc", "minimum",
]);

const extractKeywords = (text) => {
  const words = text.toLowerCase().match(/\b[a-z][a-z+#./-]{2,}\b/g) || [];
  return words.filter((w) => !STOP_WORDS.has(w));
};

const analyzeKeywords = (resumeText, jobDescription) => {
  if (!jobDescription) {
    return { score: 0, matched: [], missing: [], totalJdKeywords: 0 };
  }

  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = new Set(extractKeywords(resumeText));

  const freq = {};
  for (const w of jdKeywords) { freq[w] = (freq[w] || 0) + 1; }
  const topJdKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);

  const matched = topJdKeywords.filter((k) => resumeKeywords.has(k));
  const missing = topJdKeywords.filter((k) => !resumeKeywords.has(k));
  const total = topJdKeywords.length || 1;

  return {
    score: Math.min(Math.round((matched.length / total) * 100), 100),
    matched: matched.slice(0, 20),
    missing: missing.slice(0, 15),
    totalJdKeywords: topJdKeywords.length,
  };
};

export { analyzeKeywords };