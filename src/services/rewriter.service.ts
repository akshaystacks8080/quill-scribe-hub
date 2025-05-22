
// This service would typically call an AI API but we'll just mock it
// for the purpose of this demonstration

// Mock text rewriting methods
const wordSynonyms: Record<string, string[]> = {
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

const phraseSynonyms: Record<string, string[]> = {
  "as a result": ["consequently", "therefore", "hence", "thus"],
  "for example": ["for instance", "such as", "to illustrate"],
  "in conclusion": ["to summarize", "in closing", "to wrap up"],
  "on the other hand": ["conversely", "in contrast", "alternatively"],
  "first of all": ["to begin with", "initially", "at the outset"],
};

function replaceWords(text: string): string {
  const words = text.split(/\b/);
  return words
    .map((word) => {
      const lower = word.toLowerCase();
      if (wordSynonyms[lower] && Math.random() < 0.6) {
        const replacement = wordSynonyms[lower][Math.floor(Math.random() * wordSynonyms[lower].length)];
        return word[0] === word[0].toUpperCase()
          ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
          : replacement;
      }
      return word;
    })
    .join("");
}

function replacePhrases(text: string): string {
  for (const phrase in phraseSynonyms) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    if (regex.test(text) && Math.random() < 0.7) {
      const replacement = phraseSynonyms[phrase][Math.floor(Math.random() * phraseSynonyms[phrase].length)];
      text = text.replace(regex, replacement);
    }
  }
  return text;
}

function shuffleSentences(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= 1) return text;
  for (let i = 0; i < sentences.length - 1; i++) {
    if (Math.random() < 0.5) {
      const j = Math.floor(Math.random() * sentences.length);
      [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }
  }
  return sentences.join(" ");
}

export async function rewriteText(text: string): Promise<string> {
  let rewritten = text;

  // Simulate human-like edits
  rewritten = replacePhrases(rewritten);
  rewritten = replaceWords(rewritten);
  if (text.length > 120) {
    rewritten = shuffleSentences(rewritten);
  }

  // Simulated delay
  await new Promise((res) => setTimeout(res, 400));
  return rewritten;
}

// export async function humanizeText(text: string): Promise<string> {
//   // Simple word replacement logic for demonstration
//   const words = text.split(/\b/); // Split by word boundaries
  
//   // Random factor to make replacements less predictable
//   const replacementChance = 0.5; // 50% chance of replacing a word
  
//   const rewrittenWords = words.map(word => {
//     const lowerWord = word.toLowerCase();
//     if (synonyms[lowerWord] && Math.random() < replacementChance) {
//       // Preserve capitalization
//       const replacement = synonyms[lowerWord][Math.floor(Math.random() * synonyms[lowerWord].length)];
//       if (word[0] === word[0].toUpperCase()) {
//         return replacement.charAt(0).toUpperCase() + replacement.slice(1);
//       }
//       return replacement;
//     }
//     return word;
//   });
  
//   return rewrittenWords.join("");
// }

// export async function rearrangeSentences(text: string): Promise<string> {
//   // Add some sentence structure variations
//   const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
//   if (sentences.length <= 1) return text;
  
//   // Simple variation - change order of some sentences
//   if (sentences.length > 2 && Math.random() > 0.5) {
//     const idx1 = Math.floor(Math.random() * sentences.length);
//     let idx2 = Math.floor(Math.random() * sentences.length);
//     while (idx2 === idx1) idx2 = Math.floor(Math.random() * sentences.length);
    
//     const temp = sentences[idx1];
//     sentences[idx1] = sentences[idx2];
//     sentences[idx2] = temp;
//   }
  
//   return sentences.join(" ");
// }

// export async function rewriteText(text: string): Promise<string> {
//   // We're mocking this but in a real app this would call an AI API
//   // This approach simulates multiple transformation passes
//   let result = text;
  
//   // Apply humanization (word substitution)
//   result = await humanizeText(result);
  
//   // Apply some sentence restructuring for longer texts
//   if (text.length > 100) {
//     result = await rearrangeSentences(result);
//   }
  
//   // Simulate processing delay
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   return result;
// }

// ---------------------------------------------------------------------------------

// // rewrite.service.ts -Humanize API

// // Input API key 
// const API_KEY = '';

// async function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// export async function rewriteText(text: string): Promise<string> {
//   if (text.length < 50) {
//     throw new Error("Text must be at least 50 characters to submit.");
//   }

//   const submitResponse = await fetch('https://humanize.undetectable.ai/submit', {
//     method: 'POST',
//     headers: {
//       'apikey': API_KEY,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       content: text,
//       readability: "High School",
//       purpose: "General Writing",
//       strength: "Balanced",
//       model: "v2"
//     }),
//   });

//   if (!submitResponse.ok) {
//     const errorBody = await submitResponse.json();
//     throw new Error(`Submit failed: ${errorBody.error || submitResponse.statusText}`);
//   }

//   const { id } = await submitResponse.json();

//   let tries = 0;
//   const maxTries = 12;
//   while (tries < maxTries) {
//     tries++;
//     await delay(5000);

//     const docResponse = await fetch('https://humanize.undetectable.ai/document', {
//       method: 'POST',
//       headers: {
//         'apikey': API_KEY,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id }),
//     });

//     if (!docResponse.ok) {
//       const errorBody = await docResponse.json();
//       throw new Error(`Document fetch failed: ${errorBody.error || docResponse.statusText}`);
//     }

//     const doc = await docResponse.json();

//     if (doc.output) {
//       return doc.output;
//     }
//   }

//   throw new Error("Timeout waiting for humanized text.");
// }
