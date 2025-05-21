
// This service would typically call an AI API but we'll just mock it
// for the purpose of this demonstration

// Mock text rewriting methods
const synonyms: Record<string, string[]> = {
  "happy": ["delighted", "joyful", "pleased", "satisfied", "glad", "thrilled"],
  "sad": ["unhappy", "depressed", "downcast", "miserable", "gloomy", "dejected"],
  "good": ["excellent", "fine", "wonderful", "great", "exceptional", "superb"],
  "bad": ["poor", "inferior", "unacceptable", "terrible", "awful", "dreadful"],
  "big": ["large", "huge", "enormous", "gigantic", "massive", "substantial"],
  "small": ["tiny", "little", "mini", "modest", "minute", "petite"],
  "beautiful": ["attractive", "gorgeous", "stunning", "lovely", "exquisite", "appealing"],
  "ugly": ["unattractive", "hideous", "unpleasant", "unsightly", "revolting", "grotesque"],
  "fast": ["quick", "rapid", "speedy", "swift", "hasty", "expeditious"],
  "slow": ["leisurely", "sluggish", "unhurried", "gradual", "plodding", "dawdling"],
  "important": ["significant", "crucial", "essential", "critical", "vital", "paramount"],
  "unimportant": ["insignificant", "trivial", "minor", "inconsequential", "irrelevant", "negligible"],
  "interesting": ["fascinating", "engaging", "intriguing", "compelling", "appealing", "captivating"],
  "boring": ["dull", "tedious", "monotonous", "tiresome", "unexciting", "bland"],
  "difficult": ["hard", "challenging", "tough", "demanding", "strenuous", "arduous"],
  "easy": ["simple", "straightforward", "effortless", "uncomplicated", "trouble-free", "painless"],
  "like": ["enjoy", "appreciate", "relish", "adore", "fancy", "cherish"],
  "dislike": ["hate", "detest", "despise", "loathe", "abhor", "disapprove"],
  "smart": ["intelligent", "clever", "bright", "brilliant", "astute", "perceptive"],
  "stupid": ["foolish", "unintelligent", "dull", "mindless", "witless", "dense"],
  "said": ["stated", "mentioned", "declared", "exclaimed", "noted", "remarked"],
  "went": ["proceeded", "traveled", "journeyed", "ventured", "headed", "moved"],
  "see": ["observe", "notice", "spot", "view", "witness", "perceive"],
  "look": ["appear", "seem", "glance", "gaze", "peer", "glimpse"],
  "pretty": ["attractive", "beautiful", "lovely", "charming", "appealing", "delightful"],
  "very": ["extremely", "exceedingly", "exceptionally", "particularly", "immensely", "highly"],
  "also": ["additionally", "furthermore", "moreover", "likewise", "too", "besides"],
  "though": ["although", "however", "nevertheless", "nonetheless", "even if", "despite"],
  "but": ["however", "nevertheless", "yet", "still", "though", "although"],
  "and": ["plus", "additionally", "furthermore", "moreover", "as well as", "along with"],
  "so": ["therefore", "consequently", "thus", "accordingly", "hence", "as a result"],
};

export async function humanizeText(text: string): Promise<string> {
  // Simple word replacement logic for demonstration
  const words = text.split(/\b/); // Split by word boundaries
  
  // Random factor to make replacements less predictable
  const replacementChance = 0.5; // 50% chance of replacing a word
  
  const rewrittenWords = words.map(word => {
    const lowerWord = word.toLowerCase();
    if (synonyms[lowerWord] && Math.random() < replacementChance) {
      // Preserve capitalization
      const replacement = synonyms[lowerWord][Math.floor(Math.random() * synonyms[lowerWord].length)];
      if (word[0] === word[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    }
    return word;
  });
  
  return rewrittenWords.join("");
}

export async function rearrangeSentences(text: string): Promise<string> {
  // Add some sentence structure variations
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length <= 1) return text;
  
  // Simple variation - change order of some sentences
  if (sentences.length > 2 && Math.random() > 0.5) {
    const idx1 = Math.floor(Math.random() * sentences.length);
    let idx2 = Math.floor(Math.random() * sentences.length);
    while (idx2 === idx1) idx2 = Math.floor(Math.random() * sentences.length);
    
    const temp = sentences[idx1];
    sentences[idx1] = sentences[idx2];
    sentences[idx2] = temp;
  }
  
  return sentences.join(" ");
}

export async function rewriteText(text: string): Promise<string> {
  // We're mocking this but in a real app this would call an AI API
  // This approach simulates multiple transformation passes
  let result = text;
  
  // Apply humanization (word substitution)
  result = await humanizeText(result);
  
  // Apply some sentence restructuring for longer texts
  if (text.length > 100) {
    result = await rearrangeSentences(result);
  }
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return result;
}
