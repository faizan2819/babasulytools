
export enum Tone {
  CASUAL = 'Casual',
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  PERSUASIVE = 'Persuasive'
}

export enum Readability {
  SIMPLE = 'Simple',
  MEDIUM = 'Medium',
  ADVANCED = 'Advanced'
}

export interface ProcessingOptions {
  tone: Tone;
  readability: Readability;
}

export interface ProcessingResult {
  originalText: string;
  humanizedText: string;
  originalWordCount: number;
  newWordCount: number;
  timestamp: number;
}
