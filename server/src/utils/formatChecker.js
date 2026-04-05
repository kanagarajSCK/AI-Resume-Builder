const ACTION_VERBS = new Set([
  "led", "developed", "designed", "implemented", "managed", "created",
  "optimized", "built", "launched", "reduced", "increased", "achieved",
  "delivered", "collaborated", "spearheaded", "architected", "streamlined",
  "automated", "improved", "established", "mentored", "drove", "scaled",
  "transformed", "pioneered", "orchestrated", "engineered", "integrated",
  "accelerated", "negotiated", "resolved", "migrated", "deployed",
  "configured", "analyzed", "refactored", "coordinated", "facilitated",
]);

const checkFormatting = (sections) => {
  const results = {};

  const checks = {
    hasSummary: Boolean((sections.summary || '').trim()),
    hasExperience: (sections.experience || []).length > 0,
    hasEducation: (sections.education || []).length > 0,
    hasSkills: (sections.skills?.technical || []).length > 0 || (sections.skills?.soft || []).length > 0,
    hasPersonalInfo: Boolean((sections.personalInfo?.fullName || '').trim()),
  };
  const filled = Object.values(checks).filter(Boolean).length;
  results.sectionCompleteness = Math.round((filled / Object.keys(checks).length) * 100);

  const personal = sections.personalInfo || {};
  const contactFields = ['fullName', 'email', 'phone', 'location', 'linkedIn'];
  const contactFilled = contactFields.filter((f) => (personal[f] || '').trim()).length;
  results.contactInfo = Math.round((contactFilled / contactFields.length) * 100);

  const allBullets = [
    ...(sections.experience || []).flatMap((e) => e.bullets || []),
    ...(sections.projects || []).flatMap((p) => p.bullets || []),
  ];

  results.quantification = allBullets.length > 0
    ? Math.round((allBullets.filter((b) => /\d/.test(b)).length / allBullets.length) * 100)
    : 0;

  results.actionVerbs = allBullets.length > 0
    ? Math.round((allBullets.filter((b) => {
        const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase() || '';
        return ACTION_VERBS.has(firstWord);
      }).length / allBullets.length) * 100)
    : 0;

  const wordCount = JSON.stringify(sections).split(/\s+/).length;
  if (wordCount >= 400 && wordCount <= 1200) results.length = 100;
  else if ((wordCount >= 200 && wordCount < 400) || (wordCount > 1200 && wordCount <= 1600)) results.length = 70;
  else if (wordCount < 200) results.length = Math.max(0, Math.round((wordCount / 400) * 100));
  else results.length = Math.max(40, 100 - Math.floor((wordCount - 1600) / 100) * 10);

  let formatScore = 100;
  if (!checks.hasSummary) formatScore -= 15;
  if (!checks.hasExperience) formatScore -= 25;
  if (!checks.hasEducation) formatScore -= 10;
  if (!checks.hasSkills) formatScore -= 15;
  for (const exp of (sections.experience || [])) {
    if ((exp.bullets || []).length < 2) formatScore -= 5;
  }
  results.formatting = Math.max(0, formatScore);

  return results;
};

export { checkFormatting };